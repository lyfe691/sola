/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  isBackgroundId,
  NONE_BACKGROUND,
} from "@/components/backgrounds/registry";
import { ALL_THEME_VALUES, type Theme } from "@/config/themes";

/** Set once the visitor dismisses the welcome callout. */
export const CALLOUT_STORAGE_KEY = "sola-theme-callout-v1";

/**
 * How the site looks on a first visit, until the visitor chooses for
 * themselves: their system's light or dark, and a plain page. The
 * backgrounds are something to find in the menu (the welcome callout points
 * at it), not something every visitor is handed.
 */
export const WELCOME_PRESET: { theme: Theme; background: string } = {
  theme: "system",
  background: NONE_BACKGROUND,
};

if (!ALL_THEME_VALUES.includes(WELCOME_PRESET.theme)) {
  throw new Error(`Invalid welcome preset theme: ${WELCOME_PRESET.theme}`);
}

if (
  WELCOME_PRESET.background !== NONE_BACKGROUND &&
  !isBackgroundId(WELCOME_PRESET.background)
) {
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
