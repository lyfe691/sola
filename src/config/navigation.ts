/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Home } from "lucide-react";
import type { ElementType } from "react";
import { type Translation } from "@/lib/translations";

export interface NavigationItem {
  key: string;
  path: string;
  icon?: ElementType;
  translationKey: keyof Translation["nav"] | "home";
  isFooter?: boolean;
}

export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    key: "home",
    path: "/",
    icon: Home,
    translationKey: "home",
  },
  {
    key: "about",
    path: "/about",
    translationKey: "about",
  },
  {
    key: "experience",
    path: "/experience",
    translationKey: "experience",
  },
  {
    key: "projects",
    path: "/projects",
    translationKey: "projects",
  },
  {
    key: "skills",
    path: "/skills",
    translationKey: "skills",
  },
  {
    key: "services",
    path: "/services",
    translationKey: "services",
  },
  {
    key: "contact",
    path: "/contact",
    translationKey: "contact",
  },
];

export const FOOTER_NAVIGATION: NavigationItem[] = [
  {
    key: "privacy",
    path: "/privacy",
    translationKey: "privacy" as any, // Special case handled in footer
    isFooter: true,
  },
];
