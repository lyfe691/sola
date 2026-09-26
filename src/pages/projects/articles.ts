/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

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

/** a deep dive's MDX article, one chunk per project */
export function articleFor(slug: string | undefined) {
  const config = slug ? getProjectConfig(slug) : undefined;
  return config ? byPath[config.mdxPath] : undefined;
}
