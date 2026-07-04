/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The single route manifest: AnimatedRoutes renders from it, DocumentTitle
 * resolves tab titles from it. A route cannot exist without a title — adding
 * a page here is the whole job.
 *
 * Title voice: the home tab is the name; every other tab is the page's own
 * localized label, alone — the same string the page shows as its heading, so
 * tab and page can never say different things.
 */

import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { matchRoutes } from "react-router";
import type { Translation } from "@/lib/translations";
import { getProjectConfig } from "@/config/project-deep-dive";

export type RouteLayout = "app" | "simple" | "blank";

type RouteParams = Record<string, string | undefined>;

export interface AppRoute {
  path: string;
  Component: LazyExoticComponent<ComponentType>;
  layout: RouteLayout;
  /** tab title — resolved against the active locale */
  title: (t: Translation, params: RouteParams) => string;
}

const NAME = "Yanis Sebastian Zürcher";

export const APP_ROUTES: AppRoute[] = [
  {
    path: "/",
    layout: "app",
    Component: lazy(() => import("@/pages/Index")),
    title: () => NAME,
  },
  {
    path: "/about",
    layout: "app",
    Component: lazy(() => import("@/pages/About")),
    title: (t) => t.about.title,
  },
  {
    path: "/projects",
    layout: "app",
    Component: lazy(() => import("@/pages/Projects")),
    title: (t) => t.projects.title,
  },
  {
    path: "/skills",
    layout: "app",
    Component: lazy(() => import("@/pages/Skills")),
    title: (t) => t.skills.title,
  },
  {
    path: "/experience",
    layout: "app",
    Component: lazy(() => import("@/pages/Experience")),
    title: (t) => t.experience.title,
  },
  {
    path: "/contact",
    layout: "app",
    Component: lazy(() => import("@/pages/Contact")),
    title: (t) => t.contact.title,
  },
  {
    path: "/services",
    layout: "app",
    Component: lazy(() => import("@/pages/Services")),
    title: (t) => t.services.title,
  },
  {
    path: "/privacy",
    layout: "app",
    Component: lazy(() => import("@/pages/Privacy")),
    title: (t) => t.footer.privacy,
  },
  {
    path: "/certifications",
    layout: "simple",
    Component: lazy(() => import("@/pages/Certifications")),
    title: (t) => t.certifications?.title ?? "Certifications",
  },
  {
    path: "/404",
    layout: "blank",
    Component: lazy(() => import("@/pages/NotFound")),
    title: () => "404",
  },
  {
    path: "/a",
    layout: "blank",
    Component: lazy(() => import("@/pages/AboutThisWebsite")),
    title: () => "這個網站是怎麼造出來的",
  },
  {
    path: "/projects/:slug",
    layout: "blank",
    Component: lazy(() => import("@/pages/projects/ProjectDeepDiveRenderer")),
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

/** tab title for a location, in the active locale */
export function resolveTitle(pathname: string, t: Translation): string {
  const match = matchRoutes(MATCHABLE, pathname)?.at(-1);
  const route = match?.route.handle as AppRoute | undefined;
  if (!route) return "404";
  return route.title(t, match?.params ?? {});
}
