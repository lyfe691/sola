/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Client for /api/github-commits. Types are the API contract — keep them
 * in sync with api/github-commits.ts.
 */

import { queryOptions } from "@tanstack/react-query";
import snapshot from "virtual:changelog-snapshot";

export const CHANGELOG_REPO = "lyfe691/sola";
export const CHANGELOG_GITHUB = `https://github.com/${CHANGELOG_REPO}/commits/main`;

export interface ChangelogCommit {
  sha: string;
  shortSha: string;
  subject: string;
  body: string;
  date: string;
  htmlUrl: string;
  author: string;
  parents: string[];
  stats?: ChangelogStats;
}

export interface ChangelogStats {
  additions: number;
  deletions: number;
  files: number;
  paths: string[];
}

export interface ChangelogFile {
  filename: string;
  previousFilename?: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

export interface ChangelogCommitDetail extends ChangelogCommit {
  additions: number;
  deletions: number;
  files: ChangelogFile[];
}

export interface ChangelogPage {
  commits: ChangelogCommit[];
  page: number;
  hasMore: boolean;
}

export async function fetchCommitLog(page: number): Promise<ChangelogPage> {
  const res = await fetch(`/api/github-commits?page=${page}`);
  if (!res.ok) throw new Error(`github-commits ${res.status}`);
  return (await res.json()) as ChangelogPage;
}

export async function fetchCommitDetail(
  sha: string,
): Promise<ChangelogCommitDetail> {
  const res = await fetch(`/api/github-commits?sha=${encodeURIComponent(sha)}`);
  if (!res.ok) throw new Error(`github-commits ${res.status}`);
  return (await res.json()) as ChangelogCommitDetail;
}

const FIRST_PAGE_TTL_MS = 5 * 60_000;

export const commitLogQuery = (page: number) =>
  queryOptions({
    queryKey: ["github-commits", "log", page],
    queryFn: () => fetchCommitLog(page),
    initialData: page === 1 ? snapshot?.page : undefined,
    initialDataUpdatedAt: page === 1 ? snapshot?.at : undefined,
    staleTime: page === 1 ? FIRST_PAGE_TTL_MS : Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

export const commitDetailQuery = (sha: string) =>
  queryOptions({
    queryKey: ["github-commits", "detail", sha],
    queryFn: () => fetchCommitDetail(sha),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

/** The list's row stats, for a commit that arrived through the detail endpoint. */
export function detailStats(detail: ChangelogCommitDetail): ChangelogStats {
  return {
    additions: detail.additions,
    deletions: detail.deletions,
    files: detail.files.length,
    paths: detail.files.map((file) => file.filename),
  };
}

export interface CommitHeadline {
  text: string;
  pr?: number;
  type?: string;
  scope?: string;
}

const MERGE_RE = /^merge (?:pr|pull request) #(\d+)/i;
const CONVENTIONAL_RE = /^([a-z]+)(?:\(([^)]+)\))?!?:\s+(.+)$/i;

/**
 * A merge reads as its PR's title (the body's first line); a conventional
 * subject splits into type, scope and the sentence after the colon.
 */
export function commitHeadline(
  commit: Pick<ChangelogCommit, "subject" | "body">,
): CommitHeadline {
  const merge = MERGE_RE.exec(commit.subject);
  if (merge) {
    const title = commit.body.split("\n")[0].trim();
    return { text: title || commit.subject, pr: Number(merge[1]) };
  }
  const conventional = CONVENTIONAL_RE.exec(commit.subject);
  if (conventional) {
    return {
      text: conventional[3],
      type: conventional[1].toLowerCase(),
      scope: conventional[2],
    };
  }
  return { text: commit.subject };
}

const STATUS_LETTER: Record<string, string> = {
  added: "A",
  removed: "D",
  modified: "M",
  renamed: "R",
  copied: "C",
  changed: "M",
};

export function statusLetter(status: string): string {
  return STATUS_LETTER[status] ?? (status.slice(0, 1).toUpperCase() || "?");
}

export interface FileNode {
  name: string;
  path: string;
  file?: ChangelogFile;
  children: FileNode[];
}

export function fileTree(files: ChangelogFile[]): FileNode[] {
  const root: FileNode = { name: "", path: "", children: [] };
  const sorted = [...files].sort((a, b) =>
    a.filename.localeCompare(b.filename),
  );

  for (const file of sorted) {
    let node = root;
    let path = "";
    const parts = file.filename.split("/");
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      path = path ? `${path}/${part}` : part;
      let next = node.children.find((child) => child.name === part);
      if (!next) {
        next = { name: part, path, children: [] };
        node.children.push(next);
      }
      node = next;
      if (i === parts.length - 1) node.file = file;
    }
  }

  return root.children;
}
