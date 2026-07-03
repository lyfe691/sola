/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Fetches the commit that is currently deployed (VITE_APP_VERSION, injected at
 * build time from VERCEL_GIT_COMMIT_SHA) straight from the public GitHub API —
 * no server proxy needed; the commits endpoint is CORS-enabled. Dev builds
 * have no deploy SHA, so they fall back to the tip of `main`. The response is
 * cached in sessionStorage per ref to stay well inside the unauthenticated
 * rate limit.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const REPO = "lyfe691/sola";
const RAW_VERSION: string = import.meta.env.VITE_APP_VERSION ?? "dev";

export const IS_DEV_DEPLOY = RAW_VERSION === "dev";
export const DEPLOY_REF = IS_DEV_DEPLOY ? "main" : RAW_VERSION;
/** short label for UI chrome: `main` in dev, the 7-char sha in prod */
export const DEPLOY_LABEL = IS_DEV_DEPLOY ? "main" : RAW_VERSION.slice(0, 7);
/** somewhere to send the user when the diff itself can't be shown */
export const DEPLOY_FALLBACK_URL = IS_DEV_DEPLOY
  ? `https://github.com/${REPO}/commits/main`
  : `https://github.com/${REPO}/commit/${DEPLOY_REF}`;

const CACHE_KEY = `sola-deploy-diff:${DEPLOY_REF}`;

export interface DeployCommitFile {
  filename: string;
  previousFilename?: string;
  status: string;
  additions: number;
  deletions: number;
  /** unified hunks; absent for binary or oversized diffs */
  patch?: string;
}

export interface DeployCommit {
  sha: string;
  shortSha: string;
  /** first line of the commit message */
  subject: string;
  date: string;
  htmlUrl: string;
  additions: number;
  deletions: number;
  files: DeployCommitFile[];
}

export type DeployCommitState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; commit: DeployCommit };

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

function mapCommit(data: GitHubCommitResponse): DeployCommit {
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

function readCache(): DeployCommit | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeployCommit;
    // a wrong-shape cached value would crash the renderer on every reopen
    if (typeof parsed?.sha !== "string" || !Array.isArray(parsed?.files)) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(commit: DeployCommit) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(commit));
  } catch {
    // storage full or unavailable — the fetch just re-runs next session
  }
}

/**
 * Lazily loads the deployed commit once `enabled` first becomes true (i.e.
 * when the dialog opens), then keeps the result for the component's lifetime.
 */
export function useDeployCommit(enabled: boolean): {
  state: DeployCommitState;
  retry: () => void;
} {
  const [state, setState] = useState<DeployCommitState>({ status: "loading" });
  const requestedRef = useRef(false);

  const load = useCallback(async () => {
    setState({ status: "loading" });

    const cached = readCache();
    if (cached) {
      setState({ status: "ready", commit: cached });
      return;
    }

    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/commits/${DEPLOY_REF}`,
        { headers: { Accept: "application/vnd.github+json" } },
      );
      if (!res.ok) throw new Error(`github ${res.status}`);
      const commit = mapCommit((await res.json()) as GitHubCommitResponse);
      writeCache(commit);
      setState({ status: "ready", commit });
    } catch {
      setState({ status: "error" });
    }
  }, []);

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
