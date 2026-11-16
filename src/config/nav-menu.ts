/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The projects the bar's Projects menu lists, each with the capture its
 * preview shows. The preview draws the card-size copy and the baked cover
 * (scripts/service-images.mjs reads this list too), and the script runs in
 * plain Node: no runtime `@/` imports here.
 */

import type { Shot } from "./services";

export const NAV_PROJECTS: Shot[] = [
  { project: "kinoa", image: "/projects/kinoa/home-desktop.webp" },
  { project: "fleetmap", image: "/projects/fleetmap/live.webp" },
  { project: "montu", image: "/projects/montu/home-desktop.webp" },
  { project: "sola", image: "/projects/sola/hero.webp" },
];

export type NavMenuKey = "projects" | "services";

/** The bar links that open a panel, by path. */
export const NAV_MENUS: Record<string, NavMenuKey | undefined> = {
  "/projects": "projects",
  "/services": "services",
};

/** The panel's width in px: the bar keeps it inside its own width. */
export const NAV_PANEL_WIDTH = 700;
