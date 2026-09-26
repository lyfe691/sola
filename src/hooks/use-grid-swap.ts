/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Runs a grid re-order as a view transition (CSS in index.css, "grid
 * swap"). From two columns up, every slot on screen is named for the swap
 * in reading order, so
 * the browser crossfades each one from the card it held to the card it
 * holds after the update. The root steps out of the transition, so
 * everything else stays live, and slots off screen change unphotographed.
 */

import { useCallback, useRef, type RefObject } from "react";
import { flushSync } from "react-dom";
import { useReducedMotion } from "motion/react";

/** slots past this many on screen share the last beat of the stagger */
const BEATS = 4;

const slotsOf = (grid: HTMLElement) =>
  Array.from(grid.children as HTMLCollectionOf<HTMLElement>);

const onScreen = (slots: HTMLElement[]) =>
  slots.flatMap((slot, index) => {
    const { top, bottom } = slot.getBoundingClientRect();
    return bottom > 0 && top < window.innerHeight ? [index] : [];
  });

const unname = (el: HTMLElement) => {
  el.style.viewTransitionName = "";
  el.style.viewTransitionClass = "";
};

/** names slots by index, so both photographs agree; the beat counts from the first slot on screen */
const name = (slots: HTMLElement[], indices: number[], first: number) => {
  slots.forEach(unname);
  for (const index of indices) {
    const slot = slots[index];
    if (!slot) continue;
    const beat = Math.min(Math.max(index - first, 0), BEATS - 1);
    slot.style.viewTransitionName = `grid-slot-${index}`;
    slot.style.viewTransitionClass = `grid-slot grid-beat-${beat}`;
  }
};

export function useGridSwap(gridRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();
  const running = useRef<ViewTransition | null>(null);

  return useCallback(
    (update: () => void) => {
      const grid = gridRef.current;
      if (!grid || reducedMotion || !document.startViewTransition) {
        update();
        return;
      }
      const root = document.documentElement;
      // one column (a phone): the page dissolves as one picture, the way a
      // theme switch does. Named slots there slide the cards below one whose
      // height changed, and iOS WebKit draws captured cards offset
      if (getComputedStyle(grid).gridTemplateColumns.split(" ").length < 2) {
        running.current = null;
        delete root.dataset.gridSwap;
        slotsOf(grid).forEach(unname);
        document.startViewTransition(() => flushSync(update));
        return;
      }
      const before = onScreen(slotsOf(grid));
      const first = before[0] ?? 0;
      name(slotsOf(grid), before, first);

      root.dataset.gridSwap = "";
      const transition = document.startViewTransition(() => {
        // one synchronous commit, so the new order is in place before the
        // browser photographs it. Cards move between slots, so the names go
        // to whichever card now sits in each one, and a slot the new layout
        // brings on screen joins in, or it would pop in unanimated
        flushSync(update);
        const slots = slotsOf(grid);
        const after = onScreen(slots);
        name(slots, [...new Set([...before, ...after])], first);
      });
      running.current = transition;
      const landed = () => {
        // a newer swap that cut this one short owns the names now
        if (running.current !== transition) return;
        running.current = null;
        delete root.dataset.gridSwap;
        slotsOf(grid).forEach(unname);
      };
      transition.finished.then(landed, landed);
    },
    [gridRef, reducedMotion],
  );
}
