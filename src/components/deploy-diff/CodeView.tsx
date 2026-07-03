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
 * the repo-wide latest commit. The only UI above it is the exit bubble,
 * a frosted tab docked to the top-right edge.
 *
 * Loading is a terminal ritual, centered and full-size: the view types
 * `$ git show `, the caret blinks while the sha resolves, then the sha types
 * in — the fetch completing the command is the payoff. The finished command
 * holds a beat, is consumed the way a leaving page is (fade + scale + blur,
 * CONSUME_IN), and the commit settles in beneath as its output. The ritual
 * always plays to completion; a cached response replays it rather than
 * cutting it short. Reduced motion skips straight to the content.
 */

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { MenuHint } from "@/components/menu-hint";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { CONSUME_IN, EASE_DRAWER, EASE_OUT, REVEAL } from "@/utils/transitions";
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

// The ritual's cadence: mechanical typing (a scripted terminal, not a human),
// then a hold so the finished command registers before the content takes over.
const TYPE_INTERVAL_MS = 35;
const COMMAND_HOLD_MS = 450;

// The command enters quietly under the page transition; once finished it is
// consumed the way a leaving page is (see pageTransitionVariants), and the
// content reforms beneath on the site's reveal curve.
const commandPhase = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: EASE_OUT } },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(6px)",
    transition: { duration: 0.28, ease: CONSUME_IN },
  },
};

// Ready content settles in as ONE block on the site's reveal curve — header
// and diff together, the way a command's output arrives whole. No stagger:
// piecemeal reveals read as loading, not settling.
const contentPhase = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: REVEAL },
  },
  exit: { opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } },
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
    }, TYPE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [target]);

  return target.slice(0, Math.min(count, target.length));
}

/**
 * Terminal caret, em-sized so it scales with the prompt. Solid while
 * characters arrive, blinking while the command waits (on the fetch, or
 * through the finished hold) — the way a real terminal idles.
 */
function Caret({ blinking }: { blinking: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="ml-[0.15em] inline-block h-[1em] w-[0.5ch] translate-y-[0.12em] rounded-[2px] bg-muted-foreground/70"
      animate={blinking ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
      transition={
        blinking
          ? { duration: 1.1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: REVEAL }
          : { duration: 0.1 }
      }
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

function GitHubLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline decoration-muted-foreground/40 decoration-dotted underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/40",
        className,
      )}
    >
      {label}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </a>
  );
}

/**
 * The exit control — a frosted bubble docked to the top edge, the only UI
 * above the code. Flush at the top, round bulge below, the same surface as
 * the old floating close button but belonging to the edge instead of
 * hovering over the diff (the sticky file headers reserve clearance
 * beneath it). Portaled to <body>: the page transition animates
 * transform/filter on an ancestor, which turns `fixed` into `absolute` —
 * so the wrapper carries both the fixed position and its own slide motion.
 * Slides in and out against `active`, in step with the page swap; hover
 * pulls it out a touch taller rather than detaching it from the edge.
 */
