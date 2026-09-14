/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { createMountQueue } from "./mount-queue";

/** A scheduler we drive by hand: one `tick()` runs one scheduled callback. */
const manualScheduler = () => {
  const pending: Array<() => void> = [];
  return {
    schedule: (cb: () => void) => {
      pending.push(cb);
    },
    tick: () => pending.shift()?.(),
    get pending() {
      return pending.length;
    },
  };
};

describe("createMountQueue", () => {
  it("runs one job per tick", () => {
    const s = manualScheduler();
    const queue = createMountQueue(s.schedule);
    const ran: string[] = [];
    queue.enqueue({ priority: () => 0, run: () => ran.push("a") });
    queue.enqueue({ priority: () => 0, run: () => ran.push("b") });
    expect(ran).toEqual([]);
    s.tick();
    expect(ran).toEqual(["a"]);
    s.tick();
    expect(ran).toEqual(["a", "b"]);
    expect(queue.size).toBe(0);
  });

  it("drains the nearest job first, re-reading priorities at drain time", () => {
    const s = manualScheduler();
    const queue = createMountQueue(s.schedule);
    const ran: string[] = [];
    let farDistance = 900;
    queue.enqueue({ priority: () => farDistance, run: () => ran.push("far") });
    queue.enqueue({ priority: () => 100, run: () => ran.push("near") });
    s.tick();
    expect(ran).toEqual(["near"]);
    farDistance = 0; // the page scrolled; priorities are live functions
    s.tick();
    expect(ran).toEqual(["near", "far"]);
  });

  it("cancels a job before it runs", () => {
    const s = manualScheduler();
    const queue = createMountQueue(s.schedule);
    const ran: string[] = [];
    const cancel = queue.enqueue({
      priority: () => 0,
      run: () => ran.push("a"),
    });
    queue.enqueue({ priority: () => 1, run: () => ran.push("b") });
    cancel();
    s.tick();
    s.tick();
    expect(ran).toEqual(["b"]);
  });

  it("holds creation until released, then drains as before", () => {
    const s = manualScheduler();
    const queue = createMountQueue(s.schedule);
    const ran: string[] = [];
    queue.enqueue({ priority: () => 1, run: () => ran.push("a") });
    const release = queue.hold();
    s.tick(); // the tick scheduled before the hold runs nothing
    queue.enqueue({ priority: () => 0, run: () => ran.push("b") });
    expect(ran).toEqual([]);
    expect(s.pending).toBe(0);
    release();
    s.tick();
    s.tick();
    expect(ran).toEqual(["b", "a"]);
  });

  it("nests holds and ignores a second release", () => {
    const s = manualScheduler();
    const queue = createMountQueue(s.schedule);
    const ran: string[] = [];
    const releaseOuter = queue.hold();
    const releaseInner = queue.hold();
    queue.enqueue({ priority: () => 0, run: () => ran.push("a") });
    releaseInner();
    releaseInner();
    expect(s.pending).toBe(0);
    releaseOuter();
    s.tick();
    expect(ran).toEqual(["a"]);
  });

  it("schedules at most one tick at a time", () => {
    const s = manualScheduler();
    const queue = createMountQueue(s.schedule);
    queue.enqueue({ priority: () => 0, run: () => {} });
    queue.enqueue({ priority: () => 0, run: () => {} });
    queue.enqueue({ priority: () => 0, run: () => {} });
    expect(s.pending).toBe(1);
  });
});
