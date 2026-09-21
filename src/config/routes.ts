/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The single route manifest: AnimatedRoutes renders from it, DocumentTitle
 * resolves tab titles from it, main.tsx starts the landing page's chunk from
 * it. A route cannot exist without a title — adding a page here is the whole
 * job.
 *
 * Title voice: the home tab is the name; every other tab is the page's own
 * localized label, alone — the same string the page shows as its heading, so
 * tab and page can never say different things.
 */

import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { matchRoutes } from "react-router";
import type { Translation } from "@/lib/translations";
import { getProjectConfig } from "@/config/project-deep-dive";

export type RouteLayout = "app" | "blank";

type RouteParams = Record<string, string | undefined>;

type PageModule = { default: ComponentType };

export interface AppRoute {
  path: string;
  /** starts the page's chunk; the router's lazy Component awaits the same one */
  load: () => Promise<PageModule>;
  Component: LazyExoticComponent<ComponentType>;
  layout: RouteLayout;
  /** tab title — resolved against the active locale */
  title: (t: Translation, params: RouteParams) => string;
}

const page = (load: () => Promise<PageModule>) => ({
  load,
  Component: lazy(load),
});

const NAME = "Yanis Sebastian Zürcher";

export const APP_ROUTES: AppRoute[] = [
  {
    path: "/",
    layout: "app",
    ...page(() => import("@/pages/Index")),
    title: () => NAME,
  },
  {
    path: "/about",
    layout: "app",
    ...page(() => import("@/pages/About")),
    title: (t) => t.about.title,
  },
  {
    path: "/projects",
    layout: "app",
    ...page(() => import("@/pages/Projects")),
    title: (t) => t.projects.title,
  },
  {
    path: "/skills",
    layout: "app",
    ...page(() => import("@/pages/Skills")),
    title: (t) => t.skills.title,
  },
  {
    path: "/experience",
    layout: "app",
    ...page(() => import("@/pages/Experience")),
    title: (t) => t.experience.title,
  },
  {
    path: "/contact",
    layout: "app",
    ...page(() => import("@/pages/Contact")),
    title: (t) => t.contact.title,
  },
  {
    path: "/services",
    layout: "app",
    ...page(() => import("@/pages/Services")),
    title: (t) => t.services.title,
  },
  {
    path: "/privacy",
    layout: "app",
    ...page(() => import("@/pages/Privacy")),
    title: (t) => t.footer.privacy,
  },
  {
    path: "/certifications",
    layout: "app",
    ...page(() => import("@/pages/Certifications")),
    title: (t) => t.certifications.title,
  },
  {
    path: "/changelog",
    layout: "app",
    ...page(() => import("@/pages/Changelog")),
    title: (t) => t.changelog.title,
  },
  {
    // catch-all, ranked last by the router: unknown paths render the 404
    // in place, keeping the attempted URL for the terminal to quote
    path: "*",
    layout: "blank",
    ...page(() => import("@/pages/NotFound")),
    title: () => "404",
  },
  {
    path: "/a",
    layout: "blank",
    ...page(() => import("@/pages/AboutThisWebsite")),
    title: (t) => t.colophon.title,
  },
  {
    path: "/projects/:slug",
    layout: "blank",
    ...page(() => import("@/pages/projects/ProjectDeepDiveRenderer")),
    title: (t, params) => {
      const config = params.slug ? getProjectConfig(params.slug) : null;
      return config ? t.projects.list[config.i18nKey].title : "404";
    },
  },
];

// matched through the router's own ranking (matchRoutes), not array order,
// so the tab title can never disagree with the page the router renders
const MATCHABLE = APP_ROUTES.map((route) => ({
  path: route.path,
  handle: route,
}));

function matchRoute(pathname: string) {
  const match = matchRoutes(MATCHABLE, pathname)?.at(-1);
  return (
    match && { route: match.route.handle as AppRoute, params: match.params }
  );
}

/** tab title for a location, in the active locale */
export function resolveTitle(pathname: string, t: Translation): string {
  const match = matchRoute(pathname);
  return match ? match.route.title(t, match.params) : "404";
}

/** layout for a location — unmatched paths get blank, same as the 404 route */
export function resolveLayout(pathname: string): RouteLayout {
  return matchRoute(pathname)?.route.layout ?? "blank";
}

/** starts the chunk of the page at a location, ahead of the first render */
export function preloadRoute(pathname: string) {
  void matchRoute(pathname)?.route.load();
}
