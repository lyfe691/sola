/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { queryOptions } from "@tanstack/react-query";

export type ContributionActivity = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionYear = number | "last";

export type ContributionResponse = {
  contributions: ContributionActivity[];
  total: Record<string, number> & { lastYear: number };
};

const API_URL = "https://github-contributions-api.jogruber.de/v4/";

export async function fetchGitHubContributions(
  username: string,
  year: ContributionYear,
): Promise<ContributionResponse> {
  const res = await fetch(
    `${API_URL}${encodeURIComponent(username)}?y=${String(year)}`,
  );
  const data = (await res.json()) as ContributionResponse & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to fetch contributions");
  }
  return data;
}

// Contributions don't change within a session — cache forever, like the
// module-level Map this replaced.
export const githubContributionsQuery = (
  username: string,
  year: ContributionYear,
) =>
  queryOptions({
    queryKey: ["github-contributions", username, String(year)],
    queryFn: () => fetchGitHubContributions(username, year),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    // staleTime Infinity does NOT stop focus refetches for a query that has
    // only ever errored (no data yet == always stale) — pin them off to keep
    // the old fetch-once semantics
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

export function getContributionTotal(
  data: ContributionResponse,
  year: ContributionYear,
): number {
  if (year === "last") return data.total.lastYear;
  return (
    data.total[String(year)] ??
    data.contributions.reduce((sum, d) => sum + d.count, 0)
  );
}
