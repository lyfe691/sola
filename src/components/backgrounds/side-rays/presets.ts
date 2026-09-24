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

import { type Theme } from "@/config/themes";
import { resolveThemePreset } from "@/components/backgrounds/preset-utils";
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
  life: {
    rayColor1: "#5FAE5A",
    rayColor2: "#E8C547",
    intensity: 2.4,
    spread: 2,
    saturation: 1.2,
    blend: 0.7,
    falloff: 1.85,
    opacity: 0.76,
    speed: 1.1,
    origin: "top-right",
    tilt: 0,
  },
  sakura: {
    rayColor1: "#E8849F",
    rayColor2: "#FBD3DD",
    intensity: 2.4,
    spread: 2,
    saturation: 1.2,
    blend: 0.7,
    falloff: 1.85,
    opacity: 0.76,
    speed: 1.1,
    origin: "top-right",
    tilt: 0,
  },
  glacier: {
    rayColor1: "#4DB8CC",
    rayColor2: "#C8EEF3",
    intensity: 2.4,
    spread: 2,
    saturation: 1.2,
    blend: 0.7,
    falloff: 1.85,
    opacity: 0.76,
    speed: 1.1,
    origin: "top-right",
    tilt: 0,
  },
  dune: {
    rayColor1: "#D9825B",
    rayColor2: "#F0C08A",
    intensity: 2.4,
    spread: 2,
    saturation: 1.2,
    blend: 0.7,
    falloff: 1.85,
    opacity: 0.76,
    speed: 1.1,
    origin: "top-right",
    tilt: 0,
  },
  cyber: {
    rayColor1: "#19E3F0",
    rayColor2: "#FF2E88",
    intensity: 2.3,
    spread: 2,
    saturation: 1.35,
    blend: 0.6,
    falloff: 1.9,
    opacity: 0.88,
    speed: 1.6,
    origin: "top-right",
    tilt: 0,
  },
  forest: {
    rayColor1: "#7FD19B",
    rayColor2: "#F2C14E",
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
    rayColor1: "#D08CF0",
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
  ember: {
    rayColor1: "#FF7A2F",
    rayColor2: "#FFC56B",
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
};

/** theme class names to look for on <html> */
export const SIDE_RAYS_THEME_CLASS_KEYS = Object.keys(
  SIDE_RAYS_PRESETS,
) as Exclude<Theme, "system">[];

/** resolve the preset for a theme (maps system -> light/dark) */
export const getSideRaysPreset = (theme: Theme): SideRaysPreset =>
  resolveThemePreset(SIDE_RAYS_PRESETS, theme);
