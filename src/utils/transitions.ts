/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

/**
 * Central motion system.
 *
 * Two registers, deliberately different:
 *   - UI controls (menus, tooltips, hover, press) answer at once: short, EASE_OUT.
 *   - Content arrives on the glide: scroll reveals and load-ins. Longer, on
 *     REVEAL, and only ever a fade and a short rise. No blur and no scale:
 *     a page is too large a thing to bend. The page change clears a picture
 *     of the old page and leaves the arriving one to its reveals.
 *
 * Every curve mirrors the CSS token of the same name in src/index.css
 * (@theme): EASE_OUT is --ease-out, REVEAL is --ease-reveal, and so on. Only
 * curves JS consumes live here; CSS-only tokens (--ease-in-out, --ease-pop,
 * --ease-out-quart) stay in index.css. In markup use the `ease-*` utilities;
 * in JS import these consts. Never inline a cubic-bezier or use a built-in
 * "easeOut"/"easeInOut" string.
 */

// ---- Curves ----
// UI controls. A gentle easeOutCubic (not a front-loaded quint), so a short
// hover or menu transition glides instead of snapping.
export const EASE_OUT = [0.33, 1, 0.68, 1] as const;
// A small surface popping into place: tooltips, the toast, a swapped label.
// Front-loaded, so only for things small enough to arrive in one step.
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
// Something already on screen going from one state to another and back: a
// symmetric ease-in-out, so the way there mirrors the way back (the caret's
// breath; in CSS, the pills and chips that open and close).
export const EASE_SMOOTH = [0.45, 0, 0.55, 1] as const;
// Content arriving. It starts from rest, so nothing pops in, is half way
// there in a third of its time, and spends the rest settling: the travel
// shows for the whole duration but the block is readable early. A symmetric
// curve held content back at the start and stopped it short at the end.
export const REVEAL = [0.3, 0, 0.2, 1] as const;
// Something leaving the screen for good: it accelerates away.
export const EASE_IN = [0.5, 0, 0.75, 0] as const;

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

// ---- Swap (one label or face giving way to another in the same spot) ----
// Both fade at once, on one short curve: the tooltip's label layers and a
// <Morph>'s faces.
export const SWAP = { duration: 0.14, ease: EASE_EXPO } as const;

// ---- Glide (a surface following what it holds, and moving with it) ----
// The tooltip between triggers and labels.
export const GLIDE = { type: "spring", duration: 0.32, bounce: 0.1 } as const;
// GLIDE as physics: the same curve from rest (within 0.2px). motion starts
// every retarget of a duration spring from rest, so a box taking a new size
// mid-glide would stop dead and set off again; this one keeps its speed.
// It is at rest within half a pixel and under 20px/s: the creep past that
// is invisible, and kept a box clipped (and a PDF in it undrawn) for 150ms
// more. A <Morph>'s box and its parts.
export const GLIDE_SPRING = {
  type: "spring",
  stiffness: 702.4,
  damping: 47.7,
  mass: 1,
  restDelta: 0.5,
  restSpeed: 20,
} as const;

// ---- Gallery strip (moving between images inside the lightbox) ----
// The images sit side by side on one strip and the strip moves; the same
// spring grows the arriving image and settles the leaving one into a
// neighbour, so a move is one gesture. Nothing fades into anything else.
export const GALLERY_SLIDE = {
  type: "spring",
  visualDuration: 0.4,
  bounce: 0.12,
} as const;

// ---- Where every entrance starts ----
// Invisible (under one colour level, even on white) but never exactly 0.
// Chrome's Largest Contentful Paint skips anything painted at opacity 0, and
// a fade runs on the compositor without repainting, so content that faded
// in from 0 only counted once its glide had finished: the glide was added
// to LCP on every page. Entrances start here; exits may still end at 0.
// Mirrored by the reveal's hidden state in index.css.
export const HIDDEN_OPACITY = 0.001;

// ---- Page change ----
// The motion is CSS (index.css, "page change"): a picture of the old page
// fades where it stands while the next page builds under it through the
// reveal queue, and the title (or a project's cover) travels from one to
// the other. What runs it
// (src/layouts/page-change.ts) keeps five times (ms).
//
// BEAT: the next page goes in this long after the picture starts to fade.
// Mounting a page (and unmounting one) is the heaviest thing the site does:
// it blocks the main thread and then keeps the GPU busy, which is where
// frames go missing. By now the picture is most of the way out, so the two
// pages are never legible at once. A second click this soon also still decides
// which page goes in, where mounting the first would hold it up.
export const PAGE_BEAT = 120;
// HOLD: the longest a change waits for what it has no hold on. Under the
// whole-window dissolve the picture waits this long for a chunk still on
// its way, about what the old fade gave a tap to load it; otherwise a page
// whose chunk is still out, or that the address bar has already left, is
// mounted after all.
export const PAGE_HOLD = 320;
// HANDOVER: a further change this soon after the next page went in
// replaces that page under the picture, while its first block is under a
// quarter of the way in. Later, the change starts over.
export const PAGE_HANDOVER = 120;
// TITLE_LEAD: under a title that travels, the first block starts this
// late, so it shows once the title is nearly in its place and not while it
// crosses the block.
export const PAGE_TITLE_LEAD = 100;
// CARRY_HOLD: a carried piece (the title, a cover) waits this long for its
// successor before it fades alone. Longer than the picture's fade: a heavy
// page goes in after the picture is gone, and the piece is still carried.
export const PAGE_CARRY_HOLD = 600;

// ---- Scroll reveals ----
// The one reveal every block plays is CSS (index.css, "scroll reveals").
// The queue's clock (src/lib/reveal.ts, ms): blocks let in together start
// a beat apart in reading order, and the queue never runs further behind
// than the lag cap — a whole first screen or a fling past many rows closes
// its beats up rather than making the last block wait.
export const REVEAL_STAGGER = 80;
export const REVEAL_MAX_LAG = 320;
