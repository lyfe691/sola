/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The git-diff droplet body — a miniature of the code view plus the one-line
 * explanation. Shared by every surface that flips into the code view (the
 * appearance menu's switch, the deep-dive toolbar) so the preview stays one
 * artifact and can't drift between copies. Consumers own the Tooltip and
 * trigger and choose the side/offset.
 */

import type { ComponentProps } from "react";
import { TooltipContent } from "@/components/ui/tooltip";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { DIFF_TOKENS } from "./diff-tokens";
import { useIsDarkScheme } from "./use-scheme";

/**
 * Miniature of what the code view shows — a commit (dot + sha) and its diff,
 * one line removed, one added. Painted with the code view's own DIFF_TOKENS
 * so the preview colors are exactly the real thing's.
 */
function DiffHintArt() {
  const isDark = useIsDarkScheme();

  return (
    <svg
      viewBox="0 0 152 76"
      // block, or the inline baseline gap makes the wrapper taller than the
      // art and its bottom corners escape the wrapper's rounding
      className="block w-full"
      style={DIFF_TOKENS[isDark ? "dark" : "light"]}
      aria-hidden="true"
    >
      {/* panel ground — square-cornered; the wrapper's rounded-lg clips it
          concentric with the bubble (rounded-xl = 1.4 × --radius = 14px,
          minus the 4px inset = 10px = --radius = rounded-lg), so the
          droplet's outline stays the only border in the tooltip */}
      <rect width="152" height="76" className="fill-muted/40" />
      {/* commit dot + sha chip */}
      <circle cx="16" cy="16" r="3.5" className="fill-primary" />
      <rect
        x="26"
        y="12"
        width="34"
        height="8"
        rx="4"
        className="fill-foreground/12"
      />
      {/* context line */}
      <rect
        x="14"
        y="28"
        width="86"
        height="6"
        rx="3"
        className="fill-foreground/10"
      />
      {/* removed line: tinted row, − marker, content bar */}
      <rect
        x="6"
        y="41"
        width="140"
        height="12"
        rx="4"
        className="fill-(--diff-del-fg)/10"
      />
      <rect
        x="12"
        y="45.5"
        width="8"
        height="3"
        rx="1.5"
        className="fill-(--diff-del-fg)"
      />
      <rect
        x="28"
        y="44"
        width="58"
        height="6"
        rx="3"
        className="fill-(--diff-del-fg)/40"
      />
      {/* added line: tinted row, + marker, content bar */}
      <rect
        x="6"
        y="57"
        width="140"
        height="12"
        rx="4"
        className="fill-(--diff-add-fg)/10"
      />
      <rect
        x="12"
        y="61.5"
        width="8"
        height="3"
        rx="1.5"
        className="fill-(--diff-add-fg)"
      />
      <rect
        x="14.5"
        y="59"
        width="3"
        height="8"
        rx="1.5"
        className="fill-(--diff-add-fg)"
      />
      <rect
        x="28"
        y="60"
        width="84"
        height="6"
        rx="3"
        className="fill-(--diff-add-fg)/40"
      />
    </svg>
  );
}

/** The droplet's TooltipContent: art panel, mono `git diff` heading, hint. */
export function DiffHintContent({
  className,
  ...props
}: ComponentProps<typeof TooltipContent>) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <TooltipContent
      className={cn(
        "w-52 flex-col items-stretch gap-1.5 p-1 select-none",
        className,
      )}
      {...props}
    >
      <div className="overflow-hidden rounded-lg">
        <DiffHintArt />
      </div>
      <div className="space-y-0.5 px-2 pt-0.5 pb-1.5 text-left">
        {/* a command name, not copy — every locale keeps "git diff" */}
        <p className="font-mono">git diff</p>
        <p className="font-normal leading-relaxed text-popover-foreground/70">
          {t.common.diff.hint}
        </p>
      </div>
    </TooltipContent>
  );
}
