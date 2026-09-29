/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The site is a client-rendered SPA, and link scrapers (LinkedIn, Slack,
 * iMessage, X, Discord…) do not run JavaScript: every URL would show the home
 * card. After the bundle is written this writes one copy of the final
 * index.html per page, with that page's head tags (title, description,
 * canonical, Open Graph, Twitter, breadcrumb data) baked in, plus the sitemap
 * and a noindex 404.html. The copies share index.html's asset links and route
 * preload, which matches location.pathname at runtime, so each boots the
 * same app.
 *
 * Every string comes from the English dictionary and the project config, so
 * nothing here can drift from what the pages render.
 */

import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { ogImageUrl } from "../src/config/og-cards.ts";
import { projectPagesConfig } from "../src/config/project-deep-dive.ts";
import { PROJECTS } from "../src/config/projects.ts";
import { OWNER, ROLE, SITE_URL } from "../src/config/site.ts";
import { en, type Translation } from "../src/lib/translations/en.ts";
import { inlineText } from "./deep-dive-index.ts";
import {
  hasMarkdown,
  llmsFull,
  markdownFile,
  markdownUrl,
  pageMarkdown,
} from "./page-markdown.ts";
import { readRoutes } from "./route-preload.ts";

export { SITE_URL };
const NAME = OWNER;
/** index.html's own title: the home tab stays the name plus what I do */
export const HOME_TITLE = `${NAME} • ${ROLE}`;
const IMAGE = { width: 1200, height: 630, type: "image/png" } as const;
/** a meta description past this is cut by every search engine anyway */
const DESCRIPTION_MAX = 155;

export interface SeoPage {
  /** URL path (`/` for home). null is the 404 shell, which has no URL of its own */
  path: string | null;
  /** names the page's link-preview card in src/config/og-cards.ts */
  key: string;
  /** `<title>` and og:title */
  title: string;
  description: string;
  imageAlt: string;
  indexable: boolean;
  /** Home > … > this page. Empty where a trail adds nothing (home, noindex). */
  breadcrumbs: { name: string; path: string }[];
}

interface StaticEntry {
  label: (t: Translation) => string;
  description: (t: Translation) => string;
  indexable?: false;
}

/**
 * Every route in the manifest that is neither `/`, the catch-all nor a
 * deep dive. The label is the page's own heading, as routes.ts titles it.
 */
const STATIC_PAGES: Record<string, StaticEntry> = {
  "/about": {
    label: (t) => t.about.title,
    description: (t) => t.seo.about.description,
  },
  "/projects": {
    label: (t) => t.projects.title,
    description: (t) => t.seo.projects.description,
  },
  "/skills": {
    label: (t) => t.skills.title,
    description: (t) => t.seo.skills.description,
  },
  "/experience": {
    label: (t) => t.experience.title,
    description: (t) => t.seo.experience.description,
  },
  "/contact": {
    label: (t) => t.contact.title,
    description: (t) => t.seo.contact.description,
  },
  "/services": {
    label: (t) => t.services.title,
    description: (t) => t.seo.services.description,
  },
  "/privacy": {
    label: (t) => t.footer.privacy,
    description: (t) => t.seo.privacy.description,
  },
  "/certifications": {
    label: (t) => t.certifications.title,
    description: (t) => t.seo.certifications.description,
  },
  "/changelog": {
    label: (t) => t.changelog.title,
    description: (t) => t.seo.changelog.description,
  },
  // the colophon is deliberately noindex and disallowed in robots.txt
  "/a": {
    label: (t) => t.colophon.title,
    description: (t) => t.colophon.lede,
    indexable: false,
  },
};

const DEEP_DIVE_ROUTE = "/projects/:slug";

/**
 * A description as a search result or link card shows it: plain words on one
 * line, cut on a whole word within `max` characters and marked as cut. When a
 * sentence or clause ends near the limit, it cuts there instead, so the card
 * does not stop in the middle of a phrase.
 */
