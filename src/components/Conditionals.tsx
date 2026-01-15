/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useLocation } from "react-router-dom";
import Footer from "./Footer";

// footer visibility rules
const HIDE_FOOTER_PATHS = new Set(["/", "/404", "/a"]);

export const Conditionals = () => {
  const { pathname } = useLocation();

  const isProjectDetailPage =
    pathname.startsWith("/projects/") && pathname !== "/projects";

  const isTempPage =
    pathname.startsWith("/t/") && pathname !== "/t";

  const shouldRenderFooter =
    !HIDE_FOOTER_PATHS.has(pathname) && !isProjectDetailPage && !isTempPage;

  return <>{shouldRenderFooter && <Footer />}</>;
};
