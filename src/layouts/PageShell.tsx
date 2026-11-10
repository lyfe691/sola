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
import { useLocation, useNavigationType } from "react-router";
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

const scrollNow = () => getLenis()?.scroll ?? window.scrollY;

// One shell for every page change: a route change and the code view taking
// the page over (or handing it back) both swap the keyed child under the same
// AnimatePresence, so they are the same transition. The page that leaves
// fades where it stands, and the window only moves in the commit that swaps
// it for the next one: nothing is ever seen scrolling away under a
// transition, and the next page is first painted where it belongs.
const PageShell = ({ children }: { children: ReactNode }) => {
  const { pathname, key } = useLocation();
  const returning = useNavigationType() === "POP";
  const { active, setActive } = useCodeView();

  useEffect(() => {
    preloadRoute(pathname);
  }, [pathname]);
  useEffect(() => {
    if (active) void loadCodeView();
  }, [active]);

  // Where a page is put back, in two cases. `resume`: the page under the
  // code view comes back where it was left, held from the moment the view
  // opens. `left`: going back or forward returns each history entry to where
  // it was left, for as long as the visit lasts (a reload starts at the top).
  const resume = useRef<number | null>(null);
  const left = useRef(new Map<string, number>());
  const shown = useRef({ pathname, key, active });
  // the entry now arriving, and whether the history brought it back
  const arriving = useRef({ key, returning });
  useEffect(() => {
    const from = shown.current;
    shown.current = { pathname, key, active };
    arriving.current = { key, returning };
    if (pathname !== from.pathname) {
      // the page that leaves is still where it was left: its fade has only
      // begun. Under the code view that place is the one held for it. A
      // route change under the view (palette, back/forward) leaves the view
      left.current.set(
        from.key,
        from.active ? (resume.current ?? 0) : scrollNow(),
      );
      resume.current = null;
      if (active) setActive(false);
    } else if (active && !from.active) {
      resume.current = scrollNow();
    }
  }, [pathname, key, returning, active, setActive]);

  // Everything arrives at the top, except the page coming back from under
  // the code view and a history entry coming back to where it was left.
  // `resume` is read and left alone: it only goes stale by a route change,
  // which clears it, or by the view opening again, which replaces it.
  const land = useCallback((codeView: boolean) => {
    const back = codeView ? null : resume.current;
    if (back !== null) {
      snapScrollTo(back);
      // the toggle that opened the view lives in a long-closed menu — hand
      // focus back to the page's main landmark instead
      document.getElementById("main")?.focus({ preventScroll: true });
      return;
    }
    const entry = arriving.current;
    const place = !codeView && entry.returning && left.current.get(entry.key);
    snapScrollTo(place || 0);
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
