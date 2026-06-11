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
import type { AuroraLayer, SkyLayer } from "@/components/aurora-blur";

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
  cloud: buildPreset(lightBase, {
    layers: [
      { color: "#6BA8F0", speed: 0.32, intensity: 0.78 },
      { color: "#9EC8FF", speed: 0.14, intensity: 0.58 },
      { color: "#78B4FF", speed: 0.18, intensity: 0.44 },
      { color: "#D4EAFF", speed: 0.07, intensity: 0.48 },
    ],
    skyLayers: [
      { color: "#B8D9FF", blend: 0.58 },
      { color: "#88BFFF", blend: 0.68 },
    ],
  }),
  cyber: buildPreset(darkBase, {
    layers: [
      { color: "#E879F9", speed: 0.38, intensity: 0.52 },
      { color: "#A78BFA", speed: 0.18, intensity: 0.36 },
      { color: "#60A5FA", speed: 0.22, intensity: 0.18 },
      { color: "#22D3EE", speed: 0.1, intensity: 0.2 },
    ],
    skyLayers: [
      { color: "#1E1033", blend: 0.44 },
      { color: "#0B1220", blend: 0.56 },
    ],
  }),
  forest: buildPreset(darkBase, {
    layers: [
      { color: "#A7F3D0", speed: 0.33, intensity: 0.44 },
      { color: "#34D399", speed: 0.15, intensity: 0.32 },
      { color: "#6EE7B7", speed: 0.19, intensity: 0.14 },
      { color: "#D1FAE5", speed: 0.08, intensity: 0.15 },
    ],
    skyLayers: [
      { color: "#142820", blend: 0.47 },
      { color: "#0C1812", blend: 0.53 },
    ],
  }),
  amethyst: buildPreset(darkBase, {
    layers: [
      { color: "#E9D5FF", speed: 0.33, intensity: 0.44 },
      { color: "#C4B5FD", speed: 0.15, intensity: 0.32 },
      { color: "#A78BFA", speed: 0.19, intensity: 0.14 },
      { color: "#F5E1FF", speed: 0.08, intensity: 0.15 },
    ],
    skyLayers: [
      { color: "#241A33", blend: 0.47 },
      { color: "#120C1A", blend: 0.53 },
    ],
  }),
  vintage: buildPreset(lightBase, {
    layers: [
      { color: "#E8A050", speed: 0.31, intensity: 0.76 },
      { color: "#FFD9A8", speed: 0.14, intensity: 0.56 },
      { color: "#F0B060", speed: 0.17, intensity: 0.42 },
      { color: "#FFE8C8", speed: 0.08, intensity: 0.46 },
    ],
    skyLayers: [
      { color: "#FFD9A8", blend: 0.58 },
      { color: "#E8A868", blend: 0.68 },
    ],
  }),
  coffee: buildPreset(lightBase, {
    layers: [
      { color: "#B8885C", speed: 0.31, intensity: 0.76 },
      { color: "#E8D0B0", speed: 0.14, intensity: 0.56 },
      { color: "#C8A078", speed: 0.17, intensity: 0.42 },
      { color: "#F5E6D8", speed: 0.08, intensity: 0.46 },
    ],
    skyLayers: [
      { color: "#E8D0B0", blend: 0.58 },
      { color: "#C8A078", blend: 0.68 },
    ],
  }),
  life: buildPreset(lightBase, {
    layers: [
      { color: "#2EC98A", speed: 0.33, intensity: 0.78 },
      { color: "#7FE8C0", speed: 0.15, intensity: 0.58 },
      { color: "#48D8A0", speed: 0.19, intensity: 0.44 },
      { color: "#C8F5E4", speed: 0.08, intensity: 0.48 },
    ],
    skyLayers: [
      { color: "#8FE8C8", blend: 0.58 },
      { color: "#48C898", blend: 0.68 },
    ],
  }),
  rose: buildPreset(lightBase, {
    layers: [
      { color: "#C41E3A", speed: 0.33, intensity: 0.78 },
      { color: "#FF8FA8", speed: 0.15, intensity: 0.58 },
      { color: "#E84868", speed: 0.19, intensity: 0.44 },
      { color: "#FFD0DA", speed: 0.08, intensity: 0.48 },
    ],
    skyLayers: [
      { color: "#FF9DB0", blend: 0.58 },
      { color: "#E84868", blend: 0.68 },
    ],
  }),
};

/** theme class names to look for on <html> */
export const AURORA_BLUR_THEME_CLASS_KEYS = Object.keys(
  AURORA_BLUR_PRESETS,
) as Exclude<Theme, "system">[];

/** resolve the preset for a theme (maps system -> light/dark) */
export const getAuroraBlurPreset = (theme: Theme): AuroraBlurPreset => {
  const resolved =
    theme === "system"
      ? getThemeType("system")
      : (theme as Exclude<Theme, "system">);
  return AURORA_BLUR_PRESETS[resolved as Exclude<Theme, "system">];
};

/** whether the active theme is a light-type palette */
export const isAuroraBlurLightTheme = (theme: Theme): boolean =>
  getThemeType(theme) === "light";