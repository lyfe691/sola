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

export const ProjectGallery: React.FC<{
  images: Array<{ src: string; alt: string; caption?: string }>;
  columns?: 2 | 3 | 4;
  size?: "normal" | "large";
}> = ({ images, columns = 2, size = "normal" }) => {
  // For single image with large size, use special layout
  if (images.length === 1 && size === "large") {
    return (
      <motion.div {...blockReveal} className="mb-6 max-w-4xl mx-auto">
        <ExpandableImage
          src={images[0].src}
          alt={images[0].alt}
          className="w-full rounded-lg border border-border"
        />
        {images[0].caption && (
          <p className="text-xs text-muted-foreground italic text-center mt-2">
            {images[0].caption}
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      {...blockReveal}
      className={`grid gap-4 mb-6 items-start ${
        columns === 2
          ? "sm:grid-cols-2"
          : columns === 3
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "sm:grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {images.map((image) => (
        <div key={image.src} className="space-y-2">
          <ExpandableImage
            src={image.src}
            alt={image.alt}
            className="w-full rounded-lg border border-border"
          />
          {image.caption && (
            <p className="text-xs text-muted-foreground italic">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </motion.div>
  );
};
