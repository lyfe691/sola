/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A ported Skewed Carousel: a strip of cards where the one
 * in focus faces the reader and the others turn away, more with each step.
 * The strip is one card wide and slides by whole cards, so the focused card
 * is always centred. Changed from the source: a slide is any node (a staged
 * capture, not an image), the turn stops short of edge-on (a capture's text
 * must never show from behind), and the colours and curves are the site's.
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion, useInView, type PanInfo } from "motion/react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@/lib/locale-router";
import { cn } from "@/lib/utils";

export interface SkewedSlide {
  id: string;
  title: string;
  /** Where the card leads once it is the one in focus. */
  to?: string;
  node: ReactNode;
}

/** Degrees a card turns per step from the focused one, and where that stops. */
const ROTATION = 60;
const MAX_TURN = 76;
const INACTIVE_SCALE = 0.85;
const PERSPECTIVE = 800;
/** A drag counts as a flick past this distance, velocity weighed in. */
const FLICK_DISTANCE = 45;
const FLICK_WEIGHT = 0.08;
const AUTOPLAY_MS = 3600;
/** A card's width, in CSS: measured in script it was one size on the first
 *  paint and another after it, and the page jumped. */
const CARD_WIDTH = "min(440px, 74cqw)";
/** The source's springs: the strip, a card turning, the rail's marker. */
const STRIP = { type: "spring", bounce: 0.2, duration: 0.8 } as const;
const CARD = { type: "spring", bounce: 0.1, duration: 1 } as const;
const RAIL = { type: "spring", bounce: 0.25, duration: 0.5 } as const;

const wrap = (value: number, count: number) =>
  ((value % count) + count) % count;

export function SkewedCarousel({
  slides,
  label,
  previousLabel,
  nextLabel,
  className,
}: {
  slides: SkewedSlide[];
  label: string;
  previousLabel: string;
  nextLabel: string;
  className?: string;
}) {
  const count = slides.length;
  const token = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(Math.floor(count / 2));

  const [resting, setResting] = useState(false);
  const inView = useInView(rootRef, { amount: 0.3 });
  const navigate = useNavigate();
  // a drag ends in a click on whatever card is under the pointer: that
  // click must not undo the step the drag just made
  const dragged = useRef(false);

  const step = useCallback(
    (delta: number) => setFocused((from) => wrap(from + delta, count)),
    [count],
  );

  useEffect(() => {
    if (resting || !inView || count <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tick = window.setInterval(() => step(1), AUTOPLAY_MS);
    return () => window.clearInterval(tick);
  }, [resting, inView, count, step]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    step(delta);
  };

  const onPanEnd = (_: unknown, info: PanInfo) => {
    const thrown = info.offset.x + info.velocity.x * FLICK_WEIGHT;
    if (Math.abs(thrown) < FLICK_DISTANCE) return;
    step(thrown < 0 ? 1 : -1);
  };

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setResting(true)}
      onPointerLeave={() => setResting(false)}
      onFocus={() => setResting(true)}
      onBlur={() => setResting(false)}
      className={cn(
        // clipped sideways only: a turned card's near edge stands taller than
        // the strip, and clipping it there cuts its border. The card's width
        // is capped so the side cards end inside the strip
        "@container relative flex w-full flex-col items-center overflow-x-clip rounded-3xl outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
    >
      <div
        className="w-(--card) py-2"
        style={{ "--card": CARD_WIDTH } as CSSProperties}
      >
        <motion.div
          className="flex w-fit touch-pan-y"
          initial={false}
          animate={{ x: `${(-focused * 100) / count}%` }}
          transition={STRIP}
          onPan={(_, info) => {
            if (Math.abs(info.offset.x) > 5) dragged.current = true;
          }}
          onPanEnd={onPanEnd}
          onClickCapture={(event) => {
            if (!dragged.current) return;
            dragged.current = false;
            event.stopPropagation();
            event.preventDefault();
          }}
        >
          {slides.map((slide, index) => {
            const offset = index - focused;
            const turn = Math.max(
              -MAX_TURN,
              Math.min(MAX_TURN, offset * -ROTATION),
            );
            return (
              <div
                key={slide.id}
                className="perspective-(--depth)"
                style={{ "--depth": `${PERSPECTIVE}px` } as CSSProperties}
              >
                <motion.div
                  className="w-(--card) will-change-transform"
                  animate={{
                    rotateY: turn,
                    scale: offset === 0 ? 1 : INACTIVE_SCALE,
                  }}
                  transition={CARD}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (offset === 0 && slide.to) navigate(slide.to);
                      else setFocused(index);
                    }}
                    tabIndex={offset === 0 ? 0 : -1}
                    aria-label={slide.title}
                    aria-current={offset === 0}
                    className="block w-full cursor-pointer rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    {slide.node}
                  </button>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* announced only while the reader drives it: on autoplay it would
          speak every few seconds */}
      <p
        aria-live={resting ? "polite" : "off"}
        className="mt-6 text-sm font-medium text-foreground"
      >
        {slides[focused]?.title}
      </p>

      <div className="mt-4 flex items-center gap-4 text-foreground">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => step(-1)}
          aria-label={previousLabel}
        >
          <CaretLeftIcon />
        </Button>
        <div className="flex w-44 items-center gap-1.5 sm:w-56">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setFocused(index)}
              aria-label={slide.title}
              aria-current={index === focused}
              className="relative h-1 flex-1 cursor-pointer rounded-full bg-foreground/15 outline-none transition-colors duration-200 ease-out hover:bg-foreground/40 focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {index === focused && (
                <motion.span
                  layoutId={token}
                  className="absolute inset-0 rounded-full bg-foreground"
                  transition={RAIL}
                />
              )}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => step(1)}
          aria-label={nextLabel}
        >
          <CaretRightIcon />
        </Button>
      </div>
    </div>
  );
}
