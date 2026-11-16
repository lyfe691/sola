import fs from "node:fs";
import path from "node:path";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { PHOSPHOR_WEIGHTS, phosphorWeights } from "./phosphor-weights.ts";

const DEFS = path.resolve("node_modules/@phosphor-icons/react/dist/defs");

const sources = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return sources(file);
    return /\.(tsx?|mdx)$/.test(entry.name) ? [file] : [];
  });

/** run the plugin's transform over one icon's path table and load the result */
function strippedTable(icon: string) {
  const id = path.join(DEFS, `${icon}.es.js`);
  const plugin = phosphorWeights();
  const transform = plugin.transform as (
    code: string,
    id: string,
  ) => { code: string };
  const { code } = transform.call({}, fs.readFileSync(id, "utf8"), id);
  const name = code.match(/export \{\s*(\w+) as default/)![1];
  const body = code
    .replace(/^import \* as (\w+) from "react";/m, "const $1 = React;")
    .replace(/export \{[\s\S]*$/, `return ${name};`);
  return new Function("React", body)(React) as Map<string, unknown>;
}

describe("phosphor-weights", () => {
  it("keeps exactly the site's weights in an icon's path table", () => {
    for (const icon of ["X", "MagnifyingGlass", "Star"]) {
      expect([...strippedTable(icon).keys()].sort()).toEqual(
        [...PHOSPHOR_WEIGHTS].sort(),
      );
    }
  });

  it("every weight src/ asks for survives the build", () => {
    const kept = new Set<string>(PHOSPHOR_WEIGHTS);
    const asked: string[] = [];
    for (const file of sources(path.resolve("src"))) {
      const text = fs.readFileSync(file, "utf8");
      for (const match of text.matchAll(
        /\bweight(?:=\{([^}]*)\}|="[^"]*"|:\s*"[^"]*")/g,
      )) {
        const expr = match[1] ?? match[0];
        const literals = [...expr.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
        if (literals.length === 0 && expr.trim() !== "undefined")
          asked.push(`${path.relative("src", file)}: weight={${expr}}`);
        for (const weight of literals)
          if (!kept.has(weight))
            asked.push(`${path.relative("src", file)}: ${weight}`);
      }
    }
    expect(asked).toEqual([]);
  });
});
