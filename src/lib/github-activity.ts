/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { queryOptions } from "@tanstack/react-query";
import type { ProcessedActivity } from "@/lib/github";

export async function fetchUserActivity(
  username: string,
): Promise<ProcessedActivity[]> {
  const res = await fetch(
    `/api/github-activity?username=${encodeURIComponent(username)}`,
  );
  if (!res.ok) throw new Error(`github-activity ${res.status}`);
  return (await res.json()) as ProcessedActivity[];
}

// Activity is fetched once per session — cache forever, like the
// module-level Map this replaced.
export const userActivityQuery = (username: string) =>
  queryOptions({
    queryKey: ["github-activity", username],
    queryFn: () => fetchUserActivity(username),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
