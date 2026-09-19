/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Expandable project figure. At rest it is the image and a hairline; hover
 * adds one round expand chip and nothing else. Opening does not swap to a
 * second picture: the image itself travels from its place on the page to the
 * centre of the screen (a shared layout), and travels back on close.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowExpandIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import { PROJECT_IMAGE_SIZES } from "@/config/project-image-sizes";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { EASE_OUT, SMOOTH } from "@/utils/transitions";
import { useWindowScrollLock } from "@/hooks/use-window-scroll-lock";

/** The image's flight between the page and the screen. */
const MORPH = { duration: 0.5, ease: SMOOTH } as const;
/** Everything around it (backdrop, caption, close) fades on the UI clock. */
const FADE = { duration: 0.25, ease: EASE_OUT } as const;

const RADIUS_INLINE = 12;
const RADIUS_OPEN = 16;

function ImageLightbox({
  src,
  alt,
  caption,
  layoutId,
  isOpen,
  onClose,
  labelId,
}: {
  src: string;
  alt: string;
  caption?: string;
  layoutId: string;
  isOpen: boolean;
  onClose: () => void;
  labelId: string;
}) {
  const { language } = useLanguage();
  const t = translations[language];
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = requestAnimationFrame(() => {
      closeRef.current?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      // the close button is the dialog's only stop
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreFocusRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  const size = PROJECT_IMAGE_SIZES[src];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          className="fixed inset-0 z-100 cursor-zoom-out"
          onClick={onClose}
        >
          <span id={labelId} className="sr-only">
            {caption?.trim() || alt.trim() || t.common.expandedImage}
          </span>

          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            className="absolute inset-0 bg-background/85 backdrop-blur-xl"
          />

          <motion.button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            className={cn(
              "absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full sm:top-6 sm:right-6",
              "bg-foreground/6 text-foreground/70",
              "transition-[background-color,color,scale] duration-150 ease-out",
              "hover:bg-foreground/10 hover:text-foreground",
              "active:scale-[0.96]",
              "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
            )}
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              strokeWidth={2}
              className="size-4.5"
              aria-hidden="true"
            />
          </motion.button>

          <figure className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 sm:p-10">
            <motion.img
              layoutId={layoutId}
              transition={MORPH}
              src={src}
              alt={alt}
              width={size?.[0]}
              height={size?.[1]}
              style={{ borderRadius: RADIUS_OPEN }}
              className="h-auto max-h-[min(84vh,1100px)] w-auto max-w-full min-h-0 shadow-2xl ring-1 ring-border sm:max-w-[min(100%,1400px)]"
            />
            {caption ? (
              <motion.figcaption
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { ...FADE, delay: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="max-w-lg shrink-0 px-2 text-center text-sm leading-relaxed text-muted-foreground"
              >
                {caption}
              </motion.figcaption>
            ) : null}
          </figure>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function ExpandableImage({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  /** Shown under the image when it is open. */
  caption?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // on the way back the image is the page's own element again, so it would
  // pass under the figures that follow it; it rides above them until it lands
  const [inFlight, setInFlight] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const labelId = useId();
  const layoutId = useId();
  useWindowScrollLock(isOpen);
  const handleOpen = useCallback(() => {
    setInFlight(true);
    setIsOpen(true);
  }, []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const expandLabel = alt.trim()
    ? t.common.expandImageNamed.replace("{alt}", alt.trim())
    : t.common.expandImage;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={expandLabel}
        className={cn(
          "group/image relative block w-full rounded-xl",
          "bg-muted/20 ring-1 ring-border",
          "cursor-zoom-in outline-none select-none",
          // v4: scale uses the `scale` property — transition `scale`, not transform
          "transition-[scale] duration-200 ease-out",
          "active:scale-[0.99]",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
          inFlight && "z-40",
          className,
        )}
      >
        {/* width/height only carry the aspect ratio (the class still sizes
            the image): the box is reserved before a lazy image loads, so the
            page does not grow under a reader or under a jump to a section */}
        <motion.img
          layoutId={layoutId}
          layoutDependency={isOpen}
          onLayoutAnimationComplete={() => {
            if (!isOpen) setInFlight(false);
          }}
          transition={MORPH}
          src={src}
          alt=""
          width={PROJECT_IMAGE_SIZES[src]?.[0]}
          height={PROJECT_IMAGE_SIZES[src]?.[1]}
          style={{ borderRadius: RADIUS_INLINE }}
          className="block h-auto w-full"
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
          )}
        >
          <HugeiconsIcon
            icon={ArrowExpandIcon}
            strokeWidth={2}
            className="size-3.5"
          />
        </span>
      </button>

      <ImageLightbox
        src={src}
        alt={alt}
        caption={caption}
        layoutId={layoutId}
        isOpen={isOpen}
        onClose={handleClose}
        labelId={labelId}
      />
    </>
  );
}
