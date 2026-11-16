/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * x.ai's menu chevron: it does not turn. Its point travels up through the
 * line of its two ends, so it flattens to a dash and opens out the other
 * way. Drawn as theirs is (a 16 box, a 1.75 stroke); sized by its class and
 * inked in the text colour.
 */

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_SMOOTH } from "@/utils/transitions";

const DOWN = "4,6 8,10 12,6";
const UP = "4,10 8,6 12,10";

export function FlipChevron({
  open,
  className,
}: {
  /** Points up: what it opens is showing. */
  open: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
    >
      <motion.polyline
        initial={false}
        animate={{ points: open ? UP : DOWN }}
        transition={{ duration: 0.2, ease: EASE_SMOOTH }}
      />
    </svg>
  );
}
