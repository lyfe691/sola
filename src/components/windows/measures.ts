/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * What the Browser Window's chrome adds around its page, for the code that
 * has to know the window's footprint before it has loaded. The numbers are
 * the ones browser-window.tsx draws (its bar is h-11, its panel sits mx-1
 * mb-1): change them there and here together.
 */

const CHROME = { bar: 44, inset: 4 } as const;

/**
 * Width over height of the whole window around a page of `page` ratio, when
 * the window is `width` px wide. Drawn to scale (WindowScale) from that
 * width, it keeps this ratio at any size.
 */
export const browserWindowRatio = (page: number, width: number) =>
  width / (CHROME.bar + CHROME.inset + (width - 2 * CHROME.inset) / page);

/** The page's corners inside the window, scaled with it where it is scaled. */
export const BROWSER_SCREEN_RADIUS =
  "calc(var(--window-radius, var(--radius)) * 1.4)";
