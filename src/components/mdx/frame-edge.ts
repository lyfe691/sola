/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The colours along a screenshot's top edge, read in a few columns from left
 * to right. A device frame (frames.tsx) paints its chrome in them as a
 * gradient, so the window and the shot read as one screen, a sidebar or a
 * photo at the top included.
 *
 * One reading for both ends: scripts/image-sizes.mjs runs it on every still,
 * and a frame runs it on its clip's frames while the clip plays, so a clip
 * starts from the colours its poster was given. The build script imports
 * this file, so it stays plain: no runtime `@/` imports.
 */

/** Columns, left to right; index.css registers a --frame-edge-N for each. */
export const EDGE_STOPS = 5;

/**
 * Rows read from the top. Per column the median of them is the colour: a
 * capture often carries a stray border row, and one of those on its own is
 * the wrong answer by a mile.
 */
export const EDGE_BAND = 9;

const hex = (value: number) => Math.round(value).toString(16).padStart(2, "0");

/** `rows` rows of `width` pixels, `channels` bytes each, as `#rrggbb` per column. */
export function edgeOf(
  pixels: ArrayLike<number>,
  width: number,
  rows: number,
  channels: number,
) {
  return Array.from({ length: EDGE_STOPS }, (_, column) => {
    const from = Math.floor((column * width) / EDGE_STOPS);
    const to = Math.floor(((column + 1) * width) / EDGE_STOPS);
    const means = Array.from({ length: rows }, (_, y) => {
      const sum = [0, 0, 0];
      for (let x = from; x < to; x += 1) {
        const at = (y * width + x) * channels;
        sum[0] += pixels[at];
        sum[1] += pixels[at + 1];
        sum[2] += pixels[at + 2];
      }
      return sum.map((channel) => channel / (to - from));
    });
    const median = (channel: number) => {
      const sorted = means.map((row) => row[channel]).sort((a, b) => a - b);
      return sorted[Math.floor(sorted.length / 2)];
    };
    return `#${hex(median(0))}${hex(median(1))}${hex(median(2))}`;
  });
}

const luminance = (colour: string) => {
  const channel = (at: number) => {
    const c = parseInt(colour.slice(at, at + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
};

/**
 * Black or white, whichever reads on the edge. Chrome drawn on a shot's
 * colours cannot use the theme's ink: a pale screenshot keeps its pale
 * toolbar in the dark themes, where --foreground would be white on white.
 */
export const inkOn = (edge: readonly string[]) =>
  edge.reduce((sum, colour) => sum + luminance(colour), 0) / edge.length > 0.35
    ? "#000"
    : "#fff";
