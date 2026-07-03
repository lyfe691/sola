/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The code view page: rendered by PageShell in place of the routed page while
 * the mode is active, so entering/leaving rides the site's page transition.
 * Shows the commit that is live on this deployment as a full-width git diff.
 */

import { useMemo, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { CommitDiff } from "./CommitDiff";
import { useIsDarkScheme } from "./use-scheme";
import {
  DEPLOY_FALLBACK_URL,
  DEPLOY_LABEL,
  IS_DEV_DEPLOY,
  useDeployCommit,
} from "./use-deploy-commit";

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

function HeaderSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-7 w-3/5" />
      <Skeleton className="h-4 w-44" />
    </div>
  );
}

function BodySkeleton() {
  const widths = [
    "w-full",
    "w-11/12",
    "w-4/5",
    "w-full",
    "w-2/3",
    "w-5/6",
    "w-1/2",
    "w-3/4",
  ];
  return (
    <div className="p-6">
      <Skeleton className="mb-5 h-4 w-2/5" />
      <div className="space-y-2.5">
        {widths.map((width, i) => (
          <Skeleton key={i} className={cn("h-3", width)} />
        ))}
      </div>
    </div>
  );
}

export function CodeView() {
  const { language } = useLanguage();
  const t = translations[language].common.diff;
  const isDark = useIsDarkScheme();
  const { state, retry } = useDeployCommit(true);

  const commit = state.status === "ready" ? state.commit : null;

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
      className="flex min-h-screen flex-1 flex-col px-5 pt-24 pb-10 sm:px-6 sm:pt-28 md:px-8 lg:px-12 lg:pt-36"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
        <header className="flex min-w-0 flex-col gap-2">
          <p className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {IS_DEV_DEPLOY ? t.latest : t.deployed}
          </p>

          {commit ? (
            <>
              <h1 className="font-heading text-2xl font-semibold tracking-tight break-words md:text-3xl">
                {commit.subject}
              </h1>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                <span>{commit.shortSha}</span>
                {formattedDate && <span>{formattedDate}</span>}
                <span>
                  {commit.files.length}{" "}
                  {commit.files.length === 1 ? t.file : t.files}
                </span>
                <span>
                  <span className="text-(--diff-add-fg)">
                    +{commit.additions}
                  </span>{" "}
                  <span className="text-(--diff-del-fg)">
                    −{commit.deletions}
                  </span>
                </span>
              </p>
            </>
          ) : state.status === "loading" ? (
            <HeaderSkeleton />
          ) : (
            <p className="font-mono text-xs text-muted-foreground">
              {DEPLOY_LABEL}
            </p>
          )}
        </header>

        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-xl">
          {state.status === "loading" && <BodySkeleton />}

          {state.status === "error" && (
            <div className="flex flex-col items-center gap-3 p-12 text-center">
              <p className="text-sm text-muted-foreground">{t.error}</p>
              <Button variant="outline" size="sm" onClick={retry}>
                {t.retry}
              </Button>
            </div>
          )}

          {commit && <CommitDiff commit={commit} t={t} />}
        </div>

        <div className="flex justify-end">
          <a
            href={commit?.htmlUrl ?? DEPLOY_FALLBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.viewOnGitHub}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </main>
  );
}
