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

export const ART_PRESETS = [
  "starry",
  "cafe",
  "irises",
  "almond",
  "wheat",
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
  starry: { colors: ["#243b7a", "#f2d06b"], scale: 1.35, speed: 0.3 },
  cafe: { colors: ["#1e3557", "#e8a24a"], scale: 1.3, speed: 0.3 },
  irises: { colors: ["#4b3f8f", "#efe5c2"], scale: 1.35, speed: 0.3 },
  almond: { colors: ["#4fa3a5", "#f3efe4"], scale: 1.35, speed: 0.3 },
  wheat: { colors: ["#b8862b", "#fff0c4"], scale: 1.4, speed: 0.3 },
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

/** The CSS layer under the canvas: painted on first render, shown alone when
 *  WebGL is off or the cover is far from the viewport. */
export function baseGradient({ colors }: PaintedPreset): string {
  const [deep, pale] = colors;
  return `linear-gradient(135deg, ${deep}, ${pale})`;
}
