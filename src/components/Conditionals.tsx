/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import { SearchToggle } from "./search-toggle";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

// centralized route rules for visibility
const HIDE_TOGGLES_PATHS = new Set(["/a", "/404"]);
const HIDE_FOOTER_PATHS = new Set(["/", "/404", "/a"]);

export const Conditionals = () => {
  const { pathname } = useLocation();

  const isProjectDetailPage = pathname.startsWith("/projects/") && pathname !== "/projects";

  const shouldRenderToggles = !HIDE_TOGGLES_PATHS.has(pathname) && !isProjectDetailPage;
  const shouldRenderFooter = !HIDE_FOOTER_PATHS.has(pathname) && !isProjectDetailPage;

  return (
    <>
      {shouldRenderFooter && <Footer />}

      {shouldRenderToggles && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
          <SearchToggle />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      )}
    </>
  );
};
