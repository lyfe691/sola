import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import path from "path";
const appVersion = process.env.VERCEL_GIT_COMMIT_SHA ?? "dev";

function versionApiDevPlugin(): Plugin {
  const payload = JSON.stringify({ version: "dev" });

  return {
    name: "version-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/version", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-store");
        res.end(payload);
      });
    },
  };
}

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
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkGfm],
        providerImportSource: "@mdx-js/react",
      }),
    },
    react(),
    tailwindcss(),
    versionApiDevPlugin(),
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
});
