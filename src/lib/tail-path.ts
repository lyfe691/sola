/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The site's popup tail (the theme callout's, and the tooltip's): feet that
 * leave the surface's edge flat and a round tip, pointing up. `inset` pulls
 * the outline in so a 1px stroke rides a whole pixel row.
 */

const at = (width: number, share: number) => (width * share) / 24;

/** The outline from foot to foot, over the tip. */
export function tailEdge(width: number, height: number, inset = 0) {
  const foot = height - inset;
  return `M0 ${foot} C${at(width, 7)} ${foot} ${at(width, 9.5)} ${inset} ${width / 2} ${inset} C${at(width, 14.5)} ${inset} ${at(width, 17)} ${foot} ${width} ${foot}`;
}

/** The filled tail: it runs 1px past the edge, into the surface it leaves. */
export function tailFill(width: number, height: number, inset = 0) {
  return `${tailEdge(width, height, inset)} L${width} ${height + 1} L0 ${height + 1} Z`;
}

/**
 * The same tail on a round end (a circle of `radius` whose top is the tail's
 * base line): the flanks leave the curve along it instead of a flat edge.
 * The fill closes across the circle, inside the surface it grows from.
 */
export function tailDrop(width: number, height: number, radius: number) {
  const mid = width / 2;
  const spread = Math.min(mid, radius * 0.6);
  const rise = Math.sqrt(radius * radius - spread * spread);
  const foot = height + radius - rise;
  // the circle's direction at each foot, heading for the tip
  const [dx, dy] = [rise / radius, spread / radius];
  const [pull, ease] = [(spread * 7) / 12, (spread * 2.5) / 12];
  const lift = foot - dy * pull;
  return `M${mid - spread} ${foot} C${mid - spread + dx * pull} ${lift} ${mid - ease} 0 ${mid} 0 C${mid + ease} 0 ${mid + spread - dx * pull} ${lift} ${mid + spread} ${foot} Z`;
}
