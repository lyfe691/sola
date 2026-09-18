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
import {
  bindLenis,
  lockWindowScroll,
  unlockWindowScroll,
} from "@/utils/scroll";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Window-root Lenis. Native scroll stays the source of truth (sticky, IO,
 * getBoundingClientRect). Nested overflow panels scroll themselves via
 * allowNestedScroll. Our own overlays call lockWindowScroll; the library
 * popups (select, menus, dialogs) are covered by DocumentLockBridge. We do
 * not use autoToggle: its stop()/start() only toggle <html> overflow and can
 * no-op if checkOverflow hasn't flipped isStopped yet (stacked/fast overlays).
 */
// autoRaf off: GSAP's ticker drives lenis.raf (see LenisProvider), per the
// Lenis docs' ScrollTrigger recipe — one shared loop, no cross-loop lag.
const OPTIONS = {
  autoRaf: false,
  anchors: true,
  allowNestedScroll: true,
  stopInertiaOnNavigate: true,
} as const satisfies LenisOptions;

function LenisBinding() {
  const lenis = useLenis();

  useEffect(() => {
    bindLenis(lenis ?? null);
    if (!lenis) return;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
      bindLenis(null);
    };
  }, [lenis]);

  return null;
}

const LOCKS_SCROLL = /hidden|clip/;

/** True while someone has locked the page with an inline overflow style. */
const documentIsLocked = () =>
  [document.documentElement, document.body].some(
    ({ style }) =>
      LOCKS_SCROLL.test(style.overflowY) || LOCKS_SCROLL.test(style.overflow),
  );

/**
 * A CSS scroll lock stops the visitor's scrolling, not a script's — and
 * Lenis scrolls by script. So a modal popup from the component library
 * (it sets an inline `overflow: hidden` on <body> or <html> while open) left
 * the page rolling under it, and the popup rode along with its trigger.
 * This watches both elements' inline style and holds our own lock for as
 * long as theirs is set. Inline styles only: Lenis marks its own stop with
 * a class, so holding the lock can never look like a reason to keep it.
 */
function DocumentLockBridge() {
  useEffect(() => {
    let held = false;
    const sync = () => {
      const locked = documentIsLocked();
      if (locked === held) return;
      held = locked;
      if (locked) lockWindowScroll();
      else unlockWindowScroll();
    };

    const observer = new MutationObserver(sync);
    for (const el of [document.documentElement, document.body])
      observer.observe(el, { attributes: true, attributeFilter: ["style"] });
    sync();

    return () => {
      observer.disconnect();
      if (held) unlockWindowScroll();
    };
  }, []);

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
      <DocumentLockBridge />
      {children}
    </ReactLenis>
  );
};
