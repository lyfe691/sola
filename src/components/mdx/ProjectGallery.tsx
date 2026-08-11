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

const COL_CLASS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function ProjectGallery({
  images,
  columns = 2,
  size = "normal",
}: {
  images: Array<{ src: string; alt: string; caption?: string }>;
  columns?: 2 | 3 | 4;
  size?: "normal" | "large";
}) {
  if (images.length === 1 && size === "large") {
    const image = images[0];
    return (
      <motion.figure {...blockReveal} className="mb-6 mx-auto max-w-4xl">
        <ExpandableImage
          src={image.src}
          alt={image.alt}
          className="w-full rounded-lg border border-border"
        />
        {image.caption ? (
          <figcaption className="mt-2 text-center text-xs italic text-muted-foreground">
            {image.caption}
          </figcaption>
        ) : null}
      </motion.figure>
    );
  }

  return (
    <motion.div
      {...blockReveal}
      className={cn("mb-6 grid items-start gap-4", COL_CLASS[columns])}
    >
      {images.map((image) => (
        <figure key={image.src} className="space-y-2">
          <ExpandableImage
            src={image.src}
            alt={image.alt}
            className="w-full rounded-lg border border-border"
          />
          {image.caption ? (
            <figcaption className="text-xs italic text-muted-foreground">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </motion.div>
  );
}
