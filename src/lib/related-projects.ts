/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The deep-dive footer's picks: deep dives the reader hasn't opened yet, the
 * most related first (IDF-weighted tech overlap, so a shared rare technology
 * counts for more than a shared React); once every one has been opened, the
 * ones opened longest ago.
 */

import {
  getAllProjectSlugs,
  projectPagesConfig,
} from "@/config/project-deep-dive";

const SEEN_KEY = "sola-seen-projects";

/** slug → when the reader last opened that deep dive (ms) */
export type SeenProjects = Record<string, number>;

export function readSeenProjects(): SeenProjects {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SEEN_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, number] => typeof entry[1] === "number",
      ),
    );
  } catch {
    return {};
  }
}

export function markProjectSeen(slug: string) {
  try {
    const seen = readSeenProjects();
    seen[slug] = Date.now();
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    // storage blocked: the picks just stay relevance-ordered
  }
}

const normalize = (tech: string) => tech.toLowerCase();

export function getRelatedProjectSlugs(
  currentSlug: string,
  count: number,
  seen: SeenProjects = {},
): string[] {
  const allSlugs = getAllProjectSlugs();
  const techOf = (slug: string) =>
    new Set(projectPagesConfig[slug].technologies.map(normalize));

  const docFreq = new Map<string, number>();
  for (const slug of allSlugs) {
    for (const tech of techOf(slug)) {
      docFreq.set(tech, (docFreq.get(tech) ?? 0) + 1);
    }
  }
  const idf = (tech: string) =>
    Math.log((allSlugs.length + 1) / ((docFreq.get(tech) ?? 0) + 1));

  const currentTech = projectPagesConfig[currentSlug]
    ? techOf(currentSlug)
    : new Set<string>();

  return allSlugs
    .filter((slug) => slug !== currentSlug)
    .map((slug, order) => {
      let score = 0;
      for (const tech of techOf(slug)) {
        if (currentTech.has(tech)) score += idf(tech);
      }
      return { slug, order, score, seenAt: seen[slug] };
    })
    .sort((a, b) => {
      if (a.seenAt === undefined && b.seenAt !== undefined) return -1;
      if (a.seenAt !== undefined && b.seenAt === undefined) return 1;
      if (a.seenAt !== undefined && b.seenAt !== undefined) {
        if (a.seenAt !== b.seenAt) return a.seenAt - b.seenAt;
      }
      return b.score - a.score || a.order - b.order;
    })
    .slice(0, count)
    .map((entry) => entry.slug);
}
