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
/**
 * The one GitHub account the widgets render. Also part of every react-query
 * key, so the calendar/feed queries and About's prefetch must all read this —
 * a second copy that drifts silently breaks the prefetch instead of failing.
 */
export const GITHUB_USER = "lyfe691";

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
