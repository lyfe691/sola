/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EASE_OUT } from "@/utils/transitions";
import { smoothScrollToTop, stopScrollToTop } from "@/utils/scroll";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";

const SCROLL_THRESHOLD = 120;
const SCROLL_DEBOUNCE_DELAY = 120;

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

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
