/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { motion } from "motion/react";
import { blockReveal } from "./reveal";

export function TechStack({ technologies }: { technologies: string[] }) {
  return (
    <motion.ul
      {...blockReveal}
      className="mb-6 flex list-none flex-wrap gap-2.5 p-0"
    >
      {technologies.map((tech) => (
        <li
          key={tech}
          className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors duration-200 hover:border-primary/30 hover:bg-primary/10"
        >
          {tech}
        </li>
      ))}
    </motion.ul>
  );
}
