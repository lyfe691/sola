/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { getAllProjectSlugs } from "@/config/project-deep-dive";
import { getRelatedProjectSlugs } from "./related-projects";

const slugs = getAllProjectSlugs();
const [current, ...others] = slugs;

describe("getRelatedProjectSlugs", () => {
  it("never picks the page it is on", () => {
    expect(getRelatedProjectSlugs(current, slugs.length)).not.toContain(
      current,
    );
  });

  it("picks only unopened deep dives while there are enough", () => {
    const unseen = others.slice(-2);
    const seen = Object.fromEntries(
      others.slice(0, -2).map((slug, i) => [slug, i + 1]),
    );
    expect(getRelatedProjectSlugs(current, 2, seen).sort()).toEqual(
      [...unseen].sort(),
    );
  });

  it("falls back to the ones opened longest ago", () => {
    const seen = Object.fromEntries(
      others.map((slug, i) => [slug, others.length - i]),
    );
    expect(getRelatedProjectSlugs(current, 2, seen)).toEqual(
      others.slice(-2).reverse(),
    );
  });

  it("reaches every deep dive as the reader moves through them", () => {
    const seen: Record<string, number> = {};
    let page = current;
    for (let step = 1; step <= slugs.length; step++) {
      seen[page] = step;
      page = getRelatedProjectSlugs(page, 2, seen)[0];
    }
    expect(Object.keys(seen).sort()).toEqual([...slugs].sort());
  });
});
