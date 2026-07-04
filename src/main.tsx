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

// index.html ships a static <title>/<meta name="description"> for the pre-boot
// window and raw-HTML crawlers. Pages own them via React 19 native metadata,
// which doesn't dedupe against static tags — so the statics are removed the
// moment React hoists its first <title>. The observer fires as a microtask,
// before paint, so there is never a visible gap or duplicate.
const staticHeadTags = document.querySelectorAll("head > [data-react-managed]");
if (staticHeadTags.length > 0) {
  const headObserver = new MutationObserver(() => {
    if (document.querySelector("head > title:not([data-react-managed])")) {
      staticHeadTags.forEach((el) => el.remove());
      headObserver.disconnect();
    }
  });
  headObserver.observe(document.head, { childList: true });
}

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
      <App />
      <Analytics />
    </ErrorBoundary>
  </React.StrictMode>,
);
