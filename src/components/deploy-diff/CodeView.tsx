/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The code view: a full-bleed takeover rendered by PageShell in place of the
 * routed page (entering/leaving rides the site's page transition). Shows the
 * latest commit that touched THIS page's source (see page-sources.ts) —
 * whole and honest, page files sorted first; unmapped routes fall back to
 * the repo-wide latest commit. The only UI above it is the floating exit
 * button.
 *
 * Loading is a terminal beat: the view types `$ git show ` and blinks a
 * caret until the sha resolves, then the sha types in and the diff settles
 * beneath. The finished command line stays as the header artifact.
 */

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { MenuHint } from "@/components/menu-hint";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { REVEAL } from "@/utils/transitions";
import { CommitDiff } from "./CommitDiff";
import { useCodeView } from "./code-view-provider";
import { useIsDarkScheme } from "./use-scheme";
import { resolvePagePath } from "./page-sources";
import { githubFallbackUrl, usePageDiff } from "./use-page-diff";

/**
 * Diff accent colors, resolved against the active theme's type. Custom dark
 * themes never match the `dark:` variant (see use-scheme.ts), so the palette
 * is chosen at runtime and exposed as custom properties for CommitDiff.
 */
const DIFF_TOKENS: Record<"light" | "dark", CSSProperties> = {
  light: {
    "--diff-add-fg": "var(--color-emerald-600)",
    "--diff-del-fg": "var(--color-rose-600)",
    "--diff-mod-fg": "var(--color-amber-600)",
    "--diff-ren-fg": "var(--color-sky-600)",
  } as CSSProperties,
  dark: {
    "--diff-add-fg": "var(--color-emerald-400)",
    "--diff-del-fg": "var(--color-rose-400)",
    "--diff-mod-fg": "var(--color-amber-400)",
    "--diff-ren-fg": "var(--color-sky-400)",
  } as CSSProperties,
};

// Ready content settles in on the site's reveal curve. The header leads and
// the diff follows a beat later — otherwise the diff's sheer mass makes it
// read as arriving first (titles land first; see transitions.ts).
const settle = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: REVEAL },
};

const settleAfterHeader = {
  ...settle,
  transition: { ...settle.transition, delay: 0.14 },
};

/**
 * Reveals `target` one character at a time. The target may grow (the sha
 * arrives after the fetch) — typing simply continues; the revealed prefix
 * never resets. Reduced-motion users get the full text immediately.
 */
function useTypewriter(target: string): string {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target.length);
      return;
    }
    const id = window.setInterval(() => {
      setCount((current) => {
        if (current >= target.length) {
          window.clearInterval(id);
          return current;
        }
        return current + 1;
      });
    }, 24);
    return () => window.clearInterval(id);
  }, [target]);

  return target.slice(0, Math.min(count, target.length));
}

function Caret() {
  return (
    <motion.span
      aria-hidden
      className="ml-px inline-block h-3 w-[6px] translate-y-[1.5px] rounded-[1px] bg-muted-foreground/70"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 1.1,
        times: [0, 0.5, 0.5, 1],
        repeat: Infinity,
        ease: REVEAL,
      }}
    />
  );
}

function Dot() {
  return (
    <span aria-hidden className="text-muted-foreground/40">
      ·
    </span>
  );
}

/**
 * Commit bodies arrive hard-wrapped at ~72 columns; joining those breaks lets
 * the text reflow to the container. Paragraph breaks and list lines survive.
 */
function formatCommitBody(body: string): string {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => {
      let out = "";
      for (const line of paragraph.split("\n")) {
        if (!out) out = line.trim();
        else if (/^\s*([-*•]|\d+\.)\s/.test(line)) out += `\n${line.trim()}`;
        else out += ` ${line.trim()}`;
      }
      return out;
    })
    .join("\n\n");
}

