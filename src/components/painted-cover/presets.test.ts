/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import {
  ART_PRESETS,
  GRAIN,
  PRESETS,
  baseGradient,
  resolveArt,
  seedToAngle,
} from "./presets";

const HEX = /^#[0-9a-f]{6}$/i;

describe("PRESETS", () => {
  it("defines every named preset with two hex colors and positive motion values", () => {
    for (const name of ART_PRESETS) {
      const preset = PRESETS[name];
      expect(preset.colors).toHaveLength(2);
      for (const color of preset.colors) expect(color).toMatch(HEX);
      expect(preset.scale).toBeGreaterThan(0);
      expect(preset.speed).toBeGreaterThan(0);
    }
  });
});

describe("seedToAngle", () => {
  it("is stable and stays inside one turn", () => {
    expect(seedToAngle(3)).toBe(seedToAngle(3));
    for (let n = 0; n < 8; n++) {
      expect(seedToAngle(n)).toBeGreaterThanOrEqual(0);
      expect(seedToAngle(n)).toBeLessThan(2 * Math.PI);
    }
  });

  it("gives clearly distinct angles for seeds 0-7", () => {
    const angles = Array.from({ length: 8 }, (_, n) => seedToAngle(n));
    for (let i = 0; i < angles.length; i++) {
      for (let j = i + 1; j < angles.length; j++) {
        expect(Math.abs(angles[i] - angles[j])).toBeGreaterThan(0.3);
      }
    }
  });
});

describe("resolveArt", () => {
  it("merges the preset with a seed of 0 by default", () => {
    const art = resolveArt({ preset: "starry" });
    expect(art.colors).toEqual(PRESETS.starry.colors);
    expect(art.scale).toBe(PRESETS.starry.scale);
    expect(art.seed).toBe(0);
  });

  it("converts an integer seed to the golden-angle rotation", () => {
    expect(resolveArt({ preset: "wheat", seed: 2 }).seed).toBe(seedToAngle(2));
  });
});

describe("baseGradient", () => {
  it("runs a beam of the pale wash between vivid flanks that fall to near-black", () => {
    const gradient = baseGradient(PRESETS.almond);
    const [deep, pale] = PRESETS.almond.colors;
    const beam = gradient.slice(gradient.lastIndexOf("linear-gradient"));
    expect(gradient.startsWith("radial-gradient")).toBe(true);
    expect(beam).toContain(`color-mix(in oklab, ${deep} 55%, black) 0%`);
    expect(beam).toContain(
      `oklch(from ${deep} 0.6 clamp(0.1, c * 1.7, 0.25) h)`,
    );
    expect(beam).toMatch(new RegExp(`${pale} \\d+%`));
    expect(gradient).toContain(`color-mix(in oklab, ${pale} 70%, transparent)`);
  });

  it("moves with the seed and stays put without one", () => {
    const still = baseGradient(resolveArt({ preset: "wheat" }));
    expect(still).toBe(baseGradient(PRESETS.wheat));
    expect(baseGradient(resolveArt({ preset: "wheat", seed: 1 }))).not.toBe(
      still,
    );
  });
});

describe("GRAIN", () => {
  it("is an inline SVG of tiled fractal noise", () => {
    expect(GRAIN.startsWith('url("data:image/svg+xml,')).toBe(true);
    const svg = decodeURIComponent(GRAIN.slice(24, -2));
    expect(svg).toContain("feTurbulence");
    expect(svg).toContain("stitchTiles='stitch'");
  });
});
