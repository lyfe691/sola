/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Per-theme presets for the Silk background. Same convention as
 * `side-rays/presets.ts` — co-located, keyed by theme, resolved via
 * `getSilkPreset(theme)`.
 */

import { type Theme, getThemeType } from "@/config/themes";

export type SilkPreset = {
  color: string; // base silk color (single muted hex)
  speed: number; // flow animation speed
  scale: number; // pattern scale
  noiseIntensity: number; // grain amount
};

/** silk presets (muted shades echoing the per-theme palette) */
export const SILK_PRESETS: Record<Exclude<Theme, "system">, SilkPreset> = {
  light: {
    color: "#9DB6E0",
    speed: 5,
    scale: 1,
    noiseIntensity: 1.5,
  },
  dark: {
    color: "#3A4A6B",
    speed: 5,
    scale: 1,
    noiseIntensity: 1.5,
  },
  cloud: {
    color: "#C7D8EE",
    speed: 4.5,
    scale: 1,
    noiseIntensity: 1.3,
  },
  cyber: {
    color: "#7A3C95",
    speed: 6,
    scale: 1,
    noiseIntensity: 1.6,
  },
  forest: {
    color: "#2A6B58",
    speed: 5,
    scale: 1,
    noiseIntensity: 1.5,
  },
  amethyst: {
    color: "#6E5DA6",
    speed: 5,
    scale: 1,
    noiseIntensity: 1.5,
  },
  vintage: {
    color: "#D6B488",
    speed: 4.5,
    scale: 1,
    noiseIntensity: 1.3,
  },
  coffee: {
    color: "#B79A7C",
    speed: 4.5,
    scale: 1,
    noiseIntensity: 1.3,
  },
  life: {
    color: "#73C3A4",
    speed: 5,
    scale: 1,
    noiseIntensity: 1.4,
  },
  rose: {
    color: "#8C2C40",
    speed: 5,
    scale: 1,
    noiseIntensity: 1.5,
  },
};

/** theme class names to look for on <html> */
export const SILK_THEME_CLASS_KEYS = Object.keys(SILK_PRESETS) as Exclude<
  Theme,
  "system"
>[];

/** resolve the preset for a theme (maps system -> light/dark) */
export const getSilkPreset = (theme: Theme): SilkPreset => {
  const resolved =
    theme === "system"
      ? getThemeType("system")
      : (theme as Exclude<Theme, "system">);
  return SILK_PRESETS[resolved as Exclude<Theme, "system">];
};
