/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { coverArtwork, coverSvg } from "./artwork";
import { coverPalette } from "./palette";
import { PRESETS, resolveArt } from "./presets";

describe("coverSvg", () => {
  const svg = coverSvg(PRESETS.cobalt);
  const p = coverPalette(PRESETS.cobalt);

  it("lays the band of the pale wash over a field of the deep tones", () => {
    expect(svg).toContain(`stroke="${p.pale}" stroke-width="130"`);
    expect(svg).toContain(`stop-color="${p.dark}"`);
    expect(svg).toContain(`stop-color="${p.vivid}"`);
    expect(svg).toContain(`stroke="${p.dusk}"`);
  });

  it("uses only blurs, so the browser rasterizes it cheaply", () => {
    expect(svg).toContain("feGaussianBlur");
    expect(svg).not.toContain("feTurbulence");
    expect(svg).not.toContain("feDisplacementMap");
  });

  it("starts the band of light above mid-height, clear of the caption", () => {
    const match = svg.match(
      new RegExp(
        `<path d="M -120 (\\d+(?:\\.\\d+)?) [^"]*" fill="none" stroke="${p.pale}"`,
      ),
    );
    expect(match).not.toBeNull();
    // the caption's title begins around 72% of the height; the band's
    // centre stays under 60% even at the seed's lowest tilt
    expect(Number(match![1])).toBeLessThan(0.6 * 600);
  });

  it("bends with the seed and stays put without one", () => {
    expect(coverSvg(resolveArt({ preset: "wheat" }))).toBe(
      coverSvg(PRESETS.wheat),
    );
    expect(coverSvg(resolveArt({ preset: "wheat", seed: 1 }))).not.toBe(
      coverSvg(PRESETS.wheat),
    );
  });
});

describe("coverArtwork", () => {
  it("is a CSS image of the encoded SVG", () => {
    const value = coverArtwork(PRESETS.night);
    expect(value.startsWith('url("data:image/svg+xml,')).toBe(true);
    expect(decodeURIComponent(value.slice(24, -2))).toBe(
      coverSvg(PRESETS.night),
    );
  });
});
