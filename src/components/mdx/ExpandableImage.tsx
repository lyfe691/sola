/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Expandable project figure: the thumbnail half. At rest it is the image and
 * a hairline; hover adds one round expand chip and nothing else. A click
 * hands the image to the article's lightbox (figure-lightbox.tsx), which
 * flies it out of this slot and back.
 */

import { useContext, useEffect, useId, useRef } from "react";
import { ArrowExpandIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PROJECT_IMAGE_SIZES } from "@/config/project-image-sizes";
import { useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";
import { RADIUS_INLINE } from "./figure-layout";
import { FigureLightboxProvider } from "./figure-lightbox";
import { FigureLightboxContext } from "./figure-lightbox-context";

type ExpandableImageProps = {
  src: string;
  alt: string;
  /** Shown with the image when it is open. */
  caption?: string;
  /** Set by a frame: the corners it cuts the image to. The frame then lifts it. */
  radius?: string;
  className?: string;
};

function Thumbnail({
  src,
  alt,
  caption,
  radius,
  className,
}: ExpandableImageProps) {
  const lightbox = useContext(FigureLightboxContext);
  const id = useId();
  const thumbRef = useRef<HTMLImageElement>(null);
  const t = useTranslation();
  const away = lightbox?.awayId === id;
  const register = lightbox?.register;

  useEffect(
    () => register?.({ id, src, alt, caption, thumb: () => thumbRef.current }),
    [register, id, src, alt, caption],
  );

  const expandLabel = alt.trim()
    ? t.common.expandImageNamed.replace("{alt}", alt.trim())
    : t.common.expandImage;

  return (
    <button
      type="button"
      onClick={() => lightbox?.open(id)}
      aria-label={expandLabel}
      style={radius ? { borderRadius: radius } : undefined}
      className={cn(
        "group/image relative block w-full overflow-hidden",
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
          page does not grow under a reader or under a jump to a section */}
      <img
        ref={thumbRef}
        src={src}
        alt=""
        width={PROJECT_IMAGE_SIZES[src]?.[0]}
        height={PROJECT_IMAGE_SIZES[src]?.[1]}
        style={{ borderRadius: radius ?? RADIUS_INLINE }}
        // the lightbox's flyer is this image while it is away
        className={cn("block h-auto w-full", away && "invisible")}
        loading="lazy"
        decoding="async"
      />

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
