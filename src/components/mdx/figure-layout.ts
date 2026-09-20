/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The geometry behind a justified figure row (figures.tsx), on its own so the
 * rule can be asserted against the articles that lean on it.
 */

import { PROJECT_IMAGE_SIZES } from "@/config/project-image-sizes";

/** Width over height; a screenshot outside the size list counts as 16:10. */
export const ratioOf = (src: string) => {
  const size = PROJECT_IMAGE_SIZES[src];
  return size ? size[0] / size[1] : 1.6;
};

export const PORTRAIT_BELOW = 0.8;
export const isPortrait = (src: string) => ratioOf(src) < PORTRAIT_BELOW;

/**
 * Each figure's share of its row — its ratio over the row's, since a row shares
 * one height. Shares sum to one; less would leave part of the row unclaimed.
 */
export const rowShares = (srcs: readonly string[]) => {
  const ratios = srcs.map(ratioOf);
  const total = ratios.reduce((sum, ratio) => sum + ratio, 0);
  return ratios.map((ratio) => ratio / total);
};

/** Height of the phones on a stage, and the row gap, in rem. */
export const STAGE_HEIGHT = 27;
export const GAP = 1.25;

/** The article column at desktop, in px — measured, not configured. */
export const ARTICLE_COLUMN = 896;

/** Under this a phone screenshot stops being readable (a stage gives it ~200). */
export const MIN_FIGURE_WIDTH = 170;
