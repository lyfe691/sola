/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Proximity section list, adapted from React Bits' LineSidebar. Labels slide
 * and tint toward the accent as the cursor nears; markers stretch with them.
 * One rAF loop eases every item's --effect var with frame-rate independent
 * exponential smoothing, so color, shift and scale always move as one.
 * Site adaptations: token colors only (primary / muted-foreground / border,
 * mixed in oklab), a controlled activeIndex, real <button> items, and an
 * `interactive` switch so the drawer can reuse it as a static list.
 */

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { cn } from "@/lib/utils";

export interface LineSidebarProps {
  items: string[];
  /** names the <nav> landmark for assistive tech */
  label: string;
  activeIndex?: number | null;
  onItemClick?: (index: number, item: string) => void;
  /** false = no pointer proximity (touch surfaces); active still eases */
  interactive?: boolean;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  className?: string;
}

// smoothstep: the one falloff curve — gentle in and out of the field
const ease = (p: number) => p * p * (3 - 2 * p);

export function LineSidebar({
  items,
  label,
  activeIndex = null,
  onItemClick,
  interactive = true,
  showIndex = true,
  showMarker = true,
  proximityRadius = 90,
  maxShift = 14,
  markerLength = 24,
  markerGap = 10,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 18,
  fontSize = 0.8,
  smoothing = 140,
  className,
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const activeRef = useRef<number | null>(activeIndex);
  const smoothingRef = useRef(smoothing);

  // single rAF loop that eases every item's --effect toward its target with
  // frame-rate independent exponential smoothing, so color, shift and scale
  // all move together without staggering CSS transitions
  const runFrame = useCallback(function frame(now: number) {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothingRef.current, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let moving = false;
    const els = itemRefs.current;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (!el) continue;
      const target = Math.max(
        targetsRef.current[i] || 0,
        activeRef.current === i ? 1 : 0,
      );
      const cur = currentRef.current[i] || 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[i] = value;
      el.style.setProperty("--effect", value.toFixed(4));
      if (!settled) moving = true;
    }

    rafRef.current = moving ? requestAnimationFrame(frame) : null;
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
    }
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  useEffect(() => {
    itemRefs.current.length = items.length;
    targetsRef.current.length = items.length;
    currentRef.current.length = items.length;
  }, [items.length]);

  useEffect(() => {
    activeRef.current = activeIndex;
    smoothingRef.current = smoothing;
    startLoop();
  }, [activeIndex, smoothing, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    },
    [],
  );

  const handlePointerMove = (e: PointerEvent<HTMLUListElement>) => {
    const list = listRef.current;
    if (!list) return;
    const pointerY = e.clientY - list.getBoundingClientRect().top;
    const els = itemRefs.current;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (!el) continue;
      const center = el.offsetTop + el.offsetHeight / 2;
      const distance = Math.abs(pointerY - center);
      targetsRef.current[i] = ease(Math.max(0, 1 - distance / proximityRadius));
    }
    startLoop();
  };

  const handlePointerLeave = () => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  };

  const tickClass = showMarker
    ? cn(
        // in-between ticks hang off each item's bottom edge, halfway into the gap
        "after:absolute after:top-[calc(100%+var(--item-gap)/2)] after:left-[calc(-1*var(--marker-length)-var(--marker-gap))] after:h-px after:w-[calc(var(--marker-length)*var(--tick-scale))] after:bg-border after:opacity-50 after:content-[''] last:after:content-none",
        scaleTick
          ? "after:origin-left after:[transform:translateY(-50%)_scaleX(calc(0.7+var(--effect,0)*0.6))]"
          : "after:-translate-y-1/2",
      )
    : "";

  return (
    <nav
      aria-label={label}
      className={cn(
        "relative flex justify-start",
        showMarker && "pl-[calc(var(--marker-length)+var(--marker-gap))]",
        className,
      )}
      style={
        {
          "--marker-length": `${markerLength}px`,
          "--marker-gap": `${markerGap}px`,
          "--tick-scale": tickScale,
          "--max-shift": `${maxShift}px`,
          "--item-gap": `${itemGap}px`,
          "--font-size": `${fontSize}rem`,
        } as CSSProperties
      }
    >
      <ul
        ref={listRef}
        onPointerMove={interactive ? handlePointerMove : undefined}
        onPointerLeave={interactive ? handlePointerLeave : undefined}
        className="m-0 flex list-none flex-col gap-(--item-gap) py-2"
      >
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={cn("relative", tickClass)}
          >
            {showMarker && (
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-[calc(-1*var(--marker-length)-var(--marker-gap))] h-px w-(--marker-length) origin-left [background-color:color-mix(in_oklab,var(--primary)_calc(var(--effect,0)*100%),var(--border))] [transform:translateY(-50%)_scaleX(calc(0.7+var(--effect,0)*0.5))]"
              />
            )}
            <button
              type="button"
              onClick={() => onItemClick?.(index, item)}
              aria-current={activeIndex === index ? "true" : undefined}
              // the before: pad grows the hit area into the gaps so the
              // pointer never drops the row between two labels
              className="relative block cursor-pointer rounded-sm text-left before:absolute before:-inset-x-6 before:-inset-y-[calc(var(--item-gap)/2)] before:content-[''] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <span className="relative inline-flex items-baseline leading-[1.2] whitespace-nowrap text-(length:--font-size) [color:color-mix(in_oklab,var(--primary)_calc(var(--effect,0)*100%),var(--muted-foreground))] [transform:translateX(calc(var(--effect,0)*var(--max-shift)))]">
                {showIndex && (
                  <span className="mr-2 font-mono text-[0.85em] [opacity:calc(0.55+var(--effect,0)*0.45)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                <span>{item}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
