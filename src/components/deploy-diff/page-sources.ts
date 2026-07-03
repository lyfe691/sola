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
 * Only AppLayout routes are listed on purpose: the toggle lives in the nav's
 * appearance menu (AppLayout is the only layout with a nav), and a route
 * change force-exits the mode — so pages under SimpleLayout/BlankLayout
 * (/certifications, /a, /projects/:slug, /404) can never show the code view.
 * If the mode ever gets another entry point, re-add their mappings here.
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
};

export function resolvePagePath(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return PAGE_PATHS[normalized] ?? null;
}
