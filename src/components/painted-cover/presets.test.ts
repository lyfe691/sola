/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import {
  ART_PRESETS,
  PRESETS,
  baseGradient,
  resolveArt,
  seedToAngle,
} from "./presets";

const HEX = /^#[0-9a-f]{6}$/i;

describe("PRESETS", () => {
  it("defines every named preset with four hex stops and a horizon in [-1, 1]", () => {
    for (const name of ART_PRESETS) {
      const preset = PRESETS[name];
      expect(preset.palette).toHaveLength(4);
      for (const stop of preset.palette) expect(stop).toMatch(HEX);
      expect(preset.horizon).toBeGreaterThanOrEqual(-1);
      expect(preset.horizon).toBeLessThanOrEqual(1);
      expect(preset.swirl).toBeGreaterThan(0);
      expect(preset.stroke).toBeGreaterThan(0);
      expect(preset.drift).toBeGreaterThan(0);
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
    expect(art.palette).toEqual(PRESETS.starry.palette);
    expect(art.horizon).toBe(PRESETS.starry.horizon);
    expect(art.seed).toBe(0);
  });

  it("converts an integer seed to the golden-angle rotation", () => {
    expect(resolveArt({ preset: "wheat", seed: 2 }).seed).toBe(seedToAngle(2));
  });
});

describe("baseGradient", () => {
  it("uses all four stops and orients by horizon", () => {
    const top = baseGradient(PRESETS.starry); // horizon 1: dark at top
    const bottom = baseGradient(PRESETS.wheat); // horizon -1: dark at bottom
    for (const stop of PRESETS.starry.palette) expect(top).toContain(stop);
    expect(top).toContain("to bottom");
    expect(bottom).toContain("to top");
    expect(baseGradient(PRESETS.irises)).toContain("135deg");
  });
});
