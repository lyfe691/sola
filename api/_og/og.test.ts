/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * The card function through its real handler: every card renders, nothing
 * else does. Lives in api/_og/ because Vercel deploys every other file in
 * api/ as a function of its own.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import { OG_CARDS, ogCard, ogHash } from "../../src/config/og-cards.ts";

const renders = vi.hoisted(() => ({ count: 0 }));
vi.mock("@vercel/og", async (importOriginal) => {
  const og = await importOriginal<typeof import("@vercel/og")>();
  class ImageResponse extends og.ImageResponse {
    constructor(...args: ConstructorParameters<typeof og.ImageResponse>) {
      renders.count++;
      super(...args);
    }
  }
  return { ...og, ImageResponse };
});

const { GET, GRID, SURFACE, layout } = await import("../og.tsx");

const KEYS = Object.keys(OG_CARDS);
const request = (query: string) =>
  new Request(`https://sola.ysz.life/api/og${query}`);

describe("GET /api/og", () => {
  it.each(KEYS)(
    "draws %s as a 1200x630 PNG under 300 KB",
    async (key) => {
      const response = await GET(request(`?key=${key}`));
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("image/png");
      const image = Buffer.from(await response.arrayBuffer());
      const { format, width, height } = await sharp(image).metadata();
      expect({ format, width, height }).toEqual({
        format: "png",
        width: 1200,
        height: 630,
      });
      expect(image.length).toBeLessThan(300 * 1024);
    },
    30_000,
  );

  it("pins the URL a page links, and makes any other ask again", async () => {
    const card = ogCard("kinoa")!;
    const pinned = await GET(request(`?key=kinoa&v=${ogHash(card)}`));
    expect(pinned.headers.get("cache-control")).toMatch(
      /max-age=31536000.*immutable/,
    );
    for (const query of ["?key=kinoa", "?key=kinoa&v=00000000"]) {
      const current = await GET(request(query));
      expect(current.headers.get("cache-control"), query).toMatch(
        /max-age=0, must-revalidate/,
      );
      expect(current.headers.get("cache-control"), query).not.toMatch(
        /immutable/,
      );
    }
  }, 30_000);

  it("answers anything that is not a card with a 404 and draws nothing", async () => {
    const before = renders.count;
    const queries = [
      "",
      "?key=",
      "?v=abc",
      "?key=nope",
      "?key=Home",
      "?key=__proto__",
      "?key=constructor",
      "?key=../home",
      "?key=kinoa.png",
      "?title=Hello",
    ];
    for (const query of queries) {
      const response = await GET(request(query));
      expect(response.status, query).toBe(404);
      expect(response.headers.get("content-type"), query).toMatch(
        /^text\/plain/,
      );
      expect((await response.text()).length, query).toBeLessThan(32);
    }
    expect(renders.count).toBe(before);
  });
});

describe("vercel.json", () => {
  const config = JSON.parse(fs.readFileSync("vercel.json", "utf8")) as {
    rewrites?: { source: string; destination: string }[];
  };

  it("rewrites /og/<key>.png to the function, under the name it reads", async () => {
    const rewrite = config.rewrites?.find((r) => r.source.startsWith("/og/"));
    expect(rewrite?.source).toBe("/og/:key.png");
    const target = new URL(rewrite!.destination, "https://sola.ysz.life");
    expect(target.pathname).toBe("/api/og");
    const [[param, value]] = [...target.searchParams];
    expect(value).toBe(`:${param}`);
    expect(rewrite!.source).toContain(`:${param}`);
    const response = await GET(request(`?${param}=home`));
    expect(response.status).toBe(200);
  }, 30_000);
});