export function trimDescription(text: string, max = DESCRIPTION_MAX): string {
  const plain = inlineText(text);
  if (plain.length <= max + 5) return plain;
  const window = plain.slice(0, max + 1);
  const words = window.slice(0, window.lastIndexOf(" "));
  const end = Math.max(
    words.lastIndexOf(". "),
    words.lastIndexOf("; "),
    words.lastIndexOf(": "),
  );
  const cut = end >= max * 0.65 ? words.slice(0, end + 1) : words;
  const head = cut.replace(/[\s,;:–—-]+$/, "");
  return /[.!?]$/.test(head) ? head : `${head}…`;
}

const titled = (label: string) => `${label} • ${NAME}`;
const portfolioAlt = (label: string) => `${label}, on ${NAME}'s portfolio`;

/** the pages of the site, in manifest order, with the deep dives last */
export function buildPages(routes: string[], t: Translation): SeoPage[] {
  const home = { name: t.common.home, path: "/" };
  const pages: SeoPage[] = [];

  for (const route of routes) {
    if (route === "/") {
      pages.push({
        path: "/",
        key: "home",
        title: HOME_TITLE,
        description: t.seo.home.description,
        imageAlt: HOME_TITLE,
        indexable: true,
        breadcrumbs: [],
      });
    } else if (route === DEEP_DIVE_ROUTE) {
      for (const [slug, config] of Object.entries(projectPagesConfig)) {
        const project = t.projects.list[config.i18nKey];
        const url = `/projects/${slug}`;
        pages.push({
          path: url,
          key: slug,
          title: titled(project.title),
          description: trimDescription(project.description),
          imageAlt: `${project.title}: ${project.tagline}, on ${NAME}'s portfolio`,
          indexable: true,
          breadcrumbs: [
            home,
            { name: t.projects.title, path: "/projects" },
            { name: project.title, path: url },
          ],
        });
      }
    } else {
      const entry = STATIC_PAGES[route];
      if (!entry)
        throw new Error(
          `seo-pages: route "${route}" has no entry in STATIC_PAGES ` +
            `(vite/seo-pages.ts); it needs a label and a description`,
        );
      const label = entry.label(t);
      const indexable = entry.indexable !== false;
      pages.push({
        path: route,
        // a noindex page is not worth a card of its own
        key: indexable ? route.slice(1) : "home",
        title: titled(label),
        description: entry.description(t),
        imageAlt: indexable ? portfolioAlt(label) : HOME_TITLE,
        indexable,
        breadcrumbs: indexable ? [home, { name: label, path: route }] : [],
      });
    }
  }
  return pages;
}

/** unknown URLs: the app's own NotFound page over the same shell, noindex */
export function notFoundPage(t: Translation): SeoPage {
  return {
    path: null,
    key: "home",
    title: "404",
    description: t.seo.notFound.description,
    imageAlt: HOME_TITLE,
    indexable: false,
    breadcrumbs: [],
  };
}

/** every page in the manifest, from the files the app itself is built from */
export function sitePages(): SeoPage[] {
  return buildPages(
    readRoutes().map(({ route }) => route),
    en,
  );
}

export const pageUrl = (page: SeoPage): string =>
  `${SITE_URL}${page.path ?? "/"}`;

/** api/og.tsx draws the card; a page without one fails the build here. */
export const imageUrl = (page: SeoPage): string => ogImageUrl(page.key);

/**
 * Where a page's file goes in the output: extensionless URLs are the .html
 * file of the same name (vercel.json's cleanUrls), so `/projects/kinoa`
 * serves `projects/kinoa.html` and the canonical URL is what is requested.
 */
export function pageFile(page: SeoPage): string {
  if (page.path === null) return "404.html";
  return page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
}

