/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Expandable project figure: the thumbnail half. At rest it is the image (or
 * its clip, playing) and a hairline; hover adds one round expand chip and
 * nothing else. A click hands it to the article's lightbox
 * (figure-lightbox.tsx), which flies it out of this slot and back.
 */

import {
  useContext,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
} from "react";
import { ArrowExpandIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PROJECT_IMAGE_SIZES } from "@/config/project-image-sizes";
import { useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";
import { RADIUS_INLINE } from "./figure-layout";
import { FigureLightboxProvider } from "./figure-lightbox";
import { FigureLightboxContext } from "./figure-lightbox-context";
import { InlineVideo } from "./InlineVideo";

type ExpandableImageProps = {
  /** The image, or the clip's poster when there is a `video`. */
  src: string;
  /** A clip that plays in the image's place. */
  video?: string;
  alt: string;
  /** Shown with the image when it is open. */
  caption?: string;
  /** Set by a frame: the corners it cuts the image to. The frame then lifts it. */
  radius?: string;
  className?: string;
};

function Thumbnail({
  src,
  video,
  alt,
  caption,
  radius,
  className,
}: ExpandableImageProps) {
  const lightbox = useContext(FigureLightboxContext);
  const id = useId();
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const t = useTranslation();
  const away = lightbox?.awayId === id;
  const register = lightbox?.register;

  useEffect(
    () =>
      register?.({
        id,
        src,
        video,
        alt,
        caption,
        thumb: () => imageRef.current ?? videoRef.current,
      }),
    [register, id, src, video, alt, caption],
  );

  const expandLabel = alt.trim()
    ? (video ? t.common.expandVideoNamed : t.common.expandImageNamed).replace(
        "{alt}",
        alt.trim(),
      )
    : video
      ? t.common.expandVideo
      : t.common.expandImage;
  const mediaClass = cn(
    "block h-auto w-full rounded-(--corner)",
    away && "invisible",
  );
  const corner = { "--corner": radius ?? RADIUS_INLINE } as CSSProperties;

  return (
    <button
      type="button"
      onClick={() => lightbox?.open(id)}
      aria-label={expandLabel}
      style={radius ? ({ "--corner": radius } as CSSProperties) : undefined}
      className={cn(
        "group/image relative block w-full overflow-hidden",
        radius && "rounded-(--corner)",
        // in a frame the corners, the lift and the ground behind the image
        // are the frame's, and a ring outside the button would be clipped
        radius
          ? "focus-visible:ring-inset"
          : "rounded-xl bg-muted/20 shadow-(--prose-figure-lift)",
        "cursor-zoom-in outline-none select-none",
        // v4: scale uses the `scale` property — transition `scale`, not transform
        "transition-[scale] duration-200 ease-out",
        "active:scale-[0.99]",
        "focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
    >
      {/* width/height only carry the aspect ratio (the class still sizes
          the image): the box is reserved before a lazy image loads, so the
          page does not grow under a reader or under a jump to a section.
          The lightbox's flyer is this image while it is away. */}
      {video ? (
        <InlineVideo
          src={video}
          poster={src}
          held={lightbox?.awayId != null}
          videoRef={videoRef}
          style={corner}
          className={mediaClass}
        />
      ) : (
        <img
          ref={imageRef}
          src={src}
          alt=""
          width={PROJECT_IMAGE_SIZES[src]?.[0]}
          height={PROJECT_IMAGE_SIZES[src]?.[1]}
          style={corner}
          className={mediaClass}
          loading="lazy"
          decoding="async"
        />
      )}

      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-3 bottom-3",
          "grid size-8 place-items-center rounded-full",
          "bg-background/80 text-foreground shadow-sm backdrop-blur-md",
          "scale-90 opacity-0 transition-[opacity,scale] duration-200 ease-out",
          "can-hover:group-hover/image:scale-100 can-hover:group-hover/image:opacity-100",
          "group-focus-visible/image:scale-100 group-focus-visible/image:opacity-100",
          away && "hidden",
        )}
      >
        <HugeiconsIcon
          icon={ArrowExpandIcon}
          strokeWidth={2}
          className="size-3.5"
        />
      </span>
    </button>
  );
}

/** Inside an article the figures share its lightbox; alone, it brings its own. */
export function ExpandableImage(props: ExpandableImageProps) {
  const shared = useContext(FigureLightboxContext);
  if (shared) return <Thumbnail {...props} />;
  return (
    <FigureLightboxProvider>
      <Thumbnail {...props} />
    </FigureLightboxProvider>
  );
}
