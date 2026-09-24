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

import { type Theme } from "@/config/themes";
import { resolveThemePreset } from "@/components/backgrounds/preset-utils";

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
  life: {
    // leaf green into solar gold
    colorStops: ["#3E9B4F", "#E8C547", "#F3E7A6"],
    blendMode: "soft-light",
    intensity: 0.88,
    blend: 0.6,
    scale: 0.9,
    feather: 0.46,
    alphaGamma: 1.04,
    saturation: 1.14,
    minAlpha: 0.3,
    base: 0.27,
  },
  sakura: {
    // blossom pinks on washi
    colorStops: ["#D6608A", "#F4A7B9", "#FFF4F6"],
    blendMode: "soft-light",
    intensity: 0.88,
    blend: 0.6,
    scale: 0.9,
    feather: 0.46,
    alphaGamma: 1.04,
    saturation: 1.14,
    minAlpha: 0.3,
    base: 0.27,
  },
  glacier: {
    // meltwater teal into frost
    colorStops: ["#2A8FB0", "#5CC8D8", "#EAF8FA"],
    blendMode: "soft-light",
    intensity: 0.88,
    blend: 0.6,
    scale: 0.9,
    feather: 0.46,
    alphaGamma: 1.04,
    saturation: 1.14,
    minAlpha: 0.3,
    base: 0.27,
  },
  dune: {
    // terracotta into warm sand
    colorStops: ["#C8643C", "#F0C08A", "#FAEBD7"],
    blendMode: "soft-light",
    intensity: 0.88,
    blend: 0.6,
    scale: 0.9,
    feather: 0.46,
    alphaGamma: 1.04,
    saturation: 1.14,
    minAlpha: 0.3,
    base: 0.27,
  },
  cyber: {
    // neon signage: cyan into magenta; the acid yellow stays on the UI
    colorStops: ["#19E3F0", "#3D5AFE", "#FF2E88"],
    blendMode: "screen",
    intensity: 0.84,
    blend: 0.56,
    scale: 1.05,
    feather: 0.24,
    alphaGamma: 1.14,
    saturation: 1.22,
    minAlpha: 0.0,
    base: 0.22,
  },
  forest: {
    // moss light with a firefly glint
    colorStops: ["#2F8F5B", "#7FD19B", "#F2C14E"],
    blendMode: "screen",
    intensity: 0.62,
    blend: 0.54,
    scale: 0.94,
    feather: 0.44,
    alphaGamma: 1.14,
    saturation: 1.08,
    minAlpha: 0.0,
    base: 0.25,
  },
  amethyst: {
    // violet into orchid
    colorStops: ["#8B5CF6", "#D08CF0", "#E9D5FF"],
    blendMode: "screen",
    intensity: 0.62,
    blend: 0.54,
    scale: 0.94,
    feather: 0.44,
    alphaGamma: 1.14,
    saturation: 1.08,
    minAlpha: 0.0,
    base: 0.25,
  },
  ember: {
    // coals into flame
    colorStops: ["#C2331F", "#FF7A2F", "#FFC56B"],
    blendMode: "screen",
    intensity: 0.62,
    blend: 0.54,
    scale: 0.94,
    feather: 0.44,
    alphaGamma: 1.14,
    saturation: 1.08,
    minAlpha: 0.0,
    base: 0.25,
  },
};

/** theme class names to look for on <html> */
export const AURORA_THEME_CLASS_KEYS = Object.keys(AURORA_PRESETS) as Exclude<
  Theme,
  "system"
>[];

/** resolve the preset for a theme (maps system -> light/dark) */
export const getAuroraPreset = (theme: Theme): AuroraPreset =>
  resolveThemePreset(AURORA_PRESETS, theme);
