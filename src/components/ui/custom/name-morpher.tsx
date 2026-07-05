/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The hero name breathes through the three identities (Yanis -> Sebi ->
 * lyfe691) on a slow cycle: letters cascade out upward and the next name
 * inks in beneath — one liquid glide, no box, no 3D. Pressing the name
 * skips ahead (and restarts the clock so it doesn't double-fire).
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { EASE_OUT, SMOOTH } from "@/utils/transitions";

const CYCLE_MS = 5600;
const ENTER_STAGGER = 0.032;
const EXIT_STAGGER = 0.016;

const letterVariants: Variants = {
  initial: { opacity: 0, y: "0.22em", filter: "blur(6px)" },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: SMOOTH, delay: i * ENTER_STAGGER },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: "-0.16em",
    filter: "blur(5px)",
    transition: { duration: 0.3, ease: EASE_OUT, delay: i * EXIT_STAGGER },
  }),
};

interface NameMorpherProps {
  greeting: string;
  /** accessible hint appended to the identity list on the button label */
  switchLabel: string;
  names?: string[];
}

export const NameMorpher = ({
  greeting,
  switchLabel,
  names = ["Yanis", "Sebi", "lyfe691"],
}: NameMorpherProps) => {
  const [index, setIndex] = useState(0);
  const [clock, setClock] = useState(0);
  const name = names[index];

  // one clock for both the cycle and manual skips: pressing advances
  // immediately and bumps `clock`, so the next auto-swap counts from the press
  useEffect(() => {
    if (names.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % names.length),
      CYCLE_MS,
    );
    return () => clearInterval(id);
  }, [names.length, clock]);

  return (
    <>
      <span className="text-foreground">{greeting}</span>
      <motion.button
        type="button"
        // FLIP the plate to the next name's real width — no char-count math
        layout
        transition={{ layout: { duration: 0.6, ease: SMOOTH } }}
        onClick={() => {
          setIndex((i) => (i + 1) % names.length);
          setClock((c) => c + 1);
        }}
        aria-label={`${names.join(" · ")} — ${switchLabel}`}
        className="relative inline-flex cursor-pointer touch-manipulation rounded-[0.25em] bg-muted/65 p-[0.1em] align-baseline text-primary ring-1 ring-foreground/5 ring-inset [transition:scale_200ms_var(--ease-pop)] outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-safe:active:scale-[0.97] active:duration-100 active:ease-out"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={name}
            aria-hidden="true"
            className="inline-flex whitespace-nowrap"
          >
            {name.split("").map((letter, i) => (
              <motion.span
                key={`${name}-${i}`}
                custom={i}
                variants={letterVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  );
};
