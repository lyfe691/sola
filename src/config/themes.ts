/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
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
