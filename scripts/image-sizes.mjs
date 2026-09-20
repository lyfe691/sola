/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * Writes src/config/project-image-sizes.ts: the pixel size of every PNG
 * under public/projects, read from the file header. The deep-dive image
 * component puts those on the <img> as width/height so the browser reserves
 * the right box before a lazy image loads. Without that a page grows while
 * you scroll it, and a jump to a section lands short of it.
 *
 * Run `bun run images:sizes` after adding or replacing a project image;
 * src/config/project-image-sizes.test.ts fails when the file is stale.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { inflateSync, constants } from "node:zlib";

const { Z_SYNC_FLUSH } = constants;

const ROOT = "public/projects";
const OUT = "src/config/project-image-sizes.ts";

/** A PNG stores its width and height big-endian at bytes 16 and 20 (IHDR). */
export function pngSize(path) {
  const buf = readFileSync(path);
  if (buf.toString("ascii", 1, 4) !== "PNG")
    throw new Error(`${path} is not a PNG`);
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

/** Bytes per pixel for the PNG colour types that carry 8-bit samples. */
const CHANNELS = { 0: 1, 2: 3, 4: 2, 6: 4 };

/** Rows read from the top; the median of them is the colour. */
const BAND = 9;

const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};

/**
 * The colour along the top of a PNG, as `#rrggbb`.
 *
 * A device frame fills its screen with this, so the shot and the frame read as
 * one. The median of the top rows rather than the first one: a capture often
 * carries a stray border row, and one of those on its own is the wrong answer
 * by a mile. Returns null for anything but a plain 8-bit non-interlaced PNG —
 * the frame then falls back to a token and nothing breaks.
 */
export function pngTopColor(path) {
  const buf = readFileSync(path);
  const [width] = pngSize(path);
  const depth = buf.readUInt8(24);
  const colorType = buf.readUInt8(25);
  const interlaced = buf.readUInt8(28) !== 0;
  const bpp = CHANNELS[colorType];
  if (depth !== 8 || interlaced || !bpp) return null;

  // one scanline is a filter byte then the pixels; concatenate only as much
  // IDAT as can hold it, since inflating a 2880-wide screenshot whole is waste
  const stride = 1 + width * bpp;
  const parts = [];
  let size = 0;
  for (let at = 8; at + 8 <= buf.length && size < stride * (BAND + 4);) {
    const length = buf.readUInt32BE(at);
    if (buf.toString("ascii", at + 4, at + 8) === "IDAT") {
      parts.push(buf.subarray(at + 8, at + 8 + length));
      size += length;
    }
    at += 12 + length;
  }
  if (!parts.length) return null;

  let raw;
  try {
    raw = inflateSync(Buffer.concat(parts), { finishFlush: Z_SYNC_FLUSH });
  } catch {
    return null;
  }
  if (raw.length < stride) return null;

  const gray = colorType === 0 || colorType === 4;
  const rows = [];
  let prev = Buffer.alloc(width * bpp);
  for (let y = 0; y < BAND && (y + 1) * stride <= raw.length; y += 1) {
    const filter = raw[y * stride];
    const line = Buffer.from(raw.subarray(y * stride + 1, (y + 1) * stride));
    for (let i = 0; i < line.length; i += 1) {
      const a = i >= bpp ? line[i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
      if (filter === 1) line[i] = (line[i] + a) & 0xff;
      else if (filter === 2) line[i] = (line[i] + b) & 0xff;
      else if (filter === 3) line[i] = (line[i] + ((a + b) >> 1)) & 0xff;
      else if (filter === 4) line[i] = (line[i] + paeth(a, b, c)) & 0xff;
    }
    let r = 0;
    let g = 0;
    let b = 0;
    for (let x = 0; x < width; x += 1) {
      const at = x * bpp;
      r += line[at];
      g += gray ? line[at] : line[at + 1];
      b += gray ? line[at] : line[at + 2];
    }
    rows.push([r / width, g / width, b / width]);
    prev = line;
  }
  if (!rows.length) return null;

  const median = (channel) => {
    const sorted = rows.map((row) => row[channel]).sort((a, b) => a - b);
    return Math.round(sorted[Math.floor(sorted.length / 2)]);
  };
  const hex = (value) => value.toString(16).padStart(2, "0");
  return `#${hex(median(0))}${hex(median(1))}${hex(median(2))}`;
}

function walkPngs(dir, visit) {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkPngs(full, visit);
    else if (name.toLowerCase().endsWith(".png"))
      visit("/" + full.replaceAll("\\", "/").replace(/^public\//, ""), full);
  }
}

export function collect(dir = ROOT) {
  const sizes = {};
  walkPngs(dir, (src, full) => {
    sizes[src] = pngSize(full);
  });
  return sizes;
}

export function collectTints(dir = ROOT) {
  const tints = {};
  walkPngs(dir, (src, full) => {
    const tint = pngTopColor(full);
    if (tint) tints[src] = tint;
  });
  return tints;
}

if (
  process.argv[1]?.replaceAll("\\", "/").endsWith("scripts/image-sizes.mjs")
) {
  const sizes = collect();
  const tints = collectTints();
  const rows = Object.entries(sizes)
    .map(([src, [w, h]]) => `  ${JSON.stringify(src)}: [${w}, ${h}],`)
    .join("\n");
  const tintRows = Object.entries(tints)
    .map(([src, tint]) => `  ${JSON.stringify(src)}: "${tint}",`)
    .join("\n");
  writeFileSync(
    OUT,
    `/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * Generated by scripts/image-sizes.mjs (bun run images:sizes). Do not edit.
 * Pixel sizes of the project images, so a lazy <img> reserves its box, and
 * the colour of each one's top row, which a device frame paints the strip
 * above the screenshot in so the two read as one screen.
 */

export const PROJECT_IMAGE_SIZES: Record<
  string,
  readonly [width: number, height: number]
> = {
${rows}
};

export const PROJECT_IMAGE_TINTS: Record<string, string> = {
${tintRows}
};
`,
  );
  console.log(
    `${OUT}: ${Object.keys(sizes).length} images, ${Object.keys(tints).length} tints`,
  );
}
