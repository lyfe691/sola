/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Thin client for the GitHub activity feed. The actual GitHub calls (and the
 * token) live in the serverless function at /api/github-activity, so no token
 * ever reaches the browser. This module is just the request + the shared shape.
 */

// processed activity for display (the API contract — kept in sync with the
// mirror in api/github-activity.ts)
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
  try {
    const res = await fetch(
      `/api/github-activity?username=${encodeURIComponent(username)}`,
    );
    if (!res.ok) return [];
    return (await res.json()) as ProcessedActivity[];
  } catch (error) {
    console.error("Failed to fetch user activity:", error);
    return [];
  }
}
