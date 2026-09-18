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
 * faint echo on its other side, a leak of light where the band leaves the
 * frame, and a vignette. One small SVG per cover — a few blurred strokes,
 * nothing the browser has to think about — inlined as a data URI.
 *
 * The ingredients never change; the band's path does. Each cover draws one
 * of six compositions (COMPOSITIONS) and jitters it, both decided by a hash
 * of the cover's two colours and its seed. So two projects differ even on
 * the default seed, the same project always paints the same cover, and the
 * seed stays the knob for telling two covers on one preset apart.
 *
 * One rule holds for every composition: the caption lives in the lower
 * left, white type wants a dark field under it, so the band's centre line
 * stays above CAPTION_CLEAR_Y across the caption's width.
 */

import { coverPalette } from "./palette";
import type { ResolvedArt } from "./presets";

/** 21:9, the card's ratio; the hero slices it. */
export const ART_W = 1400;
export const ART_H = 600;

/** The caption's box, in artwork units: the band's centre keeps out of it. */
export const CAPTION_WIDTH = 0.6 * ART_W;
export const CAPTION_CLEAR_Y = 0.6 * ART_H;

type Point = readonly [x: number, y: number];

/** One cubic through the frame, plus where its companions sit. */
export interface CoverBand {
  /** start, two controls, end */
  curve: readonly [Point, Point, Point, Point];
  /** offset of the dark fold; the echo takes the opposite side */
  fold: Point;
  /** centre of the light leak, in percent of the frame */
  leak: Point;
}

/** Jitter: a value in [-n, n]. */
type Jitter = (n: number) => number;

/**
 * The six paths a band of light can take. Every one leaves the lower left
 * to the caption: a band may dip low only on the right.
 */
const COMPOSITIONS: ReadonlyArray<(j: Jitter) => CoverBand> = [
  // rising: mid-height on the left, high on the right
  (j) => ({
    curve: [
      [-120, 290 + j(40)],
      [420 + j(90), 350 + j(30)],
      [820 + j(90), 40 + j(40)],
      [ART_W + 120, 90 + j(45)],
    ],
    fold: [0, 150],
    leak: [76 + j(8), 14 + j(8)],
  }),
  // falling: high on the left, low on the right, clear of the caption's width
  (j) => ({
    curve: [
      [-120, 100 + j(40)],
      [430 + j(80), 110 + j(40)],
      [900 + j(70), 300 + j(40)],
      [ART_W + 120, 470 + j(45)],
    ],
    fold: [-60, 150],
    leak: [30 + j(10), 8 + j(6)],
  }),
  // arch: both ends at mid-height, the crown above the frame
  (j) => ({
    curve: [
      [-120, 270 + j(35)],
      [300 + j(90), -90 + j(40)],
      [920 + j(90), -70 + j(40)],
      [ART_W + 120, 310 + j(45)],
    ],
    fold: [0, 150],
    leak: [50 + j(14), 4 + j(4)],
  }),
  // sweep: poured from the top, bending out to the right
  (j) => ({
    curve: [
      [520 + j(90), -140],
      [640 + j(70), 180 + j(40)],
      [980 + j(70), 330 + j(40)],
      [ART_W + 120, 380 + j(50)],
    ],
    fold: [-130, 95],
    leak: [44 + j(8), 3 + j(3)],
  }),
  // valley: high at both ends, dipping to mid-height in the middle
  (j) => ({
    curve: [
      [-120, 50 + j(35)],
      [400 + j(70), 410 + j(25)],
      [1000 + j(70), 420 + j(25)],
      [ART_W + 120, 30 + j(40)],
    ],
    fold: [0, 150],
    leak: [84 + j(8), 8 + j(6)],
  }),
  // drop: a steep slash down the right side, out through the bottom
  (j) => ({
    curve: [
      [ART_W + 120, 20 + j(40)],
      [1210 + j(60), 130 + j(40)],
      [1010 + j(50), 390 + j(40)],
      [980 + j(60), ART_H + 160],
    ],
    fold: [130, 90],
    leak: [88 + j(6), 6 + j(5)],
  }),
];

