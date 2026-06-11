/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Per-theme presets for the Chroma Waves background. Same convention as
 * `aurora/presets.ts` — co-located, keyed by theme, resolved via
 * `getChromaWavesPreset(theme)`.
 */

import { type Theme, getThemeType } from "@/config/themes";

export type ChromaWavesPreset = {
  speed: number;
  color: string;
  backgroundColor: string;
  waveFrequency: number;
  waveAmplitude: number;
  distortion: number;
  chromaShift: number;
  noiseLevel: number;
  flatness: number;
  opacity: number;
  quality: "low" | "medium" | "high";
};

type PresetColors = Pick<ChromaWavesPreset, "color" | "backgroundColor">;

const lightBase: Omit<ChromaWavesPreset, keyof PresetColors> = {
  speed: 0.45,
  waveFrequency: 0.22,
  waveAmplitude: 0.34,
  distortion: 1.2,
  chromaShift: 0.18,
  noiseLevel: 0.06,
  flatness: 1.1,
  opacity: 0.82,
  quality: "high",
};

const darkBase: Omit<ChromaWavesPreset, keyof PresetColors> = {
  speed: 0.55,
  waveFrequency: 0.24,
  waveAmplitude: 0.38,
  distortion: 1.5,
  chromaShift: 0.28,
  noiseLevel: 0.1,
  flatness: 1.0,
  opacity: 0.92,
  quality: "high",
};

const buildPreset = (
  base: Omit<ChromaWavesPreset, keyof PresetColors>,
  colors: PresetColors,
): ChromaWavesPreset => ({
  ...base,
  ...colors,
});

/** chroma-waves presets (palettes echo the aurora presets per theme) */
export const CHROMA_WAVES_PRESETS: Record<
  Exclude<Theme, "system">,
  ChromaWavesPreset
> = {
  light: buildPreset(lightBase, {
    color: "#F0F6FF",
    backgroundColor: "#6BA8F0",
  }),
  dark: buildPreset(darkBase, {
    color: "#E8F2FF",
    backgroundColor: "#3D5A8C",
  }),
  cloud: buildPreset(lightBase, {
    color: "#FAFCFF",
    backgroundColor: "#88BFFF",
  }),
  cyber: buildPreset(darkBase, {
    color: "#F0ABFC",
    backgroundColor: "#6D28D9",
  }),
  forest: buildPreset(darkBase, {
    color: "#D1FAE5",
    backgroundColor: "#047857",
  }),
  amethyst: buildPreset(darkBase, {
    color: "#F5E1FF",
    backgroundColor: "#7C3AED",
  }),
  vintage: buildPreset(lightBase, {
    color: "#FFF6E8",
    backgroundColor: "#E8A050",
  }),
  coffee: buildPreset(lightBase, {
    color: "#FFFAF4",
    backgroundColor: "#B8885C",
  }),
  life: buildPreset(lightBase, {
    color: "#F0FDF7",
    backgroundColor: "#2EC98A",
  }),
  rose: buildPreset(lightBase, {
    color: "#FFF5F7",
    backgroundColor: "#C41E3A",
  }),
};

/** theme class names to look for on <html> */
export const CHROMA_WAVES_THEME_CLASS_KEYS = Object.keys(
  CHROMA_WAVES_PRESETS,
) as Exclude<Theme, "system">[];

/** resolve the preset for a theme (maps system -> light/dark) */
export const getChromaWavesPreset = (theme: Theme): ChromaWavesPreset => {
  const resolved =
    theme === "system"
      ? getThemeType("system")
      : (theme as Exclude<Theme, "system">);
  return CHROMA_WAVES_PRESETS[resolved as Exclude<Theme, "system">];
};