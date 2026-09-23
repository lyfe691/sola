/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Lane layout for the changelog's branch rail: one pass down the log, newest
 * first, each lane waiting for the sha it will reach next.
 */

export interface GraphRow {
  /** Lane the commit's node sits in. */
  lane: number;
  /** The node's lane runs in from the row above. */
  incoming: boolean;
  /** The node's lane runs on to the row below (it has a first parent). */
  outgoing: boolean;
  /** Lanes that cross the row without touching the node. */
  through: number[];
  /** Lanes that end in this node — a branch rejoining where it started. */
  joins: number[];
  /** Lanes the node's other parents leave by — a merge opening its branch. */
  forks: number[];
}

export interface CommitGraph {
  rows: GraphRow[];
  lanes: number;
}

function freeLane(lanes: (string | null)[]): number {
  const index = lanes.indexOf(null);
  return index === -1 ? lanes.length : index;
}

export function commitGraph(
  commits: { sha: string; parents: string[] }[],
): CommitGraph {
  const lanes: (string | null)[] = [];
  let width = 1;

  const rows = commits.map((commit) => {
    const expecting = lanes.flatMap((sha, i) =>
      sha === commit.sha ? [i] : [],
    );
    const through = lanes.flatMap((sha, i) =>
      sha !== null && sha !== commit.sha ? [i] : [],
    );
    const incoming = expecting.length > 0;
    const lane = incoming ? expecting[0] : freeLane(lanes);
    const joins = expecting.slice(1);
    for (const join of joins) lanes[join] = null;

    const [first, ...others] = commit.parents;
    lanes[lane] = first ?? null;
    const forks = others.map((parent) => {
      const existing = lanes.indexOf(parent);
      if (existing !== -1) return existing;
      const fresh = freeLane(lanes);
      lanes[fresh] = parent;
      return fresh;
    });

    width = Math.max(width, lanes.length, lane + 1, ...joins.map((j) => j + 1));
    while (lanes.length > 0 && lanes[lanes.length - 1] === null) lanes.pop();

    return {
      lane,
      incoming,
      outgoing: first !== undefined,
      through,
      joins,
      forks,
    };
  });

  return { rows, lanes: width };
}
