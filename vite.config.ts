import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkGfm],
        providerImportSource: "@mdx-js/react",
      }),
    },
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // These libs are only used inside lazily-imported background modules, so
  // Vite's initial dep scan never sees them and would re-optimize on first
  // select (causing a "504 Outdated Optimize Dep" reload). Pre-bundle them.
  optimizeDeps: {
    include: ["ogl", "three", "@react-three/fiber"],
  },
}));
