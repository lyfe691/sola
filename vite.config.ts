import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";
import type { Connect } from "vite";
import { getGitHubActivity } from "./api/github-activity";

const appVersion = process.env.VERCEL_GIT_COMMIT_SHA ?? "dev";

function applyLocalEnv(mode: string) {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.GITHUB_TOKEN) {
    process.env.GITHUB_TOKEN = env.GITHUB_TOKEN;
  }
}

function apiDevPlugin(): Plugin {
  const versionPayload = JSON.stringify({ version: "dev" });

  return {
    name: "api-dev",
    enforce: "pre",
    config(_, { mode }) {
      applyLocalEnv(mode);
    },
    configureServer(server) {
      applyLocalEnv(server.config.mode);

      const handleApi = async (
        req: IncomingMessage,
        res: ServerResponse,
        next: Connect.NextFunction,
      ) => {
        const pathname = req.url?.split("?")[0];

        if (pathname === "/api/version" && req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Cache-Control", "no-store");
          res.end(versionPayload);
          return;
        }

        if (pathname !== "/api/github-activity" || req.method !== "GET") {
          next();
          return;
        }

        try {
          const url = new URL(req.url ?? "/", "http://localhost");
          const username = url.searchParams.get("username");
          if (!username) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "username is required" }));
            return;
          }

          const processed = await getGitHubActivity(username);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.setHeader(
            "Cache-Control",
            "public, s-maxage=300, stale-while-revalidate=600",
          );
          res.end(JSON.stringify(processed));
        } catch (error) {
          console.error("[github-activity dev]", error);
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "username is required" }));
        }
      };

      // Vite serves `api/github-activity.ts` as source unless we intercept first.
      server.middlewares.stack.unshift({ route: "", handle: handleApi });
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
    apiDevPlugin(),
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
      "@": path.resolve(__dirname, "./src"),
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
    ],
  },
});
