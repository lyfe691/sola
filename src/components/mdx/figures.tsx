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
 *
 * A figure is an image or a clip, bare or in a device frame; the row treats
 * them all alike, by the footprint figure-layout.ts gives them.
 */

import type { CSSProperties, ReactNode } from "react";
import { PROJECT_IMAGE_TINTS } from "@/config/project-image-sizes";
import { Hint } from "@/components/ui/custom/hint";
import { useTruncated } from "@/hooks/use-truncated";
import { cn } from "@/lib/utils";
import { ExpandableImage } from "./ExpandableImage";
import {
  type FigureFrame,
  figureRatio,
  GAP,
  PORTRAIT_BELOW,
  rowShares,
  STAGE_HEIGHT,
  isPortrait,
} from "./figure-layout";
import { DeviceFrame, SCREEN_RADIUS } from "./frames";
import { InlineVideo } from "./InlineVideo";

type FigureImage = {
  src: string;
  alt: string;
  caption?: string;
  /** A clip that plays in the figure's place; `src` is then its poster. */
  video?: string;
  frame?: FigureFrame;
  /** What the Safari frame's address field reads. */
  url?: string;
};
type Columns = 2 | 3 | 4;

export function FigureCaption({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [textRef, truncated] = useTruncated<HTMLSpanElement>();

  // rounded-xl, not -full: a browser caps a radius at half the height, so one
  // line is a capsule and a wrapped one would still be a box, not an oval
  const pill = (
    <span
      ref={textRef}
      tabIndex={truncated ? 0 : undefined}
      className={cn(
        "block max-w-full truncate rounded-xl bg-foreground/10 px-4 py-1",
        "text-2xs leading-snug text-(--prose-strong)",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        truncated && "cursor-help",
      )}
    >
      {children}
    </span>
  );

  return (
    <figcaption className={cn("mt-3 flex justify-center", className)}>
      {truncated ? (
        <Hint
          trigger={pill}
          className="max-w-72 text-center"
          popoverClassName="w-fit max-w-72 text-center"
        >
          {children}
        </Hint>
      ) : (
        pill
      )}
    </figcaption>
  );
}

function FigureMedia({ figure }: { figure: FigureImage }) {
  const radius = figure.frame ? SCREEN_RADIUS[figure.frame] : undefined;
  const media = figure.video ? (
    <InlineVideo
      src={figure.video}
      poster={figure.src}
      label={figure.alt}
      radius={radius}
    />
  ) : (
    <ExpandableImage
      src={figure.src}
      alt={figure.alt}
      caption={figure.caption}
      radius={radius}
    />
  );
  if (!figure.frame) return media;
  return (
    <DeviceFrame
      frame={figure.frame}
      url={figure.url}
      tint={PROJECT_IMAGE_TINTS[figure.src]}
    >
      {media}
    </DeviceFrame>
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
  const ratios = images.map(figureRatio);
  const total = ratios.reduce((sum, ratio) => sum + ratio, 0);
  const shares = rowShares(images);
  const figures = (cell: (index: number) => string) =>
    images.map((image, index) => (
      <figure
        key={image.src}
        style={{ "--share": shares[index] } as CSSProperties}
        className={cn("min-w-0", cell(index))}
      >
        <FigureMedia figure={image} />
        {image.caption ? <FigureCaption>{image.caption}</FigureCaption> : null}
      </figure>
    ));

  if (ratios.every((ratio) => ratio < PORTRAIT_BELOW)) {
    return (
      <div className="rounded-2xl bg-muted/50 px-5 py-8 sm:px-10 sm:py-10">
        <div
          className="mx-auto flex max-w-(--stage-w) gap-4 sm:gap-5"
          style={
            {
              "--stage-w": `calc(${total} * ${STAGE_HEIGHT}rem + ${(images.length - 1) * GAP}rem)`,
            } as CSSProperties
          }
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
        <div
          aria-hidden="true"
          className="[flex:var(--share)_1_0%]"
          style={{ "--share": spare } as CSSProperties}
        />
      ) : null}
    </div>
  );
}

const SIZE_CLASS = {
  normal: "mx-auto max-w-2xl",
  large: "mx-auto max-w-4xl",
  full: "w-full",
} as const;

type ProjectImageProps = FigureImage & {
  className?: string;
  size?: keyof typeof SIZE_CLASS;
};

export function ProjectImage({
  className,
  size = "normal",
  ...figure
}: ProjectImageProps) {
  if (isPortrait(figure)) {
    return (
      <div className={cn("my-8", className)}>
        <FigureRow images={[figure]} columns={2} />
      </div>
    );
  }

  return (
    <figure className={cn("my-8", SIZE_CLASS[size], className)}>
      <FigureMedia figure={figure} />
      {figure.caption ? <FigureCaption>{figure.caption}</FigureCaption> : null}
    </figure>
  );
}

/** A figure in a Safari window; reads cleanest at the full column. */
export function Safari({
  size = "full",
  ...props
}: Omit<ProjectImageProps, "frame">) {
  return <ProjectImage {...props} size={size} frame="safari" />;
}

/** A figure in an iPhone; a phone shot lands on the stage as it does bare. */
export function IPhone(props: Omit<ProjectImageProps, "frame" | "url">) {
  return <ProjectImage {...props} frame="iphone" />;
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
        <FigureMedia figure={image} />
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
