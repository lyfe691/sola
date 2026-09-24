import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import path from "path";
import { apiDevPlugin } from "./vite/api-dev.ts";
import { changelogSnapshotPlugin } from "./vite/changelog-snapshot.ts";
import { hugeiconsPerIcon } from "./vite/hugeicons.ts";
import { routePreload } from "./vite/route-preload.ts";
import { fontPreload } from "./vite/font-preload.ts";

const appVersion = process.env.VERCEL_GIT_COMMIT_SHA ?? "dev";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(appVersion),
  },
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    apiDevPlugin(),
    changelogSnapshotPlugin(),
    hugeiconsPerIcon(),
    routePreload(),
    fontPreload("geist-latin-wght-normal"),
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkGfm],
        providerImportSource: "@mdx-js/react",
      }),
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // split the eager React/runtime libs into a long-lived vendor chunk so
        // they cache across deploys instead of riding in the app entry. Heavy
        // libs (three, shiki, recharts) are already lazy-split per route/feature.
        // Rolldown (Vite 8) only accepts the function form of manualChunks.
        manualChunks(id) {
          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/react-router/")
          ) {
            return "react-vendor";
          }
        },
      },
    },
  },
  // These libs are only used inside lazily-imported background modules, so
  // Vite's initial dep scan never sees them and would re-optimize on first
  // select (causing a "504 Outdated Optimize Dep" reload). Pre-bundle them.
  optimizeDeps: {
    include: [
      "ogl",
      "three",
      "@react-three/fiber",
      "gsap",
      "react-activity-calendar",
      "pdfjs-dist/legacy/build/pdf.mjs",
    ],
  },
});
