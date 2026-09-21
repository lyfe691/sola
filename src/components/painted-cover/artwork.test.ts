/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { CAPTION_CLEAR_Y, CAPTION_WIDTH, coverBand, coverSvg } from "./artwork";
import { coverPalette } from "./palette";
import { ART_PRESETS, PRESETS, resolveArt } from "./presets";

/** A point on the band's cubic at t. */
function at(
  curve: ReturnType<typeof coverBand>["curve"],
  t: number,
): [number, number] {
  const u = 1 - t;
  const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [0, 1].map((axis) =>
    curve.reduce((sum, point, i) => sum + w[i] * point[axis], 0),
  ) as [number, number];
}

describe("coverSvg", () => {
  const svg = coverSvg(PRESETS.cobalt);
  const p = coverPalette(PRESETS.cobalt);

  it("lays the band of the pale wash over a field of the deep tones", () => {
    expect(svg).toMatch(
      new RegExp(`stroke="${p.pale}" stroke-width="\\d+(\\.\\d+)?"`),
    );
    expect(svg).toContain(`stop-color="${p.dark}"`);
    expect(svg).toContain(`stop-color="${p.vivid}"`);
    expect(svg).toContain(`stroke="${p.dusk}"`);
  });

  it("uses only blurs, so the browser rasterizes it cheaply", () => {
    expect(svg).toContain("feGaussianBlur");
    expect(svg).not.toContain("feTurbulence");
    expect(svg).not.toContain("feDisplacementMap");
  });

  it("bends with the seed and stays put without one", () => {
    expect(coverSvg(resolveArt({ preset: "wheat" }))).toBe(
      coverSvg(PRESETS.wheat),
    );
    expect(coverSvg(resolveArt({ preset: "wheat", seed: 1 }))).not.toBe(
      coverSvg(PRESETS.wheat),
    );
  });

  it("paints the same cover every time", () => {
    const art = resolveArt({ preset: "moss", seed: 2 });
    expect(coverSvg(art)).toBe(coverSvg(art));
  });

  it("scopes every id, so covers inlined in one page never share defs", () => {
    const scoped = coverSvg(PRESETS.cobalt, "c1-");
    const ids = [...scoped.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    const refs = [...scoped.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) expect(id.startsWith("c1-")).toBe(true);
    for (const ref of refs) expect(ids).toContain(ref);
  });
});

describe("coverBand", () => {
  // every preset on the seeds a project is likely to declare
  const bands = ART_PRESETS.flatMap((preset) =>
    [0, 1, 2, 3, 4, 5, 6, 7].map((seed) => ({
      name: `${preset}/${seed}`,
      band: coverBand(resolveArt({ preset, seed })),
    })),
  );

  it("keeps the light out of the caption, whatever the composition", () => {
    // the caption sits in the lower left and its title begins around 72% of
    // the height: across the caption's width the band's centre stays above 60%
    for (const { name, band } of bands) {
      for (let t = 0; t <= 1; t += 0.02) {
        const [x, y] = at(band.curve, t);
        if (x >= 0 && x <= CAPTION_WIDTH)
          expect(y, `${name} at x=${Math.round(x)}`).toBeLessThan(
            CAPTION_CLEAR_Y,
          );
      }
    }
  });

  it("draws more than one composition across the presets", () => {
    // a band that enters from the left edge, from the top, or from the right
    const entries = new Set(
      bands.map(({ band }) => {
        const [x, y] = band.curve[0];
        return x < 0
          ? y < 200
            ? "left-high"
            : "left-mid"
          : y < 0
            ? "top"
            : "right";
      }),
    );
    expect(entries.size).toBeGreaterThanOrEqual(4);
  });
});
