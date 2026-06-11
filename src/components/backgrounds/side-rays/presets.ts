/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Per-theme presets for the Side Rays background. Same convention as
 * `aurora/presets.ts` — co-located, keyed by theme, resolved via
 * `getSideRaysPreset(theme)`.
 */

import { type Theme, getThemeType } from "@/config/themes";
import type { SideRaysOrigin } from "./SideRaysCanvas";

export type SideRaysPreset = {
  rayColor1: string; // primary ray color
  rayColor2: string; // secondary ray color
  intensity: number; // overall brightness
  spread: number; // angular width of the fan
  saturation: number; // color saturation
  blend: number; // mix between the two ray colors
  falloff: number; // distance falloff exponent
  opacity: number; // global alpha
  speed: number; // animation speed
  origin: SideRaysOrigin; // which corner the rays emanate from
  tilt: number; // rotation in degrees
};

/** side-rays presets (palettes echo the aurora presets per theme) */
export const SIDE_RAYS_PRESETS: Record<
  Exclude<Theme, "system">,
  SideRaysPreset
> = {
  light: {
    rayColor1: "#5B9FE8",
    rayColor2: "#9EC8FF",
    intensity: 2.6,
    spread: 2.1,
    saturation: 1.28,
    blend: 0.72,
    falloff: 1.85,
    opacity: 0.78,
    speed: 1.2,
    origin: "top-right",
    tilt: 0,
  },
  dark: {
    rayColor1: "#A8CCFF",
    rayColor2: "#DCF2FF",
    intensity: 2.0,
    spread: 2,
    saturation: 1.2,
    blend: 0.7,
    falloff: 2.0,
    opacity: 0.8,
    speed: 1.2,
    origin: "top-right",
    tilt: 0,
  },
  cloud: {
    rayColor1: "#7EB8FF",
    rayColor2: "#C5E0FF",
    intensity: 2.4,
    spread: 2.2,
    saturation: 1.18,
    blend: 0.75,
    falloff: 1.85,
    opacity: 0.74,
    speed: 1.0,
    origin: "top-right",
    tilt: 0,
  },
  cyber: {
    rayColor1: "#E879F9",
    rayColor2: "#60A5FA",
    intensity: 2.4,
    spread: 1.9,
    saturation: 1.4,
    blend: 0.6,
    falloff: 1.9,
    opacity: 0.9,
    speed: 1.6,
    origin: "top-right",
    tilt: 0,
  },
  forest: {
    rayColor1: "#34D399",
    rayColor2: "#A7F3D0",
    intensity: 1.9,
    spread: 2,
    saturation: 1.2,
    blend: 0.7,
    falloff: 2.0,
    opacity: 0.8,
    speed: 1.2,
    origin: "top-right",
    tilt: 0,
  },
  amethyst: {
    rayColor1: "#C4B5FD",
    rayColor2: "#E9D5FF",
    intensity: 1.9,
    spread: 2,
    saturation: 1.2,
    blend: 0.7,
    falloff: 2.0,
    opacity: 0.8,
    speed: 1.2,
    origin: "top-right",
    tilt: 0,
  },
  vintage: {
    rayColor1: "#E8A050",
    rayColor2: "#FFD9A8",
    intensity: 2.3,
    spread: 2.1,
    saturation: 1.16,
    blend: 0.72,
    falloff: 1.85,
    opacity: 0.72,
    speed: 1.0,
    origin: "top-right",
    tilt: 0,
  },
  coffee: {
    rayColor1: "#B8885C",
    rayColor2: "#E8D0B0",
    intensity: 2.3,
    spread: 2.1,
    saturation: 1.12,
    blend: 0.72,
    falloff: 1.85,
    opacity: 0.72,
    speed: 1.0,
    origin: "top-right",
    tilt: 0,
  },
  life: {
    rayColor1: "#2EC98A",
    rayColor2: "#8FE8C8",
    intensity: 2.5,
    spread: 2,
    saturation: 1.22,
    blend: 0.7,
    falloff: 1.85,
    opacity: 0.76,
    speed: 1.2,
    origin: "top-right",
    tilt: 0,
  },
  rose: {
    rayColor1: "#C41E3A",
    rayColor2: "#FF9DB0",
    intensity: 2.5,
    spread: 2,
    saturation: 1.3,
    blend: 0.66,
    falloff: 1.85,
    opacity: 0.76,
    speed: 1.2,
    origin: "top-right",
    tilt: 0,
  },
};

/** theme class names to look for on <html> */
export const SIDE_RAYS_THEME_CLASS_KEYS = Object.keys(
  SIDE_RAYS_PRESETS,
) as Exclude<Theme, "system">[];

/** resolve the preset for a theme (maps system -> light/dark) */
export const getSideRaysPreset = (theme: Theme): SideRaysPreset => {
  const resolved =
    theme === "system"
      ? getThemeType("system")
      : (theme as Exclude<Theme, "system">);
  return SIDE_RAYS_PRESETS[resolved as Exclude<Theme, "system">];
};
