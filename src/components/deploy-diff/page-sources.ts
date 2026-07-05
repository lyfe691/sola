/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Route -> repo source mapping for the code view: which path a page's diff is
 * scoped to. Directories are allowed (the GitHub commits API accepts them).
 * Unmapped routes fall back to the repo-wide latest commit.
 *
 * Two entry points: AppLayout routes (listed below) flip the mode from the
 * nav's appearance menu; project deep dives flip it from their breadcrumb
 * bar and scope to their MDX source — the one file that is genuinely that
 * page. The remaining BlankLayout pages (/a, /404) have no entry point on
 * purpose, so they stay unmapped.
 */

import { projectPagesConfig } from "@/config/project-deep-dive";

const PAGE_PATHS: Record<string, string> = {
  "/": "src/pages/Index.tsx",
  "/about": "src/pages/About.tsx",
  "/projects": "src/pages/Projects.tsx",
  "/skills": "src/pages/Skills.tsx",
  "/experience": "src/pages/Experience.tsx",
  "/contact": "src/pages/Contact.tsx",
  "/services": "src/pages/Services.tsx",
  "/privacy": "src/pages/Privacy.tsx",
  "/certifications": "src/pages/Certifications.tsx",
};

export function resolvePagePath(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const slug = /^\/projects\/([^/]+)$/.exec(normalized)?.[1];
  if (slug) {
    const config = projectPagesConfig[slug];
    return config ? `src/content/projects/${config.mdxPath}.mdx` : null;
  }
  return PAGE_PATHS[normalized] ?? null;
}
