/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from "react";
import { motion } from "motion/react";
import { blockReveal } from "./reveal";

export const TechStack: React.FC<{
  technologies: string[];
}> = ({ technologies }) => (
  <motion.div {...blockReveal} className="flex flex-wrap gap-2.5 mb-6">
    {technologies.map((tech) => (
      <span
        key={tech}
        className="px-3 py-1.5 bg-primary/5 text-primary border border-primary/20
                 text-xs rounded-lg font-medium transition-colors duration-200
                 hover:bg-primary/10 hover:border-primary/30"
      >
        {tech}
      </span>
    ))}
  </motion.div>
);
