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
  useRef,
  type ComponentProps,
  type PointerEvent,
  type TransitionEvent,
} from "react";
import { cn } from "@/lib/utils";

/**
 * One hover wash for a whole list. Rows marked `data-glide` share a single
 * tinted surface that fades in on the first row, glides to whichever row the
 * pointer is on, and fades out when the pointer leaves the list. A row marked
 * `data-glide="none"` clears it; anything else under the pointer (the gap
 * between two rows) holds it where it is. With the pointer away, it rests on
 * the row holding a `data-active` element, if there is one.
 */
export function HoverGlide({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  const rootRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const hovered = useRef<HTMLElement | null>(null);

  const sync = useCallback(() => {
    const root = rootRef.current;
    const wash = washRef.current;
    if (!root || !wash) return;
    const row = hovered.current?.isConnected
      ? hovered.current
      : (root
          .querySelector("[data-active]")
          ?.closest<HTMLElement>("[data-glide]") ?? null);
    if (!row) {
      delete wash.dataset.on;
      return;
    }
    const from = root.getBoundingClientRect();
    const to = row.getBoundingClientRect();
    wash.style.setProperty("--glide-x", `${to.left - from.left}px`);
    wash.style.setProperty("--glide-y", `${to.top - from.top}px`);
    wash.style.setProperty("--glide-w", `${to.width}px`);
    wash.style.setProperty("--glide-h", `${to.height}px`);
    if (wash.dataset.parked !== undefined) {
      // a wash that had faded out appears on its row: the reflow commits the
      // new place before the transition comes back, so it never flies there
      void wash.offsetWidth;
      delete wash.dataset.parked;
    }
    wash.dataset.on = "";
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new MutationObserver(sync);
    observer.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-active"],
    });
    return () => observer.disconnect();
  }, [sync]);

  const over = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const row = (event.target as Element).closest<HTMLElement>("[data-glide]");
    if (!row || !event.currentTarget.contains(row)) return;
    hovered.current = row.dataset.glide === "none" ? null : row;
    sync();
  };

  const leave = () => {
    hovered.current = null;
    sync();
  };

  const parkWhenGone = (event: TransitionEvent<HTMLDivElement>) => {
    const wash = event.currentTarget;
    if (event.propertyName === "opacity" && wash.dataset.on === undefined)
      wash.dataset.parked = "";
  };

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate", className)}
      onPointerOver={over}
      onPointerLeave={leave}
      {...props}
    >
      <div
        ref={washRef}
        aria-hidden="true"
        data-parked=""
        onTransitionEnd={parkWhenGone}
        className="pointer-events-none absolute top-0 left-0 -z-10 h-(--glide-h) w-(--glide-w) translate-x-(--glide-x) translate-y-(--glide-y) rounded-2xl bg-foreground/5 opacity-0 transition-[translate,width,height,opacity] duration-300 ease-out data-on:opacity-100 data-parked:transition-none"
      />
      {children}
    </div>
  );
}
