/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  MoonStar,
  Sun,
  Cloud,
  Sprout,
  Slack,
  Trees,
  Coffee,
  LaptopMinimal,
} from "lucide-react";
import { RoseIcon } from "@/components/ui/icons/RoseIcon";
import { FaGem, FaMoneyBillAlt } from "react-icons/fa";
import type { ElementType } from "react";

// ---------------- Existing theme config ----------------

export interface ThemeConfig {
  value: string;
  label: string;
  icon: ElementType;
  isCustom: boolean;
  type: "light" | "dark"; // for automatic theme mapping
}

export const THEMES: ThemeConfig[] = [
  { value: "light", label: "Light", icon: Sun, isCustom: false, type: "light" },
  {
    value: "dark",
    label: "Dark",
    icon: MoonStar,
    isCustom: false,
    type: "dark",
  },
  {
    value: "system",
    label: "System",
    icon: LaptopMinimal,
    isCustom: false,
    type: "light",
  }, // system handled via getThemeType
  {
    value: "life",
    label: "Solarpunk",
    icon: Sprout,
    isCustom: true,
    type: "light",
  },
  {
    value: "cyber",
    label: "Cyberpunk",
    icon: Slack,
    isCustom: true,
    type: "dark",
  },
  {
    value: "cloud",
    label: "Cloud",
    icon: Cloud,
    isCustom: true,
    type: "light",
  },
  {
    value: "forest",
    label: "Forest",
    icon: Trees,
    isCustom: true,
    type: "dark",
  },
  {
    value: "amethyst",
    label: "Amethyst",
    icon: FaGem,
    isCustom: true,
    type: "dark",
  },
  {
    value: "vintage",
    label: "Vintage",
    icon: FaMoneyBillAlt,
    isCustom: true,
    type: "light",
  },
  {
    value: "coffee",
    label: "Coffee",
    icon: Coffee,
    isCustom: true,
    type: "light",
  },
  {
    value: "rose",
    label: "Rose",
    icon: RoseIcon as unknown as ElementType,
    isCustom: true,
    type: "light",
  },
];

export const ALL_THEME_VALUES = THEMES.map((t) => t.value);
export type Theme = (typeof ALL_THEME_VALUES)[number];

/** resolve light/dark "type" for a given theme (handles "system"). */
export const getThemeType = (currentTheme: Theme): "light" | "dark" => {
  if (currentTheme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  const cfg = THEMES.find((t) => t.value === currentTheme);
  return cfg?.type || "light";
};

// ---------------- Aurora presets ----------------

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
    colorStops: ["#B0CFFF", "#C8E0FF", "#EAF3FF"],
    blendMode: "normal",
    intensity: 0.68,
    blend: 0.58,
    scale: 0.82,
    feather: 0.52,
    alphaGamma: 1.08,
    saturation: 1.04,
    minAlpha: 0.14,
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
    colorStops: ["#F2F7FF", "#E6F1FF", "#FFFFFF"],
    blendMode: "lighten",
    intensity: 0.76,
    blend: 0.7,
    scale: 0.82,
    feather: 0.5,
    alphaGamma: 1.1,
    saturation: 1.02,
    minAlpha: 0.05,
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
    colorStops: ["#FFE7C7", "#FFD6A8", "#FFF6E8"],
    blendMode: "overlay",
    intensity: 0.7,
    blend: 0.62,
    scale: 0.85,
    feather: 0.52,
    alphaGamma: 1.12,
    saturation: 0.98,
    minAlpha: 0.05,
    base: 0.3,
  },
  coffee: {
    colorStops: ["#F6E7D8", "#EAD0B6", "#FFF9F2"],
    blendMode: "overlay",
    intensity: 0.72,
    blend: 0.64,
    scale: 0.85,
    feather: 0.52,
    alphaGamma: 1.12,
    saturation: 0.98,
    minAlpha: 0.05,
    base: 0.3,
  },
  life: {
    // solarpunk green
    colorStops: ["#DDF9EE", "#7FE3BF", "#F1FDF7"],
    blendMode: "screen",
    intensity: 0.62,
    blend: 0.54,
    scale: 0.92,
    feather: 0.5,
    alphaGamma: 1.16,
    saturation: 1.02,
    minAlpha: 0.0,
    base: 0.26,
  },
  rose: {
    // wine red rose
    colorStops: ["#FFE6EA", "#B71833", "#FFF4F6"],
    blendMode: "screen",
    intensity: 0.7,
    blend: 0.56,
    scale: 0.92,
    feather: 0.48,
    alphaGamma: 1.14,
    saturation: 1.08,
    minAlpha: 0.05,
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
