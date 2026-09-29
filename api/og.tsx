/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The link-preview card of one page, drawn on request: /og/<key>.png, which
 * vercel.json rewrites to /api/og?key=<key>. The key is the only input and
 * must name a card in src/config/og-cards.ts; anything else is a 404, so no
 * one can put words of their own on this domain.
 *
 * 1200x630, ruled into a grid on the site's dark surface: the leaf and the
 * name over the first rule with the page's path across from them, the title
 * and its line in the middle, and three facts in cells along the bottom.
 * Type sits on computed baselines with its ink, not its box, on the grid,
 * and every line is fitted here, because Satori neither fits nor breaks.
 */

import { readFileSync } from "node:fs";
import { ImageResponse, type ImageResponseOptions } from "@vercel/og";
import { ogCard, ogHash, type OgCard } from "../src/config/og-cards.ts";
import { OWNER } from "../src/config/site.ts";
import { fontMetrics, type FontMetrics } from "./_og/metrics.ts";

const W = 1200;
const H = 630;
export const SURFACE = "#0a0a0a";

/**
 * The rules: two across, two down, and the bottom band split into three
 * equal cells. X crops a large card to 2:1, 15px off the top and the
 * bottom; the bands are sized for what is left.
 */
const RULE = { top: 128, bottom: 500, left: 56, right: 1144 };
const CELL_W = (RULE.right - RULE.left) / 3;
const CELLS = [0, 1, 2].map((i) => Math.round(RULE.left + i * CELL_W));
/** From a rule to the ink inside its band. */
const PAD = 32;
const TEXT = { left: RULE.left + PAD, right: RULE.right - PAD };
/** where X's crop leaves the card's edges */
const CROP = 15;
export const GRID = { W, H, RULE, CELLS, CELL_W, PAD, CROP };

const white = (alpha: number) => `rgba(255, 255, 255, ${alpha})`;
const COLOR = {
  rule: white(0.09),
  cross: white(0.45),
  byline: white(0.72),
  title: "#fafafa",
  line: white(0.64),
  value: white(0.88),
  // small text: 0.5 keeps 5.3:1 on the surface
  quiet: white(0.5),
};

// literal URLs: Vercel traces `new URL("…", import.meta.url)` to ship the
// files with the function
const font = (url: URL) => {
  const data = readFileSync(url);
  return { data, metrics: fontMetrics(data) };
};
// Satori takes static instances only (no variable fonts, no WOFF2): the
// Latin subsets of the site's Geist and JetBrains Mono, as TTF
const SEMIBOLD = font(new URL("./_fonts/Geist-SemiBold.ttf", import.meta.url));
const MEDIUM = font(new URL("./_fonts/Geist-Medium.ttf", import.meta.url));
const REGULAR = font(new URL("./_fonts/Geist-Regular.ttf", import.meta.url));
const MONO = font(
  new URL("./_fonts/JetBrainsMono-Medium.ttf", import.meta.url),
);

// one array for the life of the instance: Satori keeps the parsed fonts
// keyed by it, and a new array would parse them again on every card
const FONTS: ImageResponseOptions["fonts"] = [
  { name: "Geist", data: SEMIBOLD.data, weight: 600, style: "normal" },
  { name: "Geist", data: MEDIUM.data, weight: 500, style: "normal" },
  { name: "Geist", data: REGULAR.data, weight: 400, style: "normal" },
  { name: "Mono", data: MONO.data, weight: 500, style: "normal" },
];

