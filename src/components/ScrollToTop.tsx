/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useRef, useState, useCallback } from "react";
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
import { smoothScrollToTop } from "@/utils/scroll";
import { useTranslation } from "@/lib/language-provider";

const SCROLL_THRESHOLD = 120;
const TILE = 44;

const SAMPLES = 12;
// surface height at rest, and what a fast scroll adds (px)
const CALM = 1.1;
const SLOSH = 2.4;
// scroll speed (px/ms) at which the surface is at its roughest
const FAST = 2.5;
// The mean surface runs from the tile's floor to this far above its top, so
// the roughest surface still covers a full tile, and the level never depends
// on how rough the surface is.
const HEADROOM = (CALM + SLOSH) * 1.5;

function waterBody(level: number, time: number, amp: number, drift: number) {
  const top = (TILE + HEADROOM) * (1 - level) - HEADROOM;
  let d = `M0 ${TILE}`;
  for (let i = 0; i <= SAMPLES; i++) {
    const x = (i / SAMPLES) * TILE;
    const y =
      top +
      amp * Math.sin((x / TILE) * Math.PI * 2 + time * drift) +
      amp * 0.5 * Math.sin((x / TILE) * Math.PI * 3.4 - time * drift * 1.6);
    d += ` L${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d} L${TILE} ${TILE} Z`;
}

function WaterFill() {
  const reduceMotion = useReducedMotion();
  const page = useRef({ level: 0, scroll: 0 });
  const water = useRef({ level: 0, amp: CALM, scroll: 0 });
  const backRef = useRef<SVGPathElement>(null);
  const frontRef = useRef<SVGPathElement>(null);

  const paint = useCallback((level: number, time: number, amp: number) => {
    backRef.current?.setAttribute(
      "d",
      waterBody(level, time + 1.7, amp * 1.2, -0.0013),
    );
    frontRef.current?.setAttribute("d", waterBody(level, time, amp, 0.0021));
  }, []);

  const onLenis = useCallback(
    (instance: Lenis) => {
      const { scroll, limit } = instance;
      page.current = {
        level: limit - scroll < 8 ? 1 : scroll / Math.max(limit, 1),
        scroll,
      };
      if (reduceMotion) paint(page.current.level, 0, 0);
    },
    [paint, reduceMotion],
  );
  useLenis(onLenis);

  // every step is a rate per millisecond, never per frame: the level's lag
  // and the surface's roughness must feel the same at 60 and 144 Hz
  useAnimationFrame((time, delta) => {
    if (reduceMotion || delta <= 0) return;
    const now = water.current;
    const { level, scroll } = page.current;
    const speed = Math.abs(scroll - now.scroll) / delta;
    now.scroll = scroll;
    const rough = CALM + Math.min(speed / FAST, 1) * SLOSH;
    now.level += (level - now.level) * (1 - Math.exp(-delta / 140));
    now.amp +=
      (rough - now.amp) * (1 - Math.exp(-delta / (rough > now.amp ? 90 : 520)));
    paint(now.level, time, now.amp);
  });

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${TILE} ${TILE}`}
      className="pointer-events-none absolute inset-0 size-full"
    >
      <path ref={backRef} className="fill-muted" />
      <path ref={frontRef} className="fill-accent" />
    </svg>
  );
}

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const t = useTranslation();

  const onLenis = useCallback((instance: Lenis) => {
    const next = instance.scroll > SCROLL_THRESHOLD;
    setVisible((current) => (current === next ? current : next));
  }, []);
  useLenis(onLenis);

  // PageShell places every page itself (at the top, or where a history
  // entry was left), so the browser's own restoring would only fight it
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

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
          className="fixed right-5 bottom-5 z-50 flex size-11 items-center justify-center overflow-hidden rounded-2xl bg-background text-foreground/80 ring-1 ring-foreground/10 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:right-6 sm:bottom-6"
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
