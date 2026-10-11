/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * Writes the heading face: Mona Sans cut to the one width the headings use.
 * Fontsource's files carry every width (75-125%), which makes the latin one
 * 98 KB; pinned to 112.5% and to the weights the site sets (500-800) it is
 * 37 KB. Outputs:
 *
 *   src/assets/fonts/sola-heading-{latin,latin-ext}-wght.woff2  the site
 *   api/_fonts/SolaHeading-Bold.ttf  the link-preview card titles: Satori
 *                                    takes static instances only
 *
 * Mona Sans's licence reserves its name for unmodified fonts, so a cut of it
 * goes by another one ("Sola Heading"); the copyright, trademark and licence
 * records stay as they are.
 *
 * Run `bun run fonts:heading` after updating @fontsource-variable/mona-sans.
 * Pinning lands on half font units, so advances can round one unit off the
 * stretched original: under half a pixel across a 64px title.
 */

import { readFileSync, writeFileSync } from "node:fs";
import subsetFont from "subset-font";

const FILES = "node_modules/@fontsource-variable/mona-sans/files";
const WIDTH = 112.5;
const WEIGHTS = { min: 500, max: 800 };
const NAME = { family: "Sola Heading", postscript: "SolaHeading" };

/** Records that must keep their text: copyright, trademark, licence. */
const KEPT = new Set([0, 7, 13, 14]);

const subset = (font, options) =>
  subsetFont(font, null, {
    keepAllGlyphs: true,
    preserveNameIds: [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 16, 17, 25],
    ...options,
  });

function tables(font) {
  const map = new Map();
  for (let i = 0; i < font.readUInt16BE(4); i += 1) {
    const at = 12 + 16 * i;
    const offset = font.readUInt32BE(at + 8);
    map.set(
      font.toString("latin1", at, at + 4),
      Buffer.from(font.subarray(offset, offset + font.readUInt32BE(at + 12))),
    );
  }
  return map;
}

const checksum = (data) => {
  const padded = Buffer.alloc((data.length + 3) & ~3);
  data.copy(padded);
  let sum = 0;
  for (let i = 0; i < padded.length; i += 4)
    sum = (sum + padded.readUInt32BE(i)) >>> 0;
  return sum;
};

function assemble(flavor, map) {
  const tags = [...map.keys()].sort();
  const selector = Math.floor(Math.log2(tags.length));
  const header = Buffer.alloc(12 + 16 * tags.length);
  header.writeUInt32BE(flavor, 0);
  header.writeUInt16BE(tags.length, 4);
  header.writeUInt16BE(2 ** selector * 16, 6);
  header.writeUInt16BE(selector, 8);
  header.writeUInt16BE(tags.length * 16 - 2 ** selector * 16, 10);
  map.get("head").writeUInt32BE(0, 8);
  const chunks = [header];
  let offset = header.length;
  let headAt = 0;
  tags.forEach((tag, i) => {
    const data = map.get(tag);
    const at = 12 + 16 * i;
    header.write(tag, at, "latin1");
    header.writeUInt32BE(checksum(data), at + 4);
    header.writeUInt32BE(offset, at + 8);
    header.writeUInt32BE(data.length, at + 12);
    if (tag === "head") headAt = offset;
    const padded = Buffer.alloc((data.length + 3) & ~3);
    data.copy(padded);
    chunks.push(padded);
    offset += padded.length;
  });
  const font = Buffer.concat(chunks);
  font.writeUInt32BE((0xb1b0afba - checksum(font)) >>> 0, headAt + 8);
  return font;
}

const utf16 = {
  decode: (bytes) => {
    let text = "";
    for (let i = 0; i + 1 < bytes.length; i += 2)
      text += String.fromCharCode(bytes.readUInt16BE(i));
    return text;
  },
  encode: (text) => {
    const bytes = Buffer.alloc(text.length * 2);
    for (let i = 0; i < text.length; i += 1)
      bytes.writeUInt16BE(text.charCodeAt(i), 2 * i);
    return bytes;
  },
};

/** Every name record but the kept ones, renamed; `set` replaces whole records. */
function renamed(nameTable, set = {}) {
  const strings = nameTable.readUInt16BE(4);
  const records = [];
  for (let i = 0; i < nameTable.readUInt16BE(2); i += 1) {
    const at = 6 + 12 * i;
    const id = nameTable.readUInt16BE(at + 6);
    const start = strings + nameTable.readUInt16BE(at + 10);
    let bytes = nameTable.subarray(
      start,
      start + nameTable.readUInt16BE(at + 8),
    );
    const unicode = nameTable.readUInt16BE(at) !== 1;
    if (id in set && unicode) bytes = utf16.encode(set[id]);
    else if (!KEPT.has(id) && unicode)
      bytes = utf16.encode(
        utf16
          .decode(bytes)
          .replaceAll("Mona Sans", NAME.family)
          .replaceAll("MonaSans", NAME.postscript),
      );
    else if (!KEPT.has(id)) continue; // Mac Roman duplicates: dropped
    records.push({
      head: nameTable.subarray(at, at + 6),
      id,
      bytes,
    });
  }
  const header = Buffer.alloc(6 + 12 * records.length);
  header.writeUInt16BE(records.length, 2);
  header.writeUInt16BE(header.length, 4);
  let offset = 0;
  records.forEach(({ head, id, bytes }, i) => {
    const at = 6 + 12 * i;
    head.copy(header, at);
    header.writeUInt16BE(id, at + 6);
    header.writeUInt16BE(bytes.length, at + 8);
    header.writeUInt16BE(offset, at + 10);
    offset += bytes.length;
  });
  return Buffer.concat([header, ...records.map((record) => record.bytes)]);
}

function rename(font, set) {
  const map = tables(font);
  map.set("name", renamed(map.get("name"), set));
  return { map, flavor: font.readUInt32BE(0) };
}

for (const range of ["latin", "latin-ext"]) {
  const source = readFileSync(`${FILES}/mona-sans-${range}-wdth-normal.woff2`);
  const pinned = await subset(source, {
    targetFormat: "truetype",
    variationAxes: { wdth: WIDTH, wght: WEIGHTS },
  });
  const { map, flavor } = rename(pinned, {
    1: NAME.family,
    2: "Regular",
    4: NAME.family,
    6: NAME.postscript,
  });
  const out = `src/assets/fonts/sola-heading-${range}-wght.woff2`;
  writeFileSync(
    out,
    await subset(assemble(flavor, map), { targetFormat: "woff2" }),
  );
  console.log(out, readFileSync(out).length, "bytes");
}

const bold = await subset(
  readFileSync(`${FILES}/mona-sans-latin-wdth-normal.woff2`),
  { targetFormat: "truetype", variationAxes: { wdth: WIDTH, wght: 700 } },
);
const { map, flavor } = rename(bold, {
  1: NAME.family,
  2: "Bold",
  4: `${NAME.family} Bold`,
  6: `${NAME.postscript}-Bold`,
  16: NAME.family,
  17: "Bold",
});
const os2 = map.get("OS/2");
os2.writeUInt16BE(700, 4); // usWeightClass
os2.writeUInt16BE(6, 6); // usWidthClass: semi-expanded
os2.writeUInt16BE((os2.readUInt16BE(62) & ~0b1100001) | 0b100000, 62); // bold
const head = map.get("head");
head.writeUInt16BE(head.readUInt16BE(44) | 1, 44); // macStyle bold
const ttf = "api/_fonts/SolaHeading-Bold.ttf";
writeFileSync(ttf, assemble(flavor, map));
console.log(ttf, readFileSync(ttf).length, "bytes");
