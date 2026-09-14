/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Drives a grid through a re-order in two beats. The order on screen lags
 * the requested order by the exit clock: first the cards whose slot changes
 * dissolve where they are, then the DOM is re-ordered underneath — every
 * changed card is invisible at that instant — and the same cards enter in
 * their new slots. Cards that keep their slot never move, and because the
 * grid keys cards by id, moved cards are moved, not re-mounted: painted
 * covers keep their canvases.
 *
 * A new order arriving mid-swap retargets: cards still exiting stay in the
 * changed set, so nothing is left half-faded.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { changedSlots, enterRanks } from "@/lib/grid-swap";
import { SWAP_EXIT, SWAP_SETTLE_MS } from "@/utils/transitions";

export interface GridSwap {
  phase: "out" | "in";
  /** ids taking part: they exit in `out`, enter in `in` */
  changed: ReadonlySet<string>;
  /** enter order among the changed, for the stagger */
  rank: ReadonlyMap<string, number>;
}

export interface GridSwapView {
  /** the order to render — equals the requested order once the exit beat has run */
  shownIds: readonly string[];
  swap: GridSwap | null;
  /** ids that have ever entered through a swap: shown outright, never waiting on a scroll reveal */
  arrived: ReadonlySet<string>;
}

const EMPTY: ReadonlySet<string> = new Set();
const SEP = "\n";

export function useGridSwap(order: readonly string[]): GridSwapView {
  // one identity per sequence, so a fresh array in the same order is a no-op
  const key = order.join(SEP);
  const ids = useMemo(() => (key ? key.split(SEP) : []), [key]);

  const [view, setView] = useState<GridSwapView>(() => ({
    shownIds: ids,
    swap: null,
    arrived: EMPTY,
  }));
  const shownRef = useRef(ids);
  const exitingRef = useRef(EMPTY);
  const arrivedRef = useRef(new Set<string>());

  useEffect(() => {
    const changed = new Set([
      ...changedSlots(shownRef.current, ids),
      ...exitingRef.current,
    ]);
    if (changed.size === 0) return;
    const rank = enterRanks(ids, changed);
    exitingRef.current = changed;
    setView((v) => ({ ...v, swap: { phase: "out", changed, rank } }));

    const switchAt = window.setTimeout(() => {
      shownRef.current = ids;
      exitingRef.current = EMPTY;
      for (const id of changed) arrivedRef.current.add(id);
      setView({
        shownIds: ids,
        swap: { phase: "in", changed, rank },
        arrived: new Set(arrivedRef.current),
      });
    }, SWAP_EXIT * 1000);
    const settleAt = window.setTimeout(
      () => setView((v) => ({ ...v, swap: null })),
      SWAP_EXIT * 1000 + SWAP_SETTLE_MS,
    );
    return () => {
      window.clearTimeout(switchAt);
      window.clearTimeout(settleAt);
    };
  }, [ids]);

  return view;
}
