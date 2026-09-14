/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Planner for a grid re-order. A re-sort or filter is read slot by slot:
 * only a slot whose occupant changes takes part in the swap, and the
 * arrivals enter in reading order. Pure, so the driver hook stays a thin
 * state machine and the rules are testable.
 */

/**
 * Ids whose slot differs between the two orders — moved, arriving or
 * leaving. An id that keeps its index is untouched by the swap.
 */
export function changedSlots(
  prev: readonly string[],
  next: readonly string[],
): Set<string> {
  const changed = new Set<string>();
  const slots = Math.max(prev.length, next.length);
  for (let i = 0; i < slots; i++) {
    if (prev[i] === next[i]) continue;
    if (prev[i] !== undefined) changed.add(prev[i]);
    if (next[i] !== undefined) changed.add(next[i]);
  }
  return changed;
}

/**
 * Enter rank of every changed id that has a slot in `next`, counted in
 * reading order so the first changed slot on screen leads the cascade.
 * Leaving ids get no rank: they exit and unmount.
 */
export function enterRanks(
  next: readonly string[],
  changed: ReadonlySet<string>,
): Map<string, number> {
  const rank = new Map<string, number>();
  for (const id of next) {
    if (changed.has(id)) rank.set(id, rank.size);
  }
  return rank;
}
