/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import {
  createGeneratorEasing,
  generateLinearEasing,
  spring,
  type Variants,
} from "motion/react";

/**
 * Central motion system.
 *
 * Three registers, deliberately different:
 *   - UI controls (dropdowns, tooltips, hover) want to feel RESPONSIVE -> short + EASE_OUT.
 *   - Scroll reveals: one shape for every block (<Reveal>, src/lib/reveal.ts),
 *     a fade and a short rise settling on EASE_OUT_QUART. Blocks never pick
 *     their own delays; one queue starts them in reading order, a beat
 *     apart, so order holds at any scroll speed.
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
// easeOutQuart — a fast attack you can see, then a long visible settle (a
// grid cell re-entering after a swap). Mirrors --ease-out-quart in index.css.
export const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const;
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const; // lush hero entrances

// Page transition: a punchy expo. The blur masks its front-loading, so it's fine here.
export const SMOOTH = [0.16, 1, 0.3, 1] as const;
// The glide curve: a symmetric ease-in-out (easeInOutQuad). Motion builds
// and settles, so the travel is visible for its whole duration — this is
// what "smooth" means to the owner's eye (out-curves read as pop-in).
// Shared by scroll reveals and the load-in theater — hero, 404 terminal,
// colophon, code-view beats. Mirrors --ease-smooth in index.css.
export const REVEAL = [0.45, 0, 0.55, 1] as const;
// Exit/consume: accelerate away (ease-in is correct for a leaving element collapsing in).
// Exported for in-page elements that leave the way a page does (code view's command beat).
export const CONSUME_IN = [0.5, 0, 0.75, 0] as const;

// ---- Shared-element flight (a deep-dive image travelling to the lightbox) ----
// A click moves an element that is already on screen, so it is a spring: an
// eased tween between two boxes reads as a fade from one picture to another.
// Out lands with a little weight. Back is critically damped, because the
// image returns into a hairline frame where any undershoot shows as a gap.
export const FLIGHT_OUT = {
  type: "spring",
  visualDuration: 0.32,
  bounce: 0.14,
} as const;
export const FLIGHT_BACK = {
  type: "spring",
  visualDuration: 0.28,
  bounce: 0,
} as const;

// ---- Size morph (a dialog changing size in place to fit what it shows) ----
// A spring like the flights, with a little life; the bounce stays inside
// the content's own padding.
export const MORPH = {
  type: "spring",
  visualDuration: 0.42,
  bounce: 0.18,
} as const;

/**
 * A spring as CSS timing, for motion the browser runs itself (a view
 * transition's pseudo-elements): the spring's full settle time, and a
 * linear() curve sampled from motion's own generator — the same spring as
 * the rest of the vocabulary, not a cubic-bezier guess at one.
 */
export const cssSpring = ({
  visualDuration,
  bounce,
}: {
  visualDuration: number;
  bounce: number;
}) => {
  const { ease, duration } = createGeneratorEasing(
    { visualDuration, bounce },
    100,
    spring,
  );
  const ms = Math.round(duration * 1000);
  return { duration: `${ms}ms`, easing: generateLinearEasing(ease, ms) };
};

// ---- Gallery strip (moving between images inside the lightbox) ----
// The images sit side by side on one strip and the strip moves; the same
// spring grows the arriving image and settles the leaving one into a
// neighbour, so a move is one gesture. Nothing fades into anything else.
export const GALLERY_SLIDE = {
  type: "spring",
  visualDuration: 0.4,
  bounce: 0.12,
} as const;

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

// ---- Scroll reveals ----
// The one reveal every block plays (CSS in index.css, "scroll reveals";
// Projects' grid cells play it through motion, gridCellVariants below): a
// fade and a short rise on the glide curve. Short, so no block reads as a
// slab lurching; the same for every block, so everything triggers at the
// same line. Mirrored by --reveal-rise / --reveal-duration in index.css.
export const REVEAL_RISE = 32; // px
export const REVEAL_DURATION = 0.7; // s
// The queue's clock (src/lib/reveal.ts, ms): blocks let in together start
// a beat apart in reading order, and the queue never runs further behind
// than the lag cap — a whole first screen or a fling past many rows closes
// its beats up rather than making the last block wait.
export const REVEAL_STAGGER = 90;
export const REVEAL_MAX_LAG = 360;

// ---- Grid swap: a re-sort or filter changes which card sits in which slot ----
// Nothing slides — on tall cards any travel reads as scatter. Only a slot
// whose occupant changes animates, on a short glide between the UI and
// reveal clocks: the leaver dissolves where it is, then, once the grid has
// been re-ordered underneath, the arrival settles in from 12px below on the
// reveal curve, staggered in reading order. Exit is faster than enter and
// both are long enough to be seen as a crossfade rather than a cut;
// transform and opacity only, which the compositor runs without repainting
// a card.
export const SWAP_EXIT = 0.2;
export const SWAP_ENTER = 0.32;
export const SWAP_STAGGER = 0.04;
const SWAP_STAGGER_CAP = 0.24;
/** enter delay (s) by rank among the changed slots, capped so late slots never wait */
export const swapDelay = (rank: number) =>
  Math.min(rank * SWAP_STAGGER, SWAP_STAGGER_CAP);
/** the whole enter beat, last stagger included (ms) — the driver's clock */
export const SWAP_SETTLE_MS = Math.round(
  (SWAP_ENTER + SWAP_STAGGER_CAP) * 1000,
);

/** per-cell inputs the grid variants resolve against */
export interface GridCellCustom {
  /** the delay (ms) the reveal queue handed this cell */
  delay?: number;
  /** enter order among the changed slots of a swap */
  rank?: number;
}

/**
 * The four states of a grid cell. hidden → visible is the scroll reveal
 * (the same rise and clock as <Reveal>); swapOut → swapIn is the
 * swap. swapIn starts from its own first keyframe, so a cell can go there
 * straight from swapOut with no intermediate render.
 */
export const gridCellVariants = {
  hidden: { opacity: 0, y: REVEAL_RISE, scale: 1 },
  visible: ({ delay = 0 }: GridCellCustom = {}) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: REVEAL_DURATION,
      ease: REVEAL,
      delay: delay / 1000,
    },
  }),
  swapOut: {
    opacity: 0,
    y: 0,
    scale: 0.98,
    transition: { duration: SWAP_EXIT, ease: EASE_OUT },
  },
  swapIn: ({ rank = 0 }: GridCellCustom = {}) => ({
    opacity: [0, 1],
    y: [12, 0],
    scale: [0.98, 1],
    transition: {
      duration: SWAP_ENTER,
      ease: EASE_OUT_QUART,
      delay: swapDelay(rank),
    },
  }),
} satisfies Variants;
