import type { Plugin } from "vite";

/** the weights the site draws with; `src/main.tsx` sets bold as the default */
export const PHOSPHOR_WEIGHTS = ["bold", "regular", "fill"] as const;

const DEFS =
  /[\\/]@phosphor-icons[\\/]react[\\/]dist[\\/]defs[\\/][^\\/]+\.es\.js$/;
// one entry of the path table with its trailing comma: dropping it whole
// keeps the array free of holes, which Map would reject
const ENTRY = /\n {2}\[\n {4}"(\w+)",\n[\s\S]*?\n {2}\],?(?=\n)/g;
const ALL = ["bold", "duotone", "fill", "light", "regular", "thin"];

/**
 * Every Phosphor icon module carries its glyph in all six weights, so each
 * icon costs about three times what the site renders. This drops the weights
 * the site never asks for from each icon's path table. Build only: dev
 * pre-bundles the package untouched. A dropped weight renders an empty box,
 * which is why a test holds every `weight` in src/ to PHOSPHOR_WEIGHTS.
 */
export function phosphorWeights(): Plugin {
  const keep = new Set<string>(PHOSPHOR_WEIGHTS);
  return {
    name: "phosphor-weights",
    apply: "build",
    transform(code, id) {
      if (!DEFS.test(id)) return;
      const found: string[] = [];
      const stripped = code.replace(ENTRY, (entry, weight: string) => {
        found.push(weight);
        return keep.has(weight) ? entry : "";
      });
      if (found.join() !== ALL.join())
        throw new Error(
          `phosphor-weights: expected the weights ${ALL.join(", ")} in ${id}, ` +
            `found ${found.join(", ") || "none"}; the package's layout changed`,
        );
      return { code: stripped, map: null };
    },
  };
}
