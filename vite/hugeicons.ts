import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const PACKAGE = "@hugeicons/core-free-icons";
const IMPORT =
  /import\s*\{([^}]*)\}\s*from\s*["']@hugeicons\/core-free-icons["'];?/g;

/**
 * The package's index is one module holding all ~5,000 icons, so the chunk
 * that owns it carries every icon the site uses, and the entry owns it (the
 * nav and footer import icons). The package also ships one file per icon;
 * rewriting each named import to its file lets every icon land in the chunk
 * that renders it. Aliases (`SearchIcon` is `Search01Icon`) resolve through
 * the index's own export list. Build only: dev pre-bundles the index once.
 */
export function hugeiconsPerIcon(): Plugin {
  let files: Map<string, string>;

  return {
    name: "hugeicons-per-icon",
    apply: "build",
    enforce: "pre",
    buildStart() {
      const dir = path.dirname(
        path.resolve("node_modules", PACKAGE, "dist/esm/index.js"),
      );
      const index = fs.readFileSync(path.join(dir, "index.js"), "utf8");
      const list = index.slice(index.lastIndexOf("export {") + 8);
      files = new Map();
      for (const spec of list.slice(0, list.indexOf("}")).split(",")) {
        const [local, exported = local] = spec.trim().split(/\s+as\s+/);
        if (local && fs.existsSync(path.join(dir, `${local}.js`)))
          files.set(exported, local);
      }
    },
    transform(code, id) {
      if (id.includes("node_modules") || !code.includes(PACKAGE)) return;
      const rewritten = code.replace(
        IMPORT,
        (statement, specifiers: string) => {
          const imports = specifiers
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s && !s.startsWith("type "))
            .map((s) => {
              const [imported, local = imported] = s.split(/\s+as\s+/);
              const file = files.get(imported);
              return file
                ? `import ${local} from "${PACKAGE}/${file}";`
                : `import { ${imported} as ${local} } from "${PACKAGE}";`;
            });
          // one line, padded to the statement's height: every line after it
          // keeps its number, which is what lets `map: null` keep the
          // incoming sourcemap
          const lines = statement.split("\n").length;
          return imports.join(" ") + "\n".repeat(lines - 1);
        },
      );
      return { code: rewritten, map: null };
    },
  };
}
