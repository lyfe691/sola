import fs from "node:fs";
import path from "node:path";
import type { Plugin, Rollup } from "vite";

const ROUTES = path.resolve("src/config/routes.ts");
const ROUTE = /path:\s*"([^"]+)"[^}]*?import\("@\/pages\/([^"]+)"\)/g;

/** every route with a real path, paired with the page module it loads */
function readRoutes() {
  const source = fs.readFileSync(ROUTES, "utf8");
  const routes = [...source.matchAll(ROUTE)]
    .map(([, route, page]) => ({ route, page }))
    .filter(({ route }) => route !== "*");
  const declared = [...source.matchAll(/path:\s*"(?!\*")/g)].length;
  if (routes.length !== declared)
    throw new Error(
      `route-preload: paired ${routes.length} of ${declared} routes in ` +
        `${ROUTES}; each needs its path before its page import`,
    );
  return routes;
}

const pattern = (route: string) =>
  `^${route.replace(/:[^/]+/g, "[^/]+").replace(/\/$/, "")}/?$`;

/**
 * A page's chunk is requested by main.tsx, so it waits for the whole entry
 * graph to download and run first. This puts a small script in index.html
 * that matches the URL against the route manifest and preloads that page's
 * chunks while the entry is still downloading.
 */
export function routePreload(): Plugin {
  return {
    name: "route-preload",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return;
        const chunks = Object.values(bundle).filter(
          (output): output is Rollup.OutputChunk => output.type === "chunk",
        );
        const byFile = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
        const closure = (fileName: string, into = new Set<string>()) => {
          if (into.has(fileName)) return into;
          into.add(fileName);
          for (const dep of byFile.get(fileName)?.imports ?? [])
            closure(dep, into);
          return into;
        };

        const entry = chunks.find((chunk) => chunk.isEntry);
        const eager = entry ? closure(entry.fileName) : new Set<string>();

        const table = readRoutes().map(({ route, page }) => {
          const chunk = chunks.find((c) =>
            c.facadeModuleId
              ?.replace(/\\/g, "/")
              .endsWith(`/src/pages/${page}.tsx`),
          );
          if (!chunk)
            throw new Error(`route-preload: no chunk for src/pages/${page}`);
          const files = [...closure(chunk.fileName)]
            .filter((file) => !eager.has(file))
            .map((file) => `/${file}`);
          return [pattern(route), files];
        });

        const script = `<script>(function(){var p=location.pathname,t=${JSON.stringify(table)};for(var i=0;i<t.length;i++)if(new RegExp(t[i][0]).test(p)){t[i][1].forEach(function(h){var l=document.createElement("link");l.rel="modulepreload";l.crossOrigin="";l.href=h;document.head.appendChild(l)});break}})();</script>`;
        // ahead of the entry and its stylesheet: an inline script waits for
        // every stylesheet above it to download before it runs
        const at = html.indexOf('<script type="module"');
        if (at < 0) throw new Error("route-preload: no entry script in html");
        return `${html.slice(0, at)}${script}\n    ${html.slice(at)}`;
      },
    },
  };
}
