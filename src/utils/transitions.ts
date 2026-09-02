/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

/**
 * Central motion system.
 *
 * Three registers, deliberately different:
 *   - UI controls (dropdowns, tooltips, hover) want to feel RESPONSIVE -> short + EASE_OUT.
 *   - Scroll reveals are the SHOWPIECE register: BIG travel (32-80px),
 *     0.6-0.8s on EASE_OUT_QUART, triggered as soon as the element's top
 *     crosses 90% of the viewport. The travel is what makes it read as
 *     animation — small offsets read as pop-in at any duration or curve.
 *     The quart-out attack starts the instant the element is reached, so
 *     big+slow still feels responsive.
 *   - The page transition (and the hero's load-in) keeps the longer glide ->
 *     SMOOTH/REVEAL with the blur-bridge.
 *
 * Easing curves mirror the CSS custom properties in src/index.css (@theme) — only curves
 * actually consumed from JS live here; CSS-only tokens (--ease-in-out, --ease-drawer,
 * --ease-pop) stay in index.css. In markup use the `ease-*` utilities; in JS import these
 * consts. Never inline a cubic-bezier or use a built-in "easeOut"/"easeInOut" string.
 */

// Custom easing curves
// EASE_OUT is a gentle easeOutCubic (not a front-loaded quint) so short hover/UI
// transitions glide instead of snapping. Mirrors --ease-out in index.css.
export const EASE_OUT = [0.33, 1, 0.68, 1] as const; // responsive-but-smooth UI (dropdowns/hover)
// The reveal curve: easeOutQuart — a fast attack you can see, then a long
// visible settle. Mirrors --ease-out-quart in index.css.
export const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const;
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const; // lush hero entrances

// Page transition: a punchy expo. The blur masks its front-loading, so it's fine here.
export const SMOOTH = [0.16, 1, 0.3, 1] as const;
// The glide curve: a symmetric ease-in-out (easeInOutQuad). Motion builds
// and settles, so the travel is visible for its whole duration — this is
// what "smooth" means to the owner's eye (out-curves read as pop-in).
// Shared by scroll reveals (short clock) and the load-in theater — hero,
// 404 terminal, colophon, code-view beats (long clock).
export const REVEAL = [0.45, 0, 0.55, 1] as const;
// Exit/consume: accelerate away (ease-in is correct for a leaving element collapsing in).
// Exported for in-page elements that leave the way a page does (code view's command beat).
export const CONSUME_IN = [0.5, 0, 0.75, 0] as const;

// Durations (seconds) — long clocks are fine BECAUSE the trigger fires
// early (top-90% of viewport) and the quart-out front-loads the visible
// motion; index delays stay capped (staggerDelay) so nothing ever waits to
// start. The 0.8s clock also outlasts the 0.5s route-transition blur, so
// above-the-fold entrances keep ~0.3s of clearly visible settle after the
// page sharpens (shorter reveals finished invisibly UNDER the blur — the
// "just appears" bug).
const D_REVEAL = 0.8;
const D_TITLE = 0.7;
const D_PAGE_TITLE = 0.65;
const D_SUBTLE = 0.6;

// ---- Page (route) transition: "consumes itself" ----
// The old page shrinks + blurs as it accelerates away (consumed inward); the new page
// re-emerges from that same blurred, slightly-scaled state and settles. Because exit ends
// exactly where enter begins (scale 0.96 / blur 8 / opacity 0), the swap under
// AnimatePresence mode="wait" reads as ONE continuous implode->reform, and the blur masks
// the content change so it feels smooth, not like a hard cut.
export const pageTransitionVariants = {
  initial: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: SMOOTH },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    filter: "blur(8px)",
    transition: { duration: 0.32, ease: CONSUME_IN },
  },
};

// ---- Scroll-reveal variants ----
// Fade + a LONG rise, nothing else — no scale, no blur. Movement is
// stripped under prefers-reduced-motion globally by <MotionConfig reducedMotion="user">.

/** the register's one shape: fade + a rise that settles on the quart-out */
const rise = (y: number, duration: number) => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: EASE_OUT_QUART },
  },
});

// Travel scales with role — and DOWN as visual mass goes up: 80px on a small
// card is lively, 80px on a full-width media card is a slab lurching.
export const scrollRevealVariants = rise(80, D_REVEAL);
export const scrollTitleVariants = rise(48, D_TITLE);
// page titles: quickest of the set so the heading LANDS FIRST
export const scrollPageTitleVariants = rise(40, D_PAGE_TITLE);
export const scrollSubtleVariants = rise(32, D_SUBTLE);
export const scrollChildVariants = rise(64, D_REVEAL);

// in-view pair for config/card pages (Certifications, Privacy) — one
// definition on the shared register so the pair can't drift
export const fadeUpVariants = rise(48, D_REVEAL);
export const cardInVariants = rise(64, D_REVEAL);

// Container/child: a tight cascade from one in-view parent (stagger is
// decorative and must never make content feel gated)
export const scrollContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

/** Page chrome (title → sort/subtitle). Wider than content stagger so the
 *  heading is visibly ahead of the control that sits on top of the list. */
export const scrollHeaderVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.16 },
  },
};

/** index delay (ms) for a grid's load or re-sort cascade, capped so late
 * cards never wait. Only applied while the grid is entering (see
 * useEntranceWindow); a card scrolled to later rises at once. */
export const staggerDelay = (index: number) => Math.min(index * 80, 240);

/** First content block waits so page chrome (title / sort) leads. */
export const HEADER_LEAD = 280;

/**
 * True while the page is still settling in. HEADER_LEAD/stagger delays
 * exist to sequence what's visible AT LOAD; on an element scrolled into
 * view later the same delay is pure wait (it sits in view doing nothing).
 * Gate load-cascade delays on this so scroll-triggered reveals fire
 * instantly. The window outlasts the longest cascade (280ms lead + 240ms
 * stagger cap + the reveal's own start).
 */
export const useEntranceWindow = (ms = 1000) => {
  const [entering, setEntering] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setEntering(false), ms);
    return () => window.clearTimeout(id);
  }, [ms]);
  return entering;
};

// ---- In-view latch (fires once). Delay is applied by ScrollReveal to the variant. ----
// Default trigger fires as soon as the element's top crosses 90% of the
// viewport (margin shrinks the observation
// box by 10% at the bottom), instead of waiting for 15% of the element to be
// visible — tall elements otherwise start late and feel laggy.
export const useScrollReveal = (options?: {
  threshold?: number;
  once?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    ...(options?.threshold !== undefined
      ? { amount: options.threshold }
      : { margin: "0px 0px -10% 0px" }),
    once: options?.once ?? true,
  });
  return { ref, isInView };
};