/** FNV-1a, enough to turn a cover's identity into a seed. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: a small deterministic generator, values in [0, 1). */
function generator(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type CoverArt = Pick<ResolvedArt, "colors"> & { seed?: number };

function draw({ colors, seed = 0 }: CoverArt) {
  const next = generator(hash(`${colors[0]}${colors[1]}:${seed.toFixed(5)}`));
  const composition = COMPOSITIONS[Math.floor(next() * COMPOSITIONS.length)];
  const band = composition((n) => (next() * 2 - 1) * n);
  return { band, next };
}

/** The band a cover paints: its path, fold and leak. */
export function coverBand(art: CoverArt): CoverBand {
  return draw(art).band;
}

export function coverSvg(art: CoverArt): string {
  const { colors, seed = 0 } = art;
  const p = coverPalette({ colors });
  const turn = seed / (2 * Math.PI);
  const W = ART_W;
  const H = ART_H;
  const { band, next } = draw(art);

  // the field's gradient line: a diagonal from the upper left, turned by the
  // seed — the same line presets.ts lays under a live cover
  const angle = (118 + 30 * turn) * (Math.PI / 180);
  const dx = Math.sin(angle) * 0.62;
  const dy = -Math.cos(angle) * 0.62;
  const line = `x1="${r(0.5 - dx)}" y1="${r(0.5 - dy)}" x2="${r(0.5 + dx)}" y2="${r(0.5 + dy)}"`;

  const path = ([ox, oy]: Point) => {
    const [a, b, c, d] = band.curve.map(
      ([x, y]) => `${r(x + ox)} ${r(y + oy)}`,
    );
    return `M ${a} C ${b}, ${c}, ${d}`;
  };
  const [fx, fy] = band.fold;
  const width = 118 + next() * 34;
  const blur = 42 + next() * 12;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<defs>` +
    `<linearGradient id="f" ${line}><stop offset="0" stop-color="${p.dark}"/><stop offset="0.5" stop-color="${p.vivid}"/><stop offset="1" stop-color="${p.dusk}"/></linearGradient>` +
    `<radialGradient id="k" cx="${r(band.leak[0])}%" cy="${r(band.leak[1])}%" r="48%"><stop offset="0" stop-color="${p.light}" stop-opacity="0.5"/><stop offset="1" stop-color="${p.light}" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="v" cx="50%" cy="50%" r="72%"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>` +
    // filter regions cover the whole frame and then some: a region sized to
    // a stroke's own box clips the blur where the band leaves the frame
    `<filter id="s" filterUnits="userSpaceOnUse" x="-400" y="-500" width="${W + 800}" height="${H + 1000}"><feGaussianBlur stdDeviation="${r(blur)}"/></filter>` +
    `<filter id="t" filterUnits="userSpaceOnUse" x="-400" y="-500" width="${W + 800}" height="${H + 1000}"><feGaussianBlur stdDeviation="70"/></filter>` +
    `</defs>` +
    `<rect width="${W}" height="${H}" fill="url(#f)"/>` +
    `<path d="${path([fx, fy])}" fill="none" stroke="${p.dusk}" stroke-width="170" stroke-linecap="round" opacity="0.7" filter="url(#t)"/>` +
    `<path d="${path([0, 0])}" fill="none" stroke="${p.pale}" stroke-width="${r(width)}" stroke-linecap="round" opacity="0.95" filter="url(#s)"/>` +
    `<path d="${path([-fx * 1.27, -fy * 1.27])}" fill="none" stroke="${p.light}" stroke-width="90" stroke-linecap="round" opacity="0.3" filter="url(#t)"/>` +
    `<rect width="${W}" height="${H}" fill="url(#k)"/>` +
    `<rect width="${W}" height="${H}" fill="url(#v)"/>` +
    `</svg>`
  );
}

/** The painting as a CSS background-image value. */
export function coverArtwork(art: CoverArt): string {
  return `url("data:image/svg+xml,${encodeURIComponent(coverSvg(art))}")`;
}

const r = (n: number) => Math.round(n * 100) / 100;
