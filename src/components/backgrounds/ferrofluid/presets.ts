/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Per-theme presets for the Ferrofluid background. Same convention as
 * `side-rays/presets.ts` — co-located, keyed by theme, resolved via
 * `getFerrofluidPreset(theme)`.
 */

import { type Theme, getThemeType } from "@/config/themes";

export type FerrofluidPreset = {
  colors: string[]; // palette ramp fed to the metaball shader
  glow: number; // rim brightness
  shimmer: number; // surface sparkle amount
  turbulence: number; // distortion strength
  opacity: number; // global alpha
  speed: number; // animation speed
};

/** ferrofluid presets (palettes echo the aurora/side-rays presets per theme) */
export const FERROFLUID_PRESETS: Record<
  Exclude<Theme, "system">,
  FerrofluidPreset
> = {
  light: {
    colors: ["#B0CFFF", "#C8E0FF", "#EAF3FF"],
    glow: 1.6,
    shimmer: 1.3,
    turbulence: 0.9,
    opacity: 0.5,
    speed: 0.45,
  },
  dark: {
    colors: ["#A8CCFF", "#C2E0FF", "#DCF2FF"],
    glow: 2.2,
    shimmer: 1.6,
    turbulence: 1.0,
    opacity: 0.85,
    speed: 0.5,
  },
  cloud: {
    colors: ["#EAF3FF", "#F2F7FF", "#FFFFFF"],
    glow: 1.7,
    shimmer: 1.2,
    turbulence: 0.85,
    opacity: 0.55,
    speed: 0.4,
  },
  cyber: {
    colors: ["#E879F9", "#A78BFA", "#60A5FA"],
    glow: 2.6,
    shimmer: 1.8,
    turbulence: 1.2,
    opacity: 0.9,
    speed: 0.6,
  },
  forest: {
    colors: ["#34D399", "#A7F3D0", "#D1FAE5"],
    glow: 2.1,
    shimmer: 1.5,
    turbulence: 1.0,
    opacity: 0.8,
    speed: 0.5,
  },
  amethyst: {
    colors: ["#C4B5FD", "#E9D5FF", "#F5E1FF"],
    glow: 2.1,
    shimmer: 1.5,
    turbulence: 1.0,
    opacity: 0.8,
    speed: 0.5,
  },
  vintage: {
    colors: ["#FFD6A8", "#FFE7C7", "#FFF6E8"],
    glow: 1.7,
    shimmer: 1.2,
    turbulence: 0.85,
    opacity: 0.55,
    speed: 0.4,
  },
  coffee: {
    colors: ["#EAD0B6", "#F6E7D8", "#FFF9F2"],
    glow: 1.7,
    shimmer: 1.2,
    turbulence: 0.85,
    opacity: 0.55,
    speed: 0.4,
  },
  life: {
    colors: ["#7FE3BF", "#DDF9EE", "#F1FDF7"],
    glow: 1.8,
    shimmer: 1.4,
    turbulence: 0.95,
    opacity: 0.6,
    speed: 0.5,
  },
  rose: {
    colors: ["#B71833", "#FFE6EA", "#FFF4F6"],
    glow: 1.9,
    shimmer: 1.4,
    turbulence: 0.95,
    opacity: 0.6,
    speed: 0.5,
  },
};

/** theme class names to look for on <html> */
export const FERROFLUID_THEME_CLASS_KEYS = Object.keys(
  FERROFLUID_PRESETS,
) as Exclude<Theme, "system">[];

/** resolve the preset for a theme (maps system -> light/dark) */
export const getFerrofluidPreset = (theme: Theme): FerrofluidPreset => {
  const resolved =
    theme === "system"
      ? getThemeType("system")
      : (theme as Exclude<Theme, "system">);
  return FERROFLUID_PRESETS[resolved as Exclude<Theme, "system">];
};
