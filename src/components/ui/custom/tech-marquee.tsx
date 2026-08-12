/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Ambient logo strip for the deep-dive tech stack: naked brand marks with
 * lowercase mono names — no chip chrome, deliberately its OWN identity next
 * to the badge chips on cards — drifting slowly instead of wrapping onto a
 * second line. Craft rules:
 *   - loops ONLY when the items overflow the row — short stacks render as a
 *     static row, no three-item carousel
 *   - pauses on hover with an eased stop (velocity chases its target), so
 *     reading never fights the motion
 *   - edge fade via mask-image, i.e. real transparency, safe over any theme
 * Screen readers get exactly one copy; the seamless duplicates are hidden.
 *
 * Reduced motion is the CALLER's job: supply a static fallback that keeps
 * every tag visible (TechStack falls back to its wrapped list) — this
 * component assumes motion is allowed.
 */

import { useEffect, useRef, useState } from "react";
import { TECH_ICONS, TECH_ICON_FALLBACK } from "@/config/tech-icons";
import { cn } from "@/lib/utils";

/** px/s — ambient drift, slow enough to read in passing */
const SPEED = 30;

/**
 * One stack entry: mark + lowercase mono name. The lowercase is CSS-only so
 * screen readers and copy/paste keep the real casing; concept-tag glyphs
 * inherit the muted text color while brand marks keep their colors.
 */
export const StackItem = ({ name }: { name: string }) => {
  const Icon = TECH_ICONS[name] ?? TECH_ICON_FALLBACK;
  return (
    <span className="inline-flex items-center gap-2 font-mono text-sm lowercase whitespace-nowrap text-foreground/60">
      <Icon size={18} aria-hidden="true" className="shrink-0" />
      {name}
    </span>
  );
};
/** s — exponential easing constant for velocity changes (hover pause/resume) */
const SMOOTH_TAU = 0.25;

const Row = ({
  tags,
  hidden,
  seqRef,
}: {
  tags: string[];
  hidden?: boolean;
  seqRef?: React.Ref<HTMLDivElement>;
}) => (
  <div
    ref={seqRef}
    aria-hidden={hidden || undefined}
    className="flex shrink-0 items-center gap-8 pr-8"
  >
    {tags.map((tag) => (
      <StackItem key={tag} name={tag} />
    ))}
  </div>
);

export const TechMarquee = ({
  tags,
  className,
}: {
  tags: string[];
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const [copies, setCopies] = useState(1);
  const [looping, setLooping] = useState(false);

  // measure: loop only when the sequence genuinely overflows the container
  useEffect(() => {
    const container = containerRef.current;
    const seq = seqRef.current;
    if (!container || !seq) return;

    const update = () => {
      const containerWidth = container.clientWidth;
      const seqWidth = seq.getBoundingClientRect().width;
      if (!containerWidth || !seqWidth) return;
      const overflows = seqWidth > containerWidth + 1;
      setLooping(overflows);
      setCopies(overflows ? Math.ceil(containerWidth / seqWidth) + 2 : 1);
    };

    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(seq);
    update();
    document.fonts?.ready.then(update);
    return () => observer.disconnect();
  }, [tags]);

  // drive the drift — velocity eases toward its target (0 while hovered),
  // offset wraps on the sequence width for the seamless join
  useEffect(() => {
    if (!looping) return;
    const track = trackRef.current;
    const seq = seqRef.current;
    if (!track || !seq) return;

    let raf = 0;
    let last: number | null = null;
    let offset = 0;
    let velocity = 0;

    const step = (now: number) => {
      if (last !== null) {
        const dt = (now - last) / 1000;
        const target = hoveredRef.current ? 0 : SPEED;
        velocity += (target - velocity) * (1 - Math.exp(-dt / SMOOTH_TAU));
        const size = seq.getBoundingClientRect().width;
        if (size > 0) {
          offset = (((offset + velocity * dt) % size) + size) % size;
          track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        }
      }
      last = now;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      track.style.transform = "";
    };
  }, [looping]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      className={cn(
        "relative overflow-hidden",
        looping &&
          "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
    >
      <div ref={trackRef} className="flex w-max">
        <Row tags={tags} seqRef={seqRef} />
        {Array.from({ length: copies - 1 }, (_, i) => (
          <Row key={i} tags={tags} hidden />
        ))}
      </div>
    </div>
  );
};

export default TechMarquee;
