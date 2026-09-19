/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The article's one lightbox. Every figure registers its thumbnail here, so
 * the open view can walk all of them.
 *
 * One model, one coordinate system. The article's images sit side by side on
 * a strip, each at the size it fits the screen at, a fixed gap apart; the
 * strip's offset is one spring-driven value, so the image showing is centred
 * and its neighbours peek in, dimmed, from the sides. Arrows, arrow keys, the
 * filmstrip and a drag all move that one value, which is why fast presses
 * cannot pile up and a drag can follow the finger.
 *
 * Opening never fades one picture into another. The image showing is posed
 * over its thumbnail (translate + scale, the corner radius divided by the
 * scale so it reads the same), then released to its place on the strip;
 * closing poses it back over the thumbnail of whichever image is showing.
 * It stays above the backdrop for the whole trip, so it is solid while
 * everything around it fades.
 */

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { PROJECT_IMAGE_SIZES } from "@/config/project-image-sizes";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  EASE_OUT,
  FLIGHT_BACK,
  FLIGHT_OUT,
  GALLERY_SLIDE,
} from "@/utils/transitions";
import { snapScrollTo } from "@/utils/scroll";
import { useWindowScrollLock } from "@/hooks/use-window-scroll-lock";
import {
  FigureLightboxContext,
  RADIUS_INLINE,
  type FigureEntry,
} from "./figure-lightbox-context";

/** The chrome around the image (backdrop, caption, controls, neighbours)
 *  fades on the UI clock; the image itself never fades, it only moves. */
const FADE = { duration: 0.2, ease: EASE_OUT } as const;

const RADIUS_OPEN = 16;
/** Widest an image is shown, and the space between neighbours on the strip. */
const MAX_WIDTH = 1400;
const GAP = 48;
/** A neighbour: smaller and dimmed, so the image showing is never in doubt. */
const NEIGHBOUR_SCALE = 0.94;
const NEIGHBOUR_OPACITY = 0.22;
/** A drag turns the page past this distance, or this speed (px/s). */
const SWIPE_DISTANCE = 56;
const SWIPE_SPEED = 500;
/** What headings leave clear for the sticky bar (scroll-mt-24). */
const STICKY_CLEARANCE = 96;

const PAGE_SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
]);
const FOCUSABLE = "button:not([disabled])";

/** closed → docked (posed over the thumbnail) → open → returning → closed */
type Phase = "closed" | "docked" | "open" | "returning";
type Box = { top: number; left: number; width: number; height: number };
type View = {
  phase: Phase;
  items: FigureEntry[];
  index: number;
  /** Whether the view has moved off the image it opened on. */
  moved: boolean;
  /** Where the showing image's thumbnail sits on screen. */
  dock: Box | null;
};
const CLOSED: View = {
  phase: "closed",
  items: [],
  index: 0,
  moved: false,
  dock: null,
};

/** The area an image may fill: its centre on screen, and its size. */
type Stage = { cx: number; cy: number; w: number; h: number };

const boxOf = (node: Element | null | undefined): Box | null => {
  const rect = node?.getBoundingClientRect();
  return rect
    ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
    : null;
};

const inDocumentOrder = (a: FigureEntry, b: FigureEntry) => {
  const first = a.thumb();
  const second = b.thumb();
  if (!first || !second) return 0;
  return first.compareDocumentPosition(second) &
    Node.DOCUMENT_POSITION_FOLLOWING
    ? -1
    : 1;
};

/** The strip: each image at the size it fits the stage at (never past its
 *  own pixels), and where its centre sits when the first image's is at 0. */
function layOut(items: FigureEntry[], stage: Stage) {
  const sizes = items.map((item) => {
    const natural = PROJECT_IMAGE_SIZES[item.src];
    const ratio = natural ? natural[0] / natural[1] : 1.6;
    const w = Math.min(
      stage.w,
      MAX_WIDTH,
      stage.h * ratio,
      natural ? natural[0] : Infinity,
      natural ? natural[1] * ratio : Infinity,
    );
    return { w, h: w / ratio };
  });
  const centres: number[] = [];
  sizes.forEach((size, i) => {
    centres.push(
      i === 0 ? 0 : centres[i - 1] + sizes[i - 1].w / 2 + GAP + size.w / 2,
    );
  });
  return { sizes, centres };
}

