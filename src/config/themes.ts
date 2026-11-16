/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  DiamondIcon,
  FireIcon,
  FlowerIcon,
  LaptopIcon,
  MoonIcon,
  PlantIcon,
  SnowflakeIcon,
  SunHorizonIcon,
  SunIcon,
  TreeEvergreenIcon,
  UserFocusIcon,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

// the prop surface of a Phosphor glyph; a concrete type keeps
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
    icon: SunIcon,
    isCustom: false,
    type: "light",
  },
  {
    value: "dark",
    label: "Dark",
    icon: MoonIcon,
    isCustom: false,
    type: "dark",
  },
  {
    value: "system",
    label: "System",
    icon: LaptopIcon,
    isCustom: false,
    type: "light",
  }, // system handled via getThemeType
  {
    value: "life",
    label: "Solarpunk",
    icon: PlantIcon,
    isCustom: true,
    type: "light",
  },
  {
    value: "sakura",
    label: "Sakura",
    icon: FlowerIcon,
    isCustom: true,
    type: "light",
  },
  {
    value: "glacier",
    label: "Glacier",
    icon: SnowflakeIcon,
    isCustom: true,
    type: "light",
  },
  {
    value: "dune",
    label: "Dune",
    icon: SunHorizonIcon,
    isCustom: true,
    type: "light",
  },
  {
    value: "cyber",
    label: "Cyberpunk",
    icon: UserFocusIcon,
    isCustom: true,
    type: "dark",
  },
  {
    value: "forest",
    label: "Forest",
    icon: TreeEvergreenIcon,
    isCustom: true,
    type: "dark",
  },
  {
    value: "amethyst",
    label: "Amethyst",
    icon: DiamondIcon,
    isCustom: true,
    type: "dark",
  },
  {
    value: "ember",
    label: "Ember",
    icon: FireIcon,
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
