/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

// comprehensive github event types
export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload: {
    action?: string;
    ref_type?: string;
    ref?: string;
    master_branch?: string;
    description?: string;
    pusher_type?: string;
    size?: number;
    distinct_size?: number;
    commits?: Array<{
      sha: string;
      message: string;
      url: string;
    }>;
    pull_request?: {
      id: number;
      title: string;
      body: string;
      html_url: string;
      state: string;
      merged: boolean;
      additions: number;
      deletions: number;
      changed_files: number;
    };
    issue?: {
      id: number;
      title: string;
      body: string;
      html_url: string;
      state: string;
      comments: number;
    };
    release?: {
      tag_name: string;
      name: string;
      body: string;
      html_url: string;
      draft: boolean;
      prerelease: boolean;
    };
    forkee?: {
      full_name: string;
      html_url: string;
      description: string;
    };
    member?: {
      login: string;
      html_url: string;
    };
  };
  public: boolean;
  created_at: string;
}

// processed activity for display
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

export async function getUserActivity(
  username: string,
): Promise<ProcessedActivity[]> {
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  // Build headers that are valid for browser fetch to GitHub API
  // Note: 'User-Agent' cannot be set from browsers and will be stripped.
  const baseHeaders: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  const withAuthHeaders: HeadersInit = { ...baseHeaders };
  if (token && typeof token === "string" && token.trim().length > 0) {
    // Use proper scheme casing. GitHub supports 'Bearer' for fine-grained PATs.
    withAuthHeaders["Authorization"] = `Bearer ${token.trim()}`;
  }

  const requestUrl = `https://api.github.com/users/${username}/events/public?per_page=20`;

  try {
    // Try authenticated (when token present)
    let response = await fetch(requestUrl, { headers: withAuthHeaders });

    // If unauthorized/forbidden (bad or revoked token, or env misconfigured), retry without auth
    if (response.status === 401 || response.status === 403) {
      console.warn(
        `GitHub API auth failed with ${response.status}. Retrying without token.`,
      );
      response = await fetch(requestUrl, { headers: baseHeaders });
    }

    if (!response.ok) {
      console.error(
        `GitHub API responded with ${response.status}: ${response.statusText}`,
      );
      return [];
    }

    const events: GitHubEvent[] = await response.json();
    const processed = await Promise.all(
      events.map((event) => processEvent(event, withAuthHeaders, baseHeaders)),
    );
    return processed.filter(Boolean) as ProcessedActivity[];
  } catch (error) {
    console.error("Failed to fetch user activity:", error);
    return [];
  }
}

async function processEvent(
  event: GitHubEvent,
  authHeaders: HeadersInit,
  fallbackHeaders: HeadersInit,
): Promise<ProcessedActivity | null> {
  const baseActivity = {
    id: event.id,
    repo: event.repo.name,
    repoUrl: `https://github.com/${event.repo.name}`,
    timestamp: event.created_at,
  };

  switch (event.type) {
    case "PushEvent":
      return await buildPushActivity(event, baseActivity, authHeaders, fallbackHeaders);

    case "PullRequestEvent":
      const pr = event.payload.pull_request!;
      const prAction = event.payload.action;

      return {
        ...baseActivity,
        type: "pull_request",
        action: prAction,
        title: `${prAction === "opened" ? "Opened" : prAction === "closed" ? (pr.merged ? "Merged" : "Closed") : "Updated"} pull request`,
        description: pr.title,
        url: pr.html_url,
        metadata: {
          pullNumber: pr.id,
          additions: pr.additions,
          deletions: pr.deletions,
        },
      };

    case "IssuesEvent":
      const issue = event.payload.issue!;
      const issueAction = event.payload.action;

      return {
        ...baseActivity,
        type: "issues",
        action: issueAction,
        title: `${issueAction === "opened" ? "Opened" : issueAction === "closed" ? "Closed" : "Updated"} issue`,
        description: issue.title,
        url: issue.html_url,
        metadata: {
          issueNumber: issue.id,
        },
      };

    case "CreateEvent":
      const refType = event.payload.ref_type;
      const refName = event.payload.ref;

      if (refType === "repository") {
        return {
          ...baseActivity,
          type: "create",
          title: "Created repository",
          description: event.payload.description || "No description provided",
        };
      } else if (refType === "branch") {
        return {
          ...baseActivity,
          type: "create",
          title: `Created branch ${refName}`,
          description: `New branch in ${event.repo.name}`,
          metadata: {
            branch: refName,
          },
        };
      } else if (refType === "tag") {
        return {
          ...baseActivity,
          type: "create",
          title: `Created tag ${refName}`,
          description: `New tag in ${event.repo.name}`,
          metadata: {
            tag: refName,
          },
        };
      }
      break;

    case "DeleteEvent":
      const delRefType = event.payload.ref_type;
      const delRefName = event.payload.ref;

      return {
        ...baseActivity,
        type: "delete",
        title: `Deleted ${delRefType} ${delRefName}`,
        description: `Removed ${delRefType} from ${event.repo.name}`,
        metadata: {
          branch: delRefType === "branch" ? delRefName : undefined,
          tag: delRefType === "tag" ? delRefName : undefined,
        },
      };

    case "ForkEvent":
      const fork = event.payload.forkee!;
      return {
        ...baseActivity,
        type: "fork",
        title: "Forked repository",
        description: fork.description || "No description",
        url: fork.html_url,
      };

    case "WatchEvent":
      return {
        ...baseActivity,
        type: "star",
        title: "Starred repository",
        description: `Added ${event.repo.name} to starred repositories`,
      };

    case "ReleaseEvent":
      const release = event.payload.release!;
      return {
        ...baseActivity,
        type: "release",
        action: event.payload.action,
        title: `${event.payload.action === "published" ? "Published" : "Updated"} release ${release.tag_name}`,
        description: release.name || release.tag_name,
        url: release.html_url,
        metadata: {
          tag: release.tag_name,
        },
      };

    case "MemberEvent":
      const member = event.payload.member!;
      return {
        ...baseActivity,
        type: "member",
        action: event.payload.action,
        title: `${event.payload.action === "added" ? "Added" : "Updated"} collaborator`,
        description: `${member.login} was ${event.payload.action} as collaborator`,
        url: member.html_url,
      };

    default:
      return null;
  }

  return null;
}

