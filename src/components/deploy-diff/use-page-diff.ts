/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Data for the code view: the latest commit that touched the current page's
 * source (see page-sources.ts), shown WHOLE — the page path only anchors the
 * selection; the diff is the full, honest commit with in-scope files sorted
 * first. Everything comes straight from the public GitHub API (CORS-enabled,
 * no proxy needed). The search is anchored at the deployed ref
 * (VITE_APP_VERSION, injected at build time from VERCEL_GIT_COMMIT_SHA; dev
 * builds anchor at `main`), so undeployed commits never show up. Responses
 * are cached in sessionStorage per scope to stay well inside the
 * unauthenticated rate limit.
 */

import { useQuery } from "@tanstack/react-query";

const REPO = "lyfe691/sola";
const GITHUB_API = `https://api.github.com/repos/${REPO}`;
const RAW_VERSION: string = import.meta.env.VITE_APP_VERSION ?? "dev";

/** where the commit search starts: the deployed sha, or `main` in dev */
export const DEPLOY_REF = RAW_VERSION === "dev" ? "main" : RAW_VERSION;
/** short label for UI chrome: `main` in dev, the 7-char sha in prod */
export const DEPLOY_LABEL =
  RAW_VERSION === "dev" ? "main" : RAW_VERSION.slice(0, 7);

/** somewhere to send the user when the diff itself can't be shown */
export function githubFallbackUrl(path: string | null): string {
  return path
    ? `https://github.com/${REPO}/commits/${DEPLOY_REF}/${path}`
    : `https://github.com/${REPO}/commits/${DEPLOY_REF}`;
}

export interface PageCommitFile {
  filename: string;
  previousFilename?: string;
  status: string;
  additions: number;
  deletions: number;
  /** unified hunks; absent for binary or oversized diffs */
  patch?: string;
}

export interface PageCommit {
  sha: string;
  shortSha: string;
  /** first line of the commit message */
  subject: string;
  /** rest of the commit message, git trailers stripped; "" when absent */
  body: string;
  date: string;
  htmlUrl: string;
  additions: number;
  deletions: number;
  files: PageCommitFile[];
}

export type PageDiffState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "empty" }
  | { status: "ready"; commit: PageCommit };

interface GitHubCommitFile {
  filename: string;
  previous_filename?: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

interface GitHubCommitResponse {
  sha: string;
  html_url: string;
  commit: { message: string; author?: { date?: string } | null };
  stats?: { additions?: number; deletions?: number };
  files?: GitHubCommitFile[];
}

const HEADERS = { Accept: "application/vnd.github+json" };

/**
 * Drops the final trailer block (Co-Authored-By:, Signed-off-by:, …) — by
 * convention a terminal paragraph whose every line is `Key: value`.
 */
function stripTrailers(body: string): string {
  const paragraphs = body.trim().split(/\n{2,}/);
  const last = paragraphs[paragraphs.length - 1];
  if (
    paragraphs.length > 0 &&
    last.split("\n").every((line) => /^[A-Za-z][\w-]*:\s.+/.test(line.trim()))
  ) {
    paragraphs.pop();
  }
  return paragraphs.join("\n\n").trim();
}

function mapCommit(data: GitHubCommitResponse): PageCommit {
  const message = data.commit.message;
  const newlineIndex = message.indexOf("\n");
  return {
    sha: data.sha,
    shortSha: data.sha.slice(0, 7),
    subject: newlineIndex === -1 ? message : message.slice(0, newlineIndex),
    body:
      newlineIndex === -1 ? "" : stripTrailers(message.slice(newlineIndex + 1)),
    date: data.commit.author?.date ?? "",
    htmlUrl: data.html_url,
    additions: data.stats?.additions ?? 0,
    deletions: data.stats?.deletions ?? 0,
    files: (data.files ?? []).map((file) => ({
      filename: file.filename,
      previousFilename: file.previous_filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch,
    })),
  };
}

function matchesScope(file: PageCommitFile, path: string): boolean {
  const inScope = (name?: string) =>
    !!name && (name === path || name.startsWith(`${path}/`));
  return inScope(file.filename) || inScope(file.previousFilename);
}

/** null means: nothing in the commit history touches this scope */
async function fetchPageDiff(path: string | null): Promise<PageCommit | null> {
  let ref = DEPLOY_REF;

  if (path) {
    const listRes = await fetch(
      `${GITHUB_API}/commits?sha=${encodeURIComponent(DEPLOY_REF)}&path=${encodeURIComponent(path)}&per_page=1`,
      { headers: HEADERS },
    );
    if (!listRes.ok) throw new Error(`github ${listRes.status}`);
    const list = (await listRes.json()) as { sha?: string }[];
    const sha = Array.isArray(list) ? list[0]?.sha : undefined;
    if (!sha) return null;
    ref = sha;
  }

  const res = await fetch(`${GITHUB_API}/commits/${ref}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`github ${res.status}`);
  const commit = mapCommit((await res.json()) as GitHubCommitResponse);

  if (!path) return commit;

  // full commit, page-anchored: this page's files float to the top (stable
  // sort keeps the original order within each group)
  return {
    ...commit,
    files: [...commit.files].sort(
      (a, b) => Number(matchesScope(b, path)) - Number(matchesScope(a, path)),
    ),
  };
}

function cacheKey(path: string | null): string {
  // v3: adds the commit body to the cached shape
  return `sola-page-diff:v3:${DEPLOY_REF}:${path ?? "@site"}`;
}

function readCache(path: string | null): PageCommit | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(path));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PageCommit;
    // a wrong-shape cached value would crash the renderer on every reopen
    if (typeof parsed?.sha !== "string" || !Array.isArray(parsed?.files)) {
      sessionStorage.removeItem(cacheKey(path));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(path: string | null, commit: PageCommit) {
  try {
    sessionStorage.setItem(cacheKey(path), JSON.stringify(commit));
  } catch {
    // storage full or unavailable — the fetch just re-runs next session
  }
}

/**
 * Lazily loads the page-scoped diff once `enabled` first becomes true, then
 * keeps the result for the component's lifetime. `path` is fixed per mount
 * (the code view unmounts on route change). The sessionStorage layer feeds
 * react-query via initialData so the GitHub rate-limit budget survives full
 * page reloads, which the in-memory query cache alone would not.
 */
export function usePageDiff(
  enabled: boolean,
  path: string | null,
): { state: PageDiffState; retry: () => void } {
  const query = useQuery({
    queryKey: ["page-diff", DEPLOY_REF, path ?? "@site"],
    queryFn: async () => {
      // null means: nothing in the commit history touches this scope
      const commit = await fetchPageDiff(path);
      if (commit) writeCache(path, commit);
      return commit;
    },
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    // an errored query (no data) counts as always-stale, so default focus
    // refetches would restart the fetch behind CodeView's phase machine and
    // blank the pane; the explicit retry() below is the only re-trigger
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: () => readCache(path) ?? undefined,
  });

  let state: PageDiffState;
  if (query.isError) {
    // a manual retry shows the loading treatment again, not a frozen error
    state = query.isFetching ? { status: "loading" } : { status: "error" };
  } else if (query.data === undefined) {
    state = { status: "loading" };
  } else if (query.data === null) {
    state = { status: "empty" };
  } else {
    state = { status: "ready", commit: query.data };
  }

  return { state, retry: () => void query.refetch() };
}
