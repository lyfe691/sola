/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { cn } from "@/lib/utils";

/**
 * A chevron that becomes an arrow when the link or button around it is
 * hovered or focused: the head moves on and a shaft grows in behind it
 * (index.css, "morph arrow"). Sized by its class, drawn in the text colour.
 */
export function MorphArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
    >
      <line className="morph-arrow-shaft" x1="9" y1="12" x2="18" y2="12" />
      <g className="morph-arrow-head">
        <line x1="11" y1="8" x2="15" y2="12" />
        <line x1="11" y1="16" x2="15" y2="12" />
      </g>
    </svg>
  );
}
