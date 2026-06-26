/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { ProcessedActivity } from "@/lib/github";

const activityCache = new Map<string, ProcessedActivity[]>();

const cacheKey = (username: string) => username;

export function peekUserActivity(username: string): ProcessedActivity[] | null {
  return activityCache.get(cacheKey(username)) ?? null;
}

export async function fetchUserActivity(
  username: string,
): Promise<ProcessedActivity[] | null> {
  const key = cacheKey(username);
  const cached = activityCache.get(key);
  if (cached) return cached;

  try {
    const res = await fetch(
      `/api/github-activity?username=${encodeURIComponent(username)}`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as ProcessedActivity[];
    activityCache.set(key, data);
    return data;
  } catch (error) {
    console.error("Failed to fetch user activity:", error);
    return null;
  }
}