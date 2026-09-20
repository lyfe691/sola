/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * Reads the rows every <ProjectGallery> in a deep dive lays out. The row
 * layout is a function of the image sources and the column count, so those
 * are all the rule needs — no MDX has to be compiled to check it.
 *
 * src/content/projects/galleries.test.ts asserts the geometry over these.
 */

import { readdirSync, readFileSync } from "node:fs";

const DIR = "src/content/projects";

/** @returns {{ file: string, srcs: string[] }[]} one entry per rendered row */
export function galleryRows(dir = DIR) {
  const rows = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
    const mdx = readFileSync(`${dir}/${file}`, "utf8");
    for (const [, block] of mdx.matchAll(/<ProjectGallery([\s\S]*?)\/>/g)) {
      const srcs = [...block.matchAll(/src:\s*"([^"]+)"/g)].map(([, s]) => s);
      const columns = Number(block.match(/columns=\{(\d)\}/)?.[1] ?? 2);
      for (let start = 0; start < srcs.length; start += columns) {
        rows.push({ file, srcs: srcs.slice(start, start + columns) });
      }
    }
  }
  return rows;
}
