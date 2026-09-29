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
import { preloadRoute } from "@/config/routes";
import { readLanguage } from "@/lib/language-provider";
import { loadTranslation } from "@/lib/translations";

// After a redeploy, an already-open tab may request old chunk hashes that no
// longer exist. Vite fires this event when a lazy import fails — reload once
// to pick up the fresh index.html + new chunks. preventDefault stops Vite from
// re-throwing, which would flash the error boundary during the reload; on a
// repeat failure inside the guard window we skip both so the boundary shows
// instead of reload-looping.
window.addEventListener("vite:preloadError", (event) => {
  const last = Number(sessionStorage.getItem("preload-reload-at") ?? 0);
  if (Date.now() - last < 10_000) return;
  sessionStorage.setItem("preload-reload-at", String(Date.now()));
  event.preventDefault();
  window.location.reload();
});

// Every page's HTML ships its own <title>, description, canonical and url
// tags (baked at build by vite/seo-pages.ts) for the pre-boot window and
// raw-HTML crawlers. The title stays — DocumentTitle writes document.title
// imperatively, which mutates the static element in place, so no duplicate is
// ever created. The rest are different: the app hoists its own twin of each
// via React 19 native metadata, which doesn't dedupe against static tags, so
// a static tag marked data-react-managed is removed the moment its twin
// lands. The observer fires as a microtask, before paint, so there is never a
// visible gap or duplicate.
const staticTags = [
  ...document.head.querySelectorAll("[data-react-managed]:not(title)"),
].flatMap((tag) => {
  const key = ["name", "property", "rel"].find((k) => tag.hasAttribute(k));
  return key
    ? [
        {
          tag,
          twin: `${tag.localName}[${key}="${tag.getAttribute(key)}"]:not([data-react-managed])`,
        },
      ]
    : [];
});
if (staticTags.length) {
  const headObserver = new MutationObserver(() => {
    for (const entry of staticTags) {
      if (!entry.tag.isConnected || !document.head.querySelector(entry.twin))
        continue;
      entry.tag.remove();
    }
    if (staticTags.every(({ tag }) => !tag.isConnected))
      headObserver.disconnect();
  });
  headObserver.observe(document.head, { childList: true });
}

// get the root element
const rootElement = document.getElementById("root");

// small safety check
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// The visitor's dictionary is a chunk of its own unless it is English, so
// it loads before the first render, side by side with the landing page's
// chunk, which would otherwise wait for that render to ask for it. A failed
// load renders anyway: the provider retries it, and the error boundary
// answers if that fails too.
preloadRoute(window.location.pathname);
await loadTranslation(readLanguage()).catch(() => undefined);

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
