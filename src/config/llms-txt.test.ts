/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import llms from "../../public/llms.txt?raw";
import { LANGUAGES } from "./languages";
import { PROJECTS } from "./projects";

const listedSlugs = [
  ...llms.matchAll(/\]\(https:\/\/sola\.ysz\.life\/projects\/([^)\s]+)\)/g),
].map((match) => match[1]);

const deepDiveSlugs = PROJECTS.flatMap((project) =>
  project.slug && project.deepDive ? [project.slug] : [],
);

describe("public/llms.txt", () => {
  it("lists every project that has a deep dive", () => {
    const missing = deepDiveSlugs.filter((slug) => !listedSlugs.includes(slug));
    expect(missing).toEqual([]);
  });

  it("links only to deep dives that exist", () => {
    const unknown = listedSlugs.filter((slug) => !deepDiveSlugs.includes(slug));
    expect(unknown).toEqual([]);
  });

  it("lists each deep dive once", () => {
    expect(new Set(listedSlugs).size).toBe(listedSlugs.length);
  });

  it("names exactly the site's languages", () => {
    const names = new Intl.DisplayNames("en", { type: "language" });
    const sentence = /available in (.+?) via a language switcher/.exec(llms);
    expect(sentence, "the languages sentence is missing").not.toBeNull();

    const named = (sentence?.[1] ?? "").split(/,\s*(?:and\s+)?|\s+and\s+/);
    const expected = LANGUAGES.map(({ code }) => names.of(code) ?? code);
    expect(named.sort()).toEqual(expected.sort());
  });
});
