/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A figure that moves: a muted clip that plays while it is on screen and
 * rests on its poster otherwise. It is watched where it is, so it has no
 * lightbox; under reduced motion it waits for a press on its own controls.
 */

import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { PROJECT_IMAGE_SIZES } from "@/config/project-image-sizes";
import { cn } from "@/lib/utils";

export function InlineVideo({
  src,
  poster,
  label,
  radius,
  className,
}: {
  src: string;
  /** A still from the clip, in the size list: it reserves the box and shows
   *  until the clip plays. */
  poster: string;
  label: string;
  /** Set by a frame: the corners it cuts the clip to. The frame then lifts it. */
  radius?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reducedMotion) return;
    const observer = new IntersectionObserver(([entry]) => {
      // play() is refused now and then (autoplay policy, a pause racing it);
      // the poster is what shows then, nothing to report
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reducedMotion]);

  const size = PROJECT_IMAGE_SIZES[poster];

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={label}
      width={size?.[0]}
      height={size?.[1]}
      muted
      loop
      playsInline
      preload="metadata"
      controls={reducedMotion === true}
      style={radius ? ({ "--corner": radius } as CSSProperties) : undefined}
      className={cn(
        "block h-auto w-full",
        radius && "rounded-(--corner)",
        !radius && "rounded-xl bg-muted/20 shadow-(--prose-figure-lift)",
        className,
      )}
    />
  );
}
