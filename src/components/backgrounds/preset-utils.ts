/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { THEMES, type Theme, getThemeType } from "@/config/themes";

export const BACKGROUND_THEME_CLASS_KEYS = THEMES.map((t) => t.value).filter(
  (v) => v !== "system",
) as Exclude<Theme, "system">[];

export const resolveThemePreset = <T>(
  presets: Record<Exclude<Theme, "system">, T>,
  theme: Theme,
): T => {
  const resolved =
    theme === "system"
      ? getThemeType("system")
      : (theme as Exclude<Theme, "system">);
  return presets[resolved];
};
