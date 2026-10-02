/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A figure's clip in the page: muted, looping, playing while it is on screen
 * and resting on its poster otherwise. It opens in the lightbox like an image
 * (ExpandableImage is its thumbnail); under reduced motion it only plays
 * there, on a press.
 */

import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import { useReducedMotion } from "motion/react";
import { PROJECT_IMAGE_SIZES } from "@/config/project-image-sizes";

export function InlineVideo({
  src,
  poster,
  held,
  videoRef,
  style,
  className,
}: {
  src: string;
  /** A still from the clip, in the size list: it reserves the box and shows
   *  until the clip plays. */
  poster: string;
  /** The lightbox is open: the page's clips wait behind it. */
  held: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  style?: CSSProperties;
  className?: string;
}) {
  const [onScreen, setOnScreen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry.isIntersecting),
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // play() is refused now and then (autoplay policy, a pause racing it);
    // the poster is what shows then, nothing to report
    if (onScreen && !held && !reducedMotion) video.play().catch(() => {});
    else video.pause();
  }, [videoRef, onScreen, held, reducedMotion]);

  const size = PROJECT_IMAGE_SIZES[poster];

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      aria-hidden="true"
      width={size?.[0]}
      height={size?.[1]}
      muted
      loop
      playsInline
      preload="metadata"
      style={style}
      className={className}
    />
  );
}
