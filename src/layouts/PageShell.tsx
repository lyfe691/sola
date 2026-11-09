/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { pageTransitionVariants } from "@/utils/transitions";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { preloadRoute } from "@/config/routes";
import { preloadable } from "@/lib/preloadable";
import { getLenis, snapScrollTo } from "@/utils/scroll";

// lazy like the route pages — the diff renderer (and shiki behind it) only
// loads once someone actually flips the mode on
const { load: loadCodeView, Component: CodeView } = preloadable(() =>
  import("@/components/deploy-diff/CodeView").then((m) => ({
    default: m.CodeView,
  })),
);

/** Lands its page: runs once the page is in the document, before it is painted. */
function Arrival({
  codeView,
  land,
}: {
  codeView: boolean;
  land: (codeView: boolean) => void;
}) {
  useLayoutEffect(() => land(codeView), [land, codeView]);
  return null;
}

// One shell for every page change: a route change and the code view taking
// the page over (or handing it back) both swap the keyed child under the same
// AnimatePresence, so they are the same transition. The page that leaves
// fades where it stands, and the window only moves in the commit that swaps
// it for the next one: nothing is ever seen scrolling away under a
// transition, and the next page is first painted where it belongs.
const PageShell = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const { active, setActive } = useCodeView();

  useEffect(() => {
    preloadRoute(pathname);
  }, [pathname]);
  useEffect(() => {
    if (active) void loadCodeView();
  }, [active]);

  // The page under the code view comes back where it was left: `resume`
  // holds that scroll position from the moment the view opens. A route
  // change under the view (command palette, back/forward) leaves it and
  // drops the position, since the page that arrives is another one.
  const resume = useRef<number | null>(null);
  const shownPath = useRef(pathname);
  useEffect(() => {
    if (pathname !== shownPath.current) {
      shownPath.current = pathname;
      resume.current = null;
      if (active) setActive(false);
    } else if (active) {
      resume.current = getLenis()?.scroll ?? window.scrollY;
    }
  }, [pathname, active, setActive]);

  // Everything arrives at the top, except the page coming back from under
  // the code view. `resume` is read and left alone: it only goes stale by a
  // route change, which clears it, or by the view opening again, which
  // replaces it.
  const land = useCallback((codeView: boolean) => {
    const back = codeView ? null : resume.current;
    snapScrollTo(back ?? 0);
    // the toggle that opened the view lives in a long-closed menu — hand
    // focus back to the page's main landmark instead
    if (back !== null)
      document.getElementById("main")?.focus({ preventScroll: true });
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active ? "code-view" : pathname}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-1 flex-col"
      >
        <Arrival codeView={active} land={land} />
        <Suspense fallback={<div className="flex-1" />}>
          {active ? <CodeView /> : children}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageShell;
