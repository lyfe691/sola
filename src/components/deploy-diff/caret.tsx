/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The terminal caret: a thin primary bar, em-sized so it scales with the
 * type. Solid while characters arrive; while the shell waits it phases — a
 * soft breath, not a hard terminal strobe, matching how everything else on
 * this site idles. Shared by every prompt the site draws (the code view,
 * the 404 shell) so the caret is one object everywhere.
 */

import { motion } from "motion/react";
import { REVEAL } from "@/utils/transitions";

export function Caret({ blinking }: { blinking: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="ml-[0.15em] inline-block h-[1em] w-[0.09em] min-w-[2px] translate-y-[0.12em] rounded-full bg-primary"
      animate={blinking ? { opacity: [1, 0.15, 1] } : { opacity: 1 }}
      transition={
        blinking
          ? { duration: 1.2, repeat: Infinity, ease: REVEAL }
          : { duration: 0.1 }
      }
    />
  );
}
