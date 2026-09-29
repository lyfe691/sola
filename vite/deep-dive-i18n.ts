/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Translated deep dives. English is the source (src/content/projects/
 * <slug>.mdx); a translation is src/content/projects/<lang>/<slug>.mdx and
 * opens with `export const source = "<hash>"`, the hash of the English file
 * it was translated from.
 *
 * A translation is served only while it is current: its hash matches the
 * English file and its skeleton (components, images, code, headings,
 * tables, links, inline code) matches the English one. Otherwise the page
 * shows English with a note, so a reader never gets a translation that says
 * something the English no longer does. Headings take the English heading's
 * anchor by position, so a section has one link in every language.
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import { LANGUAGES } from "../src/config/languages.ts";
import { extractSections, headingSlugs, jsxEnd } from "./deep-dive-index.ts";

export const CONTENT_DIR = path.resolve("src/content/projects");

/** every language but English, which is the source */
export const TRANSLATED = LANGUAGES.map(({ code }) => code).filter(
  (code) => code !== "en",
);

// [ \t], not \s: the blank line after the stamp must survive a restamp, or
// MDX reads the heading below as part of the export
const STAMP = /^export const source = "([0-9a-f]{12})";?[ \t]*$/m;

/** The English file's hash, which a translation made from it records. */
export const sourceHash = (english: string): string =>
  createHash("sha256")
    .update(english.replace(/\r\n/g, "\n"))
    .digest("hex")
    .slice(0, 12);

export const stampOf = (translation: string): string | null =>
  STAMP.exec(translation)?.[1] ?? null;

/** The translation with its stamp set to the English file's current hash. */
export function stamp(translation: string, english: string): string {
  const line = `export const source = "${sourceHash(english)}";`;
  return STAMP.test(translation)
    ? translation.replace(STAMP, line)
    : `${line}\n\n${translation.replace(/^\s+/, "")}`;
}

/** What a translation must keep of its English file, part by part. */
export interface Skeleton {
  headings: number[];
  /** each component's source without its alt and caption text */
  components: string[];
  /** fenced blocks, as written */
  fences: string[];
  /** rows x columns of each table */
  tables: string[];
  links: string[];
  inlineCode: string[];
}

const TRANSLATABLE_PROP = /\b(alt|caption)\s*[=:]\s*"(?:\\.|[^"\\])*"/g;

