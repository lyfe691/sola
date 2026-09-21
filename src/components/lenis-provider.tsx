/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisOptions } from "lenis";
import { bindLenis } from "@/utils/scroll";
import "lenis/dist/lenis.css";

/**
 * Window-root Lenis. Native scroll stays the source of truth (sticky, IO,
 * getBoundingClientRect). Nested overflow panels scroll themselves via
 * allowNestedScroll. Our own overlays call lockWindowScroll. We do not use
 * autoToggle: its stop()/start() only toggle <html> overflow and can no-op
 * if checkOverflow hasn't flipped isStopped yet (stacked/fast overlays).
 */

/**
 * Is the page scroll-locked by CSS? Overflow hidden or clip on the viewport's
 * scroller, <html> or <body>: the component library's own test, and how its
 * modal popups (select, menus, dialogs) lock the page while they are open.
 *
 * A CSS lock stops the visitor's scrolling, not a script's, and Lenis
 * scrolls by script: under an open select the page rolled on and the popup
 * rode along with its trigger. So Lenis asks this before it touches a
 * gesture, and leaves a locked page to the browser, where the lock holds and
 * a scrollable popup still scrolls itself.
 */
const pageIsScrollLocked = () =>
  [document.documentElement, document.body].some((el) =>
    /hidden|clip/.test(getComputedStyle(el).overflowY),
  );

// Lenis runs its own frame loop (ReactLenis's autoRaf). Nothing on the site
// is scroll-bound through GSAP, so there is no ScrollTrigger to share one with.
const OPTIONS = {
  anchors: true,
  allowNestedScroll: true,
  stopInertiaOnNavigate: true,
  virtualScroll: () => !pageIsScrollLocked(),
} as const satisfies LenisOptions;

function LenisBinding() {
  const lenis = useLenis();

  useEffect(() => {
    bindLenis(lenis ?? null);
    if (!lenis) return;

    // a glide still in flight when the page gets locked ends where it is
    const onScroll = () => {
      if (lenis.isScrolling === "smooth" && pageIsScrollLocked())
        lenis.scrollTo(lenis.scroll, { immediate: true, force: true });
    };
    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
      bindLenis(null);
    };
  }, [lenis]);

  return null;
}

export const LenisProvider = ({ children }: { children: ReactNode }) => (
  <ReactLenis root options={OPTIONS}>
    <LenisBinding />
    {children}
  </ReactLenis>
);
