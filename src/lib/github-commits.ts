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

export const commitLogQuery = (page: number) =>
  queryOptions({
    queryKey: ["github-commits", "log", page],
    queryFn: () => fetchCommitLog(page),
    staleTime: Infinity,
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

/** Rebuild a `diff --git` header around GitHub's hunk-only patch. */
export function toUnifiedDiff(file: ChangelogFile): string {
  const a = file.previousFilename ?? file.filename;
  const b = file.filename;
  const header = `diff --git a/${a} b/${b}`;
  return file.patch ? `${header}\n${file.patch}` : header;
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

export interface StatRow {
  prefix: string;
  name: string;
  file?: ChangelogFile;
}

type Trie = {
  name: string;
  children: Map<string, Trie>;
  file?: ChangelogFile;
};

/** Box-drawing tree (`├──` / `└──`) for `git show --stat`. */
export function statTree(files: ChangelogFile[]): StatRow[] {
  const root: Trie = { name: "", children: new Map() };
  const sorted = [...files].sort((a, b) =>
    a.filename.localeCompare(b.filename),
  );

  for (const file of sorted) {
    let node = root;
    const parts = file.filename.split("/");
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      let next = node.children.get(part);
      if (!next) {
        next = { name: part, children: new Map() };
        node.children.set(part, next);
      }
      node = next;
      if (i === parts.length - 1) node.file = file;
    }
  }

  const rows: StatRow[] = [];
  const walk = (
    node: Trie,
    prefix: string,
    isLast: boolean,
    isRoot: boolean,
  ) => {
    if (!isRoot) {
      rows.push({
        prefix: prefix + (isLast ? "└── " : "├── "),
        name: node.name,
        file: node.file,
      });
    }
    const kids = [...node.children.values()];
    kids.forEach((kid, i) => {
      const last = i === kids.length - 1;
      const nextPrefix = isRoot ? "" : prefix + (isLast ? "    " : "│   ");
      walk(kid, nextPrefix, last, false);
    });
  };
  walk(root, "", true, true);
  return rows;
}
