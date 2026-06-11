/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Per-theme presets for the Aurora background. Co-located with the background
 * that consumes them — every background follows this same convention
 * (`<background>/presets.ts` + a `get<Background>Preset(theme)` helper).
 */

import { type Theme, getThemeType } from "@/config/themes";

type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

export type AuroraPreset = {
  colorStops: [string, string, string];
  blendMode: BlendMode; // CSS mix-blend-mode used on the canvas
  intensity: number; // overall brightness
  blend: number; // band width
  scale: number; // noise frequency
  feather: number; // edge softness
  alphaGamma: number; // alpha curve (higher = softer)
  saturation: number; // color saturation boost
  minAlpha: number; // baseline alpha floor
  base: number; // vertical base position of the wave (0 bottom .. 1 top)
};

/** aurora presets */
export const AURORA_PRESETS: Record<Exclude<Theme, "system">, AuroraPreset> = {
  light: {
    colorStops: ["#6BA8F0", "#9EC8FF", "#D4EAFF"],
    blendMode: "soft-light",
    intensity: 0.95,
    blend: 0.62,
    scale: 0.82,
    feather: 0.48,
    alphaGamma: 1.02,
    saturation: 1.18,
    minAlpha: 0.34,
    base: 0.28,
  },
  dark: {
    colorStops: ["#A8CCFF", "#C2E0FF", "#DCF2FF"],
    blendMode: "screen",
    intensity: 0.62,
    blend: 0.58,
    scale: 0.9,
    feather: 0.56,
    alphaGamma: 1.18,
    saturation: 1.06,
    minAlpha: 0.06,
    base: 0.26,
  },
  cloud: {
    // ultra-airy blue-white
    colorStops: ["#8EC5FF", "#B8DBFF", "#EAF3FF"],
    blendMode: "soft-light",
    intensity: 0.9,
    blend: 0.68,
    scale: 0.82,
    feather: 0.46,
    alphaGamma: 1.02,
    saturation: 1.12,
    minAlpha: 0.3,
    base: 0.3,
  },
  cyber: {
    // purple/cyan neon
    colorStops: ["#E879F9", "#A78BFA", "#60A5FA"],
    blendMode: "screen",
    intensity: 0.9,
    blend: 0.58,
    scale: 1.05,
    feather: 0.22,
    alphaGamma: 1.12,
    saturation: 1.25,
    minAlpha: 0.0,
    base: 0.22,
  },
  forest: {
    // pleasant emerald
    colorStops: ["#A7F3D0", "#34D399", "#D1FAE5"],
    blendMode: "screen",
    intensity: 0.58,
    blend: 0.52,
    scale: 0.95,
    feather: 0.46,
    alphaGamma: 1.18,
    saturation: 1.04,
    minAlpha: 0.0,
    base: 0.26,
  },
  amethyst: {
    colorStops: ["#E9D5FF", "#C4B5FD", "#F5E1FF"],
    blendMode: "screen",
    intensity: 0.58,
    blend: 0.52,
    scale: 0.92,
    feather: 0.46,
    alphaGamma: 1.16,
    saturation: 1.06,
    minAlpha: 0.0,
    base: 0.26,
  },
  vintage: {
    // warm/soft
    colorStops: ["#F0A860", "#FFD6A8", "#FFF0DC"],
    blendMode: "soft-light",
    intensity: 0.88,
    blend: 0.64,
    scale: 0.85,
    feather: 0.48,
    alphaGamma: 1.04,
    saturation: 1.1,
    minAlpha: 0.3,
    base: 0.3,
  },
  coffee: {
    colorStops: ["#C9A07A", "#EAD0B6", "#FFF4E8"],
    blendMode: "soft-light",
    intensity: 0.9,
    blend: 0.66,
    scale: 0.85,
    feather: 0.48,
    alphaGamma: 1.04,
    saturation: 1.08,
    minAlpha: 0.3,
    base: 0.3,
  },
  life: {
    // solarpunk green
    colorStops: ["#3DD68C", "#7FE3BF", "#D4F9EA"],
    blendMode: "soft-light",
    intensity: 0.86,
    blend: 0.56,
    scale: 0.92,
    feather: 0.46,
    alphaGamma: 1.04,
    saturation: 1.14,
    minAlpha: 0.28,
    base: 0.26,
  },
  rose: {
    // wine red rose
    colorStops: ["#D42B4A", "#FF8FA3", "#FFE8ED"],
    blendMode: "soft-light",
    intensity: 0.88,
    blend: 0.58,
    scale: 0.92,
    feather: 0.44,
    alphaGamma: 1.04,
    saturation: 1.16,
    minAlpha: 0.3,
    base: 0.27,
  },
};

/** theme class names to look for on <html> */
export const AURORA_THEME_CLASS_KEYS = Object.keys(AURORA_PRESETS) as Exclude<
  Theme,
  "system"
>[];

/** resolve the preset for a theme (maps system -> light/dark) */
export const getAuroraPreset = (theme: Theme): AuroraPreset => {
  const resolved =
    theme === "system"
      ? getThemeType("system")
      : (theme as Exclude<Theme, "system">);
  return AURORA_PRESETS[resolved as Exclude<Theme, "system">];
};
