/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The deployed-commit pin for the footer: a quiet mono chip — commit dot +
 * short sha — naming the exact commit this page was built from. Lingering
 * grows a tooltip with the live commit (subject, diffstat, date), loaded
 * through use-page-diff's site scope so it shares the code view's cache and
 * GitHub rate budget; nothing is fetched until someone actually hovers.
 * Clicking flips into the code view, same as the appearance menu's switch.
 */

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSwapIn } from "@/hooks/use-swap-in";
import { INTL_LOCALE } from "@/lib/dates";
import { useLanguage, useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";
import { useCodeView } from "./code-view-provider";
import { useIsDarkScheme } from "./use-scheme";
import { DEPLOY_LABEL, usePageDiff } from "./use-page-diff";

/** The commit in the tooltip: a skeleton while it loads, then its lines.
 *  It mounts with each showing of the tooltip, so the lines swap in only
 *  when that showing waited on the skeleton. */
function CommitLines({
  loading,
  commit,
  date,
  scheme,
}: {
  loading: boolean;
  commit: { subject: string; additions: number; deletions: number } | null;
  date: string;
  scheme: "light" | "dark";
}) {
  const swapIn = useSwapIn(loading);
  if (loading) {
    return (
      <div className="space-y-1.5 py-1" aria-hidden="true">
        <div className="h-2.5 w-full animate-pulse rounded-full bg-background/10" />
        <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-background/10" />
      </div>
    );
  }
  if (!commit) return null;
  return (
    <>
      <p
        className={cn(
          "line-clamp-2 leading-relaxed",
          swapIn && "animate-swap-in",
        )}
      >
        {commit.subject}
      </p>
      <p
        data-scheme={scheme}
        className={cn(
          "font-mono text-3xs font-normal text-background/60",
          swapIn && "animate-swap-in",
        )}
      >
        <span className="text-(--diff-add-fg)">+{commit.additions}</span>{" "}
        <span className="text-(--diff-del-fg)">−{commit.deletions}</span>
        {date && <> · {date}</>}
      </p>
    </>
  );
}

export function DeployChip() {
  const { setActive: setCodeView } = useCodeView();
  const { language } = useLanguage();
  const t = useTranslation();
  const isDark = useIsDarkScheme();

  // latch on first hover — the query stays enabled so the result (already
  // in the react-query/sessionStorage cache) is instant on re-hovers
  const [wanted, setWanted] = useState(false);
  const { state } = usePageDiff(wanted, null);
  const commit = state.status === "ready" ? state.commit : null;

  // same format as the code view's meta row — one commit, one voice
  const formattedDate = commit?.date
    ? new Intl.DateTimeFormat(INTL_LOCALE[language], {
        dateStyle: "medium",
      }).format(new Date(commit.date))
    : "";

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onPointerEnter={() => setWanted(true)}
            onFocus={() => setWanted(true)}
            onClick={() => setCodeView(true)}
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-foreground/40 transition-[color,transform] duration-200 ease-out hover:text-foreground/80 active:scale-[0.97]"
          />
        }
      >
        {/* the miniature's commit dot, made real — the one accent allowed
            in the footer's small print */}
        <span
          aria-hidden="true"
          className="size-[5px] shrink-0 rounded-full bg-primary/70 transition-colors duration-200 group-hover:bg-primary"
        />
        {DEPLOY_LABEL}
        <span className="sr-only">{t.common.diff.showDiff}</span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="w-56 flex-col items-stretch gap-1 text-left select-none"
      >
        {/* a command name, not copy — and the title the code view opens
            under, so the tooltip reads as its preview */}
        <p className="font-mono">git show</p>
        <CommitLines
          loading={state.status === "loading"}
          commit={commit}
          date={formattedDate}
          scheme={isDark ? "light" : "dark"}
        />
        <p className="pt-0.5 font-normal leading-relaxed text-background/70">
          {t.common.diff.deployed}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