async function buildPushActivity(
  event: GitHubEvent,
  baseActivity: {
    id: string;
    repo: string;
    repoUrl: string;
    timestamp: string;
  },
  authHeaders: HeadersInit,
  fallbackHeaders: HeadersInit,
): Promise<ProcessedActivity | null> {
  const commits = event.payload.commits ?? [];
  const branch = event.payload.ref?.replace("refs/heads/", "") || "main";
  const size =
    typeof event.payload.size === "number" ? event.payload.size : commits.length;
  const distinctSize =
    typeof event.payload.distinct_size === "number"
      ? event.payload.distinct_size
      : size;

  let commitCount = Math.max(distinctSize, size, commits.length);
  if (!Number.isFinite(commitCount)) {
    commitCount = commits.length;
  }

  let description = commits.find((commit) => commit.message?.trim())?.message;
  description = description?.trim();

  const headSha = commits[0]?.sha || event.payload.head;

  if (!description && headSha) {
    description = await fetchCommitMessage(
      event.repo.name,
      headSha,
      authHeaders,
      fallbackHeaders,
    );
  }

  if (!description) {
    description = await fetchLatestCommitMessage(
      event.repo.name,
      branch,
      authHeaders,
      fallbackHeaders,
    );
  }

  if (!description) {
    description = event.payload.forced
      ? "Branch history was rewritten"
      : "Latest changes synchronized";
  }

  const forced = Boolean(event.payload.forced);
  const created = Boolean(event.payload.created);
  const deleted = Boolean(event.payload.deleted);

  let title: string;

  if (deleted) {
    title = `Cleared branch ${branch}`;
  } else if (commitCount > 0) {
    title = `Pushed ${commitCount} commit${commitCount !== 1 ? "s" : ""} to ${branch}`;
  } else if (forced) {
    title = `Force-pushed ${branch}`;
  } else if (created) {
    title = `Initialized ${branch}`;
  } else {
    title = `Updated ${branch}`;
  }

  return {
    ...baseActivity,
    type: "push",
    title,
    description,
    metadata: {
      commits: commitCount,
      branch,
    },
  };
}

async function fetchWithFallback(
  url: string,
  authHeaders: HeadersInit,
  fallbackHeaders: HeadersInit,
) {
  try {
    let response = await fetch(url, { headers: authHeaders });
    if (response.status === 401 || response.status === 403) {
      response = await fetch(url, { headers: fallbackHeaders });
    }
    if (!response.ok) {
      return null;
    }
    return response;
  } catch (error) {
    console.error("GitHub request failed", error);
    return null;
  }
}

async function fetchCommitMessage(
  repoFullName: string,
  sha: string,
  authHeaders: HeadersInit,
  fallbackHeaders: HeadersInit,
) {
  const url = `https://api.github.com/repos/${repoFullName}/commits/${sha}`;
  const response = await fetchWithFallback(url, authHeaders, fallbackHeaders);
  if (!response) return null;
  try {
    const data = await response.json();
    const message: string | undefined = data?.commit?.message;
    return message ? message.split("\n")[0].trim() : null;
  } catch (error) {
    console.error("Failed to parse commit response", error);
    return null;
  }
}

async function fetchLatestCommitMessage(
  repoFullName: string,
  branch: string,
  authHeaders: HeadersInit,
  fallbackHeaders: HeadersInit,
) {
  const url = `https://api.github.com/repos/${repoFullName}/commits?sha=${encodeURIComponent(branch)}&per_page=1`;
  const response = await fetchWithFallback(url, authHeaders, fallbackHeaders);
  if (!response) return null;
  try {
    const data = await response.json();
    const commit = Array.isArray(data) ? data[0] : data;
    const message: string | undefined = commit?.commit?.message;
    return message ? message.split("\n")[0].trim() : null;
  } catch (error) {
    console.error("Failed to parse commits response", error);
    return null;
  }
}
