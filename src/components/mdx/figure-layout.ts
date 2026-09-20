/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The geometry behind a justified figure row (figures.tsx), on its own so the
 * rule can be asserted against the articles that lean on it. A device frame
 * (frames.tsx) is part of a figure's footprint, so its measures live here.
 */

import { PROJECT_IMAGE_SIZES } from "@/config/project-image-sizes";

/** Width over height; a screenshot outside the size list counts as 16:10. */
export const ratioOf = (src: string) => {
  const size = PROJECT_IMAGE_SIZES[src];
  return size ? size[0] / size[1] : 1.6;
};

export type FigureFrame = "safari" | "iphone";
/** What sets a figure's footprint: the screenshot, and the device around it. */
export type FigureShape = { src: string; frame?: FigureFrame };

/**
 * The frames in their own units, every length a share of the frame's width:
 * frames.tsx draws from these same numbers, so the drawing and the row agree.
 */
export const SAFARI = { width: 1202, bar: 52 } as const;
export const PHONE = {
  width: 433,
  /** Either side of the body, where the buttons stand proud. */
  side: 2.5,
  ring: 4,
  bezel: 15.25,
  /** The status bar the island sits in; the screenshot starts under it. */
  statusBar: 65,
  screenRadius: 55.75,
} as const;
export const PHONE_SCREEN =
  PHONE.width - 2 * (PHONE.side + PHONE.ring + PHONE.bezel);

/** Width over height of the whole figure, frame included. */
export const figureRatio = ({ src, frame }: FigureShape) => {
  const ratio = ratioOf(src);
  if (frame === "safari") return 1 / (1 / ratio + SAFARI.bar / SAFARI.width);
  if (frame === "iphone")
    return (
      PHONE.width /
      (2 * (PHONE.ring + PHONE.bezel) + PHONE.statusBar + PHONE_SCREEN / ratio)
    );
  return ratio;
};

export const PORTRAIT_BELOW = 0.8;
export const isPortrait = (figure: FigureShape) =>
  figureRatio(figure) < PORTRAIT_BELOW;

/**
 * Each figure's share of its row — its ratio over the row's, since a row shares
 * one height. Shares sum to one; less would leave part of the row unclaimed.
 */
export const rowShares = (figures: readonly FigureShape[]) => {
  const ratios = figures.map(figureRatio);
  const total = ratios.reduce((sum, ratio) => sum + ratio, 0);
  return ratios.map((ratio) => ratio / total);
};

/** Height of the phones on a stage, and the row gap, in rem. */
export const STAGE_HEIGHT = 27;
export const GAP = 1.25;

/** Corner radius of a bare figure, in px; the lightbox's flyer lands on it. */
export const RADIUS_INLINE = 12;

/** The article column at desktop, in px — measured, not configured. */
export const ARTICLE_COLUMN = 896;

/** Under this a phone screenshot stops being readable (a stage gives it ~200). */
export const MIN_FIGURE_WIDTH = 170;
