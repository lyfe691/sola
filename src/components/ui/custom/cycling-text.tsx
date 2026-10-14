/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The hero description cycles through its sentences: each one blurs in
 * letter by letter, then leaves the same way, last letter first.
 */

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { HIDDEN_OPACITY } from "@/utils/transitions";

const CYCLE_MS = 3000;
const STAGGER = 0.0075;
const DELAY = 0.1;

const sentenceVariants: Variants = {
  hidden: { opacity: HIDDEN_OPACITY },
  visible: {
    opacity: 1,
    transition: { staggerChildren: STAGGER, delayChildren: DELAY },
  },
  exit: {
    transition: {
      staggerChildren: STAGGER,
      staggerDirection: -1,
      delayChildren: DELAY,
    },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: HIDDEN_OPACITY, filter: "blur(12px)", y: 8 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.35 },
  },
  exit: {
    opacity: 0,
    filter: "blur(12px)",
    y: 8,
    transition: { duration: 0.35 },
  },
};

const SPACE = /^\s+$/;
const OPENING = /^[\p{Ps}\p{Pi}]+$/u;
const words =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "word" })
    : null;

/**
 * Words with their punctuation, and the runs of space between them: a line
 * may break between two pieces, never inside one. Scripts written without
 * spaces get their words from the segmenter.
 */
const splitWords = (text: string) => {
  if (!words) return text.split(/(\s+)/);
  const pieces: string[] = [];
  let opening = "";
  for (const { segment, isWordLike } of words.segment(text)) {
    const last = pieces.length - 1;
    if (SPACE.test(segment)) {
      if (opening) pieces.push(opening);
      opening = "";
      pieces.push(segment);
    } else if (!isWordLike && OPENING.test(segment)) {
      opening += segment;
    } else if (isWordLike || opening || last < 0 || SPACE.test(pieces[last])) {
      pieces.push(opening + segment);
      opening = "";
    } else {
      pieces[last] += segment;
    }
  }
  if (opening) pieces.push(opening);
  return pieces;
};

const layOut = (text: string, letter: (char: string, i: number) => ReactNode) =>
  splitWords(text).map((piece, i) =>
    SPACE.test(piece) ? (
      piece
    ) : (
      <span key={i} aria-hidden="true" className="inline-block whitespace-pre">
        {Array.from(piece, letter)}
      </span>
    ),
  );

interface CyclingTextProps {
  texts: string[];
  className?: string;
}

export const CyclingText = ({ texts, className }: CyclingTextProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % texts.length),
      CYCLE_MS,
    );
    return () => clearInterval(id);
  }, [texts.length]);

  if (texts.length === 0) return null;
  const text = texts[index];

  return (
    // every sentence sits invisibly in the one cell, so the box holds the
    // tallest one and nothing below it moves as they cycle
    <div className={cn("grid", className)}>
      {texts.map((each) => (
        <div
          key={each}
          aria-hidden="true"
          className="invisible col-start-1 row-start-1"
        >
          {layOut(each, (char, i) => (
            <span key={i} className="inline-block">
              {char}
            </span>
          ))}
        </div>
      ))}
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          variants={sentenceVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="col-start-1 row-start-1 block"
        >
          <span className="sr-only">{text}</span>
          {layOut(text, (char, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
