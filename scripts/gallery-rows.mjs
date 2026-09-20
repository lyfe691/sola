/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * The rows every <ProjectGallery> in a deep dive lays out, read from the MDX
 * rather than compiled. src/content/projects/galleries.test.ts asserts over them.
 */

import { readdirSync, readFileSync } from "node:fs";

const DIR = "src/content/projects";

/**
 * @returns {{ file: string, figures: { src: string, frame?: string }[] }[]}
 *   one entry per rendered row
 */
export function galleryRows(dir = DIR) {
  const rows = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
    const mdx = readFileSync(`${dir}/${file}`, "utf8");
    for (const [, block] of mdx.matchAll(/<ProjectGallery([\s\S]*?)\/>/g)) {
      const figures = [...block.matchAll(/\{[^{}]*\}/g)]
        .map(([entry]) => ({
          src: entry.match(/src:\s*"([^"]+)"/)?.[1],
          frame: entry.match(/frame:\s*"([^"]+)"/)?.[1],
        }))
        .filter((figure) => figure.src);
      const columns = Number(block.match(/columns=\{(\d)\}/)?.[1] ?? 2);
      for (let start = 0; start < figures.length; start += columns) {
        rows.push({ file, figures: figures.slice(start, start + columns) });
      }
    }
  }
  return rows;
}
