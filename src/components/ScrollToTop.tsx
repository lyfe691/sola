/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router";
import { ArrowUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  motion,
  AnimatePresence,
  useAnimationFrame,
  useReducedMotion,
} from "motion/react";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";
import { EASE_OUT } from "@/utils/transitions";
import { smoothScrollToTop, stopScrollToTop } from "@/utils/scroll";
import { useCodeView } from "@/components/deploy-diff/code-view-provider";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

const SCROLL_THRESHOLD = 120;
const TILE = 44;

/** One slow cubic swell. Trough sits on the progress line so full = brim. */
function waterBody(p: number, phase: number, amp: number, size: number) {
  const y = size * (1 - p) - amp;
  const a = Math.sin(phase) * amp;
  const b = Math.sin(phase + Math.PI) * amp;
  const mid = size / 2;
  return `M0 ${size} L0 ${y} C ${mid * 0.5} ${y + a}, ${mid * 0.5} ${y + a}, ${mid} ${y} C ${mid * 1.5} ${y + b}, ${mid * 1.5} ${y + b}, ${size} ${y} L${size} ${size} Z`;
}

function WaterFill() {
  const reduceMotion = useReducedMotion();
  const progressRef = useRef(0);
  const backRef = useRef<SVGPathElement>(null);
  const frontRef = useRef<SVGPathElement>(null);

  const paint = useCallback(
    (p: number, time: number) => {
      const phase = reduceMotion ? 0 : time * 0.0011;
      const amp = reduceMotion ? 0 : 1.5;
      backRef.current?.setAttribute(
        "d",
        waterBody(p, phase * 0.65 + 1, amp * 1.15, TILE),
      );
      frontRef.current?.setAttribute("d", waterBody(p, phase, amp, TILE));
    },
    [reduceMotion],
  );

  const onLenis = useCallback(
    (instance: Lenis) => {
      const { scroll, limit } = instance;
      progressRef.current =
        limit - scroll < 8 ? 1 : scroll / Math.max(limit, 1);
      if (reduceMotion) paint(progressRef.current, 0);
    },
    [paint, reduceMotion],
  );
  useLenis(onLenis);

  useAnimationFrame((t) => {
    if (reduceMotion) return;
    paint(progressRef.current, t);
  });

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${TILE} ${TILE}`}
      className="pointer-events-none absolute inset-0 size-full"
    >
      <path ref={backRef} fill="var(--primary)" fillOpacity="0.1" />
      <path ref={frontRef} fill="var(--primary)" fillOpacity="0.18" />
    </svg>
  );
}

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const onLenis = useCallback((instance: Lenis) => {
    const next = instance.scroll > SCROLL_THRESHOLD;
    setVisible((current) => (current === next ? current : next));
  }, []);
  useLenis(onLenis);

  const { active: codeViewActive } = useCodeView();
  const codeViewRef = useRef(codeViewActive);
  useEffect(() => {
    codeViewRef.current = codeViewActive;
  }, [codeViewActive]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (codeViewRef.current) return;
    smoothScrollToTop();
    return stopScrollToTop;
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          type="button"
          onClick={smoothScrollToTop}
          aria-label={t.common.a11y.scrollToTop}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: 8,
            transition: { duration: 0.16, ease: EASE_OUT },
          }}
          whileTap={{
            scale: 0.97,
            transition: { duration: 0.1, ease: EASE_OUT },
          }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
          className="fixed right-5 bottom-5 z-50 flex size-11 items-center justify-center overflow-hidden rounded-2xl bg-background/70 text-foreground/80 ring-1 ring-foreground/10 backdrop-blur-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:right-6 sm:bottom-6"
        >
          <WaterFill />
          <HugeiconsIcon
            icon={ArrowUpIcon}
            strokeWidth={1.5}
            aria-hidden
            className="relative size-3.5"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
