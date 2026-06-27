/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  CALLOUT_STORAGE_KEY,
  getWelcomePresetLabels,
} from "@/config/welcome-preset";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

const APPEAR_DELAY = 1200;
const GAP = 10;
const ARROW_W = 20;
const ARROW_H = 9;
const CORNER_INSET = 16;
const EDGE_PADDING = 16;

type Position = { top: number; right: number; arrowRight: number };

// while any of these is open the callout yields (fades out, returns after);
// tooltips are excluded on purpose — they stack above it instead (z-50 > z-40)
const OVERLAY_SELECTOR = [
  '[data-slot="dropdown-menu-content"]',
  '[data-slot="dialog-content"]',
  '[data-slot="alert-dialog-content"]',
  '[data-slot="popover-content"]',
  '[data-slot="select-content"]',
  ".mobile-menu",
].join(", ");

// the toggle is mounted twice (desktop nav + mobile bar); pick the visible one
const visibleToggle = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("[data-callout='theme']"),
  ).find((el) => el.offsetWidth > 0) ?? null;

const measure = (): Position | null => {
  const el = visibleToggle();
  if (!el) return null;
  const r = el.getBoundingClientRect();
  // clientWidth excludes the scrollbar, matching how fixed `right` resolves
  const vw = document.documentElement.clientWidth;
  const center = r.left + r.width / 2;
  // flush with the toggle's right edge, nudged left if the arrow would
  // otherwise land on the card's rounded corner
  const right = Math.max(
    EDGE_PADDING,
    Math.min(vw - r.right, vw - center - CORNER_INSET - ARROW_W / 2),
  );
  return {
    top: r.bottom + GAP,
    right,
    arrowRight: vw - right - center - ARROW_W / 2,
  };
};

const PRESET_TOKEN = /\{(background|theme)\}/g;

const renderPresetContent = (
  template: string,
  background: string,
  theme: string,
): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of template.matchAll(PRESET_TOKEN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(template.slice(lastIndex, index));
    }

    const label = match[1] === "background" ? background : theme;
    nodes.push(
      <strong key={key++} className="font-semibold text-foreground">
        {label}
      </strong>,
    );
    lastIndex = index + match[0].length;
  }

  if (lastIndex < template.length) {
    nodes.push(template.slice(lastIndex));
  }

  return nodes;
};

export function ThemeCallout() {
  const { language } = useLanguage();
  const t = translations[language].common.callout;
  const { themeLabel, backgroundLabel } = getWelcomePresetLabels();
  const calloutContent = renderPresetContent(
    t.background.content,
    backgroundLabel,
    themeLabel,
  );
  const reduceMotion = useReducedMotion();

  const [open, setOpen] = useState(() => {
    try {
      return !localStorage.getItem(CALLOUT_STORAGE_KEY);
    } catch {
      return false;
    }
  });
  const [pos, setPos] = useState<Position | null>(null);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(CALLOUT_STORAGE_KEY, "1");
    } catch {
      /* storage unavailable — fail silently */
    }
    setOpen(false);
  }, []);

  // re-measure only on layout-affecting events (resize/scroll + toggle
  // resize from the nav's scroll morph and breakpoint swaps) instead of
  // every frame; coalesced into a single rAF
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    let last = "";
    let settled = false;

    const remeasure = () => {
      if (!settled) return; // let the nav entrance settle first
      const next = document.querySelector(OVERLAY_SELECTOR) ? null : measure();
      const key = next ? `${next.top},${next.right},${next.arrowRight}` : "";
      if (key !== last) {
        last = key;
        setPos(next);
      }
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        remeasure();
      });
    };

    const settle = window.setTimeout(() => {
      settled = true;
      remeasure();
    }, APPEAR_DELAY);

    const ro = new ResizeObserver(schedule);
    let observed: HTMLElement | null = null;
    const observeToggle = () => {
      const el = visibleToggle();
      if (el && el !== observed) {
        if (observed) ro.unobserve(observed);
        ro.observe(el);
        observed = el;
      }
    };
    observeToggle();
    // re-bind to the visible toggle on layout shifts (breakpoint swap)
    const onLayout = () => {
      observeToggle();
      schedule();
    };

    window.addEventListener("resize", onLayout);
    window.addEventListener("scroll", schedule, true);

    return () => {
      window.clearTimeout(settle);
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onLayout);
      window.removeEventListener("scroll", schedule, true);
    };
  }, [open]);

  // opening the toggle is the dismissal; Esc works too
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest("[data-callout='theme']"))
        dismiss();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  return createPortal(
    <AnimatePresence>
      {open && pos && (
        <motion.div
          role="status"
          initial={
            reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.96 }
          }
          animate={
            reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
          }
          exit={
            reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.97 }
          }
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="fixed z-40 w-64 max-w-[calc(100vw-2rem)] rounded-2xl bg-popover p-4 text-popover-foreground shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10"
          style={{
            top: pos.top,
            right: pos.right,
            transformOrigin: `calc(100% - ${pos.arrowRight + ARROW_W / 2}px) -${ARROW_H}px`,
          }}
        >
          <svg
            width={ARROW_W}
            height={ARROW_H}
            viewBox={`0 0 ${ARROW_W} ${ARROW_H}`}
            aria-hidden
            className="absolute overflow-visible"
            // 1px overlap so the fill swallows the card's ring line at the seam
            style={{ right: pos.arrowRight, top: -(ARROW_H - 1) }}
          >
            <path
              d="M0 9 L7.8 1.7 Q10 -0.3 12.2 1.7 L20 9 Z"
              className="fill-popover"
            />
            <path
              d="M0 9 L7.8 1.7 Q10 -0.3 12.2 1.7 L20 9"
              fill="none"
              strokeWidth="1"
              className="stroke-foreground/5 dark:stroke-foreground/10"
            />
          </svg>

          <p className="text-sm font-semibold leading-snug tracking-tight">
            {t.background.title}
          </p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {calloutContent}
          </p>
          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              size="sm"
              onClick={dismiss}
              className="h-7 rounded-full px-3 text-xs"
            >
              {t.done}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
