/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { ComponentType } from "react";
import current from "virtual:deep-dive-translations";
import type { Language } from "@/config/languages";
import {
  getProjectConfig,
  projectPagesConfig,
} from "@/config/project-deep-dive";
import { preloadable } from "@/lib/preloadable";

const byPath = Object.fromEntries(
  Object.values(projectPagesConfig).map((config) => [
    config.mdxPath,
    preloadable(() => import(`@/content/projects/${config.mdxPath}.mdx`)),
  ]),
);

// src/content/projects/<language>/<name>.mdx, each its own chunk
const translations = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: ComponentType }>(
      "/src/content/projects/*/*.mdx",
    ),
  ).map(([file, load]) => [
    file.replace(/^\/src\/content\/projects\/|\.mdx$/g, ""),
    preloadable(load),
  ]),
);

/**
 * Whether a deep dive reads in this language: English always does, and a
 * translation only while the build finds it current (vite/deep-dive-i18n.ts).
 */
export function isTranslated(slug: string, language: Language): boolean {
  const config = getProjectConfig(slug);
  if (!config) return false;
  return (
    language === "en" || Boolean(current[language]?.includes(config.mdxPath))
  );
}

/** a deep dive's MDX article in a language, English where it has none */
export function articleFor(slug: string | undefined, language: Language) {
  const config = slug ? getProjectConfig(slug) : undefined;
  if (!config) return undefined;
  return isTranslated(config.slug, language) && language !== "en"
    ? translations[`${language}/${config.mdxPath}`]
    : byPath[config.mdxPath];
}
