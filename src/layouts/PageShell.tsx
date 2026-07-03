/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { lazy, Suspense, useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { pageTransitionVariants } from "@/utils/transitions";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";

// lazy like the route pages — the diff renderer (and shiki behind it) only
// loads once someone actually flips the mode on
const CodeView = lazy(() =>
  import("@/components/deploy-diff/CodeView").then((m) => ({
    default: m.CodeView,
  })),
);

// Code view replaces the routed page under the SAME AnimatePresence that
// drives route transitions, so flipping the mode plays the exact page
// transition (consume -> reform) instead of inventing a new one.
const PageShell = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { active, setActive } = useCodeView();

  // A route change underneath the mode (command palette, logo) exits it.
  const prevPath = useRef(location.pathname);
  const wasActive = useRef(false);
  useEffect(() => {
    if (location.pathname === prevPath.current) return;
    prevPath.current = location.pathname;
    if (active) {
      wasActive.current = false; // the new page starts at the top — drop the saved scroll
      setActive(false);
    }
  }, [location.pathname, active, setActive]);

  // Preserve the page's scroll position across the flip.
  const savedScroll = useRef(0);
  useEffect(() => {
    if (active) {
      savedScroll.current = window.scrollY;
      wasActive.current = true;
      window.scrollTo(0, 0);
    }
  }, [active]);

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        if (!active && wasActive.current) {
          wasActive.current = false;
          window.scrollTo(0, savedScroll.current);
        }
      }}
    >
      <motion.div
        key={active ? "code-view" : location.pathname}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ transformOrigin: "50% 42%" }}
        className="flex flex-1 flex-col"
      >
        <Suspense fallback={<div className="flex-1" />}>
          {active ? <CodeView /> : children}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageShell;
