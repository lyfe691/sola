/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The code view: a full-bleed takeover rendered by PageShell in place of the
 * routed page (entering/leaving rides the site's page transition). Shows the
 * latest change to THIS page — the diff is scoped to the current route's
 * source files (see page-sources.ts); unmapped routes fall back to the
 * repo-wide latest commit. The only UI above it is the floating exit button.
 */

import { useMemo, type CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

// Ready content settles in on the site's reveal curve. No skeleton: fast
// loads go straight to content; slow ones get a quiet, late spinner.
const settle = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: REVEAL },
};

function Dot() {
  return (
    <span aria-hidden className="text-muted-foreground/40">
      ·
    </span>
  );
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
      {/* the nav is gone in this mode — this is the only UI above the code */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActive(false)}
              className="fixed top-5 right-5 z-50 h-9 w-9 rounded-full transition-colors hover:bg-muted sm:top-6 sm:right-8"
            />
          }
        >
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{t.exit}</span>
        </TooltipTrigger>
        <TooltipContent>{t.exit}</TooltipContent>
      </Tooltip>

      {commit && (
        <motion.header
          {...settle}
          className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-5 pt-24 pb-6 sm:px-8 sm:pt-28"
        >
          <div className="flex min-w-0 flex-col gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight break-words md:text-3xl">
              {commit.subject}
            </h1>
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
            </p>
          </div>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 pb-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.viewOnGitHub}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </motion.header>
      )}

      {commit && (
        <motion.div
          {...settle}
          className="flex flex-1 flex-col border-t border-border/60"
        >
          <CommitDiff commit={commit} scheme={scheme} t={t} />
        </motion.div>
      )}

      {state.status === "loading" && (
        // late fade-in: fast loads never see it, slow ones get a quiet cue
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.35, ease: REVEAL }}
          className="flex flex-1 items-center justify-center"
        >
          <Spinner className="size-5 text-muted-foreground/70" />
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
