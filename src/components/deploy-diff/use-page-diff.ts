/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Data for the code view: the latest commit that touched the current page's
 * source (see page-sources.ts), with its diff filtered down to that scope.
 * Everything comes straight from the public GitHub API (CORS-enabled, no
 * proxy needed). The search is anchored at the deployed ref (VITE_APP_VERSION,
 * injected at build time from VERCEL_GIT_COMMIT_SHA; dev builds anchor at
 * `main`), so undeployed commits never show up. Responses are cached in
 * sessionStorage per scope to stay well inside the unauthenticated rate limit.
 */

import { useCallback, useEffect, useRef, useState } from "react";

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
  date: string;
  htmlUrl: string;
  /** additions/deletions within the page scope (whole commit when unscoped) */
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

function mapCommit(data: GitHubCommitResponse): PageCommit {
  return {
    sha: data.sha,
    shortSha: data.sha.slice(0, 7),
    subject: data.commit.message.split("\n")[0],
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

  const files = commit.files.filter((file) => matchesScope(file, path));
  // the list endpoint said this commit touches the scope; an empty filter
  // means the detail response was truncated past our files
  if (files.length === 0) return null;
  return {
    ...commit,
    files,
    additions: files.reduce((sum, f) => sum + f.additions, 0),
    deletions: files.reduce((sum, f) => sum + f.deletions, 0),
  };
}

function cacheKey(path: string | null): string {
  return `sola-page-diff:${DEPLOY_REF}:${path ?? "@site"}`;
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
 * (the code view unmounts on route change).
 */
export function usePageDiff(
  enabled: boolean,
  path: string | null,
): { state: PageDiffState; retry: () => void } {
  const [state, setState] = useState<PageDiffState>({ status: "loading" });
  const requestedRef = useRef(false);

  const load = useCallback(async () => {
    setState({ status: "loading" });

    const cached = readCache(path);
    if (cached) {
      setState({ status: "ready", commit: cached });
      return;
    }

    try {
      const commit = await fetchPageDiff(path);
      if (!commit) {
        setState({ status: "empty" });
        return;
      }
      writeCache(path, commit);
      setState({ status: "ready", commit });
    } catch {
      setState({ status: "error" });
    }
  }, [path]);

  useEffect(() => {
    if (!enabled || requestedRef.current) return;
    requestedRef.current = true;
    void load();
  }, [enabled, load]);

  const retry = useCallback(() => {
    void load();
  }, [load]);

  return { state, retry };
}
