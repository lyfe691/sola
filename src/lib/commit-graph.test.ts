/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 */

import { describe, expect, it } from "vitest";
import { commitGraph } from "./commit-graph";

const c = (sha: string, ...parents: string[]) => ({ sha, parents });

describe("commitGraph", () => {
  it("keeps a straight history in one lane", () => {
    const graph = commitGraph([c("c", "b"), c("b", "a"), c("a")]);
    expect(graph.lanes).toBe(1);
    expect(graph.rows.map((row) => row.lane)).toEqual([0, 0, 0]);
    expect(graph.rows[0].incoming).toBe(false);
    expect(graph.rows[1].incoming).toBe(true);
    expect(graph.rows[2].outgoing).toBe(false);
  });

  it("opens a merge's branch in a second lane and closes it at the base", () => {
    // m merges branch y→x off base b
    const graph = commitGraph([
      c("m", "b", "y"),
      c("y", "x"),
      c("x", "b"),
      c("b", "a"),
    ]);
    expect(graph.lanes).toBe(2);
    const [m, y, x, b] = graph.rows;
    expect(m).toMatchObject({ lane: 0, forks: [1], joins: [] });
    expect(y).toMatchObject({ lane: 1, incoming: true, through: [0] });
    expect(x).toMatchObject({ lane: 1, through: [0] });
    expect(b).toMatchObject({ lane: 0, joins: [1], forks: [], through: [] });
  });

  it("reuses a lane when one branch closes into the next merge", () => {
    const graph = commitGraph([
      c("m2", "m1", "q"),
      c("q", "m1"),
      c("m1", "b", "p"),
      c("p", "b"),
      c("b"),
    ]);
    expect(graph.lanes).toBe(2);
    expect(graph.rows[2]).toMatchObject({ lane: 0, joins: [1], forks: [1] });
  });

  it("starts an unreachable commit as a fresh tip", () => {
    const graph = commitGraph([c("pinned"), c("b", "a"), c("a")]);
    expect(graph.rows[1]).toMatchObject({ lane: 0, incoming: false });
  });
});
