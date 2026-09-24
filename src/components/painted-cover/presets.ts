/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Presets for the painted project covers: two clean colors per preset, a
 * deep wash and a pale one, the way the site's watercolor background pairs
 * them. The covers are artwork: these are literal colors, the same in every
 * theme, like the deep-dive hero has always been.
 */

import { coverPalette } from "./palette";

export const ART_PRESETS = [
  "night",
  "midnight",
  "cobalt",
  "caramel",
  "starry",
  "irises",
  "almond",
  "wheat",
  "moss",
  "poison",
  "slate",
] as const;

export type ArtPreset = (typeof ART_PRESETS)[number];

/** What a project declares in src/config/projects.ts. */
export interface ProjectArt {
  preset: ArtPreset;
  /** Rotates the field so two projects on one preset differ. Default 0. */
  seed?: number;
}

export interface PaintedPreset {
  /** Deep wash, pale wash. The deep one is the base color painted before WebGL. */
  colors: [string, string];
  /** Zoom of the field: larger shows more, smaller clouds. */
  scale: number;
  /** Drift speed; 0.3 matches the page background. */
  speed: number;
}

export const PRESETS: Record<ArtPreset, PaintedPreset> = {
  night: { colors: ["#0b1022", "#9fb3dc"], scale: 1.35, speed: 0.3 },
  midnight: { colors: ["#161f52", "#a9b8f0"], scale: 1.35, speed: 0.3 },
  cobalt: { colors: ["#12306b", "#6f97d6"], scale: 1.35, speed: 0.3 },
  caramel: { colors: ["#a5652b", "#f4dab4"], scale: 1.3, speed: 0.3 },
  starry: { colors: ["#243b7a", "#f4e4b0"], scale: 1.35, speed: 0.3 },
  irises: { colors: ["#4b3f8f", "#efe5c2"], scale: 1.35, speed: 0.3 },
  almond: { colors: ["#4fa3a5", "#f3efe4"], scale: 1.35, speed: 0.3 },
  wheat: { colors: ["#b8862b", "#fff0c4"], scale: 1.4, speed: 0.3 },
  moss: { colors: ["#3a7d44", "#cfe8c4"], scale: 1.35, speed: 0.3 },
  poison: { colors: ["#143a1d", "#6fe35a"], scale: 1.35, speed: 0.3 },
  slate: { colors: ["#334155", "#d6e0ea"], scale: 1.35, speed: 0.3 },
};

export interface ResolvedArt extends PaintedPreset {
  /** Rotation of the field, radians. */
  seed: number;
}

/** Golden-ratio spacing: distinct angles for small integers, stable across runs. */
export const seedToAngle = (n: number) => ((n * 0.618034) % 1) * 2 * Math.PI;

export function resolveArt(art: ProjectArt): ResolvedArt {
  return { ...PRESETS[art.preset], seed: seedToAngle(art.seed ?? 0) };
}

/**
 * The layer under a live cover's canvas: painted before the canvas exists,
 * and what remains when WebGL is off or the cover is far away. The field
 * of the painting (see artwork.ts) without its band, so the canvas fades
 * in over something of the same family. The seed turns it the way it
 * turns the painting.
 */
export function baseGradient({
  colors,
  seed = 0,
}: Pick<PaintedPreset, "colors"> & { seed?: number }): string {
  const { dark, vivid, dusk } = coverPalette({ colors });
  const angle = Math.round(118 + 30 * (seed / (2 * Math.PI)));
  return `linear-gradient(${angle}deg, ${dark} 0%, ${vivid} 50%, ${dusk} 100%)`;
}

/**
 * Film grain for a static cover: fine fractal noise tiled small, laid over
 * the painting with overlay blending. Strong enough to read as grain, the
 * way the reference cards do, not a texture hint.
 */
export const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>",
)}")`;
