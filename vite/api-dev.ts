import { loadEnv, type Connect, type Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "http";
import { getGitHubActivity } from "../api/github-activity.ts";
import githubCommits from "../api/github-commits.ts";

function applyLocalEnv(mode: string) {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.GITHUB_TOKEN) {
    process.env.GITHUB_TOKEN = env.GITHUB_TOKEN;
  }
}

export function apiDevPlugin(): Plugin {
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

        if (pathname === "/api/github-commits" && req.method === "GET") {
          try {
            const url = new URL(req.url ?? "/", "http://localhost");
            await githubCommits(
              {
                query: {
                  page: url.searchParams.get("page") ?? undefined,
                  sha: url.searchParams.get("sha") ?? undefined,
                },
              },
              {
                setHeader: (key, value) => res.setHeader(key, value),
                status: (code) => ({
                  json: (body: unknown) => {
                    res.statusCode = code;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(body));
                  },
                }),
              },
            );
          } catch (error) {
            console.error("[github-commits dev]", error);
            res.statusCode = 502;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "failed to load commits" }));
          }
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
          // mirror the production handler's branching (api/github-activity.ts)
          const notAllowed =
            error instanceof Error &&
            error.message === "username is not allowed";
          res.statusCode = notAllowed ? 403 : 502;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: notAllowed
                ? "username is not allowed"
                : "failed to load activity",
            }),
          );
        }
      };

      // Vite serves `api/*.ts` as source unless we intercept first.
      server.middlewares.stack.unshift({ route: "", handle: handleApi });
    },
  };
}
