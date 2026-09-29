/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { formatProjectDate } from "@/lib/dates";
import { en } from "@/lib/translations/en";
import { OG_CARDS, ogCard, ogHash, ogImageUrl, type OgCard } from "./og-cards";
import { projectPagesConfig } from "./project-deep-dive";
import { JOB, LOCATION, ROLE, SITE_URL } from "./site";

const HOST = new URL(SITE_URL).host;
const cards = Object.entries(OG_CARDS);

describe("OG_CARDS", () => {
  it("draws every card from the site's own copy", () => {
    for (const [key, card] of cards) {
      expect(card.title, key).not.toBe("");
      expect(card.tagline, key).not.toMatch(/\.$|^\s|\s$/);
      expect(card.path, key).toBe(
        key === "home"
          ? HOST
          : `${HOST}/${key in projectPagesConfig ? "projects/" : ""}${key}`,
      );
      expect(card.cells, key).toHaveLength(3);
      for (const [label, value] of card.cells)
        expect(label && value, `${key}: ${label}`).toBeTruthy();
    }
  });

  it("gives every deep dive its title, line, type, months and link", () => {
    for (const [slug, project] of Object.entries(projectPagesConfig)) {
      const copy = en.projects.list[project.i18nKey];
      const card = ogCard(slug)!;
      expect(card).toMatchObject({
        eyebrow: "Project",
        title: copy.title,
        tagline: copy.tagline.replace(/\.$/, ""),
      } satisfies Partial<OgCard>);
      const [type, period, where] = card.cells;
      expect(type).toEqual([
        "Type",
        `${en.projects.kind[project.kind]} project`,
      ]);
      expect(period[1].replace(" – ", " - ")).toBe(
        formatProjectDate("en-US", project.date, en.common.present),
      );
      // never a link the site itself keeps private
      const live = Boolean(project.links.live) && !project.linkPrivate;
      if (!live)
        expect(where[0] === "Source" || where[1] === "Private", slug).toBe(
          true,
        );
      if (project.sourcePrivate)
        expect(where[1], slug).not.toContain("github.com");
    }
  });

  it("leads home with what I do and gives pages the same letterhead", () => {
    expect(ogCard("home")).toMatchObject({ title: ROLE, path: HOST });
    expect(ogCard("about")?.tagline).toBe("Software developer based in Zürich");
    expect(ogCard("about")?.cells).toEqual([
      ["Role", JOB],
      ["Based in", LOCATION],
      ["Site", HOST],
    ]);
    expect(JSON.stringify(OG_CARDS)).not.toContain(en.seo.about.description);
  });

  it("answers only its own keys", () => {
    for (const key of ["", "Home", "kinoa.png", "../home", "__proto__"])
      expect(ogCard(key), key).toBeUndefined();
    for (const key of ["constructor", "toString", "hasOwnProperty"])
      expect(ogCard(key), key).toBeUndefined();
    expect(() => ogImageUrl("nope")).toThrow(/no card for "nope"/);
  });
});

describe("ogHash", () => {
  const kinoa = ogCard("kinoa")!;

  it("is stable for the same card", () => {
    expect(ogHash(kinoa)).toBe(ogHash({ ...kinoa }));
    expect(ogHash(kinoa)).toMatch(/^[0-9a-f]{8}$/);
  });

  it("changes with anything the card draws", () => {
    const base = ogHash(kinoa);
    const [type, period, where] = kinoa.cells;
    const changes: Partial<OgCard>[] = [
      { path: `${kinoa.path}x` },
      { eyebrow: "Page" },
      { title: `${kinoa.title}!` },
      { tagline: `${kinoa.tagline} again` },
      { cells: [type, ["Period", "Jan 2020"], where] },
      { cells: [type, period, ["Source", "github.com/lyfe691/kinoa"]] },
    ];
    for (const change of changes)
      expect(ogHash({ ...kinoa, ...change }), JSON.stringify(change)).not.toBe(
        base,
      );
  });

  it("tells every card apart, and puts itself in the card's URL", () => {
    const hashes = cards.map(([, card]) => ogHash(card));
    expect(new Set(hashes).size).toBe(hashes.length);
    expect(ogImageUrl("kinoa")).toBe(
      `${SITE_URL}/og/kinoa.png?v=${ogHash(kinoa)}`,
    );
  });
});
