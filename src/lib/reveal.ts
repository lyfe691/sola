/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The scroll-reveal queue: one IntersectionObserver for every reveal on the
 * site, and one clock that hands out start times.
 *
 * Blocks never pick their own delays. Whatever crosses the trigger line in
 * the same frame starts in reading order, a beat apart; whatever crosses a
 * moment later waits its turn behind them. So a page's first screen
 * cascades title-first, a grid row fills left to right, and no block can
 * overtake the one above it however fast the page is flung.
 */

import { REVEAL_MAX_LAG, REVEAL_STAGGER } from "@/utils/transitions";

/** called once, when the block is let in, with its start delay (ms) */
type Release = (delay: number) => void;

// A block's top has to reach 90% of the viewport height, so the motion
// plays where the eye already is rather than under the bottom edge.
const TRIGGER_LINE = "0px 0px -10% 0px";

const waiting = new Map<Element, Release>();
let observer: IntersectionObserver | undefined;
/** when the next block may start (performance.now() ms) */
let nextStart = 0;

const byReadingOrder = (a: Element, b: Element) =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

/**
 * Start delays (ms) for `count` blocks crossing together at `now`, in
 * reading order, given when the queue lets the next block start; plus when
 * the one after them may. The queue never runs further behind than the lag
 * cap: a batch that would, closes up its beats instead of making its last
 * block wait.
 */
export function schedule(count: number, now: number, nextStart: number) {
  const lead = Math.min(Math.max(nextStart - now, 0), REVEAL_MAX_LAG);
  const beat =
    count > 1
      ? Math.min(REVEAL_STAGGER, (REVEAL_MAX_LAG - lead) / (count - 1))
      : REVEAL_STAGGER;
  const delays = Array.from({ length: count }, (_, index) =>
    Math.round(lead + index * beat),
  );
  return { delays, next: now + lead + (count - 1) * beat + REVEAL_STAGGER };
}

function letIn(entries: IntersectionObserverEntry[]) {
  const crossing = entries
    .filter((entry) => entry.isIntersecting && waiting.has(entry.target))
    .map((entry) => entry.target)
    .sort(byReadingOrder);
  if (crossing.length === 0) return;

  const { delays, next } = schedule(
    crossing.length,
    performance.now(),
    nextStart,
  );
  nextStart = next;
  crossing.forEach((target, index) => {
    const release = waiting.get(target);
    waiting.delete(target);
    observer?.unobserve(target);
    release?.(delays[index]);
  });
}

/**
 * Hold `target` until it scrolls into view, then call `release` with the
 * delay its reveal should start after. Returns the cleanup for an effect.
 */
export function watchReveal(target: Element, release: Release) {
  observer ??= new IntersectionObserver(letIn, { rootMargin: TRIGGER_LINE });
  waiting.set(target, release);
  observer.observe(target);
  return () => {
    waiting.delete(target);
    observer?.unobserve(target);
  };
}
