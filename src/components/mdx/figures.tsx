/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * MDX figure primitives — single image, multi-image gallery, shared caption.
 * All expand through ExpandableImage.
 */

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ExpandableImage } from "./ExpandableImage";
import { blockReveal } from "./reveal";

export function FigureCaption({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <figcaption
      className={cn(
        "mt-2.5 text-center text-2xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </figcaption>
  );
}

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
      <ExpandableImage src={src} alt={alt} />
      {caption ? <FigureCaption>{caption}</FigureCaption> : null}
    </motion.figure>
  );
}

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
  /** Single-image large/full is a hero; multi always fills the column grid. */
  size?: "normal" | "large" | "full";
}) {
  if (images.length === 1 && (size === "large" || size === "full")) {
    const image = images[0];
    return (
      <motion.figure
        {...blockReveal}
        className={cn(
          "my-8",
          size === "full" ? "w-full" : "mx-auto max-w-4xl",
        )}
      >
        <ExpandableImage src={image.src} alt={image.alt} />
        {image.caption ? <FigureCaption>{image.caption}</FigureCaption> : null}
      </motion.figure>
    );
  }

  return (
    <motion.div
      {...blockReveal}
      className={cn("my-8 grid items-start gap-4 sm:gap-5", COL_CLASS[columns])}
    >
      {images.map((image) => (
        <figure key={image.src} className="min-w-0">
          <ExpandableImage src={image.src} alt={image.alt} />
          {image.caption ? (
            <FigureCaption>{image.caption}</FigureCaption>
          ) : null}
        </figure>
      ))}
    </motion.div>
  );
}
