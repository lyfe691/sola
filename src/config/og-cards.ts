/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * What each link-preview card says. api/og.tsx draws a card from its key
 * on request; vite/seo-pages.ts links every page to its card by that key,
 * with a hash of what the card says in the URL, so a card that changes is
 * fetched again under a new URL instead of served from a stale cache.
 *
 * Titles are the pages' own, and project lines, dates and links come from
 * en.ts and the project config. A page or deep dive without a card here
 * fails the build (vite/seo-pages.ts).
 *
 * The function loads this in plain Node ESM: relative imports keep their
 * `.ts` extension and nothing is imported through `@/`.
 */

import { formatProjectDate } from "../lib/dates.ts";
import { en as t } from "../lib/translations/en.ts";
import {
  projectPagesConfig,
  type ProjectPageConfig,
} from "./project-deep-dive.ts";
import { JOB, LOCATION, ROLE, SITE_URL } from "./site.ts";

/** Bump when the card's look changes: every card then gets a new URL. */
export const OG_VERSION = 3;

/** A fact in the card's bottom row: a small label over its value. */
export type OgCell = readonly [label: string, value: string];

export interface OgCard {
  /** where the page lives, printed top right */
  path: string;
  /** over the title: what kind of page this is */
  eyebrow: string;
  title: string;
  /** one short line under the title, without a closing full stop */
  tagline: string;
  /** the bottom row, three cells */
  cells: readonly [OgCell, OgCell, OgCell];
}

const HOST = new URL(SITE_URL).host;

const firstClause = (text: string) => text.split(/[,.]/)[0];
const firstSentence = (text: string) =>
  text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;
/** A card line carries no closing full stop; a question keeps its mark. */
const bare = (line: string) => line.trim().replace(/\.$/, "");
const capitalize = (text: string) => text[0].toUpperCase() + text.slice(1);

/**
 * en.ts has no short line for most pages, only descriptions written for
 * search results; where one is too long for a card, the line is its
 * opening, cut to the point. Home's title is what I do (the byline is the
 * name), and its line is the rest of its description.
 */
const PAGES: Record<string, { title: string; line: string }> = {
  home: {
    title: ROLE,
    line: capitalize(t.seo.home.description.split("focusing on ")[1]),
  },
  about: { title: t.about.title, line: firstClause(t.seo.home.description) },
  projects: {
    title: t.projects.title,
    line: "A curated selection of my projects",
  },
  skills: { title: t.skills.title, line: t.skills.subtitle },
  experience: {
    title: t.experience.title,
    line: "A timeline of education and roles",
  },
  contact: {
    title: t.contact.title,
    line: firstSentence(t.contact.description),
  },
  services: {
    title: t.services.title,
    line: "Development and technical consulting",
  },
  privacy: {
    title: t.footer.privacy,
    line: "Hosting, analytics, processors, and your rights",
  },
  certifications: {
    title: t.certifications.title,
    line: t.seo.certifications.description,
  },
  changelog: {
    title: t.changelog.title,
    line: firstSentence(t.changelog.subtitle),
  },
};

/** Every page carries the same letterhead: who, where, and the site. */
const PAGE_CELLS: OgCard["cells"] = [
  ["Role", JOB],
  ["Based in", LOCATION],
  ["Site", HOST],
];

/**
 * Where to see a project, the way its deep dive links it: the live site
 * (the Chrome Web Store by name), else the public source, else neither.
 */
function whereToSee(project: ProjectPageConfig): OgCell {
  const { live, github } = project.links;
  if (live && !project.linkPrivate)
    return live.includes("chromewebstore")
      ? ["Live", t.common.chromeStore]
      : ["Live", new URL(live).host.replace(/^www\./, "")];
  if (github && !project.sourcePrivate)
    return ["Source", github.replace(/^https:\/\//, "")];
  return ["Live", "Private"];
}

function build(): Record<string, OgCard> {
  const cards: Record<string, OgCard> = {};
  for (const [key, page] of Object.entries(PAGES)) {
    cards[key] = {
      path: key === "home" ? HOST : `${HOST}/${key}`,
      eyebrow: "Portfolio",
      title: page.title,
      tagline: bare(page.line),
      cells: PAGE_CELLS,
    };
  }
  for (const [slug, project] of Object.entries(projectPagesConfig)) {
    if (slug in cards)
      throw new Error(`og: the deep dive "${slug}" shares a key with a page`);
    const copy = t.projects.list[project.i18nKey];
    cards[slug] = {
      path: `${HOST}/projects/${slug}`,
      eyebrow: "Project",
      title: copy.title,
      tagline: bare(copy.tagline),
      cells: [
        ["Type", `${t.projects.kind[project.kind]} project`],
        [
          "Period",
          // a range takes an en dash
          formatProjectDate("en-US", project.date, t.common.present).replace(
            " - ",
            " – ",
          ),
        ],
        whereToSee(project),
      ],
    };
  }
  return cards;
}

/** Every card, by the key its URL names: `/og/<key>.png`. */
export const OG_CARDS: Readonly<Record<string, OgCard>> = build();

/** The card for a key, or undefined for anything that is not one. */
export const ogCard = (key: string): OgCard | undefined =>
  Object.hasOwn(OG_CARDS, key) ? OG_CARDS[key] : undefined;

/** FNV-1a over everything the card draws, as 8 hex digits. */
export function ogHash(card: OgCard): string {
  const text = JSON.stringify([
    OG_VERSION,
    card.path,
    card.eyebrow,
    card.title,
    card.tagline,
    card.cells,
  ]);
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/** The card's public URL, keyed by what it says. */
export function ogImageUrl(key: string): string {
  const card = ogCard(key);
  if (!card)
    throw new Error(
      `og: no card for "${key}"; give the page one in src/config/og-cards.ts`,
    );
  return `${SITE_URL}/og/${key}.png?v=${ogHash(card)}`;
}
