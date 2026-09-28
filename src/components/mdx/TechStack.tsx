/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The deep-dive tech stack as an editorial type band: big outlined names,
 * each after its mark, drifting as one line. Craft rules:
 *   - loops ONLY when the names overflow the row — a short stack sits still
 *   - pointing at the band eases it to a stop; the name under the pointer
 *     fills solid and its mark takes its colour (index.css, "type band")
 *   - a looping band can be grabbed and thrown: it follows the pointer 1:1,
 *     coasts when let go, then eases back into its drift
 *   - edge fade via mask-image, i.e. real transparency, safe over any theme
 * Under reduced motion nothing drifts or drags: the names wrap and still fill.
 * Screen readers get exactly one copy; the seamless duplicates are hidden.
 */

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type Ref,
} from "react";
import { useReducedMotion } from "motion/react";
import { TechMark } from "@/components/ui/custom/tech-mark";
import { cn } from "@/lib/utils";

/** px/s — the drift */
const SPEED = 40;
/** s — how quickly the drift eases to a stop under the pointer, and back */
const SMOOTH_TAU = 0.25;
/** s — the same after a throw, which should coast rather than brake */
const FLING_TAU = 0.5;
/** px/s — the fastest a throw sends the band */
const FLING_MAX = 2000;
/** px — travel before a press becomes a drag */
const DRAG_SLOP = 4;
/** ms — a pointer held still this long before letting go throws nothing */
const THROW_WINDOW = 80;

interface Drag {
  pointerId: number;
  startX: number;
  x: number;
  time: number;
  /** px/s, smoothed over the last few moves */
  velocity: number;
  moved: boolean;
}

function Row({
  tags,
  hidden,
  wrap,
  ref,
}: {
  tags: string[];
  hidden?: boolean;
  wrap?: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      aria-hidden={hidden || undefined}
      className={cn(
        "flex items-center gap-x-5 sm:gap-x-7",
        wrap ? "flex-wrap gap-y-2 sm:gap-y-3" : "shrink-0 pr-5 sm:pr-7",
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="type-band-item inline-flex items-center gap-2 whitespace-nowrap sm:gap-3"
        >
          <span className="type-band-mark inline-flex shrink-0 text-foreground/60">
            <TechMark name={tag} size="0.75em" aria-hidden="true" />
          </span>
          <span className="type-band-word">
            {tag}
            <span aria-hidden="true" className="type-band-fill">
              {tag}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}

export function TechStack({ technologies }: { technologies: string[] }) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLDivElement>(null);
  const seqWidthRef = useRef(0);
  const hoveredRef = useRef(false);
  // written by a drag, read by the frame loop: kept out of React
  const driftRef = useRef({ offset: 0, velocity: SPEED, fling: false });
  const dragRef = useRef<Drag | null>(null);
  const [copies, setCopies] = useState(1);
  const [overflows, setOverflows] = useState(false);
  const [dragging, setDragging] = useState(false);
  const looping = overflows && !reduceMotion;

  // measure: loop only when the sequence genuinely overflows the container
  useEffect(() => {
    const container = containerRef.current;
    const seq = seqRef.current;
    if (!container || !seq) return;

    const update = () => {
      const containerWidth = container.clientWidth;
      const seqWidth = seq.getBoundingClientRect().width;
      if (!containerWidth || !seqWidth) return;
      seqWidthRef.current = seqWidth;
      const over = seqWidth > containerWidth + 1;
      setOverflows(over);
      setCopies(over ? Math.ceil(containerWidth / seqWidth) + 2 : 1);
    };

    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(seq);
    update();
    document.fonts?.ready.then(update);
    return () => observer.disconnect();
  }, [technologies]);

  // the drift: velocity eases toward its target (0 under the pointer), a
  // drag moves the offset itself; the offset wraps on the sequence width
  useEffect(() => {
    if (!looping) return;
    const track = trackRef.current;
    if (!track) return;
    const drift = driftRef.current;

    let raf = 0;
    let last: number | null = null;

    const step = (now: number) => {
      const dt = last === null ? 0 : (now - last) / 1000;
      last = now;
      if (!dragRef.current?.moved) {
        const target = hoveredRef.current ? 0 : SPEED;
        const tau = drift.fling ? FLING_TAU : SMOOTH_TAU;
        drift.velocity += (target - drift.velocity) * (1 - Math.exp(-dt / tau));
        if (drift.fling && Math.abs(target - drift.velocity) < 1) {
          drift.fling = false;
        }
        drift.offset += drift.velocity * dt;
      }
      const size = seqWidthRef.current;
      if (size > 0) {
        drift.offset = ((drift.offset % size) + size) % size;
        track.style.transform = `translate3d(${-drift.offset}px, 0, 0)`;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      track.style.transform = "";
    };
  }, [looping]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!looping || event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      x: event.clientX,
      time: event.timeStamp,
      velocity: 0,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.moved) {
      if (Math.abs(event.clientX - drag.startX) < DRAG_SLOP) return;
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    const dx = event.clientX - drag.x;
    const dt = (event.timeStamp - drag.time) / 1000;
    driftRef.current.offset -= dx;
    if (dt > 0) drag.velocity = drag.velocity * 0.5 + (-dx / dt) * 0.5;
    drag.x = event.clientX;
    drag.time = event.timeStamp;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag?.moved) return;
    setDragging(false);
    const thrown =
      event.type === "pointerup" && event.timeStamp - drag.time < THROW_WINDOW;
    const drift = driftRef.current;
    drift.velocity = thrown
      ? Math.max(-FLING_MAX, Math.min(FLING_MAX, drag.velocity))
      : 0;
    drift.fling = true;
  };

  return (
    <div
      ref={containerRef}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cn(
        "overflow-hidden py-1 text-2xl leading-tight font-semibold tracking-tight sm:text-4xl",
        looping &&
          "touch-pan-y select-none [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] can-hover:cursor-grab",
        dragging && "can-hover:cursor-grabbing",
      )}
    >
      <div ref={trackRef} className={cn("flex", looping && "w-max")}>
        <Row
          tags={technologies}
          wrap={!looping && !!reduceMotion}
          ref={seqRef}
        />
        {looping &&
          Array.from({ length: copies - 1 }, (_, i) => (
            <Row key={i} tags={technologies} hidden />
          ))}
      </div>
    </div>
  );
}