function useStage(ref: RefObject<HTMLDivElement | null>) {
  const [stage, setStage] = useState<Stage | null>(null);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const left = parseFloat(style.paddingLeft);
      const top = parseFloat(style.paddingTop);
      const w = rect.width - left - parseFloat(style.paddingRight);
      const h = rect.height - top - parseFloat(style.paddingBottom);
      setStage({
        cx: rect.left + left + w / 2,
        cy: rect.top + top + h / 2,
        w,
        h,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return stage;
}

function RoundButton({
  icon,
  label,
  onPress,
  className,
  buttonRef,
}: {
  icon: IconSvgElement;
  label: string;
  onPress: () => void;
  className?: string;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onPress();
      }}
      className={cn(
        "pointer-events-auto absolute grid size-10 cursor-pointer place-items-center rounded-full",
        "bg-foreground/10 text-foreground/80",
        "transition-[background-color,color,scale,opacity] duration-150 ease-out",
        "hover:bg-foreground/15 hover:text-foreground",
        "active:scale-[0.96]",
        "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
        className,
      )}
    >
      <HugeiconsIcon
        icon={icon}
        strokeWidth={2}
        className="size-4.5"
        aria-hidden="true"
      />
    </button>
  );
}

/** The scrubber's frames, in px: every image is a slice this wide and tall,
 *  and the one showing opens to its own shape, within these bounds. */
const SLICE = { width: 24, height: 44, openMin: 40, openMax: 76 } as const;

/**
 * The scrubber, after the one in Photos: every image is a narrow slice, and
 * the one showing opens to its own shape with a little air either side. Size
 * and spacing say which is current, so nothing needs an outline. The tray's
 * radius (12px) is the slices' radius (rounded-sm, 6px on this site's scale)
 * plus its padding (6px), so the corners are concentric.
 */
function Filmstrip({
  items,
  index,
  onGo,
  labelFor,
}: {
  items: FigureEntry[];
  index: number;
  onGo: (index: number) => void;
  labelFor: (index: number) => string;
}) {
  const trayRef = useRef<HTMLDivElement>(null);

  // the tray follows the image, so the open frame is never off its edge;
  // again once the frame has finished opening, when its place is final
  useEffect(() => {
    const tray = trayRef.current;
    const frame = tray?.children[index];
    if (!tray || !(frame instanceof HTMLElement)) return;
    const centre = () =>
      tray.scrollTo({
        left: frame.offsetLeft - (tray.clientWidth - frame.clientWidth) / 2,
        behavior: "smooth",
      });
    centre();
    frame.addEventListener("transitionend", centre, { once: true });
    return () => frame.removeEventListener("transitionend", centre);
  }, [index]);

  return (
    <div
      ref={trayRef}
      data-lenis-prevent
      // its own scroll and taps, not a click on the backdrop
      onClick={(e) => e.stopPropagation()}
      className="pointer-events-auto flex max-w-[calc(100%-2rem)] cursor-default items-center gap-0.5 overflow-x-auto rounded-[0.75rem] bg-foreground/10 p-1.5 [scrollbar-width:none]"
    >
      {items.map((item, i) => {
        const size = PROJECT_IMAGE_SIZES[item.src];
        const ratio = size ? size[0] / size[1] : 1.6;
        const showing = i === index;
        return (
          <button
            key={item.id}
            type="button"
            aria-label={labelFor(i)}
            aria-current={showing ? "true" : undefined}
            onClick={() => onGo(i)}
            style={{
              height: SLICE.height,
              width: showing
                ? Math.min(
                    SLICE.openMax,
                    Math.max(SLICE.openMin, SLICE.height * ratio),
                  )
                : SLICE.width,
            }}
            className={cn(
              "shrink-0 cursor-pointer overflow-hidden rounded-sm outline-none",
              "transition-[width,margin,opacity] duration-300 ease-out",
              "focus-visible:ring-2 focus-visible:ring-ring/60",
              // air either side of the open frame, but never against the
              // tray's own edge, where it would read as uneven padding
              showing
                ? "mx-2 opacity-100 first:ml-0 last:mr-0"
                : "opacity-70 hover:opacity-100",
            )}
          >
            <img
              src={item.src}
              alt=""
              draggable={false}
              className="size-full object-cover object-top"
            />
          </button>
        );
      })}
    </div>
  );
}

