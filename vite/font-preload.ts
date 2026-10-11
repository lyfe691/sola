import type { Plugin } from "vite";

/**
 * Preloads each face's latin subset (latin-1, so German reads covered),
 * found by name among the emitted assets: without it a face is only
 * discovered once text renders, a round trip after the first paint. Each
 * link names its face in `data-face`, so a page that never sets one can drop
 * its preload (seo-pages.ts).
 */
export function fontPreload(faces: Record<string, string>): Plugin {
  return {
    name: "font-preload",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_, ctx) {
        const emitted = Object.keys(ctx.bundle ?? {});
        return Object.entries(faces).map(([face, prefix]) => {
          const file = emitted.find(
            (name) =>
              name.startsWith(`assets/${prefix}-`) && name.endsWith(".woff2"),
          );
          if (!file)
            throw new Error(`font-preload: no ${prefix} woff2 emitted`);
          return {
            tag: "link",
            attrs: {
              rel: "preload",
              href: `/${file}`,
              as: "font",
              type: "font/woff2",
              crossorigin: "",
              "data-face": face,
            },
            injectTo: "head",
          };
        });
      },
    },
  };
}
