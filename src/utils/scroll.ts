/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/**
 * Owned smooth-scroll-to-top.
 *
 * Why not `window.scrollTo({ behavior: "smooth" })`? That is a fire-and-forget
 * browser animation. On a route change into a SHORT page (Home), the outgoing
 * tall page stays mounted through PageShell's exit, then unmounts — collapsing
 * the document height mid-animation. The native scroll gets clamped to the new
 * (tiny) max and stranded there, which on the short page reads as "jumped down
 * to the footer". A rAF tween that we drive ourselves re-targets 0 every frame,
 * so a height collapse can't strand it: it simply keeps gliding to the top.
 *
 * State is module-level on purpose: there is exactly ONE window scroll, so there
 * is exactly one animation to own. Two concurrent tweens would fight regardless
 * of where the handle lived; modelling it as a single module-scoped controller
 * makes that singleton-ness explicit. Relies on `scroll-behavior: auto` (see
 * index.css) so each per-frame scrollTo lands instantly instead of re-animating.
 */

// Glide tuning — a premium glide for deep scrolls, snappier (but never a
// sub-300ms "snap") for short ones. Duration scales with distance, clamped.
const MIN_DURATION_MS = 420;
const MAX_DURATION_MS = 680;
const MS_PER_PX = 0.32;

// Keys that mean "the user is taking over the scroll" — pressing any hands
// control straight back to them instead of fighting their input.
const SCROLL_KEYS = new Set([
  " ",
  "PageUp",
  "PageDown",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mirrors --ease-out / EASE_OUT ([0.33, 1, 0.68, 1] ≈ easeOutCubic): decelerate
// into the top so the glide settles rather than snapping.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

let rafId: number | null = null;
let detachGuards: (() => void) | null = null;

/** Cancel any in-flight tween and detach its input guards. */
export const stopScrollToTop = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (detachGuards) {
    detachGuards();
    detachGuards = null;
  }
};

/** Glide the window to the top, resilient to mid-flight document-height changes. */
export const smoothScrollToTop = () => {
  stopScrollToTop();

  if (typeof window === "undefined") return;

  const start = window.scrollY;
  if (start <= 0) return;

  if (prefersReducedMotion()) {
    window.scrollTo(0, 0);
    return;
  }

  const duration = Math.min(
    MAX_DURATION_MS,
    Math.max(MIN_DURATION_MS, start * MS_PER_PX),
  );
  let startTime: number | null = null;

  // Yield to genuine user input — never re-snap or fight a deliberate scroll.
  // We listen to INPUT events, not "scroll", since our own scrollTo emits scroll.
  const onUserScroll = () => stopScrollToTop();
  const onKeyDown = (e: KeyboardEvent) => {
    if (SCROLL_KEYS.has(e.key)) stopScrollToTop();
  };
  window.addEventListener("wheel", onUserScroll, { passive: true });
  window.addEventListener("touchmove", onUserScroll, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  detachGuards = () => {
    window.removeEventListener("wheel", onUserScroll);
    window.removeEventListener("touchmove", onUserScroll);
    window.removeEventListener("keydown", onKeyDown);
  };

  const step = (now: number) => {
    if (startTime === null) startTime = now;
    const t = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, start * (1 - easeOutCubic(t)));
    if (t < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      stopScrollToTop();
    }
  };

  rafId = requestAnimationFrame(step);
};
