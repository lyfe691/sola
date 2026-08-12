/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Related-project picker for the deep-dive footer. Every other deep-dive is
 * scored by IDF-weighted tech overlap — sharing a rare technology says more
 * than sharing React — and the day's picks rotate through the top of that
 * ranking on a date-seeded hash, so the pair changes daily without ever
 * showing an unrelated project while a related one exists.
 */

import {
  getAllProjectSlugs,
  projectPagesConfig,
} from "@/config/project-deep-dive";

const normalize = (tech: string) => tech.toLowerCase();

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

export function getRelatedProjectSlugs(
  currentSlug: string,
  count: number,
): string[] {
  const allSlugs = getAllProjectSlugs();
  const current = projectPagesConfig[currentSlug];
  if (!current) {
    return allSlugs.filter((slug) => slug !== currentSlug).slice(0, count);
  }

  // document frequency of each tech across all deep-dives, for the IDF weight
  const docFreq = new Map<string, number>();
  for (const slug of allSlugs) {
    for (const tech of new Set(
      projectPagesConfig[slug].technologies.map(normalize),
    )) {
      docFreq.set(tech, (docFreq.get(tech) ?? 0) + 1);
    }
  }
  const idf = (tech: string) =>
    Math.log((allSlugs.length + 1) / ((docFreq.get(tech) ?? 0) + 1));

  const currentTech = new Set(current.technologies.map(normalize));
  const scored = allSlugs
    .filter((slug) => slug !== currentSlug)
    .map((slug) => {
      const tech = new Set(
        projectPagesConfig[slug].technologies.map(normalize),
      );
      let score = 0;
      for (const shared of currentTech) {
        if (tech.has(shared)) score += idf(shared);
      }
      return { slug, score };
    })
    .sort((a, b) => b.score - a.score);

  // the daily window: top four overlapping projects (all of them only when
  // nothing overlaps), entered at a date-seeded offset
  const pool = (
    scored.some((entry) => entry.score > 0)
      ? scored.filter((entry) => entry.score > 0)
      : scored
  ).slice(0, 4);
  const dayKey = new Date().toISOString().slice(0, 10);
  const rotation = pool.length
    ? hashString(dayKey + currentSlug) % pool.length
    : 0;

  const picks: string[] = [];
  for (let i = 0; i < pool.length && picks.length < count; i++) {
    picks.push(pool[(i + rotation) % pool.length].slug);
  }
  // backfill from the full ranking when the pool runs short
  for (const entry of scored) {
    if (picks.length >= count) break;
    if (!picks.includes(entry.slug)) picks.push(entry.slug);
  }
  return picks;
}
