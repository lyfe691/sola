/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Suspense, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { pageTransitionVariants } from "@/utils/transitions";

const PageShell = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: "transform, filter, opacity", transformOrigin: "50% 42%" }}
        className="flex flex-1 flex-col"
      >
        <Suspense fallback={<div className="flex-1" />}>{children}</Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageShell;
