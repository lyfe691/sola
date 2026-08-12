/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * One layout for every route. PageShell (and the AnimatePresence inside it)
 * must be a single instance ABOVE the app/blank split: with one shell per
 * layout, cross-layout navigations (project card -> deep dive, any page ->
 * 404) unmounted the exiting AnimatePresence itself, so the page hard-cut
 * instead of playing the consume->reform transition. Chrome (nav, callout,
 * footer) renders conditionally from the matched route's layout; the fixed
 * bars fade as a whole when the layout flips, and persist untouched across
 * same-layout navigations exactly as before.
 */

import { useLocation, useOutlet } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageShell from "./PageShell";
import { ThemeCallout } from "@/components/theme-callout";
import { resolveLayout } from "@/config/routes";
import { EASE_OUT } from "@/utils/transitions";

const RootLayout = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const isApp = resolveLayout(location.pathname) === "app";

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Skip to content
      </a>
      {/* nav + callout are fixed, so the fade wrapper never affects flow;
          initial={false} keeps first paint animation-free */}
      <AnimatePresence initial={false}>
        {isApp && (
          <motion.div
            key="chrome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            <Navigation />
            <ThemeCallout />
          </motion.div>
        )}
      </AnimatePresence>
      <PageShell>
        {isApp ? (
          <main
            id="main"
            tabIndex={-1}
            className="flex min-h-screen flex-1 flex-col px-5 pb-5 pt-24 outline-none sm:px-6 sm:pb-6 sm:pt-28 md:px-8 md:pb-8 lg:px-12 lg:pb-12 lg:pt-36"
          >
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
              {outlet}
            </div>
          </main>
        ) : (
          <main
            id="main"
            tabIndex={-1}
            className="flex min-h-screen flex-1 flex-col outline-none"
          >
            {outlet}
          </main>
        )}
        {isApp && <Footer />}
      </PageShell>
    </div>
  );
};

export default RootLayout;
