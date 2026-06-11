/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * Finds translation keys defined in locale files but not referenced in src/.
 * Run:  npx tsx scripts/find-unused-translations.ts
 * Fix:  npx tsx scripts/find-unused-translations.ts --fix
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { en } from "../src/lib/translations/en.ts";
import { de } from "../src/lib/translations/de.ts";
import { es } from "../src/lib/translations/es.ts";
import { ja } from "../src/lib/translations/ja.ts";
import { zh } from "../src/lib/translations/zh.ts";
import {
  MAIN_NAVIGATION,
  FOOTER_NAVIGATION,
} from "../src/config/navigation.ts";
import { PROJECTS } from "../src/config/projects.ts";
import { SKILL_GROUPS } from "../src/config/skills.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const LOCALES_DIR = path.join(SRC_DIR, "lib", "translations");

const COPYRIGHT = `/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */
`;

type JsonValue = string | string[] | JsonObject;
type JsonObject = { [key: string]: JsonValue };

const SERVICE_KEYS = [
  "fullstack",
  "frontend",
  "backend",
  "consulting",
] as const;
const CHIP_KEYS = [
  "onsite",
  "remote",
  "hybrid",
  "internship",
  "full_time",
  "part_time",
  "contract",
  "freelance",
] as const;
const CONTACT_VALIDATION_KEYS = [
  "nameRequired",
  "emailRequired",
  "emailInvalid",
  "subjectRequired",
  "messageRequired",
] as const;

function collectSourceFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "lib" && fullPath.includes(`${path.sep}lib`)) {
        const rel = path.relative(SRC_DIR, fullPath);
        if (rel === "lib") continue;
      }
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry.name)) {
      const rel = path.relative(SRC_DIR, fullPath);
      if (rel.startsWith(`lib${path.sep}translations`)) continue;
      files.push(fullPath);
    }
  }

  return files;
}

const METHOD_SUFFIXES = new Set([
  "map",
  "replace",
  "split",
  "join",
  "filter",
  "find",
  "slice",
  "trim",
  "toLowerCase",
  "toUpperCase",
  "includes",
  "startsWith",
  "endsWith",
]);

function normalizeMatchedPath(raw: string): string {
  const cleaned = raw.replace(/\?\./g, ".");
  const parts = cleaned.split(".");
  while (parts.length > 0 && METHOD_SUFFIXES.has(parts.at(-1)!)) {
    parts.pop();
  }
  return parts.join(".");
}

function addPath(used: Set<string>, pathValue: string) {
  const normalized = normalizeMatchedPath(pathValue);
  if (!normalized) return;
  used.add(normalized);
}

function collectUsedPaths(): Set<string> {
  const used = new Set<string>();
  const files = collectSourceFiles(SRC_DIR);
  const source = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");

  const staticPatterns = [
    /(?:\btranslations\[language\]|\bt)\??\.([a-zA-Z_$][\w$]*(?:\??\.[a-zA-Z_$][\w$]*)*)/g,
    /\(\s*t\.([a-zA-Z_$][\w$]*)\s+as\s+\{[^}]*\}\s*\)\.([a-zA-Z_$][\w$]*)/g,
    /const\s+t\s*=\s*translations\[language\]\.([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*)/g,
  ];

  for (const pattern of staticPatterns) {
    for (const match of source.matchAll(pattern)) {
      if (match[1] && match[2]) {
        addPath(used, `${match[1]}.${match[2]}`);
      } else if (match[1]) {
        const cleaned = match[1].replace(/\?\./g, ".");
        addPath(used, cleaned);
      }
    }
  }

  // Files that rebind `t` to a translation subtree (e.g. common.update).
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const rebind =
      /const\s+t\s*=\s*translations\[language\]\.([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*)/;
    const base = content.match(rebind)?.[1];
    if (!base) continue;

    for (const sub of content.matchAll(/\bt\.([a-zA-Z_$][\w$]*)/g)) {
      addPath(used, `${base}.${sub[1]}`);
    }
  }

  for (const item of [...MAIN_NAVIGATION, ...FOOTER_NAVIGATION]) {
    if (item.translationKey === "home") addPath(used, "common.home");
    else if (item.isFooter) addPath(used, `footer.${item.translationKey}`);
    else addPath(used, `nav.${item.translationKey}`);
  }

  for (const project of PROJECTS) {
    addPath(used, `projects.list.${project.i18nKey}.title`);
    addPath(used, `projects.list.${project.i18nKey}.description`);
  }

  for (const key of SERVICE_KEYS) {
    addPath(used, `services.services.${key}`);
  }

  for (const key of CHIP_KEYS) {
    addPath(used, `experience.chips.${key}`);
  }

  for (const group of SKILL_GROUPS) {
    addPath(used, `skills.groups.${group.id}`);
  }

  for (const key of CONTACT_VALIDATION_KEYS) {
    addPath(used, `contact.validation.${key}`);
  }

  addPath(used, "common.update");
  addPath(used, "services.badges.mostPopular");
  addPath(used, "services.contactTemplate");
  addPath(used, "skills.subtitle");

  return used;
}

