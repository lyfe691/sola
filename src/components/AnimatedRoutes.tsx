/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Routes, Route, useLocation } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import { APP_ROUTES } from "@/config/routes";
import { splitLocale } from "@/lib/locale";

// rendered straight from the manifest (src/config/routes.ts) — routes and
// tab titles cannot drift apart because they share one source of truth.
// every route sits under the ONE RootLayout so a single PageShell owns
// every transition (see RootLayout for why that must not be per-layout).
// The routes match the path without its language (/de/about is /about),
// and everything under them reads that location: switching language
// changes the URL but not the page, so no transition plays.
export const AnimatedRoutes = () => {
  const location = useLocation();
  const { path } = splitLocale(location.pathname);
  return (
    <Routes location={{ ...location, pathname: path }}>
      <Route element={<RootLayout />}>
        {APP_ROUTES.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>
    </Routes>
  );
};
