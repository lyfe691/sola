/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Each page's text as Markdown, for AI agents and crawlers that read a page
 * without running it (the HTML they fetch has no body until the app boots).
 * seo-pages writes `<page>.md` beside each page's HTML (home is
 * `index.html.md`, after the llms.txt convention), links it from the page's
 * head, and joins every file into llms-full.txt.
 *
 * Written from the sources the pages render: en.ts, the configs, and a deep
 * dive's MDX, whose components become Markdown images and code blocks.
 * Contact (a form), Privacy (legal copy set in its component) and Changelog
 * (live git history) have none.
 */

import fs from "node:fs";
import path from "node:path";
import { getAllCertifications } from "../src/config/certifications.ts";
import {
  projectPagesConfig,
  type ProjectPageConfig,
} from "../src/config/project-deep-dive.ts";
import { PROJECTS, type ProjectMeta } from "../src/config/projects.ts";
import { OWNER, ROLE, SITE_URL } from "../src/config/site.ts";
import { SKILL_GROUPS } from "../src/config/skills.ts";
import { testimonials } from "../src/config/testimonials.ts";
import { formatProjectDate } from "../src/lib/dates.ts";
import { EDUCATION, resolveEntries, WORK } from "../src/lib/experience.ts";
import { en as t } from "../src/lib/translations/en.ts";
import { jsxEnd } from "./deep-dive-index.ts";

const CONTENT_DIR = path.resolve("src/content/projects");

