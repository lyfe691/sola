/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The document title, always mounted. Page-owned <title> tags die with their
 * page mid-transition under AnimatePresence (the tab briefly showed the raw
 * URL between navigations), so the one <title> lives here, outside the
 * animated tree, resolved from the route manifest. It updates the instant
 * the route changes — before the destination page's chunk has even loaded.
 *
 * React 19 only applies a <title> whose children are ONE string; resolveTitle
 * always returns a single prebuilt string.
 */

import { useLocation } from "react-router";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { resolveTitle } from "@/config/routes";

export function DocumentTitle() {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  return <title>{resolveTitle(pathname, translations[language])}</title>;
}
