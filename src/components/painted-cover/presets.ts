/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Presets for the painted project covers, named after the paintings they
 * borrow their palettes from. The covers are artwork: these are literal
 * colors, the same in every theme, like the deep-dive hero has always been.
 */

export const ART_PRESETS = [
  "starry",
  "wheat",
  "irises",
  "almond",
  "cafe",
  "cypress",
] as const;

export type ArtPreset = (typeof ART_PRESETS)[number];

/** What a project declares in src/config/projects.ts. */
export interface ProjectArt {
  preset: ArtPreset;
  /** Rotates the flow field so two projects on one preset differ. Default 0. */
  seed?: number;
}

export interface PaintedPreset {
  /** 4 stops, dark to light; stop 0 is the base color painted before WebGL. */
  palette: [string, string, string, string];
  /** Where the darkest stop concentrates: -1 bottom, 0 even, 1 top. */
  horizon: number;
  /** Scale of the swirl field in cover widths (0.5 tight, 2 broad). */
  swirl: number;
  /** Stroke streak length as a fraction of cover width. */
  stroke: number;
  /** Field advection speed; 1 is one slow cycle per ~60s. */
  drift: number;
}

export const PRESETS: Record<ArtPreset, PaintedPreset> = {
  starry: {
    palette: ["#141f4d", "#26418f", "#5b8fd4", "#f4d35e"],
    horizon: 1,
    swirl: 1,
    stroke: 0.08,
    drift: 1,
  },
  wheat: {
    palette: ["#3b2a14", "#1f3a6e", "#c8961e", "#e9c55a"],
    horizon: -1,
    swirl: 1.4,
    stroke: 0.1,
    drift: 0.8,
  },
  irises: {
    palette: ["#2f2a5a", "#4b3f8f", "#7c6cc4", "#efe5c2"],
    horizon: 0,
    swirl: 0.8,
    stroke: 0.07,
    drift: 1,
  },
  almond: {
    palette: ["#2f5f66", "#4fa3a5", "#8fd0c8", "#f3efe4"],
    horizon: 0,
    swirl: 1.2,
    stroke: 0.06,
    drift: 0.9,
  },
  cafe: {
    palette: ["#12213a", "#1e3557", "#d98b3a", "#f2c14e"],
    horizon: 1,
    swirl: 1,
    stroke: 0.09,
    drift: 1,
  },
  cypress: {
    palette: ["#2f4a2c", "#7b9a5c", "#6fa3d0", "#e9eef2"],
    horizon: -1,
    swirl: 0.9,
    stroke: 0.1,
    drift: 1.1,
  },
};

export interface ResolvedArt extends PaintedPreset {
  /** Rotation of the flow-field domain, radians. */
  seed: number;
}

/** Golden-ratio spacing: distinct angles for small integers, stable across runs. */
export const seedToAngle = (n: number) => ((n * 0.618034) % 1) * 2 * Math.PI;

export function resolveArt(art: ProjectArt): ResolvedArt {
  return { ...PRESETS[art.preset], seed: seedToAngle(art.seed ?? 0) };
}

/** The CSS layer under the canvas: painted on first render, shown alone when
 *  WebGL is off or the cover is far from the viewport. */
export function baseGradient({ palette, horizon }: PaintedPreset): string {
  const direction =
    horizon > 0 ? "to bottom" : horizon < 0 ? "to top" : "135deg";
  const [p0, p1, p2, p3] = palette;
  return `linear-gradient(${direction}, ${p0}, ${p1} 45%, ${p2} 80%, ${p3})`;
}
