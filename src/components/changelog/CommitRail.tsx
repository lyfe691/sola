/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { GraphRow } from "@/lib/commit-graph";
import { cn } from "@/lib/utils";

const LANE = 16;
const FIRST_LANE_X = 7;
const ELBOW = 8;
/** Centre of the row's first text line: its top padding plus half a line. */
const NODE_Y = 22;
/** Lines stop short of a node so the ring reads hollow over any background. */
const CLEARANCE = 2;

export const railWidth = (lanes: number) =>
  FIRST_LANE_X * 2 + (lanes - 1) * LANE;

const laneX = (lane: number) => FIRST_LANE_X + lane * LANE;

const laneStroke = (lane: number) =>
  lane === 0 ? "stroke-foreground/20" : "stroke-primary/70";

function elbow(from: number, to: number, down: boolean, gap: number) {
  const x = laneX(to);
  const side = Math.sign(x - laneX(from));
  const end = down ? NODE_Y + ELBOW : NODE_Y - ELBOW;
  return `M ${laneX(from) + side * gap} ${NODE_Y} H ${x - side * ELBOW} Q ${x} ${NODE_Y} ${x} ${end}`;
}

function VLine({
  lane,
  from,
  to,
}: {
  lane: number;
  from: number;
  to: number | "100%";
}) {
  return (
    <line
      x1={laneX(lane)}
      x2={laneX(lane)}
      y1={from}
      y2={to}
      className={laneStroke(lane)}
    />
  );
}

export function CommitRail({
  row,
  lanes,
  merge,
  live,
  pending,
  fadeOut,
  className,
}: {
  row: GraphRow;
  lanes: number;
  merge: boolean;
  live: boolean;
  pending: boolean;
  fadeOut: boolean;
  className?: string;
}) {
  const x = laneX(row.lane);
  const radius = merge ? 4.5 : 3.5;
  const gap = radius + CLEARANCE;

  return (
    <svg
      aria-hidden="true"
      fill="none"
      width={railWidth(lanes)}
      className={cn(
        "pointer-events-none absolute inset-y-0 left-0 h-full overflow-visible",
        fadeOut &&
          "[mask-image:linear-gradient(to_bottom,#000_30px,transparent)]",
        className,
      )}
      strokeWidth={1.5}
    >
      {row.through.map((lane) => (
        <VLine key={`through-${lane}`} lane={lane} from={0} to="100%" />
      ))}
      {row.joins.map((lane) => (
        <g key={`join-${lane}`}>
          <VLine lane={lane} from={0} to={NODE_Y - ELBOW} />
          <path
            d={elbow(row.lane, lane, false, gap)}
            className={laneStroke(lane)}
          />
        </g>
      ))}
      {row.forks.map((lane) => (
        <g key={`fork-${lane}`}>
          <path
            d={elbow(row.lane, lane, true, gap)}
            className={laneStroke(lane)}
          />
          {row.through.includes(lane) ? null : (
            <VLine lane={lane} from={NODE_Y + ELBOW} to="100%" />
          )}
        </g>
      ))}
      {row.incoming ? (
        <VLine lane={row.lane} from={0} to={NODE_Y - gap} />
      ) : null}
      {row.outgoing ? (
        <VLine lane={row.lane} from={NODE_Y + gap} to="100%" />
      ) : null}

      <g className={cn(pending && "animate-pulse")}>
        {live ? (
          <circle
            cx={x}
            cy={NODE_Y}
            r={radius + 4}
            className="fill-primary/20"
          />
        ) : null}
        {merge ? (
          <>
            <circle cx={x} cy={NODE_Y} r={radius} className="stroke-primary" />
            <circle cx={x} cy={NODE_Y} r={1.5} className="fill-primary" />
          </>
        ) : (
          <circle
            cx={x}
            cy={NODE_Y}
            r={radius}
            className={
              row.lane > 0
                ? "fill-primary stroke-primary"
                : "stroke-foreground/45"
            }
          />
        )}
      </g>
    </svg>
  );
}
