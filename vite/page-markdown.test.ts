/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { projectPagesConfig } from "../src/config/project-deep-dive.ts";
import { SITE_URL } from "../src/config/site.ts";
import { en } from "../src/lib/translations/en.ts";
import {
  hasMarkdown,
  llmsFull,
  markdownFile,
  markdownUrl,
  mdxToMarkdown,
  pageMarkdown,
} from "./page-markdown.ts";
import { sitePages } from "./seo-pages.ts";

const PAGES = sitePages().filter((page) => page.language === "en");
const WITH_MARKDOWN = PAGES.map((page) => page.path!).filter(hasMarkdown);

describe("mdxToMarkdown", () => {
  const mdx = [
    "# A headline",
    "",
    "See [the other one](/projects/luma) for more.",
    "",
    "<ProjectImage",
    '  src="/projects/x/a.webp"',
    '  video="/projects/x/a.mp4"',
    '  alt="A [bracketed] \\"quoted\\" view"',
    '  caption="The caption."',
    '  size="full"',
    "/>",
    "",
    "<CodeBlock",
    // as an .mdx file holds it: inner backticks and `${` escaped
    "  code={`const a = \\`\\${b}\\` + 1",
    "    if (a) return \\${a}",
    "  done()`}",
    '  fileName="src/x.ts"',
    '  lang="ts"',
    "/>",
    "",
    "<ProjectGallery",
    "  images={[",
    '    { src: "/projects/x/b.webp", frame: "safari", alt: "B", caption: "Bee." },',
    '    { src: "/projects/x/c.webp", frame: "iphone", alt: "C" },',
    "  ]}",
    "  columns={2}",
    "/>",
    "",
    "```html",
    '<Safari url="not a component here" />',
    "# not a heading",
    "```",
    "",
    "<Unknown thing />",
  ].join("\n");
  const out = mdxToMarkdown(mdx);

  it("moves headings a level down and makes site links absolute", () => {
    expect(out).toMatch(/^## A headline$/m);
    expect(out).toContain(`[the other one](${SITE_URL}/projects/luma)`);
  });

  it("turns a figure into an image with its caption and clip", () => {
    expect(out).toContain(
      `![A \\[bracketed\\] "quoted" view](${SITE_URL}/projects/x/a.webp)\n*The caption.*\n[Video](${SITE_URL}/projects/x/a.mp4)`,
    );
  });

  it("gives a code block the code the page shows", () => {
    // escapes undone, and the two spaces MDX strips (CLAUDE.md) stripped
    expect(out).toContain(
      "`src/x.ts`\n\n```ts\nconst a = `${b}` + 1\n  if (a) return ${a}\ndone()\n```",
    );
  });

  it("turns a gallery into its images and drops what it does not know", () => {
    expect(out).toContain(`![B](${SITE_URL}/projects/x/b.webp)\n*Bee.*`);
    expect(out).toContain(`![C](${SITE_URL}/projects/x/c.webp)`);
    expect(out).not.toMatch(/Unknown|columns/);
  });

  it("leaves a fenced block exactly as written", () => {
    expect(out).toContain(
      '```html\n<Safari url="not a component here" />\n# not a heading\n```',
    );
  });
});

describe("page Markdown", () => {
  it("covers every page but the form, the legal copy, the live history and the colophon", () => {
    const without = PAGES.map((page) => page.path!).filter(
      (path) => !hasMarkdown(path),
    );
    expect(without.sort()).toEqual(
      ["/a", "/changelog", "/contact", "/privacy"].sort(),
    );
    for (const path of PAGES.map((page) => page.path!))
      expect(pageMarkdown(path) !== null, path).toBe(hasMarkdown(path));
  });

  it.each(WITH_MARKDOWN)(
    "renders %s as plain Markdown with its URL",
    (path) => {
      const md = pageMarkdown(path)!;
      expect(md).toMatch(/^# \S/);
      expect(md).toContain(`URL: ${SITE_URL}${path}`);
      // nothing of the MDX or JSX survives
      expect(md).not.toMatch(/^\s*<[A-Z][A-Za-z]*/m);
      expect(md).not.toContain("code={`");
      expect(md).not.toContain("](/");
      // every image it links is a file the site serves
      for (const [, url] of md.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
        expect(url.startsWith(`${SITE_URL}/`), url).toBe(true);
        expect(fs.existsSync(`public${url.slice(SITE_URL.length)}`), url).toBe(
          true,
        );
      }
    },
  );

  it("gives each deep dive its facts, without a link the site keeps private", () => {
    for (const [slug, project] of Object.entries(projectPagesConfig)) {
      const md = pageMarkdown(`/projects/${slug}`)!;
      expect(md).toContain(`# ${en.projects.list[project.i18nKey].title}\n`);
      expect(md).toContain(`- Type: ${en.projects.kind[project.kind]} project`);
      if (project.linkPrivate) expect(md).toContain("- Live: private");
      else if (project.links.live)
        expect(md).toContain(`- Live: ${project.links.live}`);
      if (project.sourcePrivate) {
        expect(md).toContain("- Source: private");
        expect(md).not.toMatch(/- Source: https/);
      } else if (project.links.github)
        expect(md).toContain(`- Source: ${project.links.github}`);
    }
  });

  it("names its files after the page's URL", () => {
    expect(markdownFile("/")).toBe("index.html.md");
    expect(markdownFile("/about")).toBe("about.md");
    expect(markdownUrl("/projects/kinoa")).toBe(
      `${SITE_URL}/projects/kinoa.md`,
    );
  });
});

describe("llms-full.txt", () => {
  const full = llmsFull();

  it("holds every page's Markdown once, home first", () => {
    const docs = full.trimEnd().split("\n\n---\n\n");
    expect(docs).toHaveLength(WITH_MARKDOWN.length);
    expect(docs[0]).toBe(pageMarkdown("/")!.trimEnd());
    for (const path of WITH_MARKDOWN)
      expect(docs, path).toContain(pageMarkdown(path)!.trimEnd());
  });
});

describe("public/llms.txt", () => {
  const llms = fs.readFileSync("public/llms.txt", "utf8");
  const mdLinks = [
    ...llms.matchAll(/\]\((https:\/\/sola\.ysz\.life\/[^)\s]+\.md)\)/g),
  ].map(([, url]) => url);

  it("links every page's Markdown, and no Markdown the build does not write", () => {
    const urls = WITH_MARKDOWN.map(markdownUrl);
    expect([...mdLinks].sort()).toEqual([...urls].sort());
    expect(llms).toContain(`(${SITE_URL}/llms-full.txt)`);
  });
});