/** WCAG relative luminance of an sRGB colour, channels 0..255. */
const luminance = ([r, g, b]: number[]) => {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const rgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
/** `rgba(…)` or `#rrggbb` laid over the surface */
const over = (color: string, under: number[]) => {
  if (color.startsWith("#")) return rgb(color);
  const [r, g, b, a] = color.match(/[\d.]+/g)!.map(Number);
  return [r, g, b].map((c, i) => c * a + under[i] * (1 - a));
};
const contrast = (a: number[], b: number[]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe("layout", () => {
  const surface = rgb(SURFACE);
  const { W, H, RULE, CELLS, CELL_W, PAD, CROP } = GRID;
  const isTitle = (line: { face: { weight: number } }) =>
    line.face.weight === 600;

  it.each(KEYS)(
    "sets %s inside its band of the grid, clear of the rules and the crop",
    (key) => {
      const { lines, leaf } = layout(ogCard(key)!);
      // a glyph the fonts lack would send Satori to Google Fonts mid-render
      for (const { text, face } of lines)
        expect(face.metrics.covers(text), text).toBe(true);
      const titles = lines.filter(isTitle);
      expect(titles.length).toBeGreaterThanOrEqual(1);
      expect(titles.length).toBeLessThanOrEqual(2);
      expect(titles[0].size).toBeGreaterThanOrEqual(50);

      // X shows a 2:1 crop, CROP px off the top and the bottom
      const bands = [
        [CROP, RULE.top],
        [RULE.top, RULE.bottom],
        [RULE.bottom, H - CROP],
      ];
      expect(leaf.y).toBeGreaterThan(CROP + 12);
      expect(leaf.y + leaf.height).toBeLessThan(RULE.top - 12);
      for (const { text, ink, baseline } of lines) {
        const [top, bottom] = bands.find(
          ([from, to]) => baseline > from && baseline < to,
        )!;
        expect(ink.top - top, text).toBeGreaterThanOrEqual(12);
        expect(bottom - ink.bottom, text).toBeGreaterThanOrEqual(12);
        expect(ink.left, text).toBeGreaterThanOrEqual(RULE.left + PAD);
        expect(ink.right, text).toBeLessThanOrEqual(RULE.right - PAD);
        if (top === RULE.bottom) {
          // a fact stays inside its own cell
          const cell = CELLS.findLast((x) => x <= ink.left)!;
          expect(ink.right, text).toBeLessThanOrEqual(cell + CELL_W - PAD);
        }
      }
      expect(W).toBe(1200);
    },
  );

  it("reads at WCAG AA on the surface: 3:1 for the title, 4.5:1 below it", () => {
    const worst = new Map<string, number>();
    for (const key of KEYS)
      for (const line of layout(ogCard(key)!).lines) {
        const role = isTitle(line) ? "title" : line.color;
        const ratio = contrast(over(line.color, surface), surface);
        worst.set(role, Math.min(worst.get(role) ?? Infinity, ratio));
      }
    for (const [role, ratio] of worst)
      expect(ratio, role).toBeGreaterThanOrEqual(role === "title" ? 3 : 4.5);
  });
});

describe("the function's own imports", () => {
  // Vercel runs the compiled function as plain Node ESM: a relative import
  // needs its extension, and `@/` means nothing there
  it("load without a bundler", () => {
    const seen = new Set<string>();
    const walk = (file: string) => {
      if (seen.has(file)) return;
      seen.add(file);
      const source = fs.readFileSync(file, "utf8");
      const imports = source.matchAll(
        /^(?:import|export)\s+(?!type\b)(?:[^;]*?\sfrom\s+)?"([^"]+)"/gm,
      );
      for (const [, specifier] of imports) {
        expect(specifier, file).not.toMatch(/^@\//);
        if (!specifier.startsWith(".")) continue;
        expect(specifier, file).toMatch(/\.tsx?$/);
        const target = path.resolve(path.dirname(file), specifier);
        expect(fs.existsSync(target), `${file}: ${specifier}`).toBe(true);
        walk(target);
      }
    };
    walk(path.resolve("api/og.tsx"));
    expect(seen.size).toBeGreaterThan(5);
  });
});