export function skeleton(source: string): Skeleton {
  const lines = source.split(/\r?\n/);
  const parts: Skeleton = {
    headings: [],
    components: [],
    fences: [],
    tables: [],
    links: [],
    inlineCode: [],
  };
  let table: string[] = [];
  const endTable = () => {
    if (!table.length) return;
    const rows = table.filter((row) => !/^\s*\|?\s*:?-{3,}/.test(row));
    const cols = table[0].replace(/^\s*\||\|\s*$/g, "").split("|").length;
    parts.tables.push(`${rows.length}x${cols}`);
    table = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!/^\s*\|/.test(line)) endTable();
    const fence = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fence) {
      const block = [line];
      while (i + 1 < lines.length) {
        block.push(lines[++i]);
        if (lines[i].trim().startsWith(fence[1])) break;
      }
      parts.fences.push(block.join("\n"));
      continue;
    }
    if (/^(import|export)\s/.test(line)) continue;
    if (/^\s*<[A-Z]/.test(line)) {
      const end = jsxEnd(lines, i);
      let block = lines.slice(i, end + 1).join("\n");
      // a CodeBlock's code counts byte for byte, whitespace included; the
      // rest of a component only by its tokens
      const open = block.indexOf("code={`");
      if (open >= 0) {
        let close = open + 7;
        while (close < block.length && block[close] !== "`")
          close += block[close] === "\\" ? 2 : 1;
        parts.fences.push(block.slice(open, close + 1));
        block = `${block.slice(0, open)}code${block.slice(close + 1)}`;
      }
      parts.components.push(
        block.replace(TRANSLATABLE_PROP, "$1").replace(/\s+/g, " "),
      );
      i = end;
      continue;
    }
    const heading = /^(#{1,6})\s/.exec(line);
    if (heading) parts.headings.push(heading[1].length);
    if (/^\s*\|/.test(line)) table.push(line);
    for (const [, url] of line.matchAll(/\]\(([^)\s]+)\)/g))
      parts.links.push(url);
    for (const [, code] of line.matchAll(/`([^`\n]+)`/g))
      parts.inlineCode.push(code);
  }
  endTable();
  parts.links.sort();
  parts.inlineCode.sort();
  return parts;
}

/** Where a translation's skeleton departs from its English file's. */
export function compareTranslation(english: string, translation: string) {
  const a = skeleton(english);
  const b = skeleton(translation);
  const problems: string[] = [];
  const same = (x: unknown[], y: unknown[]) =>
    JSON.stringify(x) === JSON.stringify(y);
  if (!same(a.headings, b.headings))
    problems.push(
      `headings: ${a.headings.join(",")} in English, ${b.headings.join(",")} here`,
    );
  a.components.forEach((component, i) => {
    if (component !== b.components[i])
      problems.push(`component ${i + 1} differs from the English one`);
  });
  if (b.components.length !== a.components.length)
    problems.push(
      `${b.components.length} components, the English has ${a.components.length}`,
    );
  if (!same(a.fences, b.fences))
    problems.push("a fenced code block differs from the English one");
  if (!same(a.tables, b.tables))
    problems.push(
      `tables: ${a.tables.join(", ")} in English, ${b.tables.join(", ")} here`,
    );
  if (!same(a.links, b.links))
    problems.push("its links are not the English file's links");
  if (!same(a.inlineCode, b.inlineCode))
    problems.push("its inline code is not the English file's");
  if (!stampOf(translation)) problems.push("no `export const source` stamp");
  else if (
    !/^export const source = "[0-9a-f]{12}";?[ \t]*\r?\n[ \t]*\r?\n/.test(
      translation,
    )
  )
    problems.push(
      "the stamp must be the first line, with a blank line after it (MDX reads the next line as part of the export)",
    );
  return problems;
}

export type TranslationState = "current" | "stale" | "missing" | "invalid";

export interface TranslationStatus {
  language: string;
  /** the English file's name, without .mdx */
  name: string;
  state: TranslationState;
  problems: string[];
}

const englishNames = (dir: string) =>
  fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -4))
    .sort();

export const translationFile = (
  language: string,
  name: string,
  dir = CONTENT_DIR,
) => path.join(dir, language, `${name}.mdx`);

/** Every English deep dive in every other language, and where it stands. */
export function translationStatus(dir = CONTENT_DIR): TranslationStatus[] {
  const statuses: TranslationStatus[] = [];
  for (const name of englishNames(dir)) {
    const english = fs.readFileSync(path.join(dir, `${name}.mdx`), "utf8");
    const hash = sourceHash(english);
    for (const language of TRANSLATED) {
      const file = translationFile(language, name, dir);
      if (!fs.existsSync(file)) {
        statuses.push({ language, name, state: "missing", problems: [] });
        continue;
      }
      const translation = fs.readFileSync(file, "utf8");
      if (stampOf(translation) !== hash) {
        statuses.push({ language, name, state: "stale", problems: [] });
        continue;
      }
      const problems = compareTranslation(english, translation);
      statuses.push({
        language,
        name,
        state: problems.length ? "invalid" : "current",
        problems,
      });
    }
  }
  return statuses;
}

/** Files under a language folder that translate no English deep dive. */
export function strayTranslations(dir = CONTENT_DIR): string[] {
  const names = new Set(englishNames(dir));
  const stray: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    for (const file of fs.readdirSync(path.join(dir, entry.name))) {
      const known =
        TRANSLATED.includes(entry.name as (typeof TRANSLATED)[number]) &&
        file.endsWith(".mdx") &&
        names.has(file.slice(0, -4));
      if (!known) stray.push(`${entry.name}/${file}`);
    }
  }
  return stray;
}

/** A translation's own path within the content folder, or null. */
function translationOf(file: string, dir = CONTENT_DIR) {
  const rel = path.relative(dir, file).split(path.sep);
  if (rel.length !== 2 || !rel[1].endsWith(".mdx")) return null;
  return { language: rel[0], name: rel[1].slice(0, -4) };
}

interface HeadingNode {
  type: string;
  depth?: number;
  data?: { hProperties?: Record<string, unknown> };
  children?: HeadingNode[];
}

/**
 * Remark plugin: a translation's h1–h3 take the English file's anchors by
 * position. When its headings don't line up with the English ones it leaves
 * them alone; that translation is invalid and not served anyway.
 */
export function remarkSourceHeadingIds() {
  return (tree: HeadingNode, file: { path?: string }) => {
    const own = file.path ? translationOf(file.path) : null;
    if (!own) return;
    const englishFile = path.join(CONTENT_DIR, `${own.name}.mdx`);
    if (!fs.existsSync(englishFile)) return;
    const ids = headingSlugs(fs.readFileSync(englishFile, "utf8"));
    const headings: HeadingNode[] = [];
    const walk = (node: HeadingNode) => {
      if (node.type === "heading" && (node.depth ?? 0) <= 3)
        headings.push(node);
      node.children?.forEach(walk);
    };
    walk(tree);
    if (headings.length !== ids.length) return;
    headings.forEach((heading, i) => {
      const id = ids[i];
      if (!id) return;
      heading.data ??= {};
      heading.data.hProperties = { ...heading.data.hProperties, id };
    });
  };
}

const CURRENT_ID = "virtual:deep-dive-translations";
const INDEX_ID = "virtual:deep-dive-index/";

/**
 * `virtual:deep-dive-translations`: the translations the site may serve,
 * `{ [language]: [name, …] }`. `virtual:deep-dive-index/<language>`: the
 * search index of those translations, sections keyed by the English
 * anchors, loaded only in that language.
 */
export function deepDiveTranslations(): Plugin {
  const current = () => {
    const served: Record<string, string[]> = {};
    for (const status of translationStatus())
      if (status.state === "current")
        (served[status.language] ??= []).push(status.name);
    return served;
  };

  return {
    name: "deep-dive-translations",
    configureServer(dev: ViteDevServer) {
      // an edit that changes which translations may be served (one added,
      // or outdated by an English edit) reloads; any other MDX edit stays a
      // hot update
      let served = JSON.stringify(current());
      const refresh = (file: string) => {
        if (!file.startsWith(CONTENT_DIR) || !file.endsWith(".mdx")) return;
        const next = JSON.stringify(current());
        if (next === served) return;
        served = next;
        for (const [id, module] of dev.moduleGraph.idToModuleMap)
          if (
            id.startsWith(`\0${CURRENT_ID}`) ||
            id.startsWith(`\0${INDEX_ID}`)
          )
            dev.moduleGraph.invalidateModule(module);
        dev.ws.send({ type: "full-reload" });
      };
      dev.watcher.on("add", refresh);
      dev.watcher.on("change", refresh);
      dev.watcher.on("unlink", refresh);
    },
    resolveId(id) {
      return id === CURRENT_ID || id.startsWith(INDEX_ID)
        ? `\0${id}`
        : undefined;
    },
    load(id) {
      if (id === `\0${CURRENT_ID}`)
        return `export default ${JSON.stringify(current())};`;
      if (!id.startsWith(`\0${INDEX_ID}`)) return undefined;
      const language = id.slice(`\0${INDEX_ID}`.length);
      const index: Record<string, ReturnType<typeof extractSections>> = {};
      for (const name of current()[language] ?? []) {
        const english = fs.readFileSync(
          path.join(CONTENT_DIR, `${name}.mdx`),
          "utf8",
        );
        index[name] = extractSections(
          fs.readFileSync(translationFile(language, name), "utf8"),
          headingSlugs(english),
        );
      }
      return `export default ${JSON.stringify(index)};`;
    },
  };
}
