/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * `virtual:deep-dive-index`: the text of every deep dive, split at its
 * headings, for the site search. Read from the MDX at build time so the
 * index can't drift from the pages; the search's own chunk carries it.
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import type { DeepDiveSection } from "../src/lib/search/types.ts";
import { slugify } from "../src/lib/slug.ts";

const INDEX_ID = "virtual:deep-dive-index";
const CONTENT_DIR = fileURLToPath(
  new URL("../src/content/projects", import.meta.url),
);

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

/** Markdown inline syntax down to the words a reader sees. */
export const inlineText = (line: string): string =>
  line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[^\p{L}\p{N}*])\*([^*\n]+)\*(?![\p{L}\p{N}])/gu, "$1$2")
    .replace(/(^|[^\p{L}\p{N}_])_([^_\n]+)_(?![\p{L}\p{N}])/gu, "$1$2")
    .replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity] ?? " ")
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/, "")
    .replace(/^\s*>\s?/, "")
    .replace(/\s*\|\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Where a self-closing JSX element that opens on line `start` ends, reading
 * past quoted and template-literal attributes (a CodeBlock's code can hold
 * `/>` of its own).
 */
const jsxEnd = (lines: string[], start: number): number => {
  let quote: string | null = null;
  let depth = 0;
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (quote) {
        if (ch === "\\") c++;
        else if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'" || ch === "`") quote = ch;
      else if (ch === "{") depth++;
      else if (ch === "}") depth--;
      else if (ch === "/" && line[c + 1] === ">" && depth === 0) return i;
    }
  }
  return lines.length - 1;
};

const CAPTION = /\bcaption\s*[=:]\s*(["'])((?:\\.|(?!\1).)*)\1/g;

/** A deep dive's MDX as one section per heading. */
export function extractSections(source: string): DeepDiveSection[] {
  const lines = source.split(/\r?\n/);
  const sections: DeepDiveSection[] = [];
  let current: (DeepDiveSection & { parts: string[] }) | null = null;
  let parent: string | undefined;

  const close = () => {
    if (!current) return;
    const { parts, ...section } = current;
    sections.push({ ...section, text: parts.join(" ").trim() });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      while (i + 1 < lines.length && !/^\s*```/.test(lines[i + 1])) i++;
      i++;
      continue;
    }
    if (/^(import|export)\s/.test(line)) continue;
    if (/^\s*<[A-Z]/.test(line)) {
      const end = jsxEnd(lines, i);
      const block = lines.slice(i, end + 1).join("\n");
      for (const [, , caption] of block.matchAll(CAPTION)) {
        current?.parts.push(inlineText(caption));
      }
      i = end;
      continue;
    }
    const heading = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading) {
      const text = inlineText(heading[2]);
      const id = slugify(text);
      if (!id) continue;
      close();
      const level = heading[1].length;
      if (level < 3) parent = text;
      current = {
        id,
        heading: text,
        parent: level === 3 ? parent : undefined,
        text: "",
        parts: [],
      };
      continue;
    }
    if (/^\s*\|?\s*:?-{3,}/.test(line)) continue;
    const text = inlineText(line);
    if (text) current?.parts.push(text);
  }
  close();
  return sections;
}

export function deepDiveIndexPlugin(): Plugin {
  const resolved = `\0${INDEX_ID}`;

  return {
    name: "deep-dive-index",
    resolveId(id) {
      return id === INDEX_ID ? resolved : undefined;
    },
    async load(id) {
      if (id !== resolved) return undefined;
      const files = (await readdir(CONTENT_DIR)).filter((file) =>
        file.endsWith(".mdx"),
      );
      const index: Record<string, DeepDiveSection[]> = {};
      for (const file of files.sort()) {
        const full = path.join(CONTENT_DIR, file);
        this.addWatchFile(full);
        index[file.replace(/\.mdx$/, "")] = extractSections(
          await readFile(full, "utf8"),
        );
      }
      return `export default ${JSON.stringify(index)};`;
    },
  };
}