export function sitemapXml(pages: SeoPage[]): string {
  const urls = pages
    .filter((page) => page.indexable && page.path !== null)
    .map(
      (page) =>
        `  <url>\n    <loc>${escapeText(pageUrl(page))}</loc>\n  </url>`,
    );
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls.join("\n")}\n</urlset>\n`
  );
}

export function breadcrumbJsonLd(page: SeoPage): string | null {
  if (!page.breadcrumbs.length) return null;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: page.breadcrumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  }).replace(/</g, "\\u003c");
}

/** index.html's WebSite and Person, which every page carries */
const WEBSITE = { "@id": `${SITE_URL}/#website` };
const PERSON = { "@id": `${SITE_URL}/#person` };

/**
 * What a page is, for search engines and agents, beyond its breadcrumbs:
 * About is the profile of the Person, Projects is the list of deep dives,
 * and a deep dive is a work of the Person's. null for every other page.
 */
export function pageJsonLd(page: SeoPage): string | null {
  const base = {
    "@context": "https://schema.org",
    url: pageUrl(page),
    name: page.title,
    isPartOf: WEBSITE,
  };
  let json: object | null = null;
  if (page.path === "/about")
    json = { ...base, "@type": "ProfilePage", mainEntity: PERSON };
  else if (page.path === "/projects")
    json = {
      ...base,
      "@type": "CollectionPage",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: PROJECTS.filter((p) => p.slug && p.deepDive)
          .sort((a, b) => a.priority - b.priority)
          .map((project, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/projects/${project.slug}`,
            name: en.projects.list[project.i18nKey].title,
          })),
      },
    };
  else if (page.path === `/projects/${page.key}`) {
    const project = projectPagesConfig[page.key];
    const copy = en.projects.list[project.i18nKey];
    const sameAs = [
      !project.linkPrivate && project.links.live,
      !project.sourcePrivate && project.links.github,
    ].filter(Boolean);
    json = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      url: pageUrl(page),
      name: copy.title,
      headline: copy.tagline,
      description: page.description,
      image: imageUrl(page),
      dateCreated: project.date.start,
      creator: PERSON,
      keywords: project.technologies.join(", "),
      isPartOf: WEBSITE,
      ...(sameAs.length ? { sameAs } : {}),
    };
  }
  return json && JSON.stringify(json).replace(/</g, "\\u003c");
}

const escapeText = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttr = (text: string) => escapeText(text).replace(/"/g, "&quot;");

/**
 * Comments and scripts pass through untouched; a meta or link tag is matched
 * with the whitespace before it, and quoted attribute values may hold `>`.
 */
const TAG =
  /<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|(\s*)<(meta|link)\b(?:[^>"']|"[^"]*"|'[^']*')*>/g;
const ATTRIBUTE = /([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
const TITLE = /<title\b[^>]*>[\s\S]*?<\/title>/;

const attributesOf = (tag: string) =>
  Object.fromEntries(
    [...tag.matchAll(ATTRIBUTE)].map(([, key, a, b]) => [key, a ?? b]),
  );

/**
 * Replaces the one tag with this identity (`<meta name="description">`,
 * `<link rel="canonical">`…), or removes it when `to` is null. A tag missing
 * from the source is an error rather than a silent skip, so index.html and
 * this file cannot disagree about what a page carries.
 */
function rewrite(
  html: string,
  el: "meta" | "link",
  attr: string,
  id: string,
  to: string | null,
): string {
  let found = 0;
  const out = html.replace(TAG, (match, space: string, tag: string) => {
    if (tag !== el || attributesOf(match)[attr] !== id) return match;
    found++;
    return found === 1 && to !== null ? `${space}${to}` : "";
  });
  if (!found)
    throw new Error(`seo-pages: index.html has no <${el} ${attr}="${id}">`);
  return out;
}

/**
 * `data-react-managed` marks a tag whose twin a React page hoists at runtime
 * (React 19 does not dedupe against static tags): main.tsx removes the baked
 * one when the twin lands.
 */
const MANAGED = "data-react-managed";

/** index.html's head, with this page's tags in place of the home page's */
export function renderPage(html: string, page: SeoPage): string {
  const url = pageUrl(page);
  const image = imageUrl(page);
  const setMeta = (
    attr: "name" | "property",
    id: string,
    content: string,
    managed = false,
  ) => {
    const tag = `<meta ${managed ? `${MANAGED} ` : ""}${attr}="${id}" content="${escapeAttr(content)}" />`;
    html = rewrite(html, "meta", attr, id, tag);
  };

  if (!TITLE.test(html))
    throw new Error("seo-pages: index.html has no <title>");
  html = html.replace(
    TITLE,
    () => `<title ${MANAGED}>${escapeText(page.title)}</title>`,
  );

  setMeta("name", "description", page.description, true);

  // the 404 shell answers for every unknown URL, so it names none
  if (page.path === null) {
    html = rewrite(html, "link", "rel", "canonical", null);
    html = rewrite(html, "meta", "property", "og:url", null);
    html = rewrite(html, "meta", "name", "twitter:url", null);
  } else {
    const link = `<link ${MANAGED} rel="canonical" href="${escapeAttr(url)}" />`;
    html = rewrite(html, "link", "rel", "canonical", link);
    setMeta("property", "og:url", url, true);
    setMeta("name", "twitter:url", url, true);
  }

  setMeta("property", "og:type", "website");
  setMeta("property", "og:title", page.title);
  setMeta("property", "og:description", page.description);
  setMeta("property", "og:image", image);
  setMeta("property", "og:image:width", String(IMAGE.width));
  setMeta("property", "og:image:height", String(IMAGE.height));
  setMeta("property", "og:image:type", IMAGE.type);
  setMeta("property", "og:image:alt", page.imageAlt);
  setMeta("name", "twitter:title", page.title);
  setMeta("name", "twitter:description", page.description);
  setMeta("name", "twitter:image", image);
  setMeta("name", "twitter:image:alt", page.imageAlt);

  if (!page.indexable) {
    setMeta("name", "robots", "noindex, nofollow", true);
    setMeta("name", "googlebot", "noindex, nofollow");
    setMeta("name", "bingbot", "noindex, nofollow");
  }

  const extra = [breadcrumbJsonLd(page), pageJsonLd(page)]
    .filter((json): json is string => json !== null)
    .map((json) => `<script type="application/ld+json">${json}</script>`);
  if (page.path !== null && hasMarkdown(page.path))
    extra.unshift(
      `<link rel="alternate" type="text/markdown" href="${escapeAttr(markdownUrl(page.path))}" />`,
    );
  if (extra.length) {
    const close = html.lastIndexOf("</head>");
    if (close < 0) throw new Error("seo-pages: index.html has no </head>");
    const at = html.lastIndexOf("\n", close) + 1;
    html =
      html.slice(0, at) +
      extra.map((tag) => `    ${tag}\n`).join("") +
      html.slice(at);
  }
  return html;
}

export function seoPages(): Plugin {
  return {
    name: "seo-pages",
    apply: "build",
    writeBundle: {
      order: "post",
      handler(options, bundle) {
        const dir = options.dir;
        const index = bundle["index.html"];
        if (!dir || index?.type !== "asset")
          throw new Error("seo-pages: no index.html in the bundle");
        const shell = String(index.source);
        const pages = sitePages();

        const write = (name: string, text: string) => {
          const file = path.join(dir, name);
          fs.mkdirSync(path.dirname(file), { recursive: true });
          fs.writeFileSync(file, text);
        };
        for (const page of [...pages, notFoundPage(en)]) {
          write(pageFile(page), renderPage(shell, page));
          const markdown = page.path && pageMarkdown(page.path);
          if (page.path && markdown) write(markdownFile(page.path), markdown);
        }
        write("sitemap.xml", sitemapXml(pages));
        write("llms-full.txt", llmsFull());
      },
    },
  };
}
