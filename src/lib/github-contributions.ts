/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

export type ContributionActivity = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionYear = number | "last";

type ContributionResponse = {
  contributions: ContributionActivity[];
  total: Record<string, number> & { lastYear: number };
};

const API_URL = "https://github-contributions-api.jogruber.de/v4/";
const contributionCache = new Map<string, ContributionResponse>();

const cacheKey = (username: string, year: ContributionYear) =>
  `${username}:${String(year)}`;

export function peekGitHubContributions(
  username: string,
  year: ContributionYear,
): ContributionResponse | null {
  return contributionCache.get(cacheKey(username, year)) ?? null;
}

export async function fetchGitHubContributions(
  username: string,
  year: ContributionYear,
): Promise<ContributionResponse | null> {
  const key = cacheKey(username, year);
  const cached = contributionCache.get(key);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_URL}${encodeURIComponent(username)}?y=${String(year)}`);
    const data = (await res.json()) as ContributionResponse & { error?: string };
    if (!res.ok) {
      throw new Error(data.error ?? "Failed to fetch contributions");
    }
    contributionCache.set(key, data);
    return data;
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return null;
  }
}

export function getContributionTotal(
  data: ContributionResponse,
  year: ContributionYear,
): number {
  if (year === "last") return data.total.lastYear;
  return data.total[String(year)] ?? data.contributions.reduce((sum, d) => sum + d.count, 0);
}