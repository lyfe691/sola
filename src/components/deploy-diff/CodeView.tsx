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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
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

// A slow breathe (opacity only) instead of the stock skeleton pulse — calmer,
// and the ghost is shaped like the real diff so nothing jumps when it loads.
const breathe = {
  animate: { opacity: [0.6, 1, 0.6] },
  transition: { duration: 2.4, repeat: Infinity, ease: REVEAL },
};

// Ready content settles in on the site's reveal curve.
const settle = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: REVEAL },
};

function HeaderGhost() {
  return (
    <motion.div className="flex flex-col gap-3" {...breathe}>
      <div className="h-7 w-72 max-w-full rounded-lg bg-muted/60 md:h-8" />
      <div className="flex items-center gap-3">
        <div className="h-5 w-16 rounded-md bg-muted/60" />
        <div className="h-3.5 w-24 rounded-full bg-muted/40" />
        <div className="h-3.5 w-14 rounded-full bg-muted/40" />
      </div>
    </motion.div>
  );
}

/** ghost rows silhouette a diff: gutter dashes, code bars, a hint of +/- */
const GHOST_ROWS = [
  { width: "w-2/5", tint: null },
  { width: "w-7/12", tint: null },
  { width: "w-1/2", tint: "del" },
  { width: "w-1/2", tint: "add" },
  { width: "w-2/3", tint: "add" },
  { width: "w-1/3", tint: null },
  { width: "w-3/4", tint: null },
  { width: "w-5/12", tint: null },
  { width: "w-3/5", tint: null },
  { width: "w-1/4", tint: null },
] as const;

function DiffGhost() {
  return (
    <motion.div {...breathe}>
      <div className="flex items-center gap-2 border-b border-border/60 px-5 py-3 sm:px-8">
        <div className="size-3 rounded bg-muted/60" />
        <div className="h-3 w-44 max-w-[50%] rounded-full bg-muted/60" />
        <div className="ml-auto h-3 w-10 rounded-full bg-muted/40" />
      </div>
      <div className="flex flex-col gap-[7px] px-5 py-4 sm:px-8">
        {GHOST_ROWS.map((row, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-2.5 w-5 rounded-full bg-muted/40" />
            <div className="h-2.5 w-5 rounded-full bg-muted/40" />
            <div
              className={cn(
                "h-2.5 rounded-full",
                row.width,
                row.tint === "add" && "bg-emerald-500/20",
                row.tint === "del" && "bg-rose-500/20",
                row.tint === null && "bg-muted/50",
              )}
            />
          </div>
        ))}
      </div>
    </motion.div>
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
      style={DIFF_TOKENS[isDark ? "dark" : "light"]}
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

      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-5 pt-24 pb-6 sm:px-8 sm:pt-28">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            {pagePath ? t.pageChange : t.latest}
          </p>

          {commit ? (
            <motion.div className="flex min-w-0 flex-col gap-1.5" {...settle}>
              <h1 className="font-heading text-2xl font-semibold tracking-tight break-words md:text-3xl">
                {commit.subject}
              </h1>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
                <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {commit.shortSha}
                </span>
                {formattedDate && <span>{formattedDate}</span>}
                <span>
                  {commit.files.length}{" "}
                  {commit.files.length === 1 ? t.file : t.files}
                </span>
                <span className="font-mono text-xs">
                  <span className="text-(--diff-add-fg)">
                    +{commit.additions}
                  </span>{" "}
                  <span className="text-(--diff-del-fg)">
                    −{commit.deletions}
                  </span>
                </span>
              </p>
            </motion.div>
          ) : state.status === "loading" ? (
            <HeaderGhost />
          ) : (
            <p className="font-mono text-xs text-muted-foreground">
              {pagePath ?? "…"}
            </p>
          )}
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
      </header>

      <div className="flex flex-1 flex-col border-t border-border/60">
        {state.status === "loading" && <DiffGhost />}

        {state.status === "error" && (
          <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
            <p className="text-sm text-muted-foreground">{t.error}</p>
            <Button variant="outline" size="sm" onClick={retry}>
              {t.retry}
            </Button>
          </div>
        )}

        {state.status === "empty" && (
          <p className="px-5 py-16 text-center text-sm text-muted-foreground">
            {t.noChanges}
          </p>
        )}

        {commit && (
          <motion.div {...settle}>
            <CommitDiff commit={commit} t={t} />
          </motion.div>
        )}
      </div>
    </main>
  );
}