export function CodeView() {
  const { language } = useLanguage();
  const t = translations[language].common.diff;
  const isDark = useIsDarkScheme();
  const location = useLocation();
  const { setActive } = useCodeView();

  const pagePath = resolvePagePath(location.pathname);
  const { state, retry } = usePageDiff(true, pagePath);

  const commit = state.status === "ready" ? state.commit : null;
  const githubUrl = commit?.htmlUrl ?? githubFallbackUrl(pagePath);
  const scheme = isDark ? "dark" : "light";

  // the loading beat: the view "runs" the command, then the real header
  // replaces it when the commit lands
  const typed = useTypewriter("git show");

  const formattedBody = useMemo(
    () => (commit?.body ? formatCommitBody(commit.body) : null),
    [commit],
  );

  const formattedDate = useMemo(() => {
    if (!commit?.date) return null;
    try {
      return new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(
        new Date(commit.date),
      );
    } catch {
      return null;
    }
  }, [commit, language]);

  return (
    <main
      id="main"
      style={DIFF_TOKENS[scheme]}
      className="flex min-h-screen flex-1 flex-col bg-background"
    >
      {/* the nav is gone in this mode — its floating pill surface collapses
          to this single close button, the only UI above the code */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActive(false)}
              className="fixed top-4 right-4 z-50 size-10 rounded-full border border-foreground/10 bg-background/70 shadow-lg shadow-black/5 backdrop-blur-2xl transition-colors hover:bg-muted sm:top-5 sm:right-6"
            />
          }
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">{t.exit}</span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {t.exit}
          {/* h-4 keeps the keycap inside the text line so the tooltip doesn't grow */}
          <Kbd className="h-4 min-w-4 px-1 text-[10px]">esc</Kbd>
        </TooltipContent>
      </Tooltip>

      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-5 pt-24 pb-6 sm:px-8 sm:pt-28">
        {commit ? (
          <motion.div {...settle} className="flex min-w-0 flex-col gap-2.5">
            <h1 className="max-w-3xl font-heading text-2xl font-semibold tracking-tight break-words md:text-3xl line-clamp-2">
              {commit.subject}
            </h1>
            {formattedBody && (
              <p className="max-w-2xl text-sm leading-relaxed whitespace-pre-line text-muted-foreground line-clamp-4">
                {formattedBody}
              </p>
            )}
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
              <span>{commit.shortSha}</span>
              {formattedDate && (
                <>
                  <Dot />
                  <span>{formattedDate}</span>
                </>
              )}
              <Dot />
              <span>
                {commit.files.length}{" "}
                {commit.files.length === 1 ? t.file : t.files}
              </span>
              <Dot />
              <span>
                <span className="text-(--diff-add-fg)">
                  +{commit.additions}
                </span>{" "}
                <span className="text-(--diff-del-fg)">
                  −{commit.deletions}
                </span>
              </span>
              {pagePath && <MenuHint text={t.hint} />}
            </p>
          </motion.div>
        ) : (
          <p className="font-mono text-xs text-muted-foreground">
            <span aria-hidden className="text-muted-foreground/50">
              ${" "}
            </span>
            {typed}
            {state.status === "loading" && <Caret />}
          </p>
        )}

        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 pb-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.viewOnGitHub}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      </header>

      {commit && (
        <motion.div
          {...settleAfterHeader}
          className="flex flex-1 flex-col border-t border-border/60"
        >
          <CommitDiff commit={commit} scheme={scheme} t={t} />
        </motion.div>
      )}

      {(state.status === "error" || state.status === "empty") && (
        <motion.div
          {...settle}
          className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-24 text-center"
        >
          <p className="text-sm text-muted-foreground">
            {state.status === "error" ? t.error : t.noChanges}
          </p>
          {state.status === "error" ? (
            <Button variant="outline" size="sm" onClick={retry}>
              {t.retry}
            </Button>
          ) : (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.viewOnGitHub}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </motion.div>
      )}
    </main>
  );
}
