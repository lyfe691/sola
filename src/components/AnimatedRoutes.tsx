/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Routes, Route } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import { APP_ROUTES } from "@/config/routes";

// rendered straight from the manifest (src/config/routes.ts) — routes and
// tab titles cannot drift apart because they share one source of truth.
// every route sits under the ONE RootLayout so a single PageShell owns
// every transition (see RootLayout for why that must not be per-layout)
export const AnimatedRoutes = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {APP_ROUTES.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>
    </Routes>
  );
};
