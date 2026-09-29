/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { OG_CARDS, ogCard, ogHash } from "../src/config/og-cards.ts";
import { projectPagesConfig } from "../src/config/project-deep-dive.ts";
import { en } from "../src/lib/translations/en.ts";
import { hasMarkdown, markdownUrl } from "./page-markdown.ts";
import { readRoutes } from "./route-preload.ts";
import {
  HOME_TITLE,
  SITE_URL,
  breadcrumbJsonLd,
  buildPages,
  imageUrl,
  notFoundPage,
  pageFile,
  pageUrl,
  renderPage,
  sitePages,
  sitemapXml,
  trimDescription,
  type SeoPage,
} from "./seo-pages.ts";

const INDEX = fs.readFileSync("index.html", "utf8");
const PAGES = sitePages();
const ALL = [...PAGES, notFoundPage(en)];
const byPath = (path: string) => PAGES.find((page) => page.path === path)!;

const TAGS = /<(?:meta|link)\b(?:[^>"']|"[^"]*"|'[^']*')*>/g;
const count = (html: string, attr: string, id: string) =>
  (html.match(TAGS) ?? []).filter((tag) =>
    new RegExp(`\\s${attr}="${id}"`).test(tag),
  ).length;
const content = (html: string, attr: string, id: string) => {
  const tag = (html.match(TAGS) ?? []).find((t) =>
    new RegExp(`\\s${attr}="${id}"`).test(t),
  );
  return tag?.match(/\s(?:content|href)="([^"]*)"/)?.[1];
};
const titles = (html: string) => html.match(/<title\b/g)?.length ?? 0;

describe("trimDescription", () => {
  it("reads links and emphasis as their words and collapses whitespace", () => {
    expect(
      trimDescription("[kinoa.to](https://kinoa.to) is **free**.\n  Really. "),
    ).toBe("kinoa.to is free. Really.");
  });

  it("leaves a text that fits alone", () => {
    const text = "A short description.";
    expect(trimDescription(text)).toBe(text);
  });

  it("cuts on a whole word and marks the cut", () => {
    const text = Array.from({ length: 60 }, (_, i) => `word${i}`).join(" ");
    const out = trimDescription(text, 155);
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(156);
    const head = out.slice(0, -1);
    expect(text.startsWith(head)).toBe(true);
    expect(text[head.length]).toBe(" ");
  });

  it("ends on a sentence that closes near the limit", () => {
    const first =
      "The first sentence is long enough to be worth keeping as the whole " +
      "card, and it ends exactly where a reader would stop reading.";
    const text = `${first} The second sentence carries on past the limit for a good while yet.`;
    expect(trimDescription(text, 155)).toBe(first);
  });

  it("gives every project a plain, whole-word description", () => {
    for (const config of Object.values(projectPagesConfig)) {
      const raw = en.projects.list[config.i18nKey].description;
      const out = trimDescription(raw);
      expect(out).not.toMatch(/[[\]*`]|\s{2}|^\s|\s$/);
      expect(out.length).toBeLessThanOrEqual(156);
      const head = out.replace(/…$/, "");
      const plain = raw.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").trim();
      expect(plain.startsWith(head)).toBe(true);
      expect(plain[head.length] ?? " ").toMatch(/[\s;:,.]/);
    }
  });
});

describe("pages", () => {
  it("cover every route in the manifest and every deep dive", () => {
    const routes = readRoutes().map(({ route }) => route);
    const expected = [
      ...routes.filter((route) => !route.includes(":")),
      ...Object.keys(projectPagesConfig).map((slug) => `/projects/${slug}`),
    ];
    expect(PAGES.map((page) => page.path).sort()).toEqual(expected.sort());
  });

  it("has one image key and one file per page", () => {
    const keys = PAGES.filter((page) => page.indexable).map((page) => page.key);
    expect(new Set(keys).size).toBe(keys.length);
    const files = ALL.map(pageFile);
    expect(new Set(files).size).toBe(files.length);
    expect(pageFile(byPath("/"))).toBe("index.html");
    expect(pageFile(byPath("/about"))).toBe("about.html");
    expect(pageFile(byPath("/projects/kinoa"))).toBe("projects/kinoa.html");
    expect(pageFile(notFoundPage(en))).toBe("404.html");
  });

  it("titles the home page as the name and every other page after it", () => {
    expect(byPath("/").title).toBe(HOME_TITLE);
    expect(byPath("/projects/kinoa").title).toBe(
      "Kinoa • Yanis Sebastian Zürcher",
    );
    expect(byPath("/privacy").title).toBe(
      "Privacy Policy • Yanis Sebastian Zürcher",
    );
    expect(byPath("/about").description).toBe(en.seo.about.description);
  });

  it("keeps only the colophon out of the index", () => {
    expect(PAGES.filter((page) => !page.indexable).map((p) => p.path)).toEqual([
      "/a",
    ]);
    expect(notFoundPage(en).indexable).toBe(false);
    expect(notFoundPage(en).title).toBe("404");
  });

  it("refuses a route it has no entry for", () => {
    expect(() => buildPages(["/", "/new-page"], en)).toThrow(/new-page/);
  });

  it("reads index.html's title as the home title", () => {
    const title = INDEX.match(/<title\b[^>]*>([\s\S]*?)<\/title>/)?.[1];
    expect(title?.trim()).toBe(HOME_TITLE);
  });
});

describe("link-preview cards", () => {
  it("give every page a card that says what the page says", () => {
    for (const page of ALL) {
      const card = ogCard(page.key);
      expect(
        card,
        `${page.path}: no card in src/config/og-cards.ts`,
      ).toBeDefined();
      if (!page.indexable) {
        expect(page.key, `${page.path}`).toBe("home");
        continue;
      }
      // home's tab is "name • role"; its card leads with the role, under
      // the name that every card's top band carries
      const [name, role] = page.title.split(" • ");
      expect(card?.title, page.path ?? "404").toBe(
        page.path === "/" ? role : name,
      );
    }
  });

  it("have no card without a page", () => {
    const keys = new Set(ALL.map((page) => page.key));
    expect(Object.keys(OG_CARDS).filter((key) => !keys.has(key))).toEqual([]);
  });

  it("are linked by a URL the function answers, keyed by what they say", () => {
    for (const page of ALL) {
      const url = new URL(imageUrl(page));
      expect(url.origin).toBe(SITE_URL);
      const key = url.pathname.match(/^\/og\/([a-z0-9-]+)\.png$/)?.[1];
      expect(key, url.href).toBe(page.key);
      expect(url.searchParams.get("v")).toBe(ogHash(ogCard(page.key)!));
    }
  });
});

describe("renderPage", () => {
  it("writes each page's own tags, exactly one of each", () => {
    for (const page of ALL) {
      const html = renderPage(INDEX, page);
      expect(titles(html)).toBe(1);
      const singles: [string, string][] = [
        ["name", "description"],
        ["property", "og:type"],
        ["property", "og:title"],
        ["property", "og:description"],
        ["property", "og:image"],
        ["property", "og:image:width"],
        ["property", "og:image:height"],
        ["property", "og:image:type"],
        ["property", "og:image:alt"],
        ["property", "og:site_name"],
        ["property", "og:locale"],
        ["name", "twitter:card"],
        ["name", "twitter:title"],
        ["name", "twitter:description"],
        ["name", "twitter:image"],
        ["name", "twitter:image:alt"],
        ["name", "robots"],
        ["name", "googlebot"],
        ["name", "bingbot"],
      ];
      for (const [attr, id] of singles)
        expect(count(html, attr, id), `${page.path} ${id}`).toBe(1);
      const urls: [string, string][] = [
        ["rel", "canonical"],
        ["property", "og:url"],
        ["name", "twitter:url"],
      ];
      for (const [attr, id] of urls)
        expect(count(html, attr, id), `${page.path} ${id}`).toBe(
          page.path === null ? 0 : 1,
        );
    }
  });

  it("changes nothing but the head's tags", () => {
    const home = renderPage(INDEX, byPath("/"));
    const kinoa = renderPage(INDEX, byPath("/projects/kinoa"));
    const tail = (html: string) => html.slice(html.indexOf("</head>"));
    expect(tail(kinoa)).toBe(tail(home));
    expect(tail(home)).toBe(tail(INDEX));
    const strip = (html: string) =>
      html
        .replace(TAGS, "")
        .replace(/<title\b[\s\S]*?<\/title>/, "")
        .replace(
          /<script type="application\/ld\+json">\{"@context".*<\/script>\n/g,
          "",
        )
        .replace(/\s+/g, "");
    expect(strip(kinoa)).toBe(strip(home));
  });

  it("points a deep dive's tags at the deep dive", () => {
    const html = renderPage(INDEX, byPath("/projects/kinoa"));
    const url = `${SITE_URL}/projects/kinoa`;
    expect(content(html, "rel", "canonical")).toBe(url);
    expect(content(html, "property", "og:url")).toBe(url);
    expect(content(html, "name", "twitter:url")).toBe(url);
    const card = `${SITE_URL}/og/kinoa.png?v=${ogHash(ogCard("kinoa")!)}`;
    expect(content(html, "property", "og:image")).toBe(card);
    expect(content(html, "name", "twitter:image")).toBe(card);
    expect(content(html, "property", "og:image:width")).toBe("1200");
    expect(content(html, "property", "og:image:height")).toBe("630");
    expect(content(html, "property", "og:image:type")).toBe("image/png");
    expect(content(html, "property", "og:image:alt")).toContain("Kinoa");
    expect(content(html, "property", "og:title")).toBe(
      "Kinoa • Yanis Sebastian Zürcher",
    );
    expect(content(html, "name", "robots")).toMatch(/^index, follow/);
  });

  it("marks the tags the app hoists a twin of, and only those", () => {
    const html = renderPage(INDEX, byPath("/projects/kinoa"));
    const managed = (html.match(TAGS) ?? [])
      .filter((tag) => tag.includes("data-react-managed"))
      .map((tag) => tag.match(/(?:name|property|rel)="([^"]+)"/)?.[1]);
    expect(managed.sort()).toEqual(
      ["canonical", "description", "og:url", "twitter:url"].sort(),
    );
  });

  it("makes the colophon and the 404 shell noindex", () => {
    for (const page of [byPath("/a"), notFoundPage(en)]) {
      const html = renderPage(INDEX, page);
      for (const id of ["robots", "googlebot", "bingbot"])
        expect(content(html, "name", id)).toBe("noindex, nofollow");
      expect(html).not.toContain("BreadcrumbList");
    }
  });

  it("titles the 404 shell 404", () => {
    const html = renderPage(INDEX, notFoundPage(en));
    expect(html).toMatch(/<title data-react-managed>404<\/title>/);
    expect(content(html, "property", "og:title")).toBe("404");
  });

  it("adds a breadcrumb trail to every indexable page but home", () => {
    for (const page of PAGES.filter((p) => p.indexable)) {
      const html = renderPage(INDEX, page);
      const crumbs = html.match(
        /\{"@context":"https:\/\/schema.org","@type":"BreadcrumbList".*?\]\}/,
      )?.[0];
      if (page.path === "/") {
        expect(crumbs).toBeUndefined();
        continue;
      }
      const trail = JSON.parse(crumbs ?? "null").itemListElement;
      expect(trail[0]).toMatchObject({
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      });
      expect(trail.at(-1)).toMatchObject({ item: pageUrl(page) });
      expect(trail).toHaveLength(page.path?.startsWith("/projects/") ? 3 : 2);
    }
    expect(
      JSON.parse(
        breadcrumbJsonLd(byPath("/projects/kinoa"))!,
      ).itemListElement.map((crumb: { name: string }) => crumb.name),
    ).toEqual(["Home", "Projects", "Kinoa"]);
  });

  it("links a page's Markdown from its head exactly when it has one", () => {
    for (const page of ALL) {
      const html = renderPage(INDEX, page);
      const links = (html.match(TAGS) ?? []).filter((tag) =>
        /\stype="text\/markdown"/.test(tag),
      );
      const has = page.path !== null && hasMarkdown(page.path);
      expect(links, page.path ?? "404").toHaveLength(has ? 1 : 0);
      if (has) {
        expect(links[0]).toContain('rel="alternate"');
        expect(links[0]).toContain(`href="${markdownUrl(page.path!)}"`);
      }
    }
    for (const path of ["/contact", "/privacy", "/changelog", "/a"])
      expect(hasMarkdown(path), path).toBe(false);
  });

  it("says what About, Projects and each deep dive are", () => {
    const jsonLd = (page: SeoPage) =>
      [
        ...renderPage(INDEX, page).matchAll(
          /<script type="application\/ld\+json">(\{"@context".*?)<\/script>/g,
        ),
      ].map(([, json]) => JSON.parse(json) as Record<string, unknown>);
    const typed = (page: SeoPage, type: string) =>
      jsonLd(page).find((item) => item["@type"] === type);
    const person = { "@id": `${SITE_URL}/#person` };
    const website = { "@id": `${SITE_URL}/#website` };

    expect(typed(byPath("/about"), "ProfilePage")).toMatchObject({
      url: `${SITE_URL}/about`,
      mainEntity: person,
      isPartOf: website,
    });

    const list = typed(byPath("/projects"), "CollectionPage") as {
      mainEntity: { itemListElement: { url: string; position: number }[] };
    };
    const slugs = Object.keys(projectPagesConfig);
    expect(
      list.mainEntity.itemListElement.map((item) => item.url).sort(),
    ).toEqual(slugs.map((slug) => `${SITE_URL}/projects/${slug}`).sort());

    for (const slug of slugs) {
      const page = byPath(`/projects/${slug}`);
      const work = typed(page, "CreativeWork") as {
        creator: unknown;
        image: string;
        dateCreated: string;
        sameAs?: string[];
      };
      const project = projectPagesConfig[slug];
      expect(work, slug).toMatchObject({
        url: pageUrl(page),
        creator: person,
        image: imageUrl(page),
        dateCreated: project.date.start,
      });
      // exactly the public links: never one the site itself keeps private
      const allowed = [
        !project.linkPrivate && project.links.live,
        !project.sourcePrivate && project.links.github,
      ].filter(Boolean);
      expect(work.sameAs ?? [], slug).toEqual(allowed);
    }

    const described = ["ProfilePage", "CollectionPage", "CreativeWork"];
    for (const path of ["/", "/skills", "/contact"])
      expect(
        jsonLd(byPath(path)).filter((item) =>
          described.includes(String(item["@type"])),
        ),
        path,
      ).toEqual([]);
    // the ids pages point at are declared once, in index.html
    expect(INDEX).toContain(`"@id": "${SITE_URL}/#person"`);
    expect(INDEX).toContain(`"@id": "${SITE_URL}/#website"`);
  });

  it("escapes what it writes into attributes and script tags", () => {
    const page: SeoPage = {
      ...byPath("/about"),
      title: 'A "quoted" <title> & more',
      description: 'Say "hi" <b>& bye</b>',
      breadcrumbs: [{ name: "</script><b>", path: "/about" }],
    };
    const html = renderPage(INDEX, page);
    expect(html).toContain(
      '<title data-react-managed>A "quoted" &lt;title&gt; &amp; more</title>',
    );
    expect(html).toContain(
      'content="Say &quot;hi&quot; &lt;b&gt;&amp; bye&lt;/b&gt;"',
    );
    expect(html).not.toContain("</script><b>");
    expect(html).toContain("\\u003c/script>");
  });

  it("fails loudly when index.html lacks a tag it rewrites", () => {
    const bare = "<html><head><title>x</title></head><body></body></html>";
    expect(() => renderPage(bare, byPath("/about"))).toThrow(
      /no <meta name="description">/,
    );
    expect(() => renderPage("<head></head>", byPath("/about"))).toThrow(
      /no <title>/,
    );
  });

  it("leaves tags inside comments and scripts alone", () => {
    const html = INDEX.replace(
      "<head>",
      '<head><!-- <meta name="description" content="not this"> --><script>var x = \'<meta name="description">\';</script>',
    );
    const out = renderPage(html, byPath("/about"));
    expect(out).toContain(
      '<!-- <meta name="description" content="not this"> -->',
    );
    expect(out).toContain("var x = '<meta name=\"description\">';");
  });
});

describe("sitemapXml", () => {
  const xml = sitemapXml(ALL);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc);

  it("lists every indexable page once, and nothing else", () => {
    const expected = PAGES.filter((page) => page.indexable).map(pageUrl);
    expect(locs).toEqual(expected);
    expect(locs).toContain(`${SITE_URL}/`);
    expect(locs).toContain(`${SITE_URL}/projects/vault`);
    expect(locs).not.toContain(`${SITE_URL}/a`);
    expect(locs.some((loc) => loc.endsWith("/404"))).toBe(false);
  });

  it("carries no dates or hints it cannot vouch for", () => {
    expect(xml).not.toMatch(/lastmod|changefreq|priority/);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });
});

describe("vercel.json", () => {
  const config = JSON.parse(fs.readFileSync("vercel.json", "utf8")) as {
    cleanUrls?: boolean;
    trailingSlash?: boolean;
    rewrites?: unknown[];
    redirects?: unknown[];
  };

  it("serves each page's .html at its canonical URL", () => {
    // /projects/kinoa is projects/kinoa.html; /about/ redirects to /about
    expect(config.cleanUrls).toBe(true);
    expect(config.trailingSlash).toBe(false);
  });

  it("has no catch-all, so an unknown URL is a real 404 (dist/404.html)", () => {
    // the one rewrite is the card function's, for /og/<key>.png only
    expect(config.rewrites ?? []).toEqual([
      { source: "/og/:key.png", destination: "/api/og?key=:key" },
    ]);
    expect(ALL.map(pageFile)).toContain("404.html");
  });

  it("serves the Markdown pages as UTF-8 Markdown that stays out of the index", () => {
    const rule = (
      config as {
        headers?: {
          source: string;
          headers: { key: string; value: string }[];
        }[];
      }
    ).headers?.find((entry) => entry.source === "/(.*)\\.md");
    expect(rule?.headers).toEqual(
      expect.arrayContaining([
        { key: "Content-Type", value: "text/markdown; charset=utf-8" },
        { key: "X-Robots-Tag", value: "noindex" },
      ]),
    );
  });
});

describe("robots.txt", () => {
  const lines = fs.readFileSync("public/robots.txt", "utf8").split(/\r?\n/);

  it("lets scrapers reach the card function but keeps the rest of /api/ out", () => {
    const allow = lines.indexOf("Allow: /api/og");
    const disallow = lines.indexOf("Disallow: /api/");
    expect(allow).toBeGreaterThan(-1);
    expect(disallow).toBeGreaterThan(allow);
    expect(lines.some((line) => /^Disallow: \/og\b/.test(line))).toBe(false);
  });
});
