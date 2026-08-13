/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router";
import { ArrowUp } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { EASE_OUT } from "@/utils/transitions";
import { smoothScrollToTop, stopScrollToTop } from "@/utils/scroll";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

const SCROLL_THRESHOLD = 120;
const SCROLL_DEBOUNCE_DELAY = 120;

// reading-progress ring: hugs just inside the 44px frosted circle
const RING_SIZE = 44;
const RING_RADIUS = 20;
const RING_STROKE = 2;

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  // ring fill = scroll depth, driven as a MotionValue (no re-render per
  // frame). The light spring makes glides and jumps read as one continuous
  // fill; under reduced motion the raw value applies directly — the ring is
  // information, not decoration, so it stays.
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const smoothedProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });
  const ringProgress = reduceMotion ? scrollYProgress : smoothedProgress;

  // Read through a ref so the route-change effect below doesn't re-fire
  // when the mode flips off mid-exit (that would glide anyway).
  const { active: codeViewActive } = useCodeView();
  const codeViewRef = useRef(codeViewActive);
  useEffect(() => {
    codeViewRef.current = codeViewActive;
  }, [codeViewActive]);

  // Own scroll position fully; stop the browser from also restoring it on
  // back/forward and racing the tween.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Glide to the top on every route change, and abort any in-flight tween if
  // this (singleton) component ever unmounts. A route change under an active
  // code view is the exception: PageShell owns that scroll (it snaps to top
  // only after the exit finishes) — gliding now would visibly scroll the
  // still-rendered diff mid-transition.
  useEffect(() => {
    if (codeViewRef.current) return;
    smoothScrollToTop();
    return stopScrollToTop;
  }, [pathname]);

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
          aria-label={t.common.a11y.scrollToTop}
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 10 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{
            scale: 0.95,
            transition: { duration: 0.1, ease: EASE_OUT },
          }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center
                     h-11 w-11 rounded-full
                     bg-background/70 text-foreground
                     backdrop-blur-xs shadow-lg
                     hover:bg-background/90
                     transition-colors"
        >
          {/* -rotate-90 starts the fill at 12 o'clock, running clockwise */}
          <svg
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            className="pointer-events-none absolute inset-0 -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              strokeWidth={RING_STROKE}
              className="stroke-foreground/10"
            />
            <motion.circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              className="stroke-primary"
              style={{ pathLength: ringProgress }}
            />
          </svg>
          <ArrowUp className="h-5 w-5" strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
