/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { headingSlugs } from "./deep-dive-index.ts";
import {
  CONTENT_DIR,
  compareTranslation,
  remarkSourceHeadingIds,
  sourceHash,
  stamp,
  stampOf,
  strayTranslations,
  translationStatus,
} from "./deep-dive-i18n.ts";

const ENGLISH = [
  "# A headline",
  "",
  "Run `magi --udp` or see [the docs](https://example.com).",
  "",
  "<ProjectImage",
  '  src="/projects/x/a.webp"',
  '  alt="A view of the thing"',
  '  caption="The thing."',
  "/>",
  "",
  "## First part",
  "",
  "| Flag | Default |",
  "| ---- | ------- |",
  "| `-p` | 1-1024  |",
  "",
  "<CodeBlock",
  "  code={`let a = 1;`}",
  '  lang="rust"',
  "/>",
  "",
  "### A detail",
  "",
  "```bash",
  "magi 10.0.0.5",
  "```",
].join("\n");

const GERMAN = stamp(
  [
    "# Eine Überschrift",
    "",
    "Führen Sie `magi --udp` aus oder lesen Sie [die Doku](https://example.com).",
    "",
    "<ProjectImage",
    '  src="/projects/x/a.webp"',
    '  alt="Eine Ansicht des Dings"',
    '  caption="Das Ding."',
    "/>",
    "",
    "## Erster Teil",
    "",
    "| Flag | Standard |",
    "| ---- | -------- |",
    "| `-p` | 1-1024   |",
    "",
    "<CodeBlock",
    "  code={`let a = 1;`}",
    '  lang="rust"',
    "/>",
    "",
    "### Ein Detail",
    "",
    "```bash",
    "magi 10.0.0.5",
    "```",
  ].join("\n"),
  ENGLISH,
);

describe("stamp", () => {
  it("records the English file's hash, and moves with it", () => {
    expect(stampOf(GERMAN)).toBe(sourceHash(ENGLISH));
    expect(
      GERMAN.startsWith(`export const source = "${sourceHash(ENGLISH)}";\n\n#`),
    ).toBe(true);
    const restamped = stamp(GERMAN, `${ENGLISH}\n\nMore.`);
    expect(stampOf(restamped)).not.toBe(sourceHash(ENGLISH));
    expect(restamped.match(/export const source/g)).toHaveLength(1);
  });

  it("reads line endings the same on every machine", () => {
    expect(sourceHash(ENGLISH.replace(/\n/g, "\r\n"))).toBe(
      sourceHash(ENGLISH),
    );
  });
});

describe("compareTranslation", () => {
  it("accepts translated prose, headings, cells, alt text and captions", () => {
    expect(compareTranslation(ENGLISH, GERMAN)).toEqual([]);
  });

  const broken = (from: string, to: string) =>
    compareTranslation(ENGLISH, GERMAN.replace(from, to));

  it.each([
    ["code changed", "let a = 1;", "let a = 2;"],
    ["an image swapped", "/projects/x/a.webp", "/projects/x/b.webp"],
    ["a fenced block translated", "magi 10.0.0.5", "magi 10.0.0.6"],
    ["a heading level changed", "### Ein Detail", "## Ein Detail"],
    ["a table row dropped", "| `-p` | 1-1024   |\n", ""],
    ["a link retargeted", "(https://example.com)", "(https://example.org)"],
    ["inline code translated", "`magi --udp`", "`magi --udp-modus`"],
  ])("rejects %s", (_, from, to) => {
    expect(broken(from, to)).not.toEqual([]);
  });

  it("rejects a file without its stamp", () => {
    expect(
      compareTranslation(
        ENGLISH,
        GERMAN.replace(/^export const source.*\n\n/, ""),
      ),
    ).toContain("no `export const source` stamp");
  });
});

describe("remarkSourceHeadingIds", () => {
  const tree = (depths: number[]) => ({
    type: "root",
    children: depths.map((depth) => ({ type: "heading", depth, children: [] })),
  });
  const ids = (root: ReturnType<typeof tree>) =>
    root.children.map(
      (node) =>
        (node as { data?: { hProperties?: { id?: string } } }).data?.hProperties
          ?.id,
    );
  const english = fs.readFileSync(
    path.join(CONTENT_DIR, "fleetmap.mdx"),
    "utf8",
  );
  const slugs = headingSlugs(english);
  const depths = [...english.matchAll(/^(#{1,3})\s/gm)].map((m) => m[1].length);

  it("gives a translation's headings the English anchors by position", () => {
    const root = tree(depths);
    remarkSourceHeadingIds()(root, {
      path: path.join(CONTENT_DIR, "de", "fleetmap.mdx"),
    });
    expect(ids(root)).toEqual(slugs);
    expect(slugs).toContain("replaying-a-day");
  });

  it("leaves English files, and headings that don't line up, alone", () => {
    const own = tree(depths);
    remarkSourceHeadingIds()(own, {
      path: path.join(CONTENT_DIR, "fleetmap.mdx"),
    });
    expect(ids(own).every((id) => id === undefined)).toBe(true);
    const short = tree(depths.slice(1));
    remarkSourceHeadingIds()(short, {
      path: path.join(CONTENT_DIR, "de", "fleetmap.mdx"),
    });
    expect(ids(short).every((id) => id === undefined)).toBe(true);
  });
});

describe("translationStatus", () => {
  it("tells current, outdated, missing and broken translations apart", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "deep-dive-i18n-"));
    try {
      fs.writeFileSync(path.join(dir, "x.mdx"), ENGLISH);
      fs.mkdirSync(path.join(dir, "de"));
      fs.mkdirSync(path.join(dir, "es"));
      fs.mkdirSync(path.join(dir, "ja"));
      fs.writeFileSync(path.join(dir, "de", "x.mdx"), GERMAN);
      fs.writeFileSync(
        path.join(dir, "es", "x.mdx"),
        stamp(GERMAN, `${ENGLISH} `),
      );
      fs.writeFileSync(
        path.join(dir, "ja", "x.mdx"),
        GERMAN.replace("let a = 1;", "let a = 2;"),
      );
      const state = (language: string) =>
        translationStatus(dir).find((s) => s.language === language)?.state;
      expect(state("de")).toBe("current");
      expect(state("es")).toBe("stale");
      expect(state("ja")).toBe("invalid");
      expect(state("ko")).toBe("missing");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("the site's translations", () => {
  it("are all servable or honestly outdated, never broken", () => {
    const invalid = translationStatus().filter((s) => s.state === "invalid");
    expect(
      invalid.map((s) => `${s.language}/${s.name}: ${s.problems.join("; ")}`),
    ).toEqual([]);
  });

  it("each translate a deep dive the site has, into a language it speaks", () => {
    expect(strayTranslations()).toEqual([]);
  });
});
