/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The deployed-commit pin for the footer: a quiet mono chip — commit dot +
 * short sha — naming the exact commit this page was built from. Lingering
 * grows the droplet with the live commit (subject, diffstat, date), loaded
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
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { useCodeView } from "./code-view-provider";
import { DIFF_TOKENS } from "./diff-tokens";
import { useIsDarkScheme } from "./use-scheme";
import { DEPLOY_LABEL, usePageDiff } from "./use-page-diff";

export function DeployChip() {
  const { setActive: setCodeView } = useCodeView();
  const { language } = useLanguage();
  const t = translations[language];
  const isDark = useIsDarkScheme();

  // latch on first hover — the query stays enabled so the result (already
  // in the react-query/sessionStorage cache) is instant on re-hovers
  const [wanted, setWanted] = useState(false);
  const { state } = usePageDiff(wanted, null);
  const commit = state.status === "ready" ? state.commit : null;

  // same format as the code view's meta row — one commit, one voice
  const formattedDate = commit?.date
    ? new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(
        new Date(commit.date),
      )
    : "";

  return (
    <Tooltip
      onOpenChange={(open) => {
        if (open) setWanted(true);
      }}
    >
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={() => setCodeView(true)}
            aria-label={t.common.diff.showDiff}
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
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="w-56 flex-col items-stretch p-1 select-none"
      >
        <div className="space-y-1 px-2 pt-1 pb-1.5 text-left">
          {/* a command name, not copy — and the title the code view opens
              under, so the droplet reads as its preview */}
          <p className="font-mono">git show</p>
          {state.status === "loading" && (
            <div className="space-y-1.5 py-1" aria-hidden="true">
              <div className="h-2.5 w-full animate-pulse rounded-full bg-popover-foreground/10" />
              <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-popover-foreground/10" />
            </div>
          )}
          {commit && (
            <>
              <p className="line-clamp-2 leading-relaxed">{commit.subject}</p>
              <p
                style={DIFF_TOKENS[isDark ? "dark" : "light"]}
                className="font-mono text-[10px] font-normal text-popover-foreground/60"
              >
                <span className="text-(--diff-add-fg)">
                  +{commit.additions}
                </span>{" "}
                <span className="text-(--diff-del-fg)">
                  −{commit.deletions}
                </span>
                {formattedDate && <> · {formattedDate}</>}
              </p>
            </>
          )}
          <p className="pt-0.5 font-normal leading-relaxed text-popover-foreground/70">
            {t.common.diff.deployed}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
