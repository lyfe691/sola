/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { useRef } from "react";
import { useInView } from "motion/react";

/**
 * Central motion system.
 *
 * Two registers, deliberately different:
 *   - UI controls (dropdowns, tooltips, hover) want to feel RESPONSIVE -> short + EASE_OUT.
 *   - Content reveals / page transitions want to feel SMOOTH -> longer + a buttery
 *     deceleration curve (SMOOTH), a subtle scale, and a blur-bridge where it helps.
 *
 * Easing curves mirror the CSS custom properties in src/index.css (@theme). In markup use
 * the `ease-*` utilities; in JS import these consts. Never inline a cubic-bezier or use a
 * built-in "easeOut"/"easeInOut" string.
 */

// Custom easing curves
// EASE_OUT is a gentle easeOutCubic (not a front-loaded quint) so short hover/UI
// transitions glide instead of snapping. Mirrors --ease-out in index.css.
export const EASE_OUT = [0.33, 1, 0.68, 1] as const; // responsive-but-smooth UI (dropdowns/hover)
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const; // on-screen movement / FLIP
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const; // edge-sliding panels
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const; // lush hero entrances
export const EASE_POP = [0.34, 1.56, 0.64, 1] as const; // press-release pop (button active scale); tiny overshoot, tiny deltas only

// Page transition: a punchy expo. The blur masks its front-loading, so it's fine here.
export const SMOOTH = [0.16, 1, 0.3, 1] as const;
// Content reveals: a SYMMETRIC ease-in-out (easeInOutQuad). The gentle ease-IN start (y1=0) is
// what reads as smooth for this site — the element eases up from rest rather than launching at
// full speed. User-validated: "responsive" fast-start curves (expo y1≈1, the Vaul drawer) read
// as snappy/ugly here no matter the best-practice; this gentle in-out is the one that feels right.
// Scroll reveals + hero use this.
export const REVEAL = [0.45, 0, 0.55, 1] as const;
// Exit/consume: accelerate away (ease-in is correct for a leaving element collapsing in).
// Exported for in-page elements that leave the way a page does (code view's command beat).
export const CONSUME_IN = [0.5, 0, 0.75, 0] as const;

// Durations (seconds) — smooth, leaning long (smoothness beats speed for this site)
const D_REVEAL = 0.5;
const D_TITLE = 0.6;
const D_SUBTLE = 0.42;
const STANDARD_THRESHOLD = 0.15;

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

// kept for back-compat (enter timing)
export const pageTransition = { duration: 0.5, ease: SMOOTH };

// ---- Scroll-reveal variants ----
// Opacity + a graceful translate + a subtle scale, on the SMOOTH curve. Movement is
// stripped under prefers-reduced-motion globally by <MotionConfig reducedMotion="user">.

export const scrollRevealVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: D_REVEAL, ease: REVEAL },
  },
};

export const scrollTitleVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: D_TITLE, ease: REVEAL },
  },
};

// Page titles: crisp and quick so the heading LANDS FIRST, before the content below it.
// (No blur — the blur clears slowly under the ease-in start and made the title look like it
// loaded after the content. Shorter than D_REVEAL so it leads when both fire on page load.)
export const scrollPageTitleVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: REVEAL },
  },
};

export const scrollSubtleVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: D_SUBTLE, ease: REVEAL },
  },
};

// Container/child: a gentle cascade from one in-view parent
export const scrollContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

export const scrollChildVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: D_REVEAL, ease: REVEAL },
  },
};

// ---- In-view latch (fires once). Delay is applied by ScrollReveal to the variant. ----
export const useScrollReveal = (options?: {
  threshold?: number;
  once?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: options?.threshold ?? STANDARD_THRESHOLD,
    once: options?.once ?? true,
  });
  return { ref, isInView };
};
