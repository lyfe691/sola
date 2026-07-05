/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { EASE_EXPO, EASE_IN_OUT, EASE_OUT } from "@/utils/transitions";

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
  EASE_CURVE: EASE_IN_OUT,
} as const;

const letterVariants: Variants = {
  initial: {
    opacity: 0,
    x: 25,
    y: 8,
    rotateX: 30,
    rotateY: -60,
    scale: 0.85,
    filter: "blur(4px)",
  },
  animate: (custom: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      x: {
        ...ANIMATION_CONFIG.SPRING,
        delay: custom * ANIMATION_CONFIG.LETTER_DELAY,
      },
      y: {
        ...ANIMATION_CONFIG.SPRING,
        delay: custom * ANIMATION_CONFIG.LETTER_DELAY,
      },
      rotateX: {
        type: "spring",
        stiffness: 250,
        damping: 20,
        delay: custom * ANIMATION_CONFIG.LETTER_DELAY,
      },
      rotateY: {
        type: "spring",
        stiffness: 250,
        damping: 20,
        delay: custom * ANIMATION_CONFIG.LETTER_DELAY,
      },
      scale: {
        type: "spring",
        stiffness: 280,
        damping: 18,
        delay: custom * ANIMATION_CONFIG.LETTER_DELAY,
      },
      opacity: { duration: 0.3, ease: EASE_OUT, delay: custom * 0.05 },
      filter: { duration: 0.3, ease: EASE_OUT, delay: custom * 0.05 },
    },
  }),
  exit: (custom: number) => ({
    opacity: 0,
    x: -25,
    y: -8,
    rotateX: -30,
    rotateY: 60,
    scale: 0.85,
    filter: "blur(4px)",
    transition: {
      x: {
        duration: 0.35,
        ease: ANIMATION_CONFIG.EASE_CURVE,
        delay: custom * ANIMATION_CONFIG.EXIT_DELAY,
      },
      y: {
        duration: 0.35,
        ease: ANIMATION_CONFIG.EASE_CURVE,
        delay: custom * ANIMATION_CONFIG.EXIT_DELAY,
      },
      rotateX: {
        duration: 0.35,
        ease: ANIMATION_CONFIG.EASE_CURVE,
        delay: custom * ANIMATION_CONFIG.EXIT_DELAY,
      },
      rotateY: {
        duration: 0.35,
        ease: ANIMATION_CONFIG.EASE_CURVE,
        delay: custom * ANIMATION_CONFIG.EXIT_DELAY,
      },
      scale: {
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
  const [currentNameIndex, setCurrentNameIndex] = useState(0);

  const currentName = useMemo(
    () => names[currentNameIndex],
    [names, currentNameIndex],
  );

  const containerWidth = useMemo(
    () => `${currentName.length * ANIMATION_CONFIG.CHAR_WIDTH}em`,
    [currentName.length],
  );

  useEffect(() => {
    if (names.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentNameIndex((prev) => (prev + 1) % names.length);
    }, cycleInterval);

    return () => clearInterval(interval);
  }, [names.length, cycleInterval]);

  return (
    <>
      <span className="text-foreground inline-block">{greeting}</span>
      <motion.span
        className="relative inline-block overflow-hidden align-baseline"
        initial={false}
        animate={{ width: containerWidth }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
        style={{
          display: "inline-flex",
          justifyContent: "center",
          padding: "0.1em",
          borderRadius: "0.25em",
          backgroundColor: "color-mix(in oklab, var(--muted) 65%, transparent)",
          verticalAlign: "baseline",
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentName}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE_EXPO }}
            className="inline-flex"
            style={{ perspective: "500px" }}
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
                  willChange: "transform, opacity, filter",
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