function ExitBubble({
  active,
  onExit,
  label,
}: {
  active: boolean;
  onExit: () => void;
  label: string;
}) {
  return createPortal(
    <motion.div
      initial={{ y: "-110%" }}
      animate={{ y: active ? 0 : "-110%" }}
      transition={{ duration: 0.5, ease: EASE_DRAWER }}
      inert={!active}
      className={cn(
        "fixed top-0 right-4 z-50 sm:right-6",
        !active && "pointer-events-none",
      )}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={onExit}
              className="flex h-11 w-14 items-center justify-center rounded-b-full border border-foreground/10 bg-background/70 shadow-lg shadow-black/5 outline-none backdrop-blur-2xl transition-[height,background-color] duration-300 ease-out hover:h-12 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          }
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {label}
          {/* h-4 keeps the keycap inside the text line so the tooltip doesn't grow */}
          <Kbd className="h-4 min-w-4 px-1 text-[10px]">esc</Kbd>
        </TooltipContent>
      </Tooltip>
    </motion.div>,
    document.body,
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
  const { active, setActive } = useCodeView();

  const pagePath = resolvePagePath(location.pathname);
  const { state, retry } = usePageDiff(true, pagePath);

  const commit = state.status === "ready" ? state.commit : null;
  const githubUrl = commit?.htmlUrl ?? githubFallbackUrl(pagePath);
  const scheme = isDark ? "dark" : "light";

  // The command grows once the sha lands; typing continues into it, so the
  // ritual completes even when the response beats the typewriter (cache).
  const command = commit ? `git show ${commit.shortSha}` : "git show";
  const typed = useTypewriter(command);
  const typedDone = typed === command;
  const resolved = state.status !== "loading";

  const [phase, setPhase] = useState<"command" | "content">("command");

  useEffect(() => {
    if (phase !== "command" || !resolved || !typedDone) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("content");
      return;
    }
    const id = window.setTimeout(() => setPhase("content"), COMMAND_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [phase, resolved, typedDone]);

  // re-enter the ritual: the completed prefix stays, the new sha types in
  const handleRetry = () => {
    setPhase("command");
    retry();
  };

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
      {/* the nav is gone in this mode — the exit bubble is the only UI
          above the code */}
      <ExitBubble
        active={active}
        onExit={() => setActive(false)}
        label={t.exit}
      />

      <AnimatePresence mode="wait">
        {phase === "command" ? (
          <motion.div
            key="command"
            {...commandPhase}
            className="flex flex-1 items-center justify-center px-5"
          >
            <p className="font-mono text-2xl tracking-tight whitespace-nowrap sm:text-3xl md:text-4xl">
              <span aria-hidden className="select-none text-muted-foreground/50">
                ${" "}
              </span>
              {typed}
              <Caret blinking={typedDone} />
            </p>
          </motion.div>
        ) : (
          <motion.div key="content" {...contentPhase} className="flex flex-1 flex-col">
            {commit && (
              <>
                <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 px-5 pt-24 pb-6 sm:px-8 sm:pt-28">
                  <div className="flex min-w-0 flex-col gap-2.5">
                    <h1 className="max-w-3xl font-heading text-2xl font-semibold tracking-tight break-words md:text-3xl line-clamp-2">
                      {commit.subject}
                    </h1>
                    {formattedBody && (
                      <p className="max-w-2xl text-sm leading-relaxed whitespace-pre-line text-muted-foreground line-clamp-4">
                        {formattedBody}
                      </p>
                    )}
                    {/* each ·-item pair wraps as a unit (and the hint rides
                        with the counts), so a narrow screen never strands a
                        separator or the info glyph on its own line */}
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-xs text-muted-foreground">
                      {/* the sha reads as an identifier, not prose — chip it
                          like GitHub does */}
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-foreground/80">
                        {commit.shortSha}
                      </span>
                      {formattedDate && (
                        <span className="inline-flex items-center gap-x-2 whitespace-nowrap">
                          <Dot />
                          <span>{formattedDate}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-x-2 whitespace-nowrap">
                        <Dot />
                        <span>
                          {commit.files.length}{" "}
                          {commit.files.length === 1 ? t.file : t.files}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-x-2 whitespace-nowrap">
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
                      </span>
                    </p>
                  </div>

                  <GitHubLink
                    href={githubUrl}
                    label={t.viewOnGitHub}
                    className="shrink-0 pb-1"
                  />
                </header>

                <div className="flex flex-1 flex-col border-t border-border/60">
                  <CommitDiff commit={commit} scheme={scheme} t={t} />
                </div>
              </>
            )}

            {(state.status === "error" || state.status === "empty") && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-24 text-center">
                <p className="text-sm text-muted-foreground">
                  {state.status === "error" ? t.error : t.noChanges}
                </p>
                {state.status === "error" && (
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    {t.retry}
                  </Button>
                )}
                <GitHubLink href={githubUrl} label={t.viewOnGitHub} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
