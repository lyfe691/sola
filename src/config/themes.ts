/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  FireIcon,
  GemIcon,
  HologramIcon,
  LaptopIcon,
  Moon02Icon,
  PineTreeIcon,
  Plant02Icon,
  SakuraIcon,
  SnowIcon,
  Sun03Icon,
  SunsetIcon,
} from "@hugeicons/core-free-icons";
import { hugeIcon } from "@/lib/huge-icon";
import type { ComponentType } from "react";

// the prop surface of a hugeIcon glyph; a concrete type keeps
// <Icon className/aria-hidden> call sites type-checkable
export type ThemeIcon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

// ---------------- Existing theme config ----------------

export interface ThemeConfig {
  value: string;
  label: string;
  icon: ThemeIcon;
  isCustom: boolean;
  type: "light" | "dark"; // for automatic theme mapping
}

export const THEMES = [
  {
    value: "light",
    label: "Light",
    icon: hugeIcon(Sun03Icon),
    isCustom: false,
    type: "light",
  },
  {
    value: "dark",
    label: "Dark",
    icon: hugeIcon(Moon02Icon),
    isCustom: false,
    type: "dark",
  },
  {
    value: "system",
    label: "System",
    icon: hugeIcon(LaptopIcon),
    isCustom: false,
    type: "light",
  }, // system handled via getThemeType
  {
    value: "life",
    label: "Solarpunk",
    icon: hugeIcon(Plant02Icon),
    isCustom: true,
    type: "light",
  },
  {
    value: "sakura",
    label: "Sakura",
    icon: hugeIcon(SakuraIcon),
    isCustom: true,
    type: "light",
  },
  {
    value: "glacier",
    label: "Glacier",
    icon: hugeIcon(SnowIcon),
    isCustom: true,
    type: "light",
  },
  {
    value: "dune",
    label: "Dune",
    icon: hugeIcon(SunsetIcon),
    isCustom: true,
    type: "light",
  },
  {
    value: "cyber",
    label: "Cyberpunk",
    icon: hugeIcon(HologramIcon),
    isCustom: true,
    type: "dark",
  },
  {
    value: "forest",
    label: "Forest",
    icon: hugeIcon(PineTreeIcon),
    isCustom: true,
    type: "dark",
  },
  {
    value: "amethyst",
    label: "Amethyst",
    icon: hugeIcon(GemIcon),
    isCustom: true,
    type: "dark",
  },
  {
    value: "ember",
    label: "Ember",
    icon: hugeIcon(FireIcon),
    isCustom: true,
    type: "dark",
  },
  // literal inference (not ThemeConfig[]) keeps Theme a closed union, so the
  // per-theme preset tables in backgrounds/ stay exhaustively checked — a new
  // theme without presets fails typecheck instead of silently rendering
  // upstream demo defaults
] as const satisfies readonly ThemeConfig[];

export const ALL_THEME_VALUES = THEMES.map((t) => t.value);
export type Theme = (typeof ALL_THEME_VALUES)[number];

/** membership check — narrows instead of casting */
const isTheme = (value: string): value is Theme =>
  (ALL_THEME_VALUES as readonly string[]).includes(value);

/** retired ids a returning visitor may still have stored, and their heirs */
const RETIRED_THEMES = new Map<string, Theme>([
  ["cloud", "glacier"],
  ["rose", "sakura"],
  ["vintage", "dune"],
  ["coffee", "dune"],
]);

/** a stored id as a current theme: retired ids map on, unknown ones drop */
export const toTheme = (value: string): Theme | null =>
  isTheme(value) ? value : (RETIRED_THEMES.get(value) ?? null);

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
