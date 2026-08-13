/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisOptions } from "lenis";
import { bindLenis } from "@/utils/scroll";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Window-root Lenis. Native scroll stays the source of truth (sticky, IO,
 * getBoundingClientRect). Nested overflow panels scroll themselves via
 * allowNestedScroll. Overlays must call lockWindowScroll — we do not use
 * autoToggle: its stop()/start() only toggle <html> overflow and can no-op
 * if checkOverflow hasn't flipped isStopped yet (stacked/fast overlays).
 */
const OPTIONS = {
  autoRaf: true,
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

export const LenisProvider = ({ children }: { children: ReactNode }) => (
  <ReactLenis root options={OPTIONS}>
    <LenisBinding />
    {children}
  </ReactLenis>
);
