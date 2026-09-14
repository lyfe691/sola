/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { changedSlots, enterRanks } from "./grid-swap";

const sorted = (set: ReadonlySet<string>) => [...set].sort();

describe("changedSlots", () => {
  it("is empty when nothing moves", () => {
    expect(changedSlots(["a", "b", "c"], ["a", "b", "c"]).size).toBe(0);
    expect(changedSlots([], []).size).toBe(0);
  });

  it("names both occupants of a swapped pair and nobody else", () => {
    expect(
      sorted(changedSlots(["a", "b", "c", "d"], ["c", "b", "a", "d"])),
    ).toEqual(["a", "c"]);
  });

  it("marks everything downstream of a removal, plus the leaver", () => {
    expect(sorted(changedSlots(["a", "b", "c", "d"], ["a", "c", "d"]))).toEqual(
      ["b", "c", "d"],
    );
  });

  it("marks an arrival and everything it pushes down", () => {
    expect(sorted(changedSlots(["a", "c"], ["a", "b", "c"]))).toEqual([
      "b",
      "c",
    ]);
  });

  it("treats a full replacement as every slot changing", () => {
    expect(sorted(changedSlots(["a", "b"], ["x"]))).toEqual(["a", "b", "x"]);
  });
});

describe("enterRanks", () => {
  it("ranks changed ids in reading order of the new grid, skipping the unchanged", () => {
    const next = ["a", "x", "b", "y", "c"];
    const ranks = enterRanks(next, new Set(["x", "y", "gone"]));
    expect([...ranks.entries()]).toEqual([
      ["x", 0],
      ["y", 1],
    ]);
  });

  it("gives a leaving id no rank", () => {
    expect(enterRanks(["a"], new Set(["gone"])).size).toBe(0);
  });
});
