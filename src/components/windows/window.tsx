/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The window the three ports share (Terminal Replay, Code
 * Morph, Browser Window): the source's "inset" frame, a bar over a panel set
 * four pixels in. The source draws it from its own light and dark palettes,
 * picked by reading the backdrop's luminance; here it is the site's tokens,
 * so it follows every theme without measuring anything.
 */

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The outer frame; `window-frame` (index.css) is its corner, hairline and lift. */
export const WINDOW_FRAME =
  "window-frame relative isolate flex w-full flex-col overflow-hidden bg-muted text-foreground";

/** The panel inside it, under the bar; `window-panel` keeps its corner concentric. */
export const WINDOW_PANEL =
  "window-panel relative mx-1 mb-1 overflow-hidden bg-card ring-1 ring-border";

/**
 * Draws the window inside it to scale: every length the window is built
 * from (spacing, corners, type) becomes a share of this box's width, as if
 * the window were `nominal` px wide and seen from further away. For a window
 * shown small (a card, a gallery row, a menu's preview), where its fixed
 * 44px bar would be most of it.
 */
export function WindowScale({
  nominal = 896,
  fill = false,
  children,
}: {
  /** The width, in px, at which the window is its own size. */
  nominal?: number;
  /** The window takes its box's height too, not only its width. */
  fill?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn("window-scale @container", fill && "h-full")}>
      <div
        className={cn("window-scaled", fill && "h-full")}
        style={{ "--window-nominal": nominal } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

export function WindowDots({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex flex-none gap-1.75", className)}
    >
      {[0, 1, 2].map((dot) => (
        <span key={dot} className="size-2.75 rounded-full bg-foreground/12" />
      ))}
    </span>
  );
}
