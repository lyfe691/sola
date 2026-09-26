/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Everything the site search can find, as documents in the active language:
 * the pages, projects and every deep-dive section, skills, roles,
 * certifications and services, and the palette's commands. Deep dives are
 * written in English, so their sections are English in every language.
 */

import deepDives from "virtual:deep-dive-index";
import type { Language } from "@/config/languages";
import { LANGUAGES } from "@/config/languages";
import { MAIN_NAVIGATION, FOOTER_NAVIGATION } from "@/config/navigation";
import { PROJECTS, type ProjectArt } from "@/config/projects";
import {
  SKILL_GROUPS,
  SKILL_ALIASES,
  projectsUsing,
  type Proficiency,
} from "@/config/skills";
import { getAllCertifications } from "@/config/certifications";
import { THEMES, type Theme } from "@/config/themes";
import { buildBackgroundOptions } from "@/components/backgrounds/registry";
import { EDUCATION, WORK, resolveEntries } from "@/lib/experience";
import {
  formatMonthYear,
  formatProjectDate,
  INTL_LOCALE,
  parseYearMonth,
} from "@/lib/dates";
import { plainText } from "@/lib/plain-text";
import type { Translation } from "@/lib/translations";
import type { SearchDoc } from "./engine";

export type SiteDoc = SearchDoc &
  (
    | { kind: "page"; to: string }
    | {
        kind: "project";
        to: string;
        art: ProjectArt;
        /** its dates and whether it was built for a client */
        facts: string[];
        technologies: string[];
      }
    | {
        kind: "section";
        to: string;
        art: ProjectArt;
        /** the deep dive's hero: its project's title and tagline */
        project: string;
        tagline: string;
      }
    | {
        kind: "skill";
        to: string;
        name: string;
        level: Proficiency;
        /** the projects built with it */
        projects: { title: string; art: ProjectArt }[];
      }
    | {
        kind: "experience";
        to: string;
        company: string;
        logo?: string;
        monogram: string;
        facts: string[];
        technologies: string[];
      }
    | {
        kind: "certification";
        to: string;
        logo?: string;
        /** the certificate itself, a PDF or an image */
        document?: string;
        skills: string[];
      }
    | {
        kind: "service";
        to: string;
        service: string;
        features: string[];
      }
    | { kind: "theme"; value: Theme }
    | { kind: "language"; value: Language }
    | { kind: "background"; value: string }
    | { kind: "action"; action: "diff" }
  );

export type SiteKind = SiteDoc["kind"];

/** the order groups fall back to when their best hits tie */
export const KIND_ORDER: SiteKind[] = [
  "page",
  "action",
  "project",
  "section",
  "skill",
  "experience",
  "certification",
  "service",
  "theme",
  "language",
  "background",
];

