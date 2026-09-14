/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The outline of a cover with a notch cut from its top-left corner: the
 * rounded rectangle of the cover, its corner replaced by a smaller cutout
 * with a rounded inner corner, joined to both edges by concave fillets so
 * the cut reads as carved into the painting rather than pasted over it.
 * Pure geometry in px, for `clip-path: path()`.
 */

export interface CoverBox {
  width: number;
  height: number;
  /** the cover's own corner radius */
  radius: number;
}

export interface NotchBox {
  width: number;
  height: number;
  /** the cutout's inner corner */
  radius: number;
  /** the concave curves where the cutout meets the cover's edges */
  fillet: number;
}

const px = (v: number) => Math.round(v * 100) / 100;

/** Clockwise from the top edge, just right of the notch. */
export function notchedOutline(
  { width: W, height: H, radius: R }: CoverBox,
  { width: nw, height: nh, radius: r, fillet: f }: NotchBox,
): string {
  return [
    `M ${px(nw + f)} 0`,
    `L ${px(W - R)} 0`,
    `A ${R} ${R} 0 0 1 ${px(W)} ${R}`,
    `L ${px(W)} ${px(H - R)}`,
    `A ${R} ${R} 0 0 1 ${px(W - R)} ${px(H)}`,
    `L ${R} ${px(H)}`,
    `A ${R} ${R} 0 0 1 0 ${px(H - R)}`,
    `L 0 ${px(nh + f)}`,
    `A ${f} ${f} 0 0 1 ${f} ${px(nh)}`,
    `L ${px(nw - r)} ${px(nh)}`,
    `A ${r} ${r} 0 0 0 ${px(nw)} ${px(nh - r)}`,
    `L ${px(nw)} ${f}`,
    `A ${f} ${f} 0 0 1 ${px(nw + f)} 0`,
    "Z",
  ].join(" ");
}
