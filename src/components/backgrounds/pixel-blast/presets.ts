/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Per-theme presets for the PixelBlast background. Same convention as
 * `side-rays/presets.ts` — co-located, keyed by theme, resolved via
 * `getPixelBlastPreset(theme)`.
 */

import { type Theme, getThemeType } from "@/config/themes";

export type PixelBlastPreset = {
  color: string; // single hex driving the pixels
};

/** pixel-blast presets (palettes echo the side-rays presets per theme) */
export const PIXEL_BLAST_PRESETS: Record<
  Exclude<Theme, "system">,
  PixelBlastPreset
> = {
  light: { color: "#B0CFFF" },
  dark: { color: "#A8CCFF" },
  cloud: { color: "#EAF3FF" },
  cyber: { color: "#E879F9" },
  forest: { color: "#34D399" },
  amethyst: { color: "#C4B5FD" },
  vintage: { color: "#FFD6A8" },
  coffee: { color: "#EAD0B6" },
  life: { color: "#7FE3BF" },
  rose: { color: "#B71833" },
};

/** theme class names to look for on <html> */
export const PIXEL_BLAST_THEME_CLASS_KEYS = Object.keys(
  PIXEL_BLAST_PRESETS,
) as Exclude<Theme, "system">[];

/** resolve the preset for a theme (maps system -> light/dark) */
export const getPixelBlastPreset = (theme: Theme): PixelBlastPreset => {
  const resolved =
    theme === "system"
      ? getThemeType("system")
      : (theme as Exclude<Theme, "system">);
  return PIXEL_BLAST_PRESETS[resolved as Exclude<Theme, "system">];
};
