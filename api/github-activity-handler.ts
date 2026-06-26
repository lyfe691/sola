/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Shared GitHub activity logic for Vercel (`api/github-activity.ts`) and the
 * Vite dev middleware. Lives under `api/` so Vercel can bundle it. The shape
 * mirrors `ProcessedActivity` in src/lib/github.ts (kept in sync deliberately).
 */

export interface ProcessedActivity {
  id: string;
  type:
    | "push"
    | "pull_request"
    | "issues"
    | "create"
    | "delete"
    | "fork"
    | "star"
    | "release"
    | "member"
    | "watch";
  action?: string;
  title: string;
  description: string;
  repo: string;
  repoUrl: string;
  url?: string;
  timestamp: string;
  metadata?: {
    commits?: number;
    additions?: number;
    deletions?: number;
    branch?: string;
    tag?: string;
    issueNumber?: number;
    pullNumber?: number;
  };
}

const GITHUB_API = "https://api.github.com";

interface GitHubCommit {
  sha: string;
  message: string;
  url: string;
}

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  payload: {
    action?: string;
    ref_type?: string;
    ref?: string;
    description?: string;
    size?: number;
    distinct_size?: number;
    head?: string;
    forced?: boolean;
    created?: boolean;
    deleted?: boolean;
    commits?: GitHubCommit[];
    pull_request?: {
      id: number;
      title: string;
      html_url: string;
      merged: boolean;
      additions: number;
      deletions: number;
    };
    issue?: { id: number; title: string; html_url: string };
    release?: { tag_name: string; name: string; html_url: string };
    forkee?: { html_url: string; description: string };
    member?: { login: string; html_url: string };
  };
  created_at: string;
}

type Headers = Record<string, string>;

