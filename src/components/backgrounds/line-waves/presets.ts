/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Per-theme presets for the Line Waves background. Same convention as
 * `side-rays/presets.ts` — co-located, keyed by theme, resolved via
 * `getLineWavesPreset(theme)`.
 */

import { type Theme, getThemeType } from "@/config/themes";

export type LineWavesPreset = {
  color1: string; // primary line color
  color2: string; // secondary line color
  color3: string; // tertiary line color
  brightness: number; // overall brightness
  speed: number; // animation speed
  innerLineCount: number; // line density at the center
  outerLineCount: number; // line density at the edges
  warpIntensity: number; // strength of the wave warp
  colorCycleSpeed: number; // color cycling speed
};

/** line-waves presets (palettes echo the side-rays presets per theme) */
export const LINE_WAVES_PRESETS: Record<
  Exclude<Theme, "system">,
  LineWavesPreset
> = {
  light: {
    color1: "#B0CFFF",
    color2: "#C8E0FF",
    color3: "#DCEBFF",
    brightness: 0.16,
    speed: 0.28,
    innerLineCount: 32,
    outerLineCount: 36,
    warpIntensity: 1.0,
    colorCycleSpeed: 0.9,
  },
  dark: {
    color1: "#A8CCFF",
    color2: "#7FB0FF",
    color3: "#DCF2FF",
    brightness: 0.28,
    speed: 0.3,
    innerLineCount: 32,
    outerLineCount: 36,
    warpIntensity: 1.0,
    colorCycleSpeed: 1.0,
  },
  cloud: {
    color1: "#EAF3FF",
    color2: "#FFFFFF",
    color3: "#D6E8FF",
    brightness: 0.18,
    speed: 0.24,
    innerLineCount: 30,
    outerLineCount: 34,
    warpIntensity: 0.95,
    colorCycleSpeed: 0.85,
  },
  cyber: {
    color1: "#E879F9",
    color2: "#60A5FA",
    color3: "#22D3EE",
    brightness: 0.34,
    speed: 0.4,
    innerLineCount: 34,
    outerLineCount: 38,
    warpIntensity: 1.1,
    colorCycleSpeed: 1.4,
  },
  forest: {
    color1: "#34D399",
    color2: "#A7F3D0",
    color3: "#10B981",
    brightness: 0.28,
    speed: 0.3,
    innerLineCount: 32,
    outerLineCount: 36,
    warpIntensity: 1.0,
    colorCycleSpeed: 1.0,
  },
  amethyst: {
    color1: "#C4B5FD",
    color2: "#E9D5FF",
    color3: "#A78BFA",
    brightness: 0.28,
    speed: 0.3,
    innerLineCount: 32,
    outerLineCount: 36,
    warpIntensity: 1.0,
    colorCycleSpeed: 1.0,
  },
  vintage: {
    color1: "#FFD6A8",
    color2: "#FFE7C7",
    color3: "#F5C089",
    brightness: 0.18,
    speed: 0.24,
    innerLineCount: 30,
    outerLineCount: 34,
    warpIntensity: 0.95,
    colorCycleSpeed: 0.85,
  },
  coffee: {
    color1: "#EAD0B6",
    color2: "#F6E7D8",
    color3: "#D4B08C",
    brightness: 0.18,
    speed: 0.24,
    innerLineCount: 30,
    outerLineCount: 34,
    warpIntensity: 0.95,
    colorCycleSpeed: 0.85,
  },
  life: {
    color1: "#7FE3BF",
    color2: "#DDF9EE",
    color3: "#4ADE80",
    brightness: 0.2,
    speed: 0.28,
    innerLineCount: 32,
    outerLineCount: 36,
    warpIntensity: 1.0,
    colorCycleSpeed: 0.95,
  },
  rose: {
    color1: "#B71833",
    color2: "#FFE6EA",
    color3: "#F43F5E",
    brightness: 0.22,
    speed: 0.3,
    innerLineCount: 32,
    outerLineCount: 36,
    warpIntensity: 1.0,
    colorCycleSpeed: 1.0,
  },
};

/** theme class names to look for on <html> */
export const LINE_WAVES_THEME_CLASS_KEYS = Object.keys(
  LINE_WAVES_PRESETS,
) as Exclude<Theme, "system">[];

/** resolve the preset for a theme (maps system -> light/dark) */
export const getLineWavesPreset = (theme: Theme): LineWavesPreset => {
  const resolved =
    theme === "system"
      ? getThemeType("system")
      : (theme as Exclude<Theme, "system">);
  return LINE_WAVES_PRESETS[resolved as Exclude<Theme, "system">];
};
