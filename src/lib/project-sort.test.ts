/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { sortProjects, type SortableProject } from "./project-sort";

const project = (
  id: string,
  priority: number,
  start: string,
  title = id,
): SortableProject & { id: string } => ({
  id,
  priority,
  title,
  date: { start },
});

const ids = (items: { id: string }[]) => items.map((p) => p.id);

// deliberately out of every order so each sort has to do real work
const PROJECTS = [
  project("c", 3, "2025-02", "Sola"),
  project("a", 1, "2025-11", "Kinoa"),
  project("d", 4, "2024-08", "Website Code Extractor"),
  project("b", 2, "2026-06", "magi"),
  project("e", 5, "2024-08", "Self"),
];

describe("sortProjects", () => {
  it("orders by priority ascending", () => {
    expect(ids(sortProjects(PROJECTS, "priority", "en-US"))).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
    ]);
  });

  it("orders newest start date first, breaking ties by priority", () => {
    expect(ids(sortProjects(PROJECTS, "date-newest", "en-US"))).toEqual([
      "b",
      "a",
      "c",
      "d",
      "e",
    ]);
  });

  it("orders oldest start date first, breaking ties by priority", () => {
    expect(ids(sortProjects(PROJECTS, "date-oldest", "en-US"))).toEqual([
      "d",
      "e",
      "c",
      "a",
      "b",
    ]);
  });

  it("treats a bare year as the start of that year", () => {
    const items = [project("month", 1, "2024-03"), project("year", 2, "2024")];
    expect(ids(sortProjects(items, "date-oldest", "en-US"))).toEqual([
      "year",
      "month",
    ]);
    expect(ids(sortProjects(items, "date-newest", "en-US"))).toEqual([
      "month",
      "year",
    ]);
  });

  it("orders names A-Z case-insensitively for the given locale", () => {
    expect(ids(sortProjects(PROJECTS, "name-asc", "en-US"))).toEqual([
      "a",
      "b",
      "e",
      "c",
      "d",
    ]);
  });

  it("orders names Z-A", () => {
    expect(ids(sortProjects(PROJECTS, "name-desc", "en-US"))).toEqual([
      "d",
      "c",
      "e",
      "b",
      "a",
    ]);
  });

  it("does not mutate its input", () => {
    const input = [...PROJECTS];
    sortProjects(input, "name-asc", "en-US");
    expect(ids(input)).toEqual(ids(PROJECTS));
  });
});