/** The site's leaf, cropped to its ink and white (from public/apple-touch-icon.png). */
const LEAF = (() => {
  const data = readFileSync(new URL("./_og/leaf.png", import.meta.url));
  // a PNG's size sits in its header
  return {
    src: `data:image/png;base64,${data.toString("base64")}`,
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
})();

interface Face {
  family: "Geist" | "Mono";
  weight: 400 | 500 | 600;
  metrics: FontMetrics;
  /** letter-spacing, em */
  tracking: number;
  caps?: boolean;
}

const face = (
  family: Face["family"],
  weight: Face["weight"],
  metrics: FontMetrics,
  tracking: number,
  caps = false,
): Face => ({ family, weight, metrics, tracking, caps });

const TITLE = face("Geist", 600, SEMIBOLD.metrics, -0.04);
const LINE = face("Geist", 400, REGULAR.metrics, -0.012);
const BYLINE = face("Geist", 500, MEDIUM.metrics, -0.01);
const VALUE = face("Geist", 400, REGULAR.metrics, -0.01);
const PATH = face("Mono", 500, MONO.metrics, -0.02);
const EYEBROW = face("Mono", 500, MONO.metrics, 0.12, true);
const LABEL = face("Mono", 500, MONO.metrics, 0.14, true);
const SIZE = {
  title: 72,
  line: 28,
  byline: 24,
  leaf: 32,
  path: 16,
  eyebrow: 15,
  label: 13,
  value: 22,
};

const em = (face: Face, units: number, size: number) =>
  (units / face.metrics.unitsPerEm) * size;
const capHeight = (face: Face, size: number) =>
  em(face, face.metrics.capHeight, size);

/** Where the ink of `text` starts and ends, from the line's origin. */
function ink(face: Face, size: number, text: string) {
  const chars = [...text];
  const last = chars[chars.length - 1] ?? " ";
  const head = chars.slice(0, -1).join("");
  const left = em(face, face.metrics.box(chars[0] ?? " ").xMin, size);
  const lastOrigin = face.metrics.width(head, face.tracking) * size;
  const right = lastOrigin + em(face, face.metrics.box(last).xMax, size);
  return { left, right, width: right - left };
}

interface Line {
  text: string;
  face: Face;
  size: number;
  /** the ink's left edge */
  x: number;
  baseline: number;
  color: string;
  /** where the line's ink lands on the card */
  ink: { left: number; right: number; top: number; bottom: number };
}

/**
 * Satori widens every word space by about an eighth of an em; a no-break
 * space it sets at the font's own width. Lines are broken here, never by
 * Satori, so no break is lost.
 */
const NBSP = String.fromCharCode(0xa0);

/** A line box's top, for its baseline to land on `baseline` (line-height 1). */
function boxTop(face: Face, size: number, baseline: number) {
  const ascent = em(face, face.metrics.ascender, size);
  const descent = -em(face, face.metrics.descender, size);
  return baseline - ((size - ascent - descent) / 2 + ascent);
}

const WEAK = new Set(
  "a an the for of and with in to as on at by or from into your my its one".split(
    " ",
  ),
);

/** The best break into two lines that both fit, or null. */
function split2(text: string, widthOf: (line: string) => number, max: number) {
  const words = text.split(" ");
  let best: { cost: number; lines: [string, string] } | null = null;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const wa = widthOf(a);
    const wb = widthOf(b);
    if (Math.max(wa, wb) > max) continue;
    const end = words[i - 1].toLowerCase().replace(/[^a-z']/g, "");
    // 0.5 is an even split; a clause break wins only near one
    let cost = Math.max(wa, wb) / (wa + wb);
    if (WEAK.has(end)) cost += 0.35;
    if (/[,;:]$/.test(words[i - 1])) cost -= 0.06;
    if (words.length - i === 1 && words[i].length <= 3) cost += 0.3;
    if (!best || cost < best.cost) best = { cost, lines: [a, b] };
  }
  return best?.lines ?? null;
}

/**
 * One line at up to `size`, or two balanced ones when one would shrink past
 * `floor` of it; `twoLines: false` shrinks to fit one line and throws past
 * the floor.
 */
function fit(
  face: Face,
  text: string,
  size: number,
  max: number,
  { floor, twoLines }: { floor: number; twoLines: boolean },
) {
  const width = (line: string, s: number) => ink(face, s, line).width;
  const whole = width(text, size);
  if (whole <= max) return { size, lines: [text] };
  const one = Math.floor((size * max) / whole);
  if (one >= size * floor || !twoLines || !text.includes(" ")) {
    if (one < size * floor)
      throw new Error(`og: "${text}" does not fit ${max}px`);
    return { size: one, lines: [text] };
  }
  for (let s = size; s >= size * floor; s--) {
    const two = split2(text, (line) => width(line, s), max);
    if (two) return { size: s, lines: two };
  }
  throw new Error(`og: "${text}" does not fit two lines of ${max}px`);
}

/**
 * The card's lines on the grid. The byline and path share a baseline in the
 * top band; the title block is centred in the middle band from the eyebrow's
 * capitals to the line's last baseline; each cell's label and value are
 * centred in the part of the bottom band X's crop keeps. Gaps run from a
 * baseline to the next line's cap height, so they read the same at any size.
 */
export function layout(card: OgCard) {
  const lines: Line[] = [];
  const set = (
    face: Face,
    size: number,
    raw: string,
    x: number,
    baseline: number,
    color: string,
    align: "left" | "right" = "left",
  ) => {
    const text = face.caps ? raw.toUpperCase() : raw;
    const width = ink(face, size, text).width;
    const left = align === "left" ? x : x - width;
    const boxes = [...text].map((char) => face.metrics.box(char));
    lines.push({
      text,
      face,
      size,
      x: left,
      baseline,
      color,
      ink: {
        left,
        right: left + width,
        top: baseline - em(face, Math.max(...boxes.map((b) => b.yMax)), size),
        bottom:
          baseline - em(face, Math.min(...boxes.map((b) => b.yMin)), size),
      },
    });
  };

  // the top band, centred on what the crop keeps of it
  const topMiddle = (CROP + RULE.top) / 2;
  const leaf = {
    x: TEXT.left,
    y: topMiddle - SIZE.leaf / 2,
    width: (LEAF.width / LEAF.height) * SIZE.leaf,
    height: SIZE.leaf,
  };
  const bylineBase = topMiddle + capHeight(BYLINE, SIZE.byline) / 2;
  set(
    BYLINE,
    SIZE.byline,
    OWNER,
    leaf.x + leaf.width + 12,
    bylineBase,
    COLOR.byline,
  );
  const bylineRight = lines[0].ink.right;
  const path = fit(PATH, card.path, SIZE.path, TEXT.right - bylineRight - 48, {
    floor: 0.8,
    twoLines: false,
  });
  set(PATH, path.size, card.path, TEXT.right, bylineBase, COLOR.quiet, "right");

  // the middle band
  const title = fit(TITLE, card.title, SIZE.title, TEXT.right - TEXT.left, {
    floor: 0.7,
    twoLines: true,
  });
  const titleLead = Math.round(title.size * 0.98);
  const sub = fit(LINE, card.tagline, SIZE.line, TEXT.right - TEXT.left, {
    floor: 0.85,
    twoLines: true,
  });
  const subLead = Math.round(sub.size * 1.3);
  const eyebrowCap = capHeight(EYEBROW, SIZE.eyebrow);
  const gapToTitle = 28;
  const gapToLine = 40;
  const block =
    eyebrowCap +
    gapToTitle +
    capHeight(TITLE, title.size) +
    (title.lines.length - 1) * titleLead +
    gapToLine +
    capHeight(LINE, sub.size) +
    (sub.lines.length - 1) * subLead;
  const eyebrowBase = (RULE.top + RULE.bottom - block) / 2 + eyebrowCap;
  set(EYEBROW, SIZE.eyebrow, card.eyebrow, TEXT.left, eyebrowBase, COLOR.quiet);
  const titleFirst = eyebrowBase + gapToTitle + capHeight(TITLE, title.size);
  title.lines.forEach((text, i) => {
    set(
      TITLE,
      title.size,
      text,
      TEXT.left,
      titleFirst + i * titleLead,
      COLOR.title,
    );
  });
  const subFirst =
    titleFirst +
    (title.lines.length - 1) * titleLead +
    gapToLine +
    capHeight(LINE, sub.size);
  sub.lines.forEach((text, i) => {
    set(LINE, sub.size, text, TEXT.left, subFirst + i * subLead, COLOR.line);
  });

  // the bottom band's cells
  const labelCap = capHeight(LABEL, SIZE.label);
  const gapToValue = 14;
  const pair = labelCap + gapToValue + capHeight(VALUE, SIZE.value);
  const labelBase = (RULE.bottom + H - CROP - pair) / 2 + labelCap;
  const valueBase = labelBase + gapToValue + capHeight(VALUE, SIZE.value);
  card.cells.forEach(([label, value], i) => {
    const x = CELLS[i] + PAD;
    const room = CELL_W - 2 * PAD;
    set(LABEL, SIZE.label, label, x, labelBase, COLOR.quiet);
    const fitted = fit(VALUE, value, SIZE.value, room, {
      floor: 0.8,
      twoLines: false,
    });
    set(VALUE, fitted.size, value, x, valueBase, COLOR.value);
  });

  return { lines, leaf };
}

/** The rules and a cross where the outer ones meet, as absolute boxes. */
function rules() {
  const box = (left: number, top: number, width: number, height: number) => ({
    left,
    top,
    width,
    height,
  });
  const lines = [
    box(0, RULE.top, W, 1),
    box(0, RULE.bottom, W, 1),
    box(RULE.left, 0, 1, H),
    box(RULE.right, 0, 1, H),
    box(CELLS[1], RULE.bottom, 1, H - RULE.bottom),
    box(CELLS[2], RULE.bottom, 1, H - RULE.bottom),
  ];
  const crosses = [RULE.left, RULE.right].flatMap((x) =>
    [RULE.top, RULE.bottom].flatMap((y) => [
      box(x - 7, y, 15, 1),
      box(x, y - 7, 1, 15),
    ]),
  );
  return { lines, crosses };
}

async function render(card: OgCard): Promise<ArrayBuffer> {
  const { lines, leaf } = layout(card);
  const grid = rules();
  const image = new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: W,
        height: H,
        backgroundColor: SURFACE,
      }}
    >
      {grid.lines.map((b) => (
        <div
          key={`r${b.left}:${b.top}:${b.width}`}
          style={{ position: "absolute", ...b, backgroundColor: COLOR.rule }}
        />
      ))}
      {grid.crosses.map((b) => (
        <div
          key={`c${b.left}:${b.top}:${b.width}`}
          style={{ position: "absolute", ...b, backgroundColor: COLOR.cross }}
        />
      ))}
      <img
        src={LEAF.src}
        width={leaf.width}
        height={leaf.height}
        style={{ position: "absolute", left: leaf.x, top: leaf.y }}
      />
      {lines.map((line) => (
        <div
          key={`${line.baseline}:${line.x}`}
          style={{
            position: "absolute",
            left: line.x - ink(line.face, line.size, line.text).left,
            top: boxTop(line.face, line.size, line.baseline),
            display: "flex",
            fontFamily: line.face.family,
            fontWeight: line.face.weight,
            fontSize: line.size,
            letterSpacing: `${line.face.tracking}em`,
            lineHeight: 1,
            whiteSpace: "nowrap",
            color: line.color,
          }}
        >
          {line.text.replaceAll(" ", NBSP)}
        </div>
      ))}
    </div>,
    { width: W, height: H, fonts: FONTS },
  );
  // drawn in full before answering: a render that fails is a 500, not a
  // truncated image
  return image.arrayBuffer();
}

/**
 * The URL a page links carries `v`, a hash of what its card says: that
 * URL's image never changes and is kept for a year. Without it, or with a
 * stale one, the card is the current one and the browser asks again; the
 * CDN keeps either for the deployment, which is all the card can change in.
 */
const PINNED =
  "public, max-age=31536000, s-maxage=31536000, immutable, no-transform";
const CURRENT =
  "public, max-age=0, must-revalidate, s-maxage=31536000, no-transform";

export async function GET(request: Request): Promise<Response> {
  const query = new URL(request.url).searchParams;
  const card = ogCard(query.get("key") ?? "");
  if (!card)
    return new Response("Not found\n", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  return new Response(await render(card), {
    headers: {
      "content-type": "image/png",
      "cache-control": query.get("v") === ogHash(card) ? PINNED : CURRENT,
    },
  });
}
