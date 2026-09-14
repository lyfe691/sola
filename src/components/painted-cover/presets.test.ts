/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { coverPalette } from "./palette";
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
  it("runs the painting's field: dark through vivid to dusk", () => {
    const gradient = baseGradient(PRESETS.almond);
    const { dark, vivid, dusk } = coverPalette(PRESETS.almond);
    expect(gradient).toBe(
      `linear-gradient(118deg, ${dark} 0%, ${vivid} 50%, ${dusk} 100%)`,
    );
  });

  it("turns with the seed and stays put without one", () => {
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
