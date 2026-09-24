/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Per-theme presets for the Aurora Blur background. Same convention as
 * `aurora/presets.ts` — co-located, keyed by theme, resolved via
 * `getAuroraBlurPreset(theme)`.
 *
 * Light-type themes use low verticalFade and airy sky fills so the shader's
 * bottom-weighted gradient doesn't leave a black band at the top.
 */

import { type Theme, getThemeType } from "@/config/themes";
import { resolveThemePreset } from "@/components/backgrounds/preset-utils";
import type { AuroraLayer, SkyLayer } from "./AuroraBlur";

export type AuroraBlurPreset = {
  speed: number;
  layers: AuroraLayer[];
  noiseScale: number;
  movementX: number;
  movementY: number;
  verticalFade: number;
  bloomIntensity: number;
  skyLayers: SkyLayer[];
  brightness: number;
  saturation: number;
  opacity: number;
};

type PresetColors = {
  layers: AuroraLayer[];
  skyLayers: SkyLayer[];
};

const lightBase = {
  verticalFade: 0.18,
  bloomIntensity: 3.4,
  brightness: 1.55,
  saturation: 1.22,
  opacity: 0.96,
  noiseScale: 3.2,
  movementX: -1.4,
  movementY: -1.8,
  speed: 1.1,
} as const;

const darkBase = {
  verticalFade: 0.76,
  bloomIntensity: 2.1,
  brightness: 0.84,
  saturation: 1.08,
  opacity: 0.92,
  noiseScale: 3.6,
  movementX: -2,
  movementY: -2.8,
  speed: 1.4,
} as const;

const buildPreset = (
  base: typeof lightBase | typeof darkBase,
  colors: PresetColors,
): AuroraBlurPreset => ({
  ...base,
  ...colors,
});

/** aurora-blur presets (palettes echo the aurora presets per theme) */
export const AURORA_BLUR_PRESETS: Record<
  Exclude<Theme, "system">,
  AuroraBlurPreset
