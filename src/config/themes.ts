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
} from "lucide-react";
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
  { value: "dark", label: "Dark", icon: MoonStar, isCustom: false, type: "dark" },
  { value: "system", label: "System", icon: Sun, isCustom: false, type: "light" }, // system handled via getThemeType
  { value: "life", label: "Solarpunk", icon: Sprout, isCustom: true, type: "light" },
  { value: "cyber", label: "Cyberpunk", icon: Slack, isCustom: true, type: "dark" },
  { value: "cloud", label: "Cloud", icon: Cloud, isCustom: true, type: "light" },
  { value: "forest", label: "Forest", icon: Trees, isCustom: true, type: "dark" },
  { value: "amethyst", label: "Amethyst", icon: FaGem, isCustom: true, type: "dark" },
  { value: "vintage", label: "Vintage", icon: FaMoneyBillAlt, isCustom: true, type: "light" },
  { value: "coffee", label: "Coffee", icon: Coffee, isCustom: true, type: "light" },
];

export const STANDARD_THEMES = THEMES.filter((t) => !t.isCustom);
export const CUSTOM_THEMES = THEMES.filter((t) => t.isCustom);

export const ALL_THEME_VALUES = THEMES.map((t) => t.value);
export type Theme = (typeof ALL_THEME_VALUES)[number];

/** Resolve light/dark “type” for a given theme (handles `system`). */
export const getThemeType = (currentTheme: Theme): "light" | "dark" => {
  if (currentTheme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  const cfg = THEMES.find((t) => t.value === currentTheme);
  return cfg?.type || "light";
};

// ---------------- Aurora presets (new) ----------------

type BlendMode =
  | "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten"
  | "color-dodge" | "color-burn" | "hard-light" | "soft-light"
  | "difference" | "exclusion" | "hue" | "saturation" | "color" | "luminosity";

export type AuroraPreset = {
  colorStops: [string, string, string];
  blendMode: BlendMode; // CSS mix-blend-mode used on the canvas
  intensity: number;    // overall brightness
  blend: number;        // band width
  scale: number;        // noise frequency
  feather: number;      // edge softness
  alphaGamma: number;   // alpha curve (higher = softer)
  saturation: number;   // color saturation boost
  minAlpha: number;     // baseline alpha floor
};

/** aurora presets */
export const AURORA_PRESETS: Record<Exclude<Theme, "system">, AuroraPreset> = {
  light: { // clean celestial w/ contrast everywhere
    colorStops: ["#B0CFFF", "#C8E0FF", "#EAF3FF"],
    blendMode: "normal",
    intensity: 1.15,
    blend: 0.85,
    scale: 0.82,
    feather: 0.32,
    alphaGamma: 1.05,
    saturation: 1.25,
    minAlpha: 0.12,
  },
  dark: { // deep celestial
    colorStops: ["#7FB8FF", "#9FC9FF", "#BFDFFF"],
    blendMode: "screen",
    intensity: 0.65,
    blend: 0.50,
    scale: 0.90,
    feather: 0.24,
    alphaGamma: 1.20,
    saturation: 1.00,
    minAlpha: 0.00,
  },
  cloud: { // ultra-airy blue-white
    colorStops: ["#F2F7FF", "#E6F1FF", "#FFFFFF"],
    blendMode: "lighten",
    intensity: 0.96,
    blend: 0.80,
    scale: 0.82,
    feather: 0.34,
    alphaGamma: 1.08,
    saturation: 1.05,
    minAlpha: 0.06,
  },
  cyber: { // purple/cyan neon
    colorStops: ["#E879F9", "#A78BFA", "#60A5FA"],
    blendMode: "screen",
    intensity: 0.72,
    blend: 0.55,
    scale: 1.00,
    feather: 0.24,
    alphaGamma: 1.15,
    saturation: 1.20,
    minAlpha: 0.00,
  },
  forest: { // pleasant emerald
    colorStops: ["#A7F3D0", "#34D399", "#D1FAE5"],
    blendMode: "screen",
    intensity: 0.70,
    blend: 0.55,
    scale: 0.95,
    feather: 0.26,
    alphaGamma: 1.20,
    saturation: 1.05,
    minAlpha: 0.00,
  },
  amethyst: {
    colorStops: ["#E9D5FF", "#C4B5FD", "#F5E1FF"],
    blendMode: "screen",
    intensity: 0.72,
    blend: 0.55,
    scale: 0.92,
    feather: 0.26,
    alphaGamma: 1.15,
    saturation: 1.10,
    minAlpha: 0.00,
  },
  vintage: { // warm/soft
    colorStops: ["#FFE7C7", "#FFD6A8", "#FFF6E8"],
    blendMode: "overlay",
    intensity: 0.90,
    blend: 0.70,
    scale: 0.85,
    feather: 0.32,
    alphaGamma: 1.10,
    saturation: 1.00,
    minAlpha: 0.04,
  },
  coffee: {
    colorStops: ["#F6E7D8", "#EAD0B6", "#FFF9F2"],
    blendMode: "overlay",
    intensity: 0.92,
    blend: 0.72,
    scale: 0.85,
    feather: 0.32,
    alphaGamma: 1.10,
    saturation: 1.00,
    minAlpha: 0.04,
  },
  life: { // solarpunk green
    colorStops: ["#DDF9EE", "#7FE3BF", "#F1FDF7"],
    blendMode: "screen",
    intensity: 0.80,
    blend: 0.58,
    scale: 0.92,
    feather: 0.28,
    alphaGamma: 1.16,
    saturation: 1.05,
    minAlpha: 0.00,
  },
};

/** theme class names to look for on <html> */
export const AURORA_THEME_CLASS_KEYS = Object.keys(AURORA_PRESETS) as Exclude<
  Theme,
  "system"
>[];

/** resolve the preset for a theme (maps system -> light/dark) */
export const getAuroraPreset = (theme: Theme): AuroraPreset => {
  const resolved = theme === "system" ? getThemeType("system") : (theme as Exclude<Theme, "system">);
  return AURORA_PRESETS[resolved as Exclude<Theme, "system">];
};
