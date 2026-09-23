/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export const ARROW_W = 20;
export const ARROW_H = 9;

/**
 * The rounded-tip arrow a popover card points with, drawn pointing up.
 * Place it overlapping the card by 1px: the fill swallows the card's ring
 * line at the seam.
 */
export function PopupArrow({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={ARROW_W}
      height={ARROW_H}
      viewBox={`0 0 ${ARROW_W} ${ARROW_H}`}
      aria-hidden
      className={cn("overflow-visible", className)}
      style={style}
    >
      <path
        d="M0 9 L7.8 1.7 Q10 -0.3 12.2 1.7 L20 9 Z"
        className="fill-popover"
      />
      <path
        d="M0 9 L7.8 1.7 Q10 -0.3 12.2 1.7 L20 9"
        fill="none"
        strokeWidth="1"
        className="stroke-foreground/5 dark:stroke-foreground/10"
      />
    </svg>
  );
}