function flattenLeaves(
  value: JsonValue,
  prefix = "",
): { path: string; isArray: boolean }[] {
  if (Array.isArray(value)) {
    return [{ path: prefix, isArray: true }];
  }

  if (typeof value === "string") {
    return [{ path: prefix, isArray: false }];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    flattenLeaves(child, prefix ? `${prefix}.${key}` : key),
  );
}

function isPathUsed(pathValue: string, used: Set<string>): boolean {
  if (used.has(pathValue)) return true;

  for (const candidate of used) {
    if (pathValue.startsWith(`${candidate}.`)) return true;
  }

  return false;
}

function findUnusedPaths(translation: JsonObject, used: Set<string>): string[] {
  const leaves = flattenLeaves(translation);
  return leaves
    .filter(({ path: leafPath }) => !isPathUsed(leafPath, used))
    .map(({ path: leafPath }) => leafPath)
    .sort();
}

function deletePath(obj: JsonObject, pathValue: string) {
  const parts = pathValue.split(".");
  let current: JsonObject = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const next = current[parts[i]];
    if (!next || typeof next === "string" || Array.isArray(next)) return;
    current = next;
  }

  delete current[parts.at(-1)!];
}

function pruneEmptyObjects(value: JsonValue): JsonValue | undefined {
  if (typeof value === "string" || Array.isArray(value)) return value;
  const prunedEntries = Object.entries(value)
    .map(([key, child]) => [key, pruneEmptyObjects(child)] as const)
    .filter(([, child]) => child !== undefined);

  if (prunedEntries.length === 0) return undefined;
  return Object.fromEntries(prunedEntries) as JsonObject;
}

function pruneTranslation(
  translation: JsonObject,
  unused: string[],
): JsonObject {
  const clone = structuredClone(translation) as JsonObject;
  for (const pathValue of unused.sort((a, b) => b.length - a.length)) {
    deletePath(clone, pathValue);
  }
  return pruneEmptyObjects(clone) as JsonObject;
}

function serializeValue(value: JsonValue, indent: number): string {
  const pad = "  ".repeat(indent);
  const inner = "  ".repeat(indent + 1);

  if (typeof value === "string") {
    if (value.includes("\n")) {
      return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    const items = value.map((item) => `${inner}${JSON.stringify(item)},`);
    return `[\n${items.join("\n")}\n${pad}]`;
  }

  const entries = Object.entries(value).map(([key, child]) => {
    const keyLabel = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
    return `${inner}${keyLabel}: ${serializeValue(child, indent + 1)},`;
  });

  return `{\n${entries.join("\n")}\n${pad}}`;
}

function writeLocaleFile(
  filePath: string,
  exportName: string,
  translation: JsonObject,
  suffix: string,
) {
  const body = serializeValue(translation, 0);
  const contents = `${COPYRIGHT}\nexport const ${exportName} = ${body}${suffix}\n`;
  fs.writeFileSync(filePath, contents.replace(/\r\n/g, "\n"), "utf8");
}

function main() {
  const fix = process.argv.includes("--fix");
  const used = collectUsedPaths();
  const unused = findUnusedPaths(en as JsonObject, used);

  console.log(`Used path prefixes: ${used.size}`);
  console.log(`Unused translation leaves: ${unused.length}`);

  if (unused.length > 0) {
    console.log("\nUnused keys:");
    for (const key of unused) console.log(`  - ${key}`);
  } else {
    console.log("\nNo unused translation keys found.");
    return;
  }

  if (!fix) {
    console.log("\nDry run only. Re-run with --fix to remove these keys.");
    return;
  }

  const locales = [
    {
      file: "en.ts",
      exportName: "en",
      data: en as JsonObject,
      suffix: ";\n\nexport type Translation = typeof en;",
    },
    {
      file: "de.ts",
      exportName: "de",
      data: de as JsonObject,
      suffix: " satisfies Translation;",
    },
    {
      file: "es.ts",
      exportName: "es",
      data: es as JsonObject,
      suffix: " satisfies Translation;",
    },
    {
      file: "ja.ts",
      exportName: "ja",
      data: ja as JsonObject,
      suffix: " satisfies Translation;",
    },
    {
      file: "zh.ts",
      exportName: "zh",
      data: zh as JsonObject,
      suffix: " satisfies Translation;",
    },
  ];

  for (const locale of locales) {
    const pruned = pruneTranslation(locale.data, unused);
    const importLine =
      locale.exportName === "en"
        ? ""
        : 'import type { Translation } from "./en";\n\n';
    const filePath = path.join(LOCALES_DIR, locale.file);
    const body = serializeValue(pruned, 0);
    const contents = `${COPYRIGHT}${importLine}export const ${locale.exportName} = ${body}${locale.suffix}\n`;
    fs.writeFileSync(filePath, contents.replace(/\r\n/g, "\n"), "utf8");
    console.log(`Updated ${locale.file}`);
  }
}

main();
