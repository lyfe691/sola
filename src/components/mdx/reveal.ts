/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Deep-dive motion helpers. Prefer SECTION-level reveals over per-block
 * animation — independent whileInView observers race and feel broken when
 * MDX mounts async after the config sections.
 */

import type { Variants } from "motion/react";
import { REVEAL, scrollSubtleVariants } from "@/utils/transitions";

/** One soft settle when a major region enters view (meta block, article, footer). */
export const sectionReveal = {
  variants: scrollSubtleVariants,
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, amount: 0.12, margin: "0px 0px -8% 0px" },
} as const;

/** Parent for a staggered cascade of config sections (overview / tech / links). */
export const sectionCascade: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const sectionChild = scrollSubtleVariants;

// legacy alias — prefer sectionReveal; kept for any stray imports
export const blockReveal = sectionReveal;

export { REVEAL };
