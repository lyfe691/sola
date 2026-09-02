/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Sort orders for the projects page. Every order is total: date and name
 * sorts fall back to priority so equal keys never leave the outcome to
 * input order, and the same list always renders in the same sequence.
 */

import type { ProjectDate } from "@/lib/dates";

export const PROJECT_SORT_OPTIONS = [
  "priority",
  "date-newest",
  "date-oldest",
  "name-asc",
  "name-desc",
] as const;

export type ProjectSortOption = (typeof PROJECT_SORT_OPTIONS)[number];

export interface SortableProject {
  priority: number;
  title: string;
  date: ProjectDate;
}

const byPriority = (a: SortableProject, b: SortableProject) =>
  a.priority - b.priority;

// `YYYY-MM` / `YYYY` compare correctly as strings, and a bare year sorts
// ahead of every month in it — the same "start of year" reading
// formatProjectDate gives it.
const byStart = (a: SortableProject, b: SortableProject) =>
  a.date.start < b.date.start ? -1 : a.date.start > b.date.start ? 1 : 0;

const byTitle = (locale: string) => {
  const collator = new Intl.Collator(locale, { sensitivity: "base" });
  return (a: SortableProject, b: SortableProject) =>
    collator.compare(a.title, b.title);
};

type Comparator = (a: SortableProject, b: SortableProject) => number;

const chain =
  (...comparators: Comparator[]): Comparator =>
  (a, b) => {
    for (const compare of comparators) {
      const result = compare(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };

const reverse =
  (compare: Comparator): Comparator =>
  (a, b) =>
    compare(b, a);

const comparatorFor = (
  sortBy: ProjectSortOption,
  locale: string,
): Comparator => {
  switch (sortBy) {
    case "priority":
      return byPriority;
    case "date-newest":
      return chain(reverse(byStart), byPriority);
    case "date-oldest":
      return chain(byStart, byPriority);
    case "name-asc":
      return chain(byTitle(locale), byPriority);
    case "name-desc":
      return chain(reverse(byTitle(locale)), byPriority);
  }
};

/** Returns a new array; the input is left untouched. */
export function sortProjects<T extends SortableProject>(
  projects: readonly T[],
  sortBy: ProjectSortOption,
  locale: string,
): T[] {
  return [...projects].sort(comparatorFor(sortBy, locale));
}
