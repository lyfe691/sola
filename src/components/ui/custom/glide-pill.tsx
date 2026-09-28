/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * React Bits' GlideSelect highlight: one pill that glides from row to row
 * instead of each row lighting its own background. It lands in place when it
 * appears and takes each row's size and radius as it travels. Render `pill`
 * inside a `relative isolate` container of the rows; the consumer decides
 * which row is highlighted.
 */

import { useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Pill = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: string;
  shown: boolean;
  /** moves with a transition; off, it lands where it is sent */
  glide: boolean;
};

const HIDDEN: Pill = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  radius: "0px",
  shown: false,
  glide: false,
};

export function useGlidePill() {
  const ref = useRef<HTMLSpanElement>(null);
  const [pill, setPill] = useState(HIDDEN);

  const moveTo = (row: HTMLElement) => {
    const el = ref.current;
    const box = el?.offsetParent;
    if (!el || !(box instanceof HTMLElement)) return;
    // rects carry any running scale (a menu's pop, a layout morph); the
    // ratio to the layout size takes it back out
    const outer = box.getBoundingClientRect();
    const scaleX = outer.width / box.offsetWidth || 1;
    const scaleY = outer.height / box.offsetHeight || 1;
    const r = row.getBoundingClientRect();
    setPill({
      x: (r.left - outer.left) / scaleX - box.clientLeft,
      y: (r.top - outer.top) / scaleY - box.clientTop,
      width: r.width / scaleX,
      height: r.height / scaleY,
      radius: getComputedStyle(row).borderTopLeftRadius,
      shown: true,
      // by what is on screen, not by state: a pill still fading out glides
      // on, and a pointer crossing a gap between rows doesn't make it jump
      glide: getComputedStyle(el).opacity !== "0",
    });
  };

  const hide = () =>
    setPill((prev) => (prev.shown ? { ...prev, shown: false } : prev));

  const element = (
    <span
      ref={ref}
      aria-hidden="true"
      style={
        {
          "--pill-x": `${pill.x}px`,
          "--pill-y": `${pill.y}px`,
          "--pill-w": `${pill.width}px`,
          "--pill-h": `${pill.height}px`,
          "--pill-r": pill.radius,
        } as CSSProperties
      }
      className={cn(
        "pointer-events-none absolute top-0 left-0 -z-10 h-(--pill-h) w-(--pill-w) translate-x-(--pill-x) translate-y-(--pill-y) rounded-(--pill-r) bg-accent transition-opacity duration-150 ease-out",
        !pill.shown && "opacity-0",
        pill.glide &&
          "motion-safe:transition-[translate,width,height,border-radius,opacity] motion-safe:duration-220 motion-safe:ease-expo",
      )}
    />
  );

  return { pill: element, shown: pill.shown, moveTo, hide };
}
