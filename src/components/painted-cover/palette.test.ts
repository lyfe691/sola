/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { coverPalette, mix, tone } from "./palette";
import { PRESETS } from "./presets";

const HEX = /^#[0-9a-f]{6}$/;

const luma = (hex: string) =>
  [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);

describe("mix", () => {
  it("is the identity at 0 and the target at 1", () => {
    expect(mix("#12306b", "#000000", 0)).toBe("#12306b");
    expect(mix("#12306b", "#ffffff", 1)).toBe("#ffffff");
  });

  it("darkens toward black by the amount", () => {
    const half = mix("#6f97d6", "#000000", 0.5);
    expect(luma(half)).toBeLessThan(luma("#6f97d6"));
    expect(luma(half)).toBeGreaterThan(luma(mix("#6f97d6", "#000000", 0.8)));
  });
});

describe("tone", () => {
  it("keeps the hue while setting lightness and pushing chroma", () => {
    // cobalt's deep navy at a luminous lightness stays blue, not gray
    const [r, g, b] = [1, 3, 5].map((i) =>
      parseInt(tone("#12306b", 0.6, 1.7, 0.1, 0.25).slice(i, i + 2), 16),
    );
    expect(b).toBeGreaterThan(r + 60);
    expect(b).toBeGreaterThan(g);
  });

  it("floors chroma so a near-black preset still carries color", () => {
    const [r, g, b] = [1, 3, 5].map((i) =>
      parseInt(tone("#0a0d16", 0.6, 1.7, 0.1, 0.25).slice(i, i + 2), 16),
    );
    expect(b - r).toBeGreaterThan(20);
    expect(b).toBeGreaterThan(g);
  });
});

describe("coverPalette", () => {
  it("orders its tones dark → dusk below the deep wash, light above the pale", () => {
    for (const preset of Object.values(PRESETS)) {
      const p = coverPalette(preset);
      const [deep, pale] = preset.colors;
      for (const hex of Object.values(p)) expect(hex).toMatch(HEX);
      expect(luma(p.dusk)).toBeLessThan(luma(p.dark));
      expect(luma(p.dark)).toBeLessThan(luma(deep) + 1);
      expect(p.pale).toBe(pale);
      expect(luma(p.light)).toBeGreaterThan(luma(pale) - 1);
    }
  });
});
