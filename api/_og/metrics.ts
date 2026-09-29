/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * What the card layout needs to know about a TrueType font, read straight
 * from its tables: advance widths to fit a line before Satori sets it, the
 * vertical metrics Satori places a line box with, and glyph boxes so type
 * aligns on its ink rather than its box. Satori sets a line from the hhea
 * ascender and descender with CSS half-leading, and advances without
 * kerning or with only a little, so a width summed here is what it draws,
 * give or take a pixel at the right edge.
 */

export interface GlyphBox {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

export interface FontMetrics {
  unitsPerEm: number;
  ascender: number;
  descender: number;
  capHeight: number;
  /** advance width of `text` in ems, `tracking` ems added after every glyph */
  width(text: string, tracking?: number): number;
  /** the ink box of one character's glyph, in font units */
  box(char: string): GlyphBox;
  /** whether the font draws every character of `text` */
  covers(text: string): boolean;
}

export function fontMetrics(data: Uint8Array): FontMetrics {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const u16 = (at: number) => view.getUint16(at);
  const i16 = (at: number) => view.getInt16(at);
  const u32 = (at: number) => view.getUint32(at);

  const tables = new Map<string, number>();
  for (let i = 0; i < u16(4); i++) {
    const at = 12 + 16 * i;
    const tag = String.fromCharCode(...data.subarray(at, at + 4));
    tables.set(tag, u32(at + 8));
  }
  const table = (tag: string) => {
    const at = tables.get(tag);
    if (at === undefined) throw new Error(`og: the font has no ${tag} table`);
    return at;
  };

  const head = table("head");
  const hhea = table("hhea");
  const hmtx = table("hmtx");
  const os2 = table("OS/2");
  const loca = table("loca");
  const glyf = table("glyf");
  const longLoca = i16(head + 50) === 1;
  const metricsCount = u16(hhea + 34);

  // cmap: the Windows Unicode BMP subtable (format 4)
  const cmap = table("cmap");
  let subtable = -1;
  for (let i = 0; i < u16(cmap + 2); i++) {
    const at = cmap + 4 + 8 * i;
    const offset = cmap + u32(at + 4);
    if (u16(at) === 3 && u16(at + 2) === 1 && u16(offset) === 4)
      subtable = offset;
  }
  if (subtable < 0) throw new Error("og: the font has no Unicode cmap");
  const segments = u16(subtable + 6) / 2;
  const ends = subtable + 14;
  const starts = ends + 2 * segments + 2;
  const deltas = starts + 2 * segments;
  const ranges = deltas + 2 * segments;

  const glyphOf = (code: number) => {
    for (let s = 0; s < segments; s++) {
      if (code > u16(ends + 2 * s)) continue;
      const start = u16(starts + 2 * s);
      if (code < start) return 0;
      const delta = i16(deltas + 2 * s);
      const range = u16(ranges + 2 * s);
      if (range === 0) return (code + delta) & 0xffff;
      const glyph = u16(ranges + 2 * s + range + 2 * (code - start));
      return glyph === 0 ? 0 : (glyph + delta) & 0xffff;
    }
    return 0;
  };
  const glyph = (char: string) => glyphOf(char.codePointAt(0) ?? 0);
  const advance = (id: number) =>
    u16(hmtx + 4 * Math.min(id, metricsCount - 1));

  const unitsPerEm = u16(head + 18);
  return {
    unitsPerEm,
    ascender: i16(hhea + 4),
    descender: i16(hhea + 6),
    capHeight: i16(os2 + 88),
    width(text, tracking = 0) {
      let units = 0;
      let count = 0;
      for (const char of text) {
        units += advance(glyph(char));
        count++;
      }
      return units / unitsPerEm + tracking * count;
    },
    box(char) {
      const id = glyph(char);
      const start = longLoca ? u32(loca + 4 * id) : 2 * u16(loca + 2 * id);
      const end = longLoca
        ? u32(loca + 4 * id + 4)
        : 2 * u16(loca + 2 * id + 2);
      if (end === start) return { xMin: 0, yMin: 0, xMax: 0, yMax: 0 };
      const at = glyf + start;
      return {
        xMin: i16(at + 2),
        yMin: i16(at + 4),
        xMax: i16(at + 6),
        yMax: i16(at + 8),
      };
    },
    covers(text) {
      return [...text].every((char) => glyph(char) !== 0);
    },
  };
}
