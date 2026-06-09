/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Background registry. Each entry is a full-screen, mutually-exclusive
 * background. Components are lazy-imported so a heavy effect (WebGL, etc.)
 * only enters the bundle once the user actually selects it.
 *
 * Adding a background:
 *   1. Drop it in `backgrounds/<name>/<Name>.tsx` (+ a co-located `presets.ts`
 *      if it needs per-theme tuning, mirroring `aurora/`).
 *   2. Add one entry below.
 */

import { lazy, type ComponentType } from "react";

/** sentinel meaning "no background" (kept out of the registry on purpose) */
export const NONE_BACKGROUND = "none";

export interface BackgroundDef {
  /** stable id, persisted to localStorage */
  id: string;
  /** display name — a proper noun, intentionally not translated */
  label: string;
  /** the full-screen effect, lazy-loaded */
  component: ComponentType;
}

export const BACKGROUNDS: BackgroundDef[] = [
  {
    id: "aurora",
    label: "Aurora",
    component: lazy(() => import("./aurora/Aurora")),
  },
  {
    id: "side-rays",
    label: "Side Rays",
    component: lazy(() => import("./side-rays/SideRays")),
  },
  {
    id: "dot-field",
    label: "Dot Field",
    component: lazy(() => import("./dot-field/DotField")),
  },
];

/** true when `value` is a currently-registered background id */
export const isBackgroundId = (value: string): boolean =>
  BACKGROUNDS.some((b) => b.id === value);

/** normalize any stored/incoming value to a valid option */
export const resolveBackground = (value: string | null | undefined): string =>
  value && isBackgroundId(value) ? value : NONE_BACKGROUND;
