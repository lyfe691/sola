/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type MotionStyle,
} from "motion/react";
import { Button } from "@/components/ui/button";
import {
  CALLOUT_STORAGE_KEY,
  getWelcomePresetLabels,
} from "@/config/welcome-preset";
import { useTranslation } from "@/lib/language-provider";
import { useCommandMenu } from "@/hooks/use-command-menu";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import { tailEdge, tailFill } from "@/lib/tail-path";

const APPEAR_DELAY = 1200;
// the arrow's tip stops 3px short of whatever it points out of
const GAP = 13;
const ARROW_W = 24;
const ARROW_H = 10;
// rounded-2xl is 1.8 × --radius (10px): the arrow's feet keep off its curve
const CARD_RADIUS = 18;
const EDGE_PADDING = 16;

// the arrow's stroke rides the ring's pixel row (y = ARROW_H - 0.5); its
// fill swallows the ring line under it
const ARROW_EDGE = tailEdge(ARROW_W, ARROW_H, 0.5);
const ARROW_FILL = tailFill(ARROW_W, ARROW_H, 0.5);

type Position = {
  top: number;
  right: number;
  arrowRight: number;
  /** the card's corner beside the arrow */
  corner: number;
};

// while any of these is open the callout yields (fades out, returns after);
// tooltips are excluded on purpose — they stack above it instead (z-50 > z-40)
const OVERLAY_SELECTOR = [
  '[data-slot="dropdown-menu-content"]',
  '[data-slot="dialog-content"]',
  '[data-slot="alert-dialog-content"]',
  '[data-slot="popover-content"]',
  '[data-slot="select-content"]',
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
  // a docked nav is a capsule whose edge sits below the toggle: point out of
  // the capsule, not into it
  const bar = el.closest<HTMLElement>("[data-nav-bar]");
  const from =
    bar?.dataset.docked === undefined
      ? r.bottom
      : bar.getBoundingClientRect().bottom;
  // the fixed header spans exactly the box a fixed `right` resolves against;
  // documentElement.clientWidth still counts the page's scrollbar gutter
  const vw =
    el.closest("header")?.getBoundingClientRect().right ??
    document.documentElement.clientWidth;
  const center = r.left + r.width / 2;
  // flush with the toggle's right edge, nudged right until the arrow clears
  // the card's rounded corner; where the screen edge stops that (phones),
  // the corner beside the arrow tightens instead
  const right = Math.max(
    EDGE_PADDING,
    Math.min(vw - r.right, vw - center - CARD_RADIUS - ARROW_W / 2),
  );
  const arrowRight = vw - right - center - ARROW_W / 2;
  return {
    top: from + GAP,
    right,
    arrowRight,
    corner: Math.max(0, Math.min(CARD_RADIUS, arrowRight)),
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
  const t = useTranslation().common.callout;
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
  // the phone menu hides the toggle it points at, and the palette covers it
  const menuOpen = useMobileMenu((state) => state.isOpen);
  const paletteOpen = useCommandMenu((state) => state.isOpen);
  const yielding = menuOpen || paletteOpen;

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
      const key = next
        ? `${next.top},${next.right},${next.arrowRight},${next.corner}`
        : "";
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
        ro.disconnect();
        ro.observe(el);
        // the bar resizes through its dock morph, which the toggle doesn't
        const bar = el.closest<HTMLElement>("[data-nav-bar]");
        if (bar) ro.observe(bar);
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

  // opening the toggle is the dismissal; Esc works too, but not an Esc that
  // closes whatever it is yielding to
  useEffect(() => {
    if (!open || yielding) return;
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
  }, [open, yielding, dismiss]);

  return createPortal(
    <AnimatePresence>
      {open && pos && !yielding && (
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
          className="fixed top-(--top) right-(--right) z-40 w-64 max-w-[calc(100vw-2rem)] origin-(--origin) rounded-2xl rounded-tr-(--corner) bg-popover p-4 text-popover-foreground shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10"
          style={
            {
              "--top": `${pos.top}px`,
              "--right": `${pos.right}px`,
              "--corner": `${pos.corner}px`,
              "--origin": `calc(100% - ${pos.arrowRight + ARROW_W / 2}px) -${ARROW_H}px`,
            } as MotionStyle
          }
        >
          <svg
            width={ARROW_W}
            height={ARROW_H + 1}
            viewBox={`0 0 ${ARROW_W} ${ARROW_H + 1}`}
            aria-hidden
            className="absolute top-(--arrow-top) right-(--arrow-right) overflow-visible"
            style={
              {
                "--arrow-right": `${pos.arrowRight}px`,
                "--arrow-top": `${-ARROW_H}px`,
              } as CSSProperties
            }
          >
            <path d={ARROW_FILL} className="fill-popover" />
            <path
              d={ARROW_EDGE}
              fill="none"
              strokeWidth="1"
              className="stroke-foreground/5 dark:stroke-foreground/10"
            />
          </svg>

          <p className="text-sm font-semibold leading-snug tracking-tight">
            {t.background.title}
          </p>
          <p className="mt-1 text-xs-plus leading-relaxed text-muted-foreground">
            {calloutContent}
          </p>
          <div className="mt-3 flex justify-end">
            <Button type="button" size="sm" onClick={dismiss} className="h-7">
              <span className="text-xs">{t.done}</span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
