import type { Plugin } from "vite";

/**
 * Preloads the body face's latin subset (latin-1, so German reads covered),
 * found by name among the emitted assets: without it the font is only
 * discovered once text renders, a round trip after the first paint.
 */
export function fontPreload(prefix: string): Plugin {
  return {
    name: "font-preload",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_, ctx) {
        const file = Object.keys(ctx.bundle ?? {}).find(
          (name) =>
            name.startsWith(`assets/${prefix}-`) && name.endsWith(".woff2"),
        );
        if (!file) throw new Error(`font-preload: no ${prefix} woff2 emitted`);
        return [
          {
            tag: "link",
            attrs: {
              rel: "preload",
              href: `/${file}`,
              as: "font",
              type: "font/woff2",
              crossorigin: "",
            },
            injectTo: "head",
          },
        ];
      },
    },
  };
}
