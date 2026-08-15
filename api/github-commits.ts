/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Server-side git-log proxy for /api/github-commits. Lists commits on
 * lyfe691/sola and, on demand, the files/patches for one sha. The token
 * never reaches the browser. Also exported for the Vite dev middleware.
 */

const GITHUB_API = "https://api.github.com";
const REPO = "lyfe691/sola";
const PER_PAGE = 30;
const MAX_PAGE = 10;
const SHA_RE = /^[0-9a-f]{7,40}$/i;

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

interface GitHubListCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author?: { name?: string; date?: string } | null;
  };
  author?: { login?: string } | null;
}

interface GitHubCommitFile {
  filename: string;
  previous_filename?: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

interface GitHubDetailCommit extends GitHubListCommit {
  stats?: { additions?: number; deletions?: number };
  files?: GitHubCommitFile[];
}

type Headers = Record<string, string>;

class UpstreamError extends Error {
  readonly status: number;
  constructor(status: number) {
    super(status === 404 ? "commit not found" : "failed to fetch commits");
    this.status = status;
  }
}

async function fetchJson<T>(url: string, headers: Headers): Promise<T> {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new UpstreamError(res.status);
    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof UpstreamError) throw error;
    throw new UpstreamError(502);
  }
}

function githubHeaders(): Headers {
  const headers: Headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "sola-portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** Drops the terminal `Key: value` trailer block (Co-Authored-By, …). */
export function stripTrailers(body: string): string {
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

export function splitMessage(message: string): {
  subject: string;
  body: string;
} {
  const newlineIndex = message.indexOf("\n");
  if (newlineIndex === -1) return { subject: message, body: "" };
  return {
    subject: message.slice(0, newlineIndex),
    body: stripTrailers(message.slice(newlineIndex + 1)),
  };
}

function mapListCommit(data: GitHubListCommit): ChangelogCommit {
  const { subject, body } = splitMessage(data.commit.message);
  return {
    sha: data.sha,
    shortSha: data.sha.slice(0, 7),
    subject,
    body,
    date: data.commit.author?.date ?? "",
    htmlUrl: data.html_url,
    author: data.author?.login ?? data.commit.author?.name ?? "",
  };
}

function mapDetail(data: GitHubDetailCommit): ChangelogCommitDetail {
  return {
    ...mapListCommit(data),
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

const LIST_TTL_MS = 5 * 60_000;
const DETAIL_TTL_MS = 60 * 60_000;

const listCache = new Map<number, { at: number; data: ChangelogPage }>();
const detailCache = new Map<
  string,
  { at: number; data: ChangelogCommitDetail }
>();

export function parsePage(raw: string | undefined): number | null {
  if (raw === undefined || raw === "") return 1;
  if (!/^\d+$/.test(raw)) return null;
  const page = Number(raw);
  if (page < 1 || page > MAX_PAGE) return null;
  return page;
}

export function parseSha(raw: string | undefined): string | null {
  if (!raw) return null;
  if (!SHA_RE.test(raw)) return null;
  return raw.toLowerCase();
}

export async function getCommitLog(page: number): Promise<ChangelogPage> {
  const cached = listCache.get(page);
  if (cached && Date.now() - cached.at < LIST_TTL_MS) return cached.data;

  const data = await fetchJson<GitHubListCommit[]>(
    `${GITHUB_API}/repos/${REPO}/commits?sha=main&per_page=${PER_PAGE}&page=${page}`,
    githubHeaders(),
  );

  const commits = data.map(mapListCommit);
  const result: ChangelogPage = {
    commits,
    page,
    hasMore: commits.length === PER_PAGE && page < MAX_PAGE,
  };
  if (commits.length > 0) {
    listCache.set(page, { at: Date.now(), data: result });
  }
  return result;
}

export async function getCommitDetail(
  sha: string,
): Promise<ChangelogCommitDetail> {
  const cached = detailCache.get(sha);
  if (cached && Date.now() - cached.at < DETAIL_TTL_MS) return cached.data;

  const data = await fetchJson<GitHubDetailCommit>(
    `${GITHUB_API}/repos/${REPO}/commits/${encodeURIComponent(sha)}`,
    githubHeaders(),
  );

  const result = mapDetail(data);
  const entry = { at: Date.now(), data: result };
  detailCache.set(sha, entry);
  if (result.sha !== sha) detailCache.set(result.sha, entry);
  return result;
}

type VercelRequest = { query: Record<string, string | string[] | undefined> };
type VercelResponse = {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => { json: (body: unknown) => void };
};

function queryString(
  query: VercelRequest["query"],
  key: string,
): string | undefined {
  const raw = query[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const shaRaw = queryString(req.query, "sha");
  const pageRaw = queryString(req.query, "page");

  try {
    if (shaRaw !== undefined) {
      const sha = parseSha(shaRaw);
      if (!sha) {
        res.status(400).json({ error: "invalid sha" });
        return;
      }
      const detail = await getCommitDetail(sha);
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=3600, stale-while-revalidate=86400",
      );
      res.status(200).json(detail);
      return;
    }

    const page = parsePage(pageRaw);
    if (page === null) {
      res.status(400).json({ error: "invalid page" });
      return;
    }
    const log = await getCommitLog(page);
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );
    res.status(200).json(log);
  } catch (error) {
    const missing = error instanceof UpstreamError && error.status === 404;
    res
      .status(missing ? 404 : 502)
      .json({ error: missing ? "commit not found" : "failed to load commits" });
  }
}
