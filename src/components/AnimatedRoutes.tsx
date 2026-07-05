/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Routes, Route, Navigate } from "react-router";
import AppLayout from "@/layouts/AppLayout";
import BlankLayout from "@/layouts/BlankLayout";
import { APP_ROUTES, type RouteLayout } from "@/config/routes";

// rendered straight from the manifest (src/config/routes.ts) — routes and
// tab titles cannot drift apart because they share one source of truth
const LAYOUTS: { layout: RouteLayout; element: React.ReactElement }[] = [
  { layout: "app", element: <AppLayout /> },
  { layout: "blank", element: <BlankLayout /> },
];

export const AnimatedRoutes = () => {
  return (
    <Routes>
      {LAYOUTS.map(({ layout, element }) => (
        <Route key={layout} element={element}>
          {APP_ROUTES.filter((route) => route.layout === layout).map(
            ({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ),
          )}
        </Route>
      ))}

      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};
