/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A Depth Card, ported as a wrapper: its child leans toward
 * the pointer, and whatever inside reads --depth-x / --depth-y slides the
 * other way, so it sits nearer than the surface behind it. Both ease toward
 * the pointer a tenth of the way each frame, as the source does. Left out:
 * the card's own image, caption, shadow and spotlight (the owner asked for
 * no light on hover).
 */

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The most a tile leans (degrees) and its near layer slides (px). */
const MAX_ROTATION = 10;
const MAX_TRANSLATION = 14;
/** How much of the remaining way is covered each frame. */
const FOLLOW = 0.1;

type Pose = { x: number; y: number; rotateX: number; rotateY: number };
const REST: Pose = { x: 0, y: 0, rotateX: 0, rotateY: 0 };

export function DepthTilt({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const target = useRef<Pose>(REST);
  const current = useRef<Pose>({ ...REST });
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const follow = () => {
    const inner = innerRef.current;
    if (!inner) return;
    const pose = current.current;
    let moving = false;
    for (const key of Object.keys(REST) as (keyof Pose)[]) {
      const gap = target.current[key] - pose[key];
      pose[key] += gap * FOLLOW;
      if (Math.abs(gap) > 0.01) moving = true;
    }
    inner.style.setProperty("--tilt-x", `${pose.rotateX}deg`);
    inner.style.setProperty("--tilt-y", `${pose.rotateY}deg`);
    inner.style.setProperty("--depth-x", `${pose.x}px`);
    inner.style.setProperty("--depth-y", `${pose.y}px`);
    frame.current = moving ? requestAnimationFrame(follow) : 0;
  };

  const aim = (pose: Pose) => {
    target.current = pose;
    if (!frame.current) frame.current = requestAnimationFrame(follow);
  };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) / (box.width / 2);
    const y = (event.clientY - box.top - box.height / 2) / (box.height / 2);
    aim({
      x: x * -MAX_TRANSLATION,
      y: y * -MAX_TRANSLATION,
      rotateX: y * -MAX_ROTATION,
      rotateY: x * MAX_ROTATION,
    });
  };

  return (
    <div
      className={cn("perspective-distant", className)}
      onPointerMove={move}
      onPointerLeave={() => aim(REST)}
    >
      <div ref={innerRef} className="depth-tilt">
        {children}
      </div>
    </div>
  );
}