const monogramOf = (company: string) =>
  company
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function buildSiteDocs(t: Translation, language: Language): SiteDoc[] {
  const docs: SiteDoc[] = [];
  const locale = INTL_LOCALE[language];
  const languageName = new Intl.DisplayNames([locale], { type: "language" });
  const seo = t.seo as Record<string, { description?: string } | undefined>;

  const pages = [...MAIN_NAVIGATION, ...FOOTER_NAVIGATION].map((item) => ({
    key: item.key,
    path: item.path,
    title:
      item.translationKey === "home"
        ? t.common.home
        : item.isFooter
          ? t.footer[item.translationKey as keyof typeof t.footer]
          : t.nav[item.translationKey as keyof typeof t.nav],
  }));
  pages.push({
    key: "certifications",
    path: "/certifications",
    title: t.certifications.title,
  });
  for (const page of pages) {
    docs.push({
      kind: "page",
      id: `page:${page.path}`,
      title: page.title,
      body: seo[page.key]?.description,
      to: page.path,
      boost: 2,
    });
  }

  for (const project of PROJECTS) {
    const copy = t.projects.list[project.i18nKey];
    const to =
      project.slug && project.deepDive
        ? `/projects/${project.slug}`
        : "/projects";
    docs.push({
      kind: "project",
      id: `project:${project.id}`,
      title: copy.title,
      context: copy.tagline,
      body: plainText(copy.description),
      keywords: project.technologies,
      to,
      art: project.art,
      facts: [
        formatProjectDate(locale, project.date, t.common.present),
        t.projects.kind[project.kind],
      ],
      technologies: project.technologies,
      boost: 2,
    });
    const sections =
      project.slug && project.deepDive
        ? deepDives[project.deepDive.mdxPath ?? project.slug]
        : undefined;
    for (const section of sections ?? []) {
      docs.push({
        kind: "section",
        id: `section:${project.id}:${section.id}`,
        title: section.heading,
        context: section.parent
          ? `${copy.title} · ${section.parent}`
          : copy.title,
        body: section.text,
        to: `${to}#${section.id}`,
        art: project.art,
        project: copy.title,
        tagline: copy.tagline,
      });
    }
  }

  for (const group of SKILL_GROUPS) {
    const groupLabel =
      t.skills.groups[group.id as keyof typeof t.skills.groups] ?? group.id;
    for (const skill of group.skills) {
      const using = projectsUsing(skill.name);
      const count = using.length;
      docs.push({
        kind: "skill",
        id: `skill:${skill.name}`,
        title: skill.name,
        context: [
          groupLabel,
          t.skills.levels[skill.level],
          count === 1
            ? t.skills.usedInOne
            : count > 1
              ? t.skills.usedIn.replace("{count}", String(count))
              : null,
        ]
          .filter(Boolean)
          .join(" · "),
        keywords: SKILL_ALIASES[skill.name],
        projects: using.map((p) => ({
          title: t.projects.list[p.i18nKey].title,
          art: p.art,
        })),
        to: "/skills",
        name: skill.name,
        level: skill.level,
        boost: 1,
      });
    }
  }

  for (const entry of [
    ...resolveEntries(WORK, t, language),
    ...resolveEntries(EDUCATION, t, language),
  ]) {
    docs.push({
      kind: "experience",
      id: `experience:${entry.key}`,
      title: entry.role,
      context: `${entry.company} · ${entry.period}`,
      body: [entry.description, ...entry.achievements].join(" "),
      keywords: [t.nav.experience, entry.location, ...entry.technologies],
      to: "/experience",
      company: entry.company,
      logo: entry.logo,
      monogram: entry.monogram ?? monogramOf(entry.company),
      facts: [
        entry.period,
        entry.location,
        t.experience.chips[entry.employmentType],
      ],
      technologies: entry.technologies,
      boost: 1,
    });
  }

  for (const cert of getAllCertifications()) {
    docs.push({
      kind: "certification",
      id: `certification:${cert.id}`,
      title: cert.title,
      context: `${cert.issuer} · ${formatMonthYear(locale, parseYearMonth(cert.issueDate))}`,
      keywords: [t.certifications.title, ...(cert.skills ?? [])],
      to: "/certifications",
      logo: cert.issuerLogo,
      document: cert.certificatePdf ?? cert.certificateImage,
      skills: cert.skills ?? [],
      boost: 0.5,
    });
  }

  for (const [key, service] of Object.entries(t.services.services)) {
    docs.push({
      kind: "service",
      id: `service:${key}`,
      title: service.title,
      context: service.price,
      body: service.description,
      to: "/services",
      keywords: [t.nav.services, ...service.features],
      service: key,
      features: service.features,
      boost: 0.5,
    });
  }

  for (const theme of THEMES) {
    docs.push({
      kind: "theme",
      id: `theme:${theme.value}`,
      title: theme.label,
      context: theme.isCustom
        ? t.common.menu.customThemes
        : t.common.command.groups.theme,
      value: theme.value as Theme,
    });
  }

  for (const { code, label } of LANGUAGES) {
    docs.push({
      kind: "language",
      id: `language:${code}`,
      title: label,
      // the language's name in the one being read, unless that's itself
      context:
        languageName.of(code) !== label
          ? languageName.of(code)
          : t.common.command.groups.language,
      keywords: [code, t.common.command.groups.language],
      value: code,
    });
  }

  for (const option of buildBackgroundOptions(t.common.none)) {
    docs.push({
      kind: "background",
      id: `background:${option.id}`,
      title: option.label,
      context: t.common.command.groups.background,
      value: option.id,
    });
  }

  return docs;
}
