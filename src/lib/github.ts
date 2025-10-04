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
    return events.map(processEvent).filter(Boolean) as ProcessedActivity[];
  } catch (error) {
    console.error("Failed to fetch user activity:", error);
    return [];
  }
}

function processEvent(event: GitHubEvent): ProcessedActivity | null {
  const baseActivity = {
    id: event.id,
    repo: event.repo.name,
    repoUrl: `https://github.com/${event.repo.name}`,
    timestamp: event.created_at,
  };

  switch (event.type) {
    case "PushEvent":
      const commits = event.payload.commits || [];
      const distinctCommits = event.payload.distinct_size || commits.length;
      const branch = event.payload.ref?.replace("refs/heads/", "") || "main";

      return {
        ...baseActivity,
        type: "push",
        title: `Pushed ${distinctCommits} commit${distinctCommits !== 1 ? "s" : ""} to ${branch}`,
        description: commits[0]?.message || "No commit message",
        metadata: {
          commits: distinctCommits,
          branch: branch,
        },
      };

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
