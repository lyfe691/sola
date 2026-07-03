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
 */

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
  "/a": "src/pages/AboutThisWebsite.tsx",
};

export function resolvePagePath(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (PAGE_PATHS[normalized]) return PAGE_PATHS[normalized];
  // project deep dives are MDX content files
  if (normalized.startsWith("/projects/")) return "src/content/projects";
  return null;
}
