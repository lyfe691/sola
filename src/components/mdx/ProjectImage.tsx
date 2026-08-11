/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ExpandableImage } from "./ExpandableImage";
import { blockReveal } from "./reveal";

const SIZE_CLASS = {
  normal: "mx-auto max-w-2xl",
  large: "mx-auto max-w-4xl",
  full: "w-full",
} as const;

export function ProjectImage({
  src,
  alt,
  caption,
  className,
  size = "normal",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  size?: keyof typeof SIZE_CLASS;
}) {
  return (
    <motion.figure
      {...blockReveal}
      className={cn("my-8", SIZE_CLASS[size], className)}
    >
      <ExpandableImage
        src={src}
        alt={alt}
        className="w-full rounded-lg border border-border"
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-xs italic text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}
