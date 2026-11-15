/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type Lenis from "lenis";

/**
 * Window scroll, owned through the root Lenis instance.
 *
 * Lenis keeps its own idea of where the window is, so every programmatic
 * scroll goes through it: a bare `window.scrollTo` moves the page and leaves
 * Lenis behind, and the next wheel tick jumps back to where it thought it
 * was. A page change never glides (PageShell jumps to the top once the old
 * page is gone); the glide is for the scroll-to-top button and section
 * links, where the reader watches the page travel.
 *
 * The instance is bound by LenisProvider. Call sites stay module-level because
 * there is exactly one window scroll.
 */

// Glide tuning for programmatic jumps (wheel smoothing uses Lenis lerp).
// A premium glide for deep scrolls, snappier (but never a sub-300ms snap)
// for short ones. Duration scales with distance, clamped. Seconds for Lenis.
const MIN_DURATION_S = 0.42;
const MAX_DURATION_S = 0.68;
const S_PER_PX = 0.00032;

// Mirrors --ease-out / EASE_OUT ([0.33, 1, 0.68, 1] ≈ easeOutCubic).
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

let lenis: Lenis | null = null;
let lockCount = 0;

export const bindLenis = (instance: Lenis | null) => {
  lenis = instance;
  // overlays can mount before the instance; re-apply an existing lock
  if (lenis && lockCount > 0) lenis.stop();
};

export const getLenis = () => lenis;

/**
 * Pause window smoothing while an overlay is open. Ref-counted so stacked
 * dialogs don't release the lock early. Calls Lenis stop/start directly
 * (autoToggle is off — it only writes <html> overflow and can miss a
 * start() if isStopped hasn't flipped yet).
 */
export const lockWindowScroll = () => {
  lockCount += 1;
  if (lockCount === 1) lenis?.stop();
};

export const unlockWindowScroll = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) lenis?.start();
};

/** Instant jump — keeps Lenis's internal scroll in sync (unlike window.scrollTo). */
export const snapScrollTo = (y: number) => {
  if (lenis) {
    // Lenis clamps targets to its cached limit, and its content
    // ResizeObserver is debounced (250ms) — right after a takeover swap
    // (code view's one-viewport command screen) the cache can still read
    // ~0, which would clamp a restore to the top. Measure now, then jump.
    // force: the jump must land even if an overlay lock is still held.
    lenis.resize();
    lenis.scrollTo(y, { immediate: true, force: true });
    return;
  }
  window.scrollTo(0, y);
};

/** Glide the window to the top. */
export const smoothScrollToTop = () => {
  if (typeof window === "undefined") return;

  const start = lenis?.scroll ?? window.scrollY;
  if (start <= 0) return;

  if (!lenis) {
    window.scrollTo(0, 0);
    return;
  }

  // respectReducedMotion already forces instant scrollTo; still be explicit
  if (lenis.prefersReducedMotion) {
    lenis.scrollTo(0, { immediate: true });
    return;
  }

  const duration = Math.min(
    MAX_DURATION_S,
    Math.max(MIN_DURATION_S, start * S_PER_PX),
  );
  lenis.scrollTo(0, { duration, easing: easeOutCubic });
};

/** Scroll to a section / element. Falls back to scrollIntoView without Lenis. */
export const scrollToTarget = (
  target: string | HTMLElement,
  options?: { immediate?: boolean; offset?: number },
) => {
  if (lenis) {
    // same stale-limit hazard as snapScrollTo: content may have grown
    // (lazy images, fonts) inside the resize debounce window
    lenis.resize();
    lenis.scrollTo(target, options);
    return;
  }

  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!(el instanceof HTMLElement)) return;
  el.scrollIntoView({
    behavior: options?.immediate ? "auto" : "smooth",
    block: "start",
  });
};
