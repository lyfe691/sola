/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  BACKGROUNDS,
  isBackgroundId,
} from "@/components/backgrounds/registry";
import { ALL_THEME_VALUES, THEMES, type Theme } from "@/config/themes";

/** Shown until the user dismisses the theme-menu callout. */
export const CALLOUT_STORAGE_KEY = "sola-theme-callout-v1";

/** First-visit appearance defaults — applied while the callout is undismissed. */
export const WELCOME_PRESET = {
  theme: "light" as Theme,
  background: "liquid-ether",
} as const;

if (!ALL_THEME_VALUES.includes(WELCOME_PRESET.theme)) {
  throw new Error(`Invalid welcome preset theme: ${WELCOME_PRESET.theme}`);
}

if (!isBackgroundId(WELCOME_PRESET.background)) {
  throw new Error(
    `Invalid welcome preset background: ${WELCOME_PRESET.background}`,
  );
}

export const shouldApplyWelcomePreset = (): boolean => {
  try {
    return !localStorage.getItem(CALLOUT_STORAGE_KEY);
  } catch {
    return false;
  }
};

export const getWelcomePresetLabels = () => {
  const themeLabel =
    THEMES.find((t) => t.value === WELCOME_PRESET.theme)?.label ??
    WELCOME_PRESET.theme;
  const backgroundLabel =
    BACKGROUNDS.find((b) => b.id === WELCOME_PRESET.background)?.label ??
    WELCOME_PRESET.background;

  return { themeLabel, backgroundLabel };
};