function Lightbox({
  view,
  flyerRef,
  onReady,
  onClose,
  onGo,
  onLanded,
}: {
  view: View;
  /** The image showing, as it is on screen: what close() measures. */
  flyerRef: RefObject<HTMLDivElement | null>;
  onReady: () => void;
  onClose: () => void;
  onGo: (index: number) => void;
  onLanded: () => void;
}) {
  const { phase, items, index, moved, dock } = view;
  const item = items[index];
  const { language } = useLanguage();
  const t = translations[language];
  const labelId = useId();
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const showingRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragged = useRef(false);
  const open = phase === "open";
  const many = items.length > 1;

  const stage = useStage(stageRef);
  const strip = useMemo(
    () => (stage ? layOut(items, stage) : null),
    [items, stage],
  );

  // the one value every way of moving drives
  const x = useMotionValue(0);
  const lastIndex = useRef(index);
  useLayoutEffect(() => {
    if (!strip) return;
    const to = -strip.centres[index];
    // a first placement or a re-measure is not a move
    if (lastIndex.current === index || reducedMotion) x.set(to);
    else animate(x, to, GALLERY_SLIDE);
    lastIndex.current = index;
  }, [strip, index, reducedMotion, x]);

  // posed over the thumbnail, the image waits until it can paint, so the
  // thumbnail is never swapped for a blank frame
  useEffect(() => {
    if (phase !== "docked" || !strip) return;
    let live = true;
    const leave = () => {
      if (live) onReady();
    };
    (showingRef.current?.decode() ?? Promise.resolve()).then(leave, leave);
    return () => {
      live = false;
    };
  }, [phase, strip, onReady]);

  useEffect(() => {
    if (!open) return;

    const restoreTo =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(focusFrame);
      restoreTo?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        onGo(index + (e.key === "ArrowRight" ? 1 : -1));
      } else if (e.key === "Tab") {
        const stops = Array.from(
          rootRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
        );
        if (stops.length === 0) return;
        const at = stops.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        stops[
          (at + (e.shiftKey ? -1 : 1) + stops.length) % stops.length
        ].focus();
      } else if (PAGE_SCROLL_KEYS.has(e.key)) {
        // the page behind a dialog does not scroll from the keyboard either
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, index, onClose, onGo]);

  if (!item || !dock) return null;
  const labelFor = (i: number) =>
    t.common.imageOf
      .replace("{current}", String(i + 1))
      .replace("{total}", String(items.length));

  return createPortal(
    <div
      ref={rootRef}
      role={open ? "dialog" : undefined}
      aria-modal={open ? true : undefined}
      aria-labelledby={open ? labelId : undefined}
      aria-hidden={open ? undefined : true}
      className={cn(
        "fixed inset-0 z-100 overflow-hidden select-none",
        open ? "cursor-zoom-out" : "pointer-events-none",
      )}
      onPointerDown={() => {
        dragged.current = false;
      }}
      onClick={() => {
        // the click that ends a drag is the drag, not a close
        if (!dragged.current) onClose();
      }}
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            key="backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            // opaque: at any translucency the page's text ghosts through,
            // and through the dimmed neighbours; no blur to redo per frame
            className="absolute inset-0 bg-background"
          />
        ) : null}
      </AnimatePresence>

      {/* measures the area an image may fill: below the close button, beside
          the arrows on wide screens, above the caption and the filmstrip */}
      <div
        ref={stageRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 px-4 pt-16 pb-4 sm:px-24",
          many ? "bottom-32" : "bottom-16",
        )}
      />

      {strip && stage ? (
        <motion.div
          // a point at the stage's centre; the images hang off it
          style={{ x, left: stage.cx, top: stage.cy }}
          drag={open && many ? "x" : false}
          dragMomentum={false}
          dragDirectionLock
          onDragStart={() => {
            dragged.current = true;
          }}
          onDragEnd={(_, info) => {
            const go =
              info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_SPEED
                ? 1
                : info.offset.x > SWIPE_DISTANCE ||
                    info.velocity.x > SWIPE_SPEED
                  ? -1
                  : 0;
            const to = index + go;
            if (go !== 0 && to >= 0 && to < items.length) onGo(to);
            else animate(x, -strip.centres[index], GALLERY_SLIDE);
          }}
          className="absolute touch-pan-y"
        >
          {items.map((entry, i) => {
            const { w, h } = strip.sizes[i];
            const showing = i === index;
            // over the thumbnail: moved to its centre and scaled to its width
            const scale = dock.width / w;
            const pose = !showing
              ? {
                  x: 0,
                  y: 0,
                  scale: NEIGHBOUR_SCALE,
                  opacity: open ? NEIGHBOUR_OPACITY : 0,
                  borderRadius: RADIUS_OPEN,
                }
              : open
                ? {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    borderRadius: RADIUS_OPEN,
                  }
                : {
                    x: dock.left + dock.width / 2 - stage.cx,
                    y: dock.top + dock.height / 2 - stage.cy,
                    scale,
                    opacity: 1,
                    borderRadius: RADIUS_INLINE / scale,
                  };
            const flight = !open
              ? FLIGHT_BACK
              : moved
                ? GALLERY_SLIDE
                : FLIGHT_OUT;

            return (
              <motion.div
                key={entry.id}
                ref={showing ? flyerRef : undefined}
                initial={false}
                animate={pose}
                transition={{
                  default: flight,
                  // neighbours belong to the chrome: they arrive once the
                  // image has, and leave with the backdrop
                  opacity: showing || moved ? flight : { ...FADE, delay: 0.2 },
                }}
                onAnimationComplete={() => {
                  if (showing && phase === "returning") onLanded();
                }}
                onClick={
                  showing
                    ? undefined
                    : (e) => {
                        e.stopPropagation();
                        if (!dragged.current) onGo(i);
                      }
                }
                style={{
                  left: strip.centres[i] - w / 2,
                  top: -h / 2,
                  width: w,
                  height: h,
                }}
                className={cn(
                  "absolute",
                  open && "pointer-events-auto",
                  !showing && "cursor-pointer",
                )}
              >
                {/* the shadow is its own layer so it can fade in without the
                    image being repainted on every frame of the flight */}
                <motion.div
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: showing && open ? 1 : 0 }}
                  transition={FADE}
                  className="absolute inset-0 rounded-[inherit] shadow-2xl"
                />
                <img
                  ref={showing ? showingRef : undefined}
                  src={entry.src}
                  alt={showing && open ? entry.alt : ""}
                  aria-hidden={showing ? undefined : true}
                  draggable={false}
                  decoding="async"
                  className={cn(
                    "relative block size-full rounded-[inherit]",
                    open && "ring-1 ring-border",
                  )}
                />
              </motion.div>
            );
          })}
        </motion.div>
      ) : null}

      {/* over the images, so they pass under the controls as the strip moves */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="controls"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            className="pointer-events-none absolute inset-0"
          >
            <span id={labelId} className="sr-only">
              {many ? `${labelFor(index)}. ` : ""}
              {item.caption?.trim() ||
                item.alt.trim() ||
                t.common.expandedImage}
            </span>

            <RoundButton
              buttonRef={closeRef}
              icon={Cancel01Icon}
              label={t.common.close}
              onPress={onClose}
              className="top-4 right-4 sm:top-6 sm:right-6"
            />
            {many ? (
              <>
                <RoundButton
                  icon={ArrowLeft01Icon}
                  label={t.common.previousImage}
                  onPress={() => onGo(index - 1)}
                  className={cn(
                    "top-1/2 left-6 -mt-5 hidden sm:grid",
                    index === 0 && "pointer-events-none opacity-0",
                  )}
                />
                <RoundButton
                  icon={ArrowRight01Icon}
                  label={t.common.nextImage}
                  onPress={() => onGo(index + 1)}
                  className={cn(
                    "top-1/2 right-6 -mt-5 hidden sm:grid",
                    index === items.length - 1 &&
                      "pointer-events-none opacity-0",
                  )}
                />
              </>
            ) : null}

            {/* where you are: opposite the close button, so it never moves
                with the length of a caption */}
            {many ? (
              <p className="absolute top-4 left-4 grid h-10 place-items-center rounded-full bg-foreground/10 px-4 text-sm font-medium text-foreground/80 tabular-nums sm:top-6 sm:left-6">
                {index + 1} / {items.length}
              </p>
            ) : null}

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-5">
              {/* one line: a caption too long for it fades out at the end.
                  The fade is the text's own trailing 1.5rem of padding, so a
                  caption that fits is never touched and the pill stays whole. */}
              {item.caption ? (
                <motion.p
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={FADE}
                  title={item.caption}
                  className="flex max-w-[min(36rem,calc(100%-2rem))] rounded-full bg-foreground/10 py-1.5 pl-6 text-sm leading-snug text-foreground/80"
                >
                  <span className="truncate-fade pr-6">{item.caption}</span>
                </motion.p>
              ) : null}
              {many ? (
                <Filmstrip
                  items={items}
                  index={index}
                  onGo={onGo}
                  labelFor={labelFor}
                />
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>,
    document.body,
  );
}

export function FigureLightboxProvider({ children }: { children: ReactNode }) {
  const entries = useRef(new Map<string, FigureEntry>());
  const flyer = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState<View>(CLOSED);
  // what the handlers read: they measure the page, so they cannot be pure
  // state updaters
  const current = useRef(view);
  useLayoutEffect(() => {
    current.current = view;
  }, [view]);
  const reducedMotion = useReducedMotion();
  const { phase, items, index } = view;

  // The page is held only while an image is out. An overflow lock on <body>
  // is not used: it would make <body> the scroll container and un-stick the
  // page's sticky bar. Lenis alone holds the page.
  useWindowScrollLock(phase === "docked" || phase === "open");

  // On the way back the page is live again. If it scrolls, the thumbnail has
  // moved out from under the image, so the flight ends where the thumbnail
  // is. (The catch-up jump in close() reports itself a frame later, from the
  // position the flight already started at: that one is not a scroll.)
  useEffect(() => {
    if (phase !== "returning") return;
    const from = window.scrollY;
    const land = () => {
      if (Math.abs(window.scrollY - from) > 1) setView(CLOSED);
    };
    window.addEventListener("scroll", land, { passive: true });
    return () => window.removeEventListener("scroll", land);
  }, [phase]);

  const register = useCallback((entry: FigureEntry) => {
    entries.current.set(entry.id, entry);
    return () => {
      entries.current.delete(entry.id);
    };
  }, []);

  const open = useCallback((id: string) => {
    const all = [...entries.current.values()].sort(inDocumentOrder);
    const at = all.findIndex((entry) => entry.id === id);
    const dock = boxOf(all[at]?.thumb());
    if (at < 0 || !dock) return;
    setView({ phase: "docked", items: all, index: at, moved: false, dock });
  }, []);

  const ready = useCallback(
    () => setView((v) => (v.phase === "docked" ? { ...v, phase: "open" } : v)),
    [],
  );

  const go = useCallback((to: number) => {
    const v = current.current;
    if (v.phase !== "open" || to < 0 || to >= v.items.length || to === v.index)
      return;
    setView({ ...v, index: to, moved: true });
  }, []);

  const close = useCallback(() => {
    const v = current.current;
    if (v.phase !== "open") return;
    const thumb = v.items[v.index]?.thumb();
    // Browsing never moves what is behind the view. The page catches up only
    // now, and only if the image showing has no slot on screen to land in.
    const slot = boxOf(thumb);
    if (
      slot &&
      (slot.top < STICKY_CLEARANCE ||
        slot.top + slot.height > window.innerHeight)
    ) {
      snapScrollTo(
        window.scrollY + slot.top + slot.height / 2 - window.innerHeight / 2,
      );
    }
    const dock = boxOf(thumb);
    const at = flyer.current?.getBoundingClientRect();
    if (!dock || !at) return setView(CLOSED);
    // nothing to fly (reduced motion, or the open image already sits on the
    // thumbnail): no animation would run, so none would ever complete
    const landed =
      Math.abs(at.top - dock.top) < 1 &&
      Math.abs(at.left - dock.left) < 1 &&
      Math.abs(at.width - dock.width) < 1;
    setView(
      reducedMotion || landed ? CLOSED : { ...v, phase: "returning", dock },
    );
  }, [reducedMotion]);

  const landed = useCallback(() => setView(CLOSED), []);

  const awayId =
    phase === "open" || phase === "returning"
      ? (items[index]?.id ?? null)
      : null;
  const api = useMemo(
    () => ({ register, open, awayId }),
    [register, open, awayId],
  );

  return (
    <FigureLightboxContext.Provider value={api}>
      {children}
      {phase !== "closed" ? (
        <Lightbox
          view={view}
          flyerRef={flyer}
          onReady={ready}
          onClose={close}
          onGo={go}
          onLanded={landed}
        />
      ) : null}
    </FigureLightboxContext.Provider>
  );
}
