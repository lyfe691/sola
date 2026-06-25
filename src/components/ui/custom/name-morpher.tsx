/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion, Variants, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/utils/transitions";

interface NameMorpherProps {
  greeting: string;
  names?: string[];
  cycleInterval?: number;
}

const ANIMATION_CONFIG = {
  CYCLE_INTERVAL: 3200,
  LETTER_DELAY: 0.055,
  EXIT_DELAY: 0.035,
  CHAR_WIDTH: 0.6,
  SPRING: { stiffness: 300, damping: 20 },
  EASE_CURVE: [0.76, 0, 0.24, 1] as const,
} as const;

const letterVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
    filter: "blur(4px)",
  },
  animate: (custom: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      y: {
        ...ANIMATION_CONFIG.SPRING,
        delay: custom * ANIMATION_CONFIG.LETTER_DELAY,
      },
      opacity: { duration: 0.3, ease: EASE_OUT, delay: custom * 0.05 },
      filter: { duration: 0.3, ease: EASE_OUT, delay: custom * 0.05 },
    },
  }),
  exit: (custom: number) => ({
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: {
      y: {
        duration: 0.35,
        ease: ANIMATION_CONFIG.EASE_CURVE,
        delay: custom * ANIMATION_CONFIG.EXIT_DELAY,
      },
      opacity: { duration: 0.25, ease: EASE_OUT, delay: custom * 0.03 },
      filter: { duration: 0.25, ease: EASE_OUT, delay: custom * 0.03 },
    },
  }),
};

const containerVariants: Variants = {
  initial: { opacity: 0.9, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0.9, y: -5 },
};

export const NameMorpher = ({
  greeting,
  names = ["Yanis", "Sebi", "lyfe691"],
  cycleInterval = ANIMATION_CONFIG.CYCLE_INTERVAL,
}: NameMorpherProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [currentNameIndex, setCurrentNameIndex] = useState(0);

  const currentName = useMemo(
    () => names[currentNameIndex],
    [names, currentNameIndex],
  );

  const containerWidth = useMemo(
    () => `${currentName.length * ANIMATION_CONFIG.CHAR_WIDTH}em`,
    [currentName.length],
  );

  // Cycle through the alternate names a couple of times, then settle on the
  // real (first) name. Pause in background tabs; skip entirely when reduced.
  useEffect(() => {
    if (prefersReducedMotion || names.length <= 1) return;

    // One full pass through the names, then back to the first.
    const totalSteps = names.length;
    let step = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      step += 1;
      setCurrentNameIndex(step % names.length);
      if (step >= totalSteps) {
        // settled on the first (real) name
        if (interval) clearInterval(interval);
        interval = undefined;
      }
    };

    const start = () => {
      if (interval || step >= totalSteps) return;
      interval = setInterval(tick, cycleInterval);
    };

    const stop = () => {
      if (interval) clearInterval(interval);
      interval = undefined;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [prefersReducedMotion, names.length, cycleInterval]);

  if (prefersReducedMotion) {
    return (
      <>
        <span className="text-foreground inline-block">{greeting}</span>
        <span
          className="relative inline-flex items-center justify-center align-baseline"
          style={{
            padding: "0.1em",
            borderRadius: "0.25em",
            backgroundColor:
              "color-mix(in oklab, var(--muted) 65%, transparent)",
          }}
        >
          <span className="text-primary inline-block">{names[0]}</span>
        </span>
      </>
    );
  }

  return (
    <>
      <span className="text-foreground inline-block">{greeting}</span>
      <motion.span
        className="relative inline-block overflow-hidden align-baseline"
        initial={false}
        layout
        transition={{ layout: { duration: 0.35, ease: EASE_OUT } }}
        style={{
          display: "inline-flex",
          justifyContent: "center",
          padding: "0.1em",
          borderRadius: "0.25em",
          backgroundColor: "color-mix(in oklab, var(--muted) 65%, transparent)",
          verticalAlign: "baseline",
          width: containerWidth,
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentName}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="inline-flex"
          >
            {currentName.split("").map((letter, index) => (
              <motion.span
                key={`${currentName}-${index}`}
                variants={letterVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={index}
                className="text-primary inline-block"
                style={{
                  textShadow:
                    "0 0 12px color-mix(in oklab, var(--primary) 20%, transparent)",
                  willChange: "opacity, filter",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.span>
    </>
  );
};
