/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// After a redeploy, an already-open tab may request old chunk hashes that no
// longer exist (the server then serves index.html → MIME error). Vite fires
// this event when a lazy import fails to load — reload once to pick up the
// fresh index.html + new chunks, time-guarded against reload loops.
window.addEventListener("vite:preloadError", () => {
  const last = Number(sessionStorage.getItem("preload-reload-at") ?? 0);
  if (Date.now() - last < 10_000) return;
  sessionStorage.setItem("preload-reload-at", String(Date.now()));
  window.location.reload();
});

// get the root element
const rootElement = document.getElementById("root");

// small safety check
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// create root
const root = createRoot(rootElement);

// render app with strict mode
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <App />
      </HelmetProvider>
      <Analytics />
    </ErrorBoundary>
  </React.StrictMode>,
);
