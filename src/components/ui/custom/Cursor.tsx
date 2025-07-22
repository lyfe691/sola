import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useSpring, MotionValue } from "motion/react";
import { createPortal } from "react-dom";

/**
 * Cursor (v3)
 * ------------
 * Goals:
 *  - True wrap *around* targets (tracks their rect, not just centers under them).
 *  - Dot / Wrap / Caret modes.
 *  - No caret when text is inside interactive elements.
 *  - Uses shadcn/ui theming tokens (CSS vars). Tailwind utilities for layout.
 *  - Clean, maintainable code.
 */

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------
const DOT_SIZE = 6;
const CARET = { w: 2, h: 22, radius: 2 };
const WRAP_PADDING = 8; // px extra around target
const EASE = [0.22, 1, 0.36, 1] as const;

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------
const closestInteractive = (el: HTMLElement | null): HTMLElement | null => {
  if (!el) return null;
  return el.closest(
    "[data-cursor=wrap], button, a, input, textarea, select, [role=button]"
  ) as HTMLElement | null;
};

const isExplicitCaret = (el: HTMLElement | null) => el?.getAttribute("data-cursor") === "caret";

const looksLikeTextBlock = (el: HTMLElement | null) => {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return ["p", "span", "li", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tag);
};

interface CursorState {
  mode: "dot" | "wrap" | "caret";
  w: number;
  h: number;
  x: number; // top-left (NOT center)
  y: number;
  radius: number;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export const Cursor: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  // animated top-left and size
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const w = useMotionValue(DOT_SIZE);
  const h = useMotionValue(DOT_SIZE);
  const r = useMotionValue(9999);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(0);

  const smx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const smy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });
  const smw = useSpring(w, { stiffness: 500, damping: 40, mass: 0.6 });
  const smh = useSpring(h, { stiffness: 500, damping: 40, mass: 0.6 });
  const smr = useSpring(r, { stiffness: 500, damping: 40, mass: 0.6 });

  const stateRef = useRef<CursorState>({ mode: "dot", w: DOT_SIZE, h: DOT_SIZE, x: 0, y: 0, radius: 9999 });
  const roRef = useRef<ResizeObserver | null>(null);
  const observingEl = useRef<HTMLElement | null>(null);

  // Hide OS cursor
  useEffect(() => {
    document.documentElement.classList.add("cursor-none");
    setMounted(true);
    return () => document.documentElement.classList.remove("cursor-none");
  }, []);

  // Move handler (also hit-test each frame)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      opacity.set(1);
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      updateForPointer(target, e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Click shrink
  useEffect(() => {
    const down = () => animate(scale, 0.75, { duration: 0.08 });
    const up = () => animate(scale, 1, { duration: 0.25, ease: EASE });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [scale]);

  // Observe target size changes to keep wrap accurate
  const observeRect = (el: HTMLElement | null) => {
    if (observingEl.current === el) return; // already
    roRef.current?.disconnect();
    observingEl.current = el;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (stateRef.current.mode === "wrap") applyWrapFromRect(el.getBoundingClientRect());
    });
    ro.observe(el);
    roRef.current = ro;
  };

  const applyWrapFromRect = (rect: DOMRect) => {
    const nx = rect.left - WRAP_PADDING / 2;
    const ny = rect.top - WRAP_PADDING / 2;
    const nw = rect.width + WRAP_PADDING;
    const nh = rect.height + WRAP_PADDING;
    setMode({ mode: "wrap", x: nx, y: ny, w: nw, h: nh, radius: 10 });
  };

  const updateForPointer = (el: HTMLElement | null, cx: number, cy: number) => {
    const interactive = closestInteractive(el);
    if (interactive) {
      observeRect(interactive);
      applyWrapFromRect(interactive.getBoundingClientRect());
      return;
    }

    observeRect(null);

    if (isExplicitCaret(el) || (looksLikeTextBlock(el) && !closestInteractive(el))) {
      setMode({ mode: "caret", x: cx - CARET.w / 2, y: cy - CARET.h / 2, w: CARET.w, h: CARET.h, radius: CARET.radius });
      return;
    }

    setMode({ mode: "dot", x: cx - DOT_SIZE / 2, y: cy - DOT_SIZE / 2, w: DOT_SIZE, h: DOT_SIZE, radius: 9999 });
  };

  const setMode = (next: CursorState) => {
    stateRef.current = next;
    animate(w, next.w, { duration: 0.22, ease: EASE });
    animate(h, next.h, { duration: 0.22, ease: EASE });
    animate(r, next.radius, { duration: 0.22, ease: EASE });
    // positions through motion values (springs already wrap them)
    x.set(next.x);
    y.set(next.y);
  };

  if (!mounted) return null;

  return createPortal(
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ translateX: smx, translateY: smy }}
    >
      <motion.div
        className="will-change-transform"
        style={{
          width: smw,
          height: smh,
          borderRadius: smr as unknown as MotionValue<string | number>,
          opacity,
          scale,
          backgroundColor: "transparent", // keep content readable
          boxShadow: "0 0 0 1px hsl(var(--foreground)/0.28) inset", // subtle inner stroke
          mixBlendMode: "normal",
        }}
      />
    </motion.div>,
    document.body
  );
};

export default Cursor;
