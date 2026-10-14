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
import { EASE_OUT, HIDDEN_OPACITY, SMOOTH } from "@/utils/transitions";

const CYCLE_MS = 5600;
const ENTER_STAGGER = 0.032;
const EXIT_STAGGER = 0.016;

const letterVariants: Variants = {
  initial: { opacity: HIDDEN_OPACITY, y: "0.22em", filter: "blur(6px)" },
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

/**
 * The greeting, and its last word: after its last space, or, in a script
 * written without spaces, after its last punctuation ("こんにちは、|私は").
 */
const splitGreeting = (greeting: string) => {
  const text = greeting.trim();
  const space = text.search(/\s\S*$/);
  const cut = space >= 0 ? space + 1 : text.search(/[\p{P}][^\p{P}]*$/u) + 1;
  return [text.slice(0, cut), text.slice(cut)] as const;
};

interface NameMorpherProps {
  /** the words before the name */
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
  const [lead, lastWord] = splitGreeting(greeting);

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
      <span className="text-foreground">{lead}</span>
      <wbr />
      <span className="whitespace-nowrap">
        <span className="text-foreground">{lastWord} </span>
        <span className="inline-grid">
          {names.map((each) => (
            <span
              key={each}
              aria-hidden="true"
              className="invisible col-start-1 row-start-1 inline-flex p-[0.1em] whitespace-nowrap"
            >
              {each.split("").map((letter, i) => (
                <span key={i} className="inline-block">
                  {letter}
                </span>
              ))}
            </span>
          ))}
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
            className="relative col-start-1 row-start-1 inline-flex cursor-pointer touch-manipulation justify-self-start rounded-[0.25em] bg-muted/65 p-[0.1em] text-primary ring-1 ring-foreground/5 ring-inset [transition:scale_200ms_var(--ease-pop)] outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-safe:active:scale-[0.97] active:duration-100 active:ease-out"
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
        </span>
      </span>
    </>
  );
};
