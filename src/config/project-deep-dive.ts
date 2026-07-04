/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  PROJECTS,
  type ProjectDeepDiveMeta,
  type ProjectI18nKey,
  type ProjectMeta,
} from "./projects";

export interface ProjectPageConfig {
  slug: string;
  i18nKey: ProjectI18nKey;
  mdxPath: string;
  tagline?: string;
  overview: string;
  technologies: string[];
  date: string;
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
  silk: ProjectDeepDiveMeta["silk"];
}

type ProjectWithDeepDive = ProjectMeta & {
  slug: string;
  deepDive: ProjectDeepDiveMeta;
};

function isProjectWithDeepDive(
  project: ProjectMeta,
): project is ProjectWithDeepDive {
  return Boolean(project.slug && project.deepDive);
}

function toPageConfig(project: ProjectWithDeepDive): ProjectPageConfig {
  return {
    slug: project.slug,
    i18nKey: project.i18nKey,
    mdxPath: project.deepDive.mdxPath ?? project.slug,
    tagline: project.deepDive.tagline,
    overview: project.deepDive.overview,
    technologies: project.technologies,
    date: project.date.display,
    links: {
      live: project.link,
      github: project.github,
      demo: project.deepDive.demo,
    },
    silk: project.deepDive.silk,
  };
}

export const projectPagesConfig: Record<string, ProjectPageConfig> =
  Object.fromEntries(
    PROJECTS.filter(isProjectWithDeepDive).map((project) => [
      project.slug,
      toPageConfig(project),
    ]),
  );

export const getProjectConfig = (slug: string): ProjectPageConfig | null =>
  projectPagesConfig[slug] ?? null;

export const getAllProjectSlugs = (): string[] =>
  Object.keys(projectPagesConfig);
