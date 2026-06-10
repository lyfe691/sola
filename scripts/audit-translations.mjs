// Translation parity audit: key sets, types, interpolation tokens, embedded
// links, empty strings, possibly-untranslated values. Run: node scripts/audit-translations.mjs
// (imports locale files directly because index.ts uses the @ path alias)
import { en } from "../src/lib/translations/en.ts";
import { de } from "../src/lib/translations/de.ts";
import { es } from "../src/lib/translations/es.ts";
import { ja } from "../src/lib/translations/ja.ts";
import { zh } from "../src/lib/translations/zh.ts";

const translations = { en, de, es, ja, zh };

const locales = Object.keys(translations);
const BASE = "en";

function walk(obj, prefix = "", out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) {
      out.set(path, { type: "array", value: v });
    } else if (v !== null && typeof v === "object") {
      walk(v, path, out);
    } else {
      out.set(path, { type: typeof v, value: v });
    }
  }
  return out;
}

const maps = Object.fromEntries(locales.map((l) => [l, walk(translations[l])]));
const base = maps[BASE];

const report = {
  missing: {},
  extra: {},
  typeMismatch: [],
  arrayLenMismatch: [],
  tokenMismatch: [],
  linkMismatch: [],
  empty: [],
  identicalToEn: {},
};

const tokensOf = (s) =>
  [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const linksOf = (s) =>
  [...String(s).matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((m) => m[2]).sort();

for (const l of locales) {
  if (l === BASE) continue;
  const m = maps[l];
  report.missing[l] = [...base.keys()].filter((k) => !m.has(k));
  report.extra[l] = [...m.keys()].filter((k) => !base.has(k));
  report.identicalToEn[l] = [];
  for (const [k, { type, value }] of m) {
    if (!base.has(k)) continue;
    const b = base.get(k);
    if (b.type !== type) {
      report.typeMismatch.push(`${l}:${k} (${b.type} vs ${type})`);
      continue;
    }
    if (type === "array") {
      if (b.value.length !== value.length)
        report.arrayLenMismatch.push(
          `${l}:${k} (en=${b.value.length}, ${l}=${value.length})`,
        );
      continue;
    }
    if (type === "string") {
      const bt = tokensOf(b.value).join(",");
      const lt = tokensOf(value).join(",");
      if (bt !== lt)
        report.tokenMismatch.push(`${l}:${k} (en={${bt}} vs ${l}={${lt}})`);
      const bl = linksOf(b.value).join(" | ");
      const ll = linksOf(value).join(" | ");
      if (bl !== ll)
        report.linkMismatch.push(
          `${l}:${k}\n    en: ${bl || "(none)"}\n    ${l}: ${ll || "(none)"}`,
        );
      if (String(value).trim() === "") report.empty.push(`${l}:${k}`);
      if (value === b.value && String(value).length > 3)
        report.identicalToEn[l].push(
          `${k} = ${JSON.stringify(value).slice(0, 80)}`,
        );
    }
  }
}

// empty strings in base too
for (const [k, { type, value }] of base) {
  if (type === "string" && String(value).trim() === "")
    report.empty.push(`${BASE}:${k}`);
}

console.log(`Locales: ${locales.join(", ")}`);
console.log(
  `Leaf entries per locale: ${locales.map((l) => `${l}=${maps[l].size}`).join(", ")}\n`,
);

const section = (title, items) => {
  console.log(`## ${title} (${items.length})`);
  for (const i of items) console.log("  - " + i);
  console.log("");
};

for (const l of locales) {
  if (l === BASE) continue;
  section(`Missing keys in ${l} (present in en)`, report.missing[l]);
  section(`Extra keys in ${l} (absent in en)`, report.extra[l]);
}
section("Type mismatches", report.typeMismatch);
section("Array length mismatches", report.arrayLenMismatch);
section("Interpolation token mismatches", report.tokenMismatch);
section("Embedded link URL mismatches", report.linkMismatch);
section("Empty strings", report.empty);
for (const l of locales) {
  if (l === BASE) continue;
  section(
    `Identical to en in ${l} (possibly untranslated)`,
    report.identicalToEn[l],
  );
}
