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
 * Each figure's share of its row. The figures of a row share one height, so a
 * width is that figure's ratio over the row's — grow factors that sum to one,
 * since anything less would leave part of the row unclaimed.
 */
export const rowShares = (srcs: readonly string[]) => {
  const ratios = srcs.map(ratioOf);
  const total = ratios.reduce((sum, ratio) => sum + ratio, 0);
  return ratios.map((ratio) => ratio / total);
};

/** Height of the phones on a stage, and the row gap, in rem. */
export const STAGE_HEIGHT = 27;
export const GAP = 1.25;

/**
 * The article column at desktop, in px — the width a row is justified into.
 * Measured, not configured: `max-w-3xl` prose beside the deep-dive rail.
 */
export const ARTICLE_COLUMN = 896;

/**
 * The narrowest a figure may end up. A lone phone on a stage is sized to
 * STAGE_HEIGHT, which at a phone's ratio comes out near 200px, and that is the
 * width at which a phone screenshot still reads and its caption still sits on
 * one line. A phone justified into a row of desktop shots is narrower than a
 * phone alone — at three columns it collapses to a thumbnail — so a row that
 * would push one under this belongs in two rows instead.
 */
export const MIN_FIGURE_WIDTH = 170;