const abs = (url: string) => (url.startsWith("/") ? `${SITE_URL}${url}` : url);
/** Markdown links a page's copy carries, with site paths made absolute */
const links = (text: string) => text.replace(/\]\(\//g, `](${SITE_URL}/`);
const escapeAlt = (text: string) => text.replace(/[[\]]/g, "\\$&");
const unquote = (text: string) => text.replace(/\\(["\\])/g, "$1");

/** A double-quoted JSX attribute or object property from a component's source. */
function prop(source: string, name: string, sep: "=" | ":"): string | null {
  const match = new RegExp(
    `\\b${name}\\s*${sep}\\s*"((?:\\\\.|[^"\\\\])*)"`,
  ).exec(source);
  return match ? unquote(match[1]) : null;
}

function figure(source: string, sep: "=" | ":"): string {
  const src = prop(source, "src", sep);
  if (!src) return "";
  const alt = prop(source, "alt", sep) ?? "";
  const caption = prop(source, "caption", sep);
  const video = prop(source, "video", sep);
  const notes = [
    caption && `*${caption}*`,
    video && `[Video](${abs(video)})`,
  ].filter(Boolean);
  return [`![${escapeAlt(alt)}](${abs(src)})`, ...notes].join("\n");
}

/**
 * A CodeBlock's code as the page shows it: the template literal's escapes
 * undone, and the two spaces MDX strips from every line after the first
 * (see CLAUDE.md) taken off here too.
 */
function codeBlock(source: string): string {
  const open = source.indexOf("code={`");
  if (open < 0) return "";
  let end = open + 7;
  while (end < source.length && source[end] !== "`")
    end += source[end] === "\\" ? 2 : 1;
  const code = source
    .slice(open + 7, end)
    .replace(/\\([\\`$])/g, "$1")
    .split("\n")
    .map((line, i) => (i > 0 && line.startsWith("  ") ? line.slice(2) : line))
    .join("\n");
  const lang = prop(source, "lang", "=") ?? "";
  const file = prop(source, "fileName", "=");
  const run = Math.max(0, ...(code.match(/`+/g) ?? []).map((m) => m.length));
  const fence = "`".repeat(Math.max(3, run + 1));
  return [file && `\`${file}\``, `${fence}${lang}\n${code}\n${fence}`]
    .filter(Boolean)
    .join("\n\n");
}

/**
 * A deep dive's MDX as plain Markdown: headings one level down (the page's
 * own title leads the file), site links absolute, and each component as the
 * Markdown it stands for. A component this does not know is dropped.
 */
export function mdxToMarkdown(source: string): string {
  const lines = source.split(/\r?\n/);
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fence = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fence) {
      out.push(line);
      while (i + 1 < lines.length) {
        out.push(lines[++i]);
        if (lines[i].trim().startsWith(fence[1])) break;
      }
      continue;
    }
    if (/^(import|export)\s/.test(line)) continue;
    const component = /^\s*<([A-Z][A-Za-z]*)/.exec(line);
    if (component) {
      const end = jsxEnd(lines, i);
      const block = lines.slice(i, end + 1).join("\n");
      i = end;
      if (component[1] === "CodeBlock") out.push(codeBlock(block));
      else if (component[1] === "ProjectGallery")
        out.push(
          (block.match(/\{[^{}]*\}/g) ?? [])
            .map((image) => figure(image, ":"))
            .filter(Boolean)
            .join("\n\n"),
        );
      else out.push(figure(block, "="));
      continue;
    }
    out.push(links(line.replace(/^(#{1,5})(?=\s)/, "#$1")));
  }
  return tidy(out.join("\n"));
}

/** one blank line between blocks, one newline at the end */
const tidy = (text: string) => `${text.replace(/\n{3,}/g, "\n\n").trim()}\n`;

const doc = (title: string, url: string, ...blocks: (string | false)[]) =>
  tidy([`# ${title}`, `URL: ${url}`, ...blocks.filter(Boolean)].join("\n\n"));

const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

const period = (project: Pick<ProjectMeta, "date">) =>
  formatProjectDate("en-US", project.date, t.common.present);

/** Where a project can be seen, as its page links it: never a private link. */
function whereToSee(project: ProjectPageConfig | ProjectMeta): string[] {
  const live = "links" in project ? project.links.live : project.link;
  const github = "links" in project ? project.links.github : project.github;
  const lines: string[] = [];
  if (project.linkPrivate) lines.push("Live: private");
  else if (live) lines.push(`Live: ${live}`);
  if (project.sourcePrivate) lines.push("Source: private");
  else if (github) lines.push(`Source: ${github}`);
  return lines;
}

const deepDiveUrl = (slug: string) => `${SITE_URL}/projects/${slug}`;

function deepDive(slug: string, project: ProjectPageConfig): string {
  const copy = t.projects.list[project.i18nKey];
  const mdx = fs.readFileSync(
    path.join(CONTENT_DIR, `${project.mdxPath}.mdx`),
    "utf8",
  );
  return doc(
    copy.title,
    deepDiveUrl(slug),
    `> ${copy.tagline}`,
    list([
      `Type: ${t.projects.kind[project.kind]} project`,
      `Period: ${period(project)}`,
      ...whereToSee(project),
      `Stack: ${project.technologies.join(", ")}`,
    ]),
    project.overview,
    mdxToMarkdown(mdx),
  );
}

/** Projects in the order the projects page features them. */
const featured = () => [...PROJECTS].sort((a, b) => a.priority - b.priority);

const PAGES: Record<string, () => string> = {
  "/": () => {
    const i = t.index;
    return doc(
      OWNER,
      `${SITE_URL}/`,
      `> ${ROLE}`,
      [i.description1, i.description2, i.description3, i.description4].join(
        " ",
      ),
      `## On this site`,
      list(
        Object.entries(MARKDOWN_TITLES).map(
          ([page, title]) =>
            `[${title()}](${markdownUrl(page)}): ${SEO_LINES[page]()}`,
        ),
      ),
    );
  },
  "/about": () => {
    const a = t.about;
    const quotes = testimonials.map((item) => {
      const copy = a.testimonials.items[item.i18nKey];
      const who = item.company
        ? a.testimonials.roleAtCompany
            .replace("{role}", copy.role)
            .replace("{company}", item.company)
        : copy.role;
      return `> ${copy.quote}\n>\n> ${item.author}, ${who}`;
    });
    return doc(
      a.title,
      `${SITE_URL}/about`,
      links(a.intro),
      links(a.hobbies),
      `## ${a.philosophy.title}`,
      list([
        a.philosophy.clean,
        a.philosophy.simplicity,
        a.philosophy.learning,
      ]),
      `## ${a.interests.title}`,
      ...(["nature", "tech", "learning", "workspace"] as const).map(
        (key) =>
          `### ${a.interests[key].title}\n\n${a.interests[key].description}`,
      ),
      `## ${a.testimonials.title}`,
      quotes.join("\n\n"),
    );
  },
  "/experience": () => {
    const e = t.experience;
    const chips = e.chips as Record<string, string>;
    const section = (
      title: string,
      entries: ReturnType<typeof resolveEntries>,
    ) =>
      [
        `## ${title}`,
        ...entries.map((entry) =>
          [
            `### ${entry.role}, ${entry.company}`,
            [
              entry.period,
              entry.location,
              chips[entry.employmentType],
              chips[entry.locationType],
            ].join(" · "),
            entry.description,
            entry.achievements.length > 0 && list(entry.achievements),
            `Technologies: ${entry.technologies.join(", ")}`,
          ]
            .filter(Boolean)
            .join("\n\n"),
        ),
      ].join("\n\n");
    return doc(
      e.title,
      `${SITE_URL}/experience`,
      e.subtitle,
      section(e.sections.work, resolveEntries(WORK, t, "en")),
      section(e.sections.education, resolveEntries(EDUCATION, t, "en")),
    );
  },
  "/skills": () => {
    const s = t.skills;
    const groups = s.groups as Record<string, string>;
    return doc(
      s.title,
      `${SITE_URL}/skills`,
      s.subtitle,
      `Levels: ${Object.values(s.levels).join(", ")} (lowest to highest).`,
      ...SKILL_GROUPS.map(
        (group) =>
          `## ${groups[group.id]}\n\n${list(
            group.skills.map(
              (skill) => `${skill.name}: ${s.levels[skill.level]}`,
            ),
          )}`,
      ),
    );
  },
  "/services": () => {
    const s = t.services;
    return doc(
      s.title,
      `${SITE_URL}/services`,
      s.subtitle,
      ...Object.values(s.services).map((service) =>
        [
          `## ${service.title}`,
          service.description,
          `Price: ${service.price}`,
          list(service.features),
        ].join("\n\n"),
      ),
      `## ${s.customRequirements.title}`,
      s.customRequirements.description,
    );
  },
  "/certifications": () => {
    const c = t.certifications;
    const month = (iso: string) =>
      new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
    return doc(
      c.title,
      `${SITE_URL}/certifications`,
      ...getAllCertifications().map((cert) =>
        [
          `## ${cert.title}`,
          list(
            [
              `Issuer: ${cert.issuer}`,
              `Issued: ${month(cert.issueDate)}`,
              cert.expirationDate &&
                `${c.expires}: ${month(cert.expirationDate)}`,
              cert.credentialId && `${c.credentialId}: ${cert.credentialId}`,
              cert.url && `${c.verify}: ${cert.url}`,
              cert.skills?.length && `Skills: ${cert.skills.join(", ")}`,
            ].filter((line): line is string => Boolean(line)),
          ),
        ].join("\n\n"),
      ),
    );
  },
  "/projects": () =>
    doc(
      t.projects.title,
      `${SITE_URL}/projects`,
      t.seo.projects.description,
      ...featured().map((project) => {
        const copy = t.projects.list[project.i18nKey];
        return [
          `## ${copy.title}`,
          `> ${copy.tagline}`,
          links(copy.description),
          list([
            `Type: ${t.projects.kind[project.kind]} project`,
            `Period: ${period(project)}`,
            ...whereToSee(project),
            ...(project.slug && project.deepDive
              ? [`Deep dive: ${markdownUrl(`/projects/${project.slug}`)}`]
              : []),
          ]),
        ].join("\n\n");
      }),
    ),
};

/** what home's list calls each page, and the line it gives it */
const MARKDOWN_TITLES: Record<string, () => string> = {
  "/about": () => t.about.title,
  "/experience": () => t.experience.title,
  "/skills": () => t.skills.title,
  "/services": () => t.services.title,
  "/certifications": () => t.certifications.title,
  "/projects": () => t.projects.title,
};
const SEO_LINES: Record<string, () => string> = {
  "/about": () => t.seo.about.description,
  "/experience": () => t.seo.experience.description,
  "/skills": () => t.seo.skills.description,
  "/services": () => t.seo.services.description,
  "/certifications": () => t.seo.certifications.description,
  "/projects": () => t.seo.projects.description,
};

/** The page's Markdown, or null for a page that has none. */
export function pageMarkdown(pagePath: string): string | null {
  const page = PAGES[pagePath];
  if (page) return page();
  const slug = /^\/projects\/([^/]+)$/.exec(pagePath)?.[1];
  const project = slug ? projectPagesConfig[slug] : undefined;
  return slug && project ? deepDive(slug, project) : null;
}

export const hasMarkdown = (pagePath: string): boolean =>
  pagePath in PAGES ||
  (pagePath.startsWith("/projects/") &&
    pagePath.slice("/projects/".length) in projectPagesConfig);

/** Where a page's Markdown goes in the output: `/about` → `about.md`. */
export const markdownFile = (pagePath: string): string =>
  pagePath === "/" ? "index.html.md" : `${pagePath.slice(1)}.md`;

export const markdownUrl = (pagePath: string): string =>
  `${SITE_URL}/${markdownFile(pagePath)}`;

/**
 * Every page's Markdown in one file: home, the pages as its list orders
 * them, then the deep dives in the order the projects page features them.
 */
export function llmsFull(): string {
  const deepDives = featured()
    .filter((project) => project.slug && project.deepDive)
    .map((project) => `/projects/${project.slug}`);
  const pages = ["/", ...Object.keys(MARKDOWN_TITLES), ...deepDives];
  return `${pages.map((page) => pageMarkdown(page)!.trimEnd()).join("\n\n---\n\n")}\n`;
}