async function fetchJson<T>(url: string, headers: Headers): Promise<T | null> {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchCommitMessage(
  repoFullName: string,
  sha: string,
  headers: Headers,
): Promise<string | null> {
  const repoPath = repoFullName.split("/").map(encodeURIComponent).join("/");
  const data = await fetchJson<{ commit?: { message?: string } }>(
    `${GITHUB_API}/repos/${repoPath}/commits/${encodeURIComponent(sha)}`,
    headers,
  );
  const message = data?.commit?.message;
  return message ? message.split("\n")[0].trim() : null;
}

async function fetchLatestCommitMessage(
  repoFullName: string,
  branch: string,
  headers: Headers,
): Promise<string | null> {
  const repoPath = repoFullName.split("/").map(encodeURIComponent).join("/");
  const data = await fetchJson<Array<{ commit?: { message?: string } }>>(
    `${GITHUB_API}/repos/${repoPath}/commits?sha=${encodeURIComponent(branch)}&per_page=1`,
    headers,
  );
  const message = data?.[0]?.commit?.message;
  return message ? message.split("\n")[0].trim() : null;
}

async function buildPushActivity(
  event: GitHubEvent,
  base: Pick<ProcessedActivity, "id" | "repo" | "repoUrl" | "timestamp">,
  headers: Headers,
): Promise<ProcessedActivity> {
  const commits = event.payload.commits ?? [];
  const branch = event.payload.ref?.replace("refs/heads/", "") || "main";
  const size =
    typeof event.payload.size === "number" ? event.payload.size : commits.length;
  const distinctSize =
    typeof event.payload.distinct_size === "number"
      ? event.payload.distinct_size
      : size;

  let commitCount = Math.max(distinctSize, size, commits.length);
  if (!Number.isFinite(commitCount)) commitCount = commits.length;

  let description = commits.find((c) => c.message?.trim())?.message?.trim();
  const headSha = commits[0]?.sha || event.payload.head;

  if (!description && headSha) {
    description =
      (await fetchCommitMessage(event.repo.name, headSha, headers)) ?? undefined;
  }
  if (!description) {
    description =
      (await fetchLatestCommitMessage(event.repo.name, branch, headers)) ??
      undefined;
  }
  if (!description) {
    description = event.payload.forced
      ? "Branch history was rewritten"
      : "Latest changes synchronized";
  }

  const deleted = Boolean(event.payload.deleted);
  const forced = Boolean(event.payload.forced);
  const created = Boolean(event.payload.created);

  let title: string;
  if (deleted) title = `Cleared branch ${branch}`;
  else if (commitCount > 0)
    title = `Pushed ${commitCount} commit${commitCount !== 1 ? "s" : ""} to ${branch}`;
  else if (forced) title = `Force-pushed ${branch}`;
  else if (created) title = `Initialized ${branch}`;
  else title = `Updated ${branch}`;

  return {
    ...base,
    type: "push",
    title,
    description,
    metadata: { commits: commitCount, branch },
  };
}

async function processEvent(
  event: GitHubEvent,
  headers: Headers,
): Promise<ProcessedActivity | null> {
  const base = {
    id: event.id,
    repo: event.repo.name,
    repoUrl: `https://github.com/${event.repo.name}`,
    timestamp: event.created_at,
  };
  const { payload } = event;

  switch (event.type) {
    case "PushEvent":
      return buildPushActivity(event, base, headers);

    case "PullRequestEvent": {
      const pr = payload.pull_request!;
      const a = payload.action;
      return {
        ...base,
        type: "pull_request",
        action: a,
        title: `${a === "opened" ? "Opened" : a === "closed" ? (pr.merged ? "Merged" : "Closed") : "Updated"} pull request`,
        description: pr.title,
        url: pr.html_url,
        metadata: {
          pullNumber: pr.id,
          additions: pr.additions,
          deletions: pr.deletions,
        },
      };
    }

    case "IssuesEvent": {
      const issue = payload.issue!;
      const a = payload.action;
      return {
        ...base,
        type: "issues",
        action: a,
        title: `${a === "opened" ? "Opened" : a === "closed" ? "Closed" : "Updated"} issue`,
        description: issue.title,
        url: issue.html_url,
        metadata: { issueNumber: issue.id },
      };
    }

    case "CreateEvent": {
      const refType = payload.ref_type;
      const refName = payload.ref;
      if (refType === "repository")
        return {
          ...base,
          type: "create",
          title: "Created repository",
          description: payload.description || "No description provided",
        };
      if (refType === "branch")
        return {
          ...base,
          type: "create",
          title: `Created branch ${refName}`,
          description: `New branch in ${event.repo.name}`,
          metadata: { branch: refName },
        };
      if (refType === "tag")
        return {
          ...base,
          type: "create",
          title: `Created tag ${refName}`,
          description: `New tag in ${event.repo.name}`,
          metadata: { tag: refName },
        };
      return null;
    }

    case "DeleteEvent":
      return {
        ...base,
        type: "delete",
        title: `Deleted ${payload.ref_type} ${payload.ref}`,
        description: `Removed ${payload.ref_type} from ${event.repo.name}`,
        metadata: {
          branch: payload.ref_type === "branch" ? payload.ref : undefined,
          tag: payload.ref_type === "tag" ? payload.ref : undefined,
        },
      };

    case "ForkEvent": {
      const fork = payload.forkee!;
      return {
        ...base,
        type: "fork",
        title: "Forked repository",
        description: fork.description || "No description",
        url: fork.html_url,
      };
    }

    case "WatchEvent":
      return {
        ...base,
        type: "star",
        title: "Starred repository",
        description: `Added ${event.repo.name} to starred repositories`,
      };

    case "ReleaseEvent": {
      const release = payload.release!;
      return {
        ...base,
        type: "release",
        action: payload.action,
        title: `${payload.action === "published" ? "Published" : "Updated"} release ${release.tag_name}`,
        description: release.name || release.tag_name,
        url: release.html_url,
        metadata: { tag: release.tag_name },
      };
    }

    case "MemberEvent": {
      const member = payload.member!;
      return {
        ...base,
        type: "member",
        action: payload.action,
        title: `${payload.action === "added" ? "Added" : "Updated"} collaborator`,
        description: `${member.login} was ${payload.action} as collaborator`,
        url: member.html_url,
      };
    }

    default:
      return null;
  }
}

const ALLOWED_USERNAMES = new Set(["lyfe691"]);

export async function getGitHubActivity(
  username: string,
): Promise<ProcessedActivity[]> {
  if (!ALLOWED_USERNAMES.has(username)) {
    throw new Error("username is not allowed");
  }

  const headers: Headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "sola-portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const events = await fetchJson<GitHubEvent[]>(
    `${GITHUB_API}/users/${encodeURIComponent(username)}/events/public?per_page=20`,
    headers,
  );

  if (!events) return [];

  return (
    await Promise.all(events.map((event) => processEvent(event, headers)))
  ).filter((activity): activity is ProcessedActivity => activity !== null);
}