> = {
  light: buildPreset(lightBase, {
    layers: [
      { color: "#4A90E8", speed: 0.34, intensity: 0.82 },
      { color: "#7EB8FF", speed: 0.15, intensity: 0.62 },
      { color: "#5AA0F0", speed: 0.19, intensity: 0.48 },
      { color: "#B8D9FF", speed: 0.08, intensity: 0.52 },
    ],
    skyLayers: [
      { color: "#C8E0FF", blend: 0.58 },
      { color: "#8EB8FF", blend: 0.68 },
    ],
  }),
  dark: buildPreset(darkBase, {
    layers: [
      { color: "#A8CCFF", speed: 0.34, intensity: 0.48 },
      { color: "#C2E0FF", speed: 0.16, intensity: 0.34 },
      { color: "#7EB4FF", speed: 0.2, intensity: 0.14 },
      { color: "#DCF2FF", speed: 0.09, intensity: 0.16 },
    ],
    skyLayers: [
      { color: "#1A2230", blend: 0.46 },
      { color: "#0F141C", blend: 0.54 },
    ],
  }),
  life: buildPreset(lightBase, {
    layers: [
      { color: "#3E9B4F", speed: 0.33, intensity: 0.78 },
      { color: "#E8C547", speed: 0.15, intensity: 0.58 },
      { color: "#7CC46A", speed: 0.19, intensity: 0.44 },
      { color: "#F3E7A6", speed: 0.08, intensity: 0.48 },
    ],
    skyLayers: [
      { color: "#E9E3A8", blend: 0.58 },
      { color: "#8CC47A", blend: 0.68 },
    ],
  }),
  sakura: buildPreset(lightBase, {
    layers: [
      { color: "#D6608A", speed: 0.33, intensity: 0.78 },
      { color: "#F4A7B9", speed: 0.15, intensity: 0.58 },
      { color: "#E8849F", speed: 0.19, intensity: 0.44 },
      { color: "#FBD3DD", speed: 0.08, intensity: 0.48 },
    ],
    skyLayers: [
      { color: "#FBD3DD", blend: 0.58 },
      { color: "#F0A0B8", blend: 0.68 },
    ],
  }),
  glacier: buildPreset(lightBase, {
    layers: [
      { color: "#2A8FB0", speed: 0.33, intensity: 0.78 },
      { color: "#A8E6EE", speed: 0.15, intensity: 0.58 },
      { color: "#5CC8D8", speed: 0.19, intensity: 0.44 },
      { color: "#EAF8FA", speed: 0.08, intensity: 0.48 },
    ],
    skyLayers: [
      { color: "#C8EEF3", blend: 0.58 },
      { color: "#6CCBDB", blend: 0.68 },
    ],
  }),
  dune: buildPreset(lightBase, {
    layers: [
      { color: "#C8643C", speed: 0.33, intensity: 0.78 },
      { color: "#F0C08A", speed: 0.15, intensity: 0.58 },
      { color: "#E89B6A", speed: 0.19, intensity: 0.44 },
      { color: "#FAEBD7", speed: 0.08, intensity: 0.48 },
    ],
    skyLayers: [
      { color: "#F5D6B0", blend: 0.58 },
      { color: "#E0A070", blend: 0.68 },
    ],
  }),
  cyber: buildPreset(darkBase, {
    layers: [
      { color: "#19E3F0", speed: 0.34, intensity: 0.46 },
      { color: "#FF2E88", speed: 0.16, intensity: 0.32 },
      { color: "#3D5AFE", speed: 0.2, intensity: 0.16 },
      { color: "#B8F5FA", speed: 0.09, intensity: 0.16 },
    ],
    skyLayers: [
      { color: "#141A3A", blend: 0.46 },
      { color: "#0B1026", blend: 0.54 },
    ],
  }),
  forest: buildPreset(darkBase, {
    layers: [
      { color: "#7FD19B", speed: 0.34, intensity: 0.46 },
      { color: "#2F8F5B", speed: 0.16, intensity: 0.32 },
      { color: "#F2C14E", speed: 0.2, intensity: 0.16 },
      { color: "#C8EBD2", speed: 0.09, intensity: 0.16 },
    ],
    skyLayers: [
      { color: "#12261C", blend: 0.46 },
      { color: "#08140F", blend: 0.54 },
    ],
  }),
  amethyst: buildPreset(darkBase, {
    layers: [
      { color: "#D08CF0", speed: 0.34, intensity: 0.46 },
      { color: "#8B5CF6", speed: 0.16, intensity: 0.32 },
      { color: "#6D3FD6", speed: 0.2, intensity: 0.16 },
      { color: "#E9D5FF", speed: 0.09, intensity: 0.16 },
    ],
    skyLayers: [
      { color: "#221433", blend: 0.46 },
      { color: "#110A1C", blend: 0.54 },
    ],
  }),
  ember: buildPreset(darkBase, {
    layers: [
      { color: "#FF7A2F", speed: 0.34, intensity: 0.46 },
      { color: "#FFC56B", speed: 0.16, intensity: 0.32 },
      { color: "#C2331F", speed: 0.2, intensity: 0.16 },
      { color: "#FFE0B0", speed: 0.09, intensity: 0.16 },
    ],
    skyLayers: [
      { color: "#2A160C", blend: 0.46 },
      { color: "#140A06", blend: 0.54 },
    ],
  }),
};

/** theme class names to look for on <html> */
export const AURORA_BLUR_THEME_CLASS_KEYS = Object.keys(
  AURORA_BLUR_PRESETS,
) as Exclude<Theme, "system">[];

/** resolve the preset for a theme (maps system -> light/dark) */
export const getAuroraBlurPreset = (theme: Theme): AuroraBlurPreset =>
  resolveThemePreset(AURORA_BLUR_PRESETS, theme);

/** whether the active theme is a light-type palette */
export const isAuroraBlurLightTheme = (theme: Theme): boolean =>
  getThemeType(theme) === "light";
