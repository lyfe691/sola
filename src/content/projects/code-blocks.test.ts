/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { HIGHLIGHT_SPEC, linesIn } from "../../components/mdx/code-lines";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const LANGS = ["de", "es", "ja", "ko", "zh"];

type Block = { file: string; lines: number; highlight: string };

/** every CodeBlock with a highlight, in English and every translation,
 *  with its code's line count as the page shows it */
function highlightedBlocks(): Block[] {
  const files = [
    ...readdirSync(ROOT).filter((f) => f.endsWith(".mdx")),
    ...LANGS.flatMap((lang) =>
      readdirSync(join(ROOT, lang))
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => `${lang}/${f}`),
    ),
  ];
  return files.flatMap((file) => {
    const source = readFileSync(join(ROOT, file), "utf8");
    const blocks: Block[] = [];
    for (const match of source.matchAll(/<CodeBlock\b/g)) {
      const open = source.indexOf("code={`", match.index);
      let close = open + 7;
      while (close < source.length && source[close] !== "`")
        close += source[close] === "\\" ? 2 : 1;
      const tail = source.slice(close, source.indexOf("/>", close));
      const highlight = /\bhighlight="([^"]*)"/.exec(tail)?.[1];
      if (highlight === undefined) continue;
      const code = source.slice(open + 7, close).replace(/\n+$/, "");
      blocks.push({ file, lines: code.split("\n").length, highlight });
    }
    return blocks;
  });
}

describe("deep-dive code blocks", () => {
  it("finds highlights to check", () => {
    expect(highlightedBlocks().length).toBeGreaterThan(0);
  });

  // a typo would highlight nothing, or a line past the end, without a sound
  it("highlights only lines the block has", () => {
    const wrong = highlightedBlocks().filter(
      ({ lines, highlight }) =>
        !HIGHLIGHT_SPEC.test(highlight) ||
        highlight.split(",").some((part) => {
          const [from, to = from] = part.split("-").map(Number);
          return from < 1 || to < from || to > lines;
        }) ||
        linesIn(highlight).size === 0,
    );
    expect(wrong).toEqual([]);
  });
});
