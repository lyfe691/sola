/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The static cover painting, after the grainy-gradient cards React Bits
 * shows in its Gradient Carousel: a dark, saturated field with one soft
 * curved band of light laid across it, a darker fold beside the band, a
 * faint echo above, a leak of light where the band leaves the frame, and
 * a vignette. One small SVG per cover — a few blurred strokes, nothing the
 * browser has to think about — inlined as a data URI. The seed tilts and
 * bends the band so two covers on one preset differ.
 *
 * The band rides the upper half: the caption lives in the lower left, and
 * white type wants a dark field under it.
 */

import { coverPalette } from "./palette";
import type { ResolvedArt } from "./presets";

/** 21:9, the card's ratio; the hero slices it. */
export const ART_W = 1400;
export const ART_H = 600;

export function coverSvg({
  colors,
  seed = 0,
}: Pick<ResolvedArt, "colors"> & { seed?: number }): string {
  const p = coverPalette({ colors });
  const turn = seed / (2 * Math.PI);
  const W = ART_W;
  const H = ART_H;

  // the field's gradient line: a diagonal from the upper left, turned by the seed
  const angle = (118 + 30 * turn) * (Math.PI / 180);
  const dx = Math.sin(angle) * 0.62;
  const dy = -Math.cos(angle) * 0.62;
  const line = `x1="${r(0.5 - dx)}" y1="${r(0.5 - dy)}" x2="${r(0.5 + dx)}" y2="${r(0.5 + dy)}"`;

  // the band: mid-height on the left, high on the right, bending with the
  // seed; its dark fold falls where the caption sits
  const tilt = (turn - 0.5) * 90;
  const yL = 300 + tilt;
  const yR = 90 - tilt;
  const c1x = 380 + 160 * turn;
  const c2x = 860 - 160 * turn;
  const band = (offset: number) =>
    `M -120 ${r(yL + offset)} C ${r(c1x)} ${r(yL + 60 + offset)}, ${r(c2x)} ${r(yR - 40 + offset)}, ${W + 120} ${r(yR + offset)}`;

  const leakX = 72 + 16 * turn;
  const leakY = 10 + 22 * turn;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<defs>` +
    `<linearGradient id="f" ${line}><stop offset="0" stop-color="${p.dark}"/><stop offset="0.5" stop-color="${p.vivid}"/><stop offset="1" stop-color="${p.dusk}"/></linearGradient>` +
    `<radialGradient id="k" cx="${r(leakX)}%" cy="${r(leakY)}%" r="48%"><stop offset="0" stop-color="${p.light}" stop-opacity="0.5"/><stop offset="1" stop-color="${p.light}" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="v" cx="50%" cy="50%" r="72%"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>` +
    // filter regions cover the whole frame and then some: a region sized to
    // a stroke's own box clips the blur where the band leaves the frame
    `<filter id="s" filterUnits="userSpaceOnUse" x="-400" y="-500" width="${W + 800}" height="${H + 1000}"><feGaussianBlur stdDeviation="46"/></filter>` +
    `<filter id="t" filterUnits="userSpaceOnUse" x="-400" y="-500" width="${W + 800}" height="${H + 1000}"><feGaussianBlur stdDeviation="70"/></filter>` +
    `</defs>` +
    `<rect width="${W}" height="${H}" fill="url(#f)"/>` +
    `<path d="${band(150)}" fill="none" stroke="${p.dusk}" stroke-width="170" stroke-linecap="round" opacity="0.7" filter="url(#t)"/>` +
    `<path d="${band(0)}" fill="none" stroke="${p.pale}" stroke-width="130" stroke-linecap="round" opacity="0.95" filter="url(#s)"/>` +
    `<path d="${band(-190)}" fill="none" stroke="${p.light}" stroke-width="90" stroke-linecap="round" opacity="0.3" filter="url(#t)"/>` +
    `<rect width="${W}" height="${H}" fill="url(#k)"/>` +
    `<rect width="${W}" height="${H}" fill="url(#v)"/>` +
    `</svg>`
  );
}

/** The painting as a CSS image value. */
export function coverArtwork(
  art: Pick<ResolvedArt, "colors"> & { seed?: number },
): string {
  return `url("data:image/svg+xml,${encodeURIComponent(coverSvg(art))}")`;
}

const r = (n: number) => Math.round(n * 100) / 100;
