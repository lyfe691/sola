/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EASE_OUT } from "@/utils/transitions";

const SCROLL_THRESHOLD = 120;
const SCROLL_DEBOUNCE_DELAY = 120;

// Scroll keys we treat as "the user wants to scroll" — pressing any of these
// during our tween hands control back to them immediately.
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
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mirrors --ease-out / EASE_OUT ([0.33, 1, 0.68, 1] ≈ easeOutCubic): decelerate
// into the top so the glide settles rather than snapping.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// ---- Owned smooth-scroll-to-top --------------------------------------------
// Why not window.scrollTo({ behavior: "smooth" })? That is a fire-and-forget
// browser animation. On a route change into a SHORT page (Home), the outgoing
// tall page stays mounted through PageShell's exit, then unmounts — collapsing
// the document height mid-animation. The native scroll gets clamped to the new
// (tiny) max and stranded there, which on the short page reads as "jumped down
// to the footer". A rAF tween that we drive ourselves re-targets 0 every frame,
// so a height collapse can't strand it: it simply keeps gliding to the top.
let rafId: number | null = null;
let detachGuards: (() => void) | null = null;

const stopActiveScroll = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (detachGuards) {
    detachGuards();
    detachGuards = null;
  }
};

const smoothScrollToTop = () => {
  stopActiveScroll();

  const start = window.scrollY;
  if (start <= 0) return;

  if (prefersReducedMotion()) {
    window.scrollTo(0, 0);
    return;
  }

  // Distance-aware duration: a glide for deep scrolls, snappier for short ones,
  // never sub-300ms (which reads as a snap rather than a glide).
  const duration = Math.min(680, Math.max(420, start * 0.32));
  let startTime: number | null = null;

  // Yield to genuine user input — never re-snap or fight a deliberate scroll.
  // (We listen to INPUT events, not "scroll", since our own scrollTo emits scroll.)
  const onUserScroll = () => stopActiveScroll();
  const onKeyDown = (e: KeyboardEvent) => {
    if (SCROLL_KEYS.has(e.key)) stopActiveScroll();
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
      stopActiveScroll();
    }
  };

  rafId = requestAnimationFrame(step);
};

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // Own scroll position fully; stop the browser from also restoring it on
  // back/forward and racing the tween.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    smoothScrollToTop();
  }, [pathname]);

  // Cancel any in-flight tween if this (singleton) component ever unmounts.
  useEffect(() => stopActiveScroll, []);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, SCROLL_DEBOUNCE_DELAY);
    };

    window.addEventListener("scroll", debouncedScroll);
    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          onClick={smoothScrollToTop}
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 10 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95, transition: { duration: 0.1, ease: EASE_OUT } }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center
                     h-11 w-11 rounded-full
                     bg-background/70 text-foreground
                     backdrop-blur-xs shadow-lg
                     hover:bg-background/90
                     transition-colors"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
