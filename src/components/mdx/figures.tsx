/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * MDX figure primitives — single image, multi-image gallery, shared caption.
 *
 * One layout rule: the figures of a row share one height, and each one's
 * width follows from its aspect ratio, so a phone beside a desktop shot ends
 * on the same line and the captions sit on one baseline. A row of phones
 * alone cannot fill the block at a sane height; it sits centred on a stage
 * that does.
 */

import type { CSSProperties, ReactNode } from "react";
import { PROJECT_IMAGE_SIZES } from "@/config/project-image-sizes";
import { cn } from "@/lib/utils";
import { ExpandableImage } from "./ExpandableImage";

type FigureImage = { src: string; alt: string; caption?: string };
type Columns = 2 | 3 | 4;

/** Width over height; a screenshot outside the size list counts as 16:10. */
const ratioOf = (src: string) => {
  const size = PROJECT_IMAGE_SIZES[src];
  return size ? size[0] / size[1] : 1.6;
};
const PORTRAIT_BELOW = 0.8;
const isPortrait = (src: string) => ratioOf(src) < PORTRAIT_BELOW;

/** Height of the phones on a stage, and the row gap, in rem. */
const STAGE_HEIGHT = 27;
const GAP = 1.25;

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

// the row forms where its thumbnails stay legible; below that it stacks
const ROW_FROM = {
  2: "sm:flex-row",
  3: "md:flex-row",
  4: "md:flex-row",
} as const;
const CELL_FROM = {
  2: "sm:[flex:var(--share)_1_0%]",
  3: "md:[flex:var(--share)_1_0%]",
  4: "md:[flex:var(--share)_1_0%]",
} as const;
const STACKED_PHONE = {
  2: "max-sm:mx-auto max-sm:w-full max-sm:max-w-56",
  3: "max-md:mx-auto max-md:w-full max-md:max-w-56",
  4: "max-md:mx-auto max-md:w-full max-md:max-w-56",
} as const;

function FigureRow({
  images,
  columns,
}: {
  images: FigureImage[];
  columns: Columns;
}) {
  const ratios = images.map((image) => ratioOf(image.src));
  const total = ratios.reduce((sum, ratio) => sum + ratio, 0);
  // grow factors are shares of the row: factors that sum to less than one
  // would leave part of the row unclaimed
  const figures = (cell: (index: number) => string) =>
    images.map((image, index) => (
      <figure
        key={image.src}
        style={{ "--share": ratios[index] / total } as CSSProperties}
        className={cn("min-w-0", cell(index))}
      >
        <ExpandableImage
          src={image.src}
          alt={image.alt}
          caption={image.caption}
        />
        {image.caption ? <FigureCaption>{image.caption}</FigureCaption> : null}
      </figure>
    ));

  if (ratios.every((ratio) => ratio < PORTRAIT_BELOW)) {
    return (
      <div className="rounded-2xl bg-muted/50 px-5 py-8 sm:px-10 sm:py-10">
        <div
          className="mx-auto flex gap-4 sm:gap-5"
          style={{
            maxWidth: `calc(${total} * ${STAGE_HEIGHT}rem + ${(images.length - 1) * GAP}rem)`,
          }}
        >
          {figures(() => "[flex:var(--share)_1_0%]")}
        </div>
      </div>
    );
  }

  // a short last row keeps the scale of a full one instead of stretching
  const spare = (columns - images.length) / images.length;

  return (
    <div className={cn("flex flex-col gap-4 sm:gap-5", ROW_FROM[columns])}>
      {figures((index) =>
        cn(
          CELL_FROM[columns],
          ratios[index] < PORTRAIT_BELOW && STACKED_PHONE[columns],
        ),
      )}
      {spare > 0 ? (
        <div aria-hidden="true" style={{ flex: `${spare} 1 0%` }} />
      ) : null}
    </div>
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
  if (isPortrait(src)) {
    return (
      <div className={cn("my-8", className)}>
        <FigureRow images={[{ src, alt, caption }]} columns={2} />
      </div>
    );
  }

  return (
    <figure className={cn("my-8", SIZE_CLASS[size], className)}>
      <ExpandableImage src={src} alt={alt} caption={caption} />
      {caption ? <FigureCaption>{caption}</FigureCaption> : null}
    </figure>
  );
}

export function ProjectGallery({
  images,
  columns = 2,
  size = "normal",
}: {
  images: FigureImage[];
  /** Figures per row. */
  columns?: Columns;
  /** Single-image large/full is a hero; multi always fills the block. */
  size?: "normal" | "large" | "full";
}) {
  if (images.length === 1 && (size === "large" || size === "full")) {
    const image = images[0];
    return (
      <figure
        className={cn("my-8", size === "full" ? "w-full" : "mx-auto max-w-4xl")}
      >
        <ExpandableImage
          src={image.src}
          alt={image.alt}
          caption={image.caption}
        />
        {image.caption ? <FigureCaption>{image.caption}</FigureCaption> : null}
      </figure>
    );
  }

  const rows: FigureImage[][] = [];
  for (let start = 0; start < images.length; start += columns) {
    rows.push(images.slice(start, start + columns));
  }

  return (
    <div className="my-8 flex flex-col gap-6">
      {rows.map((row) => (
        <FigureRow key={row[0].src} images={row} columns={columns} />
      ))}
    </div>
  );
}
