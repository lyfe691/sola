import { type Theme } from "@/config/themes";
import type { SilkWavesProps } from "@/components/silk-waves";
import {
  BACKGROUND_THEME_CLASS_KEYS,
  resolveThemePreset,
} from "@/components/backgrounds/preset-utils";

export type SilkWavesPreset = Required<
  Pick<
    SilkWavesProps,
    | "speed"
    | "scale"
    | "distortion"
    | "curve"
    | "contrast"
    | "colors"
    | "rotation"
    | "offsetX"
    | "offsetY"
    | "brightness"
    | "opacity"
    | "complexity"
    | "frequency"
  >
>;

const lightPalette = [
  "#E8F2FF",
  "#C5DBFF",
  "#9EC5FF",
  "#7EB8FF",
  "#6BA8F0",
  "#5B9FE8",
  "#4A90E8",
  "#3D82D9",
] as const;

const darkPalette = [
  "#0d1326",
  "#162a52",
  "#1e407e",
  "#2657aa",
  "#2e6ed5",
  "#3785ff",
  "#5092ff",
  "#69a0ff",
] as const;

const lightBase: Omit<SilkWavesPreset, "colors"> = {
  speed: 0.85,
  scale: 2,
  distortion: 0.9,
  curve: 1,
  contrast: 0.95,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  brightness: 0.9,
  opacity: 0.82,
  complexity: 1,
  frequency: 1,
};

const darkBase: Omit<SilkWavesPreset, "colors"> = {
  speed: 1,
  scale: 2,
  distortion: 1,
  curve: 1,
  contrast: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  brightness: 1,
  opacity: 0.88,
  complexity: 1,
  frequency: 1,
};

const SILK_WAVES_PRESETS: Record<Exclude<Theme, "system">, SilkWavesPreset> = {
  light: { ...lightBase, colors: [...lightPalette] },
  dark: { ...darkBase, colors: [...darkPalette] },
  cloud: {
    ...lightBase,
    colors: [
      "#F2F7FF",
      "#E6F1FF",
      "#D4EAFF",
      "#B8DBFF",
      "#9EC8FF",
      "#88BFFF",
      "#78B4FF",
      "#69A8FF",
    ],
  },
  cyber: {
    ...darkBase,
    colors: [
      "#1a0a2e",
      "#2d1b69",
      "#5b21b6",
      "#7c3aed",
      "#a855f7",
      "#e879f9",
      "#60a5fa",
      "#22d3ee",
    ],
  },
  forest: {
    ...darkBase,
    colors: [
      "#0c1812",
      "#142820",
      "#065f46",
      "#047857",
      "#059669",
      "#10b981",
      "#34d399",
      "#6ee7b7",
    ],
  },
  amethyst: {
    ...darkBase,
    colors: [
      "#120c1a",
      "#241a33",
      "#4c1d95",
      "#6d28d9",
      "#8b5cf6",
      "#a78bfa",
      "#c4b5fd",
      "#e9d5ff",
    ],
  },
  vintage: {
    ...lightBase,
    colors: [
      "#FFF6E8",
      "#FFE7C7",
      "#FFD9A8",
      "#F0C080",
      "#E8A868",
      "#D89048",
      "#C87838",
      "#B86830",
    ],
  },
  coffee: {
    ...lightBase,
    colors: [
      "#FFFAF4",
      "#F5E6D8",
      "#E8D0B0",
      "#D4B896",
      "#C8A078",
      "#B8885C",
      "#A87848",
      "#986838",
    ],
  },
  life: {
    ...lightBase,
    colors: [
      "#F0FDF7",
      "#DDF9EE",
      "#A7F3D0",
      "#7FE3BF",
      "#5FD4A8",
      "#3CB88A",
      "#2EC98A",
      "#22B87A",
    ],
  },
  rose: {
    ...lightBase,
    colors: [
      "#FFF5F7",
      "#FFE8ED",
      "#FFD0DA",
      "#FFB8C6",
      "#FF9DB0",
      "#E84868",
      "#C41E3A",
      "#B71833",
    ],
  },
};

export { BACKGROUND_THEME_CLASS_KEYS as SILK_WAVES_THEME_CLASS_KEYS };

export const getSilkWavesPreset = (theme: Theme): SilkWavesPreset =>
  resolveThemePreset(SILK_WAVES_PRESETS, theme);