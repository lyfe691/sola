/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * After React Bits Pro's Blur Highlight, with its timings: a line of text
 * that blurs in once it is in view, then has its key phrases marked from
 * the left. The mark is not the source's inline background: at display
 * size that one ran into the next line's mark and over the comma after a
 * phrase. Here each phrase is one unbreakable box with a mark of its own
 * behind it, shorter than the line and barely wider than the word.
 */

import { Fragment, useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE_OUT, HIDDEN_OPACITY } from "@/utils/transitions";

const BLUR_AMOUNT = 8;
const BLUR_DURATION = 0.8;
const HIGHLIGHT_DELAY = 0.4;
const HIGHLIGHT_STAGGER = 0.12;
const HIGHLIGHT_DURATION = 1;

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function BlurHighlight({
  text,
  phrases,
  className,
}: {
  text: string;
  /** Marked wherever they occur, whatever their case. */
  phrases: string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const active = useInView(ref, { once: true, amount: 0.5 });

  const wanted = phrases.filter(Boolean);
  const parts =
    wanted.length > 0
      ? text.split(new RegExp(`(${wanted.map(escape).join("|")})`, "gi"))
      : [text];
  const isMarked = (part: string) =>
    wanted.some((phrase) => phrase.toLowerCase() === part.toLowerCase());
  let marks = 0;

  return (
    <motion.p
      ref={ref}
      className={className}
      initial={{ opacity: HIDDEN_OPACITY, filter: `blur(${BLUR_AMOUNT}px)` }}
      animate={active ? { opacity: 1, filter: "blur(0px)" } : undefined}
      transition={{ duration: BLUR_DURATION, ease: EASE_OUT }}
    >
      {parts.map((part, index) => {
        // a phrase is one box, so the mark after it could wrap to the head
        // of the next line on its own: it stays with the phrase instead
        const taken = isMarked(parts[index - 1] ?? "")
          ? (CLOSING_MARK.exec(part)?.[0] ?? "")
          : "";
        if (!isMarked(part))
          return <Fragment key={index}>{part.slice(taken.length)}</Fragment>;
        const order = marks++;
        const mark = CLOSING_MARK.exec(parts[index + 1] ?? "")?.[0];
        return (
          <span key={index} className="whitespace-nowrap">
            <Phrase order={order} active={active}>
              {part}
            </Phrase>
            {mark}
          </span>
        );
      })}
    </motion.p>
  );
}

/** Punctuation that may not start a line. */
const CLOSING_MARK = /^[、。，,.;:!?]/;

function Phrase({
  order,
  active,
  children,
}: {
  order: number;
  active: boolean;
  children: string;
}) {
  return (
    <span className="relative isolate inline-block whitespace-nowrap">
      <motion.span
        aria-hidden="true"
        className="absolute -inset-x-1.5 inset-y-0.5 -z-10 origin-left rounded-2xl bg-muted"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{
          type: "spring",
          bounce: 0,
          duration: HIGHLIGHT_DURATION,
          delay: HIGHLIGHT_DELAY + order * HIGHLIGHT_STAGGER,
        }}
      />
      {children}
    </span>
  );
}
