// Usage audit: find translation leaves not statically referenced in src.
// Heuristic — verify hits by hand (dynamic access like t.x[key] shows up as
// "partial" or "weak"). Run: node scripts/audit-usage.mjs
import { en } from "../src/lib/translations/en.ts";

const translations = { en };
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(obj, prefix = "", out = []) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) out.push(path);
    else if (v !== null && typeof v === "object") walk(v, path, out);
    else out.push(path);
  }
  return out;
}

const leaves = walk(translations.en);

function files(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) files(p, out);
    else if (
      /\.(tsx?|mdx?)$/.test(e) &&
      !p.replace(/\\/g, "/").includes("lib/translations/")
    )
      out.push(p);
  }
  return out;
}

const corpus = files("src").map((f) => ({ f, c: readFileSync(f, "utf8") }));

const results = [];
for (const leaf of leaves) {
  const segs = leaf.split(".");
  let level = 0; // how many trailing segments matched contiguously
  for (let n = segs.length; n >= 2; n--) {
    const needle = segs.slice(segs.length - n).join(".");
    if (corpus.some(({ c }) => c.includes(needle))) {
      level = n;
      break;
    }
  }
  if (level === 0) {
    // check bare key as property access / bracket access
    const last = segs[segs.length - 1];
    const re = new RegExp(`[.?\\[]\\s*["']?${last}\\b`);
    const bare = corpus.some(({ c }) => re.test(c));
    results.push({
      leaf,
      status: bare ? "WEAK (only bare key found)" : "UNREFERENCED",
    });
  } else if (level < segs.length) {
    results.push({ leaf, status: `partial (matched last ${level} segs)` });
  }
}

const unref = results.filter((r) => r.status === "UNREFERENCED");
const weak = results.filter((r) => r.status.startsWith("WEAK"));
const partial = results.filter((r) => r.status.startsWith("partial"));

console.log(`Total leaves: ${leaves.length}`);
console.log(`\n## UNREFERENCED (${unref.length})`);
unref.forEach((r) => console.log("  - " + r.leaf));
console.log(`\n## WEAK match only (${weak.length})`);
weak.forEach((r) => console.log("  - " + r.leaf));
console.log(
  `\n## Partial chain match — likely dynamic access (${partial.length})`,
);
partial.forEach((r) => console.log(`  - ${r.leaf}  [${r.status}]`));
