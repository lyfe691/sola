/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Suspense } from "react";
import { useLocalePath } from "@/lib/locale-router";
import { cn } from "@/lib/utils";
import { useBackground } from "./background-provider";
import { BACKGROUNDS } from "./registry";

/**
 * The chosen background, behind everything. The home page is its stage: one
 * line of large type over it. Every other page is there to be read, with
 * small text set straight on the page, so there the background steps back
 * behind a veil of the page colour and comes forward again on the way home.
 */
export default function BackgroundLayer() {
  const { active } = useBackground();
  const { path } = useLocalePath();
  const def = BACKGROUNDS.find((b) => b.id === active);
  if (!def) return null;

  const Background = def.component;
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none select-none"
      aria-hidden
    >
      <Suspense fallback={null}>
        <Background />
      </Suspense>
      <div
        className={cn(
          "absolute inset-0 bg-background transition-opacity duration-700 ease-smooth",
          path === "/" ? "opacity-0" : "opacity-60",
        )}
      />
    </div>
  );
}
