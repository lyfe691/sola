/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from "react";
import { motion } from "motion/react";
import { ExpandableImage } from "./ExpandableImage";
import { blockReveal } from "./reveal";

export const ProjectImage: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  size?: "normal" | "large" | "full";
}> = ({ src, alt, caption, className = "", size = "normal" }) => (
  <motion.div
    {...blockReveal}
    className={`my-8 ${className} ${
      size === "large"
        ? "max-w-4xl mx-auto"
        : size === "full"
          ? "w-full"
          : "max-w-2xl mx-auto"
    }`}
  >
    <ExpandableImage
      src={src}
      alt={alt}
      className="w-full rounded-lg border border-border"
    />
    {caption && (
      <p className="text-xs text-muted-foreground italic text-center mt-2">
        {caption}
      </p>
    )}
  </motion.div>
);
