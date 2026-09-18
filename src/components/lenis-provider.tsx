/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import type { LenisOptions } from "lenis";
import { bindLenis } from "@/utils/scroll";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

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

// autoRaf off: GSAP's ticker drives lenis.raf (see LenisProvider), per the
// Lenis docs' ScrollTrigger recipe — one shared loop, no cross-loop lag.
const OPTIONS = {
  autoRaf: false,
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

    const onScroll = () => {
      ScrollTrigger.update();
      // a glide still in flight when the page gets locked ends where it is
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

export const LenisProvider = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef<LenisRef>(null);

  // The docs' GSAP sync: Lenis ticks inside gsap.ticker (seconds → ms) so
  // ScrollTrigger and the scroll interpolation share one frame loop, and
  // lag smoothing is off so scroll-bound animation never drifts from the
  // real scroll position after a hitch.
  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root options={OPTIONS} ref={lenisRef}>
      <LenisBinding />
      {children}
    </ReactLenis>
  );
};
