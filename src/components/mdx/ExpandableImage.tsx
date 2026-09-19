/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Expandable project figure. At rest it is the image and a hairline; hover
 * adds one round expand chip and nothing else.
 *
 * Opening never fades one picture into another. A single image (the flyer)
 * is laid over the thumbnail, then re-laid at the centre of the screen, and
 * the layout animation carries it there; closing re-lays it over the
 * thumbnail and it flies back. The flyer lives above the backdrop for the
 * whole trip, so it stays solid while everything around it fades.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowExpandIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PROJECT_IMAGE_SIZES } from "@/config/project-image-sizes";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { EASE_OUT, FLIGHT_BACK, FLIGHT_OUT } from "@/utils/transitions";
import { useWindowScrollLock } from "@/hooks/use-window-scroll-lock";

/** The chrome around the image (backdrop, caption, close) fades on the UI
 *  clock; the image itself never fades, it only moves. */
const FADE = { duration: 0.2, ease: EASE_OUT } as const;

const PAGE_SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
]);

const RADIUS_INLINE = 12;
const RADIUS_OPEN = 16;

/** closed → docked (flyer laid over the thumbnail) → open → returning → closed */
type Phase = "closed" | "docked" | "open" | "returning";
type Box = { top: number; left: number; width: number; height: number };

function Lightbox({
  src,
  alt,
  caption,
  phase,
  dock,
  flyerRef,
  onClose,
  onLanded,
}: {
  src: string;
  alt: string;
  caption?: string;
  phase: Phase;
  /** Where the thumbnail sits on screen: the flyer's start and end. */
  dock: Box;
  flyerRef: React.RefObject<HTMLImageElement | null>;
  onClose: () => void;
  onLanded: () => void;
}) {
  const { language } = useLanguage();
  const t = translations[language];
  const labelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = phase === "open";

  useEffect(() => {
    if (!open) return;

    const restoreTo =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus());

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
        return;
      }
      // the page behind a dialog does not scroll from the keyboard either
      if (PAGE_SCROLL_KEYS.has(e.key)) e.preventDefault();
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
      restoreTo?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  const size = PROJECT_IMAGE_SIZES[src];

  return createPortal(
    <div
      role={open ? "dialog" : undefined}
      aria-modal={open ? true : undefined}
      aria-labelledby={open ? labelId : undefined}
      aria-hidden={open ? undefined : true}
      className={cn(
        "fixed inset-0 z-100",
        open ? "cursor-zoom-out" : "pointer-events-none",
      )}
      onClick={onClose}
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            key="chrome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            className="absolute inset-0"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-background/85 backdrop-blur-xl"
            />
            <span id={labelId} className="sr-only">
              {caption?.trim() || alt.trim() || t.common.expandedImage}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label={t.common.close}
              className={cn(
                "absolute top-4 right-4 grid size-10 cursor-pointer place-items-center rounded-full sm:top-6 sm:right-6",
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
            </button>
            {caption ? (
              <p className="absolute inset-x-4 bottom-5 mx-auto w-fit max-w-lg rounded-2xl bg-foreground/6 px-4 py-1.5 text-center text-sm leading-snug text-foreground/70">
                {caption}
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* the layer is click-through so it cannot cover the close button */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center p-4 sm:p-10">
        <motion.img
          ref={flyerRef}
          layout
          layoutDependency={phase}
          onLayoutAnimationComplete={() => {
            if (phase === "returning") onLanded();
          }}
          initial={false}
          animate={{ borderRadius: open ? RADIUS_OPEN : RADIUS_INLINE }}
          transition={open ? FLIGHT_OUT : FLIGHT_BACK}
          src={src}
          alt={open ? alt : ""}
          width={size?.[0]}
          height={size?.[1]}
          // laid over the thumbnail it takes the thumbnail's box; open, the
          // classes centre it and let it grow to the screen
          style={open ? undefined : { position: "fixed", ...dock }}
          className={cn(
            "transition-shadow duration-300 ease-out",
            open
              ? "pointer-events-auto h-auto max-h-[min(80vh,1100px)] w-auto max-w-full shadow-2xl ring-1 ring-border sm:max-w-[min(100%,1400px)]"
              : "max-w-none",
          )}
        />
      </div>
    </div>,
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
  /** Shown with the image when it is open. */
  caption?: string;
  className?: string;
}) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [dock, setDock] = useState<Box | null>(null);
  const thumbRef = useRef<HTMLImageElement>(null);
  const flyerRef = useRef<HTMLImageElement>(null);
  const reducedMotion = useReducedMotion();
  const { language } = useLanguage();
  const t = translations[language];
  const away = phase !== "closed";
  // docked, the flyer only covers the thumbnail; after that it has left
  const flown = phase === "open" || phase === "returning";

  // The page is held only while the image is out. An overflow lock on
  // <body> is not used: it would make <body> the scroll container and
  // un-stick the page's sticky bar. Lenis alone holds the page.
  useWindowScrollLock(phase === "docked" || phase === "open");

  // On the way back the page is live again. If it scrolls, the thumbnail has
  // moved out from under the flyer, so the flight ends where the thumbnail is.
  useEffect(() => {
    if (phase !== "returning") return;
    const land = () => setPhase("closed");
    window.addEventListener("scroll", land, { passive: true, once: true });
    return () => window.removeEventListener("scroll", land);
  }, [phase]);

  const measure = useCallback((): Box | null => {
    const rect = thumbRef.current?.getBoundingClientRect();
    return rect
      ? {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }
      : null;
  }, []);

  const handleOpen = useCallback(() => {
    const box = measure();
    if (!box) return;
    setDock(box);
    setPhase("docked");
  }, [measure]);

  // The flyer is laid over the thumbnail first, and leaves once it can
  // paint, so the thumbnail is never swapped for a blank frame.
  useEffect(() => {
    if (phase !== "docked") return;
    let live = true;
    const leave = () => {
      if (live) setPhase("open");
    };
    (flyerRef.current?.decode() ?? Promise.resolve()).then(leave, leave);
    return () => {
      live = false;
    };
  }, [phase]);

  const handleClose = useCallback(() => {
    const box = measure();
    const at = flyerRef.current?.getBoundingClientRect();
    if (!box || !at) return setPhase("closed");
    // nothing to fly (reduced motion, or the open image already sits on the
    // thumbnail): no layout animation would run, so none would ever complete
    const landed =
      Math.abs(at.top - box.top) < 1 &&
      Math.abs(at.left - box.left) < 1 &&
      Math.abs(at.width - box.width) < 1;
    setDock(box);
    setPhase(reducedMotion || landed ? "closed" : "returning");
  }, [measure, reducedMotion]);

  const handleLanded = useCallback(() => setPhase("closed"), []);

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
          "group/image relative block w-full overflow-hidden rounded-xl",
          "bg-muted/20 ring-1 ring-border",
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
          style={{ borderRadius: RADIUS_INLINE }}
          // the flyer is this image while it is away
          className={cn("block h-auto w-full", flown && "invisible")}
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

      {away && dock ? (
        <Lightbox
          src={src}
          alt={alt}
          caption={caption}
          phase={phase}
          dock={dock}
          flyerRef={flyerRef}
          onClose={handleClose}
          onLanded={handleLanded}
        />
      ) : null}
    </>
  );
}
