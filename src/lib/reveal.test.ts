/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { REVEAL_MAX_LAG, REVEAL_STAGGER } from "@/utils/transitions";
import { schedule } from "./reveal";

describe("schedule", () => {
  it("starts a lone block at once when the queue is idle", () => {
    expect(schedule(1, 1000, 0)).toEqual({
      delays: [0],
      next: 1000 + REVEAL_STAGGER,
    });
  });

  it("spaces a batch a beat apart, in the order given", () => {
    expect(schedule(3, 0, 0).delays).toEqual([
      0,
      REVEAL_STAGGER,
      2 * REVEAL_STAGGER,
    ]);
  });

  it("makes a block that crosses just after another wait its turn", () => {
    const first = schedule(1, 0, 0);
    const second = schedule(1, 20, first.next);
    expect(second.delays).toEqual([REVEAL_STAGGER - 20]);
  });

  it("never lets a block wait longer than the lag cap", () => {
    const { delays } = schedule(20, 0, 0);
    expect(Math.max(...delays)).toBeLessThanOrEqual(REVEAL_MAX_LAG);
    expect(delays).toEqual([...delays].sort((a, b) => a - b));
  });

  it("caps the lead too when the queue is far behind", () => {
    expect(schedule(1, 0, 10_000).delays).toEqual([REVEAL_MAX_LAG]);
  });
});
