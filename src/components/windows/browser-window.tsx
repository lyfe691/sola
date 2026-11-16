/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A ported Browser Window: a browser that moves between
 * pages on its own. The address is erased back to what the two URLs share
 * and typed out again, a loader runs under the bar, and the next page comes
 * in over the old one; a screenshot taller than the window scrolls through
 * while it is shown. With children instead of pages it is a still window
 * around them. The navigation timeline (erase, type, loader, swap, settle)
 * and the autoplay clock that only runs on screen are the source's, number
 * for number.
 *
 * Changed from the source: colours are the site's tokens instead of its own
 * light and dark palettes, so the backdrop probe and the theme, colour and
 * radius props are gone; the frame is always the inset one with plain dots;
 * the narrow layout (no buttons, address at the left) comes from a container
 * query instead of a width measured after the first paint, at 448px where
 * the source switched at 420 (`layout="wide"` keeps the full bar, for a
 * window drawn to scale); the buttons are the site's Button and icons;
 * easings are the site's curves; there are no built-in demo pages.
 */

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import {
  ArrowClockwiseIcon,
  CaretLeftIcon,
  CaretRightIcon,
  LockIcon,
  type Icon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/language-provider";
import { cn } from "@/lib/utils";
import {
  EASE_EXPO,
  EASE_SMOOTH,
  HIDDEN_OPACITY,
  REVEAL,
} from "@/utils/transitions";
import { WINDOW_FRAME, WINDOW_PANEL, WindowDots } from "./window";

export interface BrowserPage {
  url: string;
  title?: string;
  src?: string;
  alt?: string;
  content?: ReactNode;
}

export interface BrowserWindowHandle {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  reload: () => void;
  play: () => void;
  pause: () => void;
}

export interface BrowserWindowProps {
  pages?: BrowserPage[];
  /** With children: what the address reads. */
  url?: string;
  children?: ReactNode;
  chrome?: "compact" | "tabs";
  /** Width over height of the page area. */
  aspect?: number;
  /** px; takes the place of `aspect`. */
  height?: number;
  /** The page area takes whatever height the window is given (through
   *  `className`), in place of `aspect` and `height`. */
  fill?: boolean;
  fit?: "cover" | "contain";
  transition?: "blur" | "slide" | "fade";
  interval?: number;
  autoplay?: boolean;
  loop?: boolean;
  pauseOnHover?: boolean;
  typing?: boolean;
  loader?: boolean;
  scroll?: boolean;
  controls?: boolean;
  /** "wide" keeps the full bar at any width: for a window that scales. */
  layout?: "auto" | "wide";
  defaultPage?: number;
  onPageChange?: (index: number) => void;
  className?: string;
  ref?: Ref<BrowserWindowHandle>;
}

interface Layer {
  key: number;
  index: number;
}

/** The address field's width while it sits centred in the bar. */
const ADDRESS_WIDTH = "min(440px, 52%)";
const NO_PAGES: BrowserPage[] = [];

const bezier = (curve: readonly number[]) => `cubic-bezier(${curve.join(",")})`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const finite = (value: number | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const splitUrl = (url: string) => {
  const clean = url.replace(/^https?:\/\//, "");
  const cut = clean.indexOf("/");
  return cut < 0
    ? { host: clean, path: "" }
    : { host: clean.slice(0, cut), path: clean.slice(cut) };
};

const subscribeToMotion = (notify: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};

const readMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ENTER: Record<
  NonNullable<BrowserWindowProps["transition"]>,
  Keyframe[]
> = {
  slide: [
    { opacity: HIDDEN_OPACITY, transform: "translateX(5%)" },
    { opacity: 1, transform: "translateX(0)" },
  ],
  fade: [{ opacity: HIDDEN_OPACITY }, { opacity: 1 }],
  blur: [
    {
      opacity: HIDDEN_OPACITY,
      filter: "blur(14px)",
      transform: "scale(1.02)",
    },
    { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
  ],
};

function Control({
  label,
  icon: Glyph,
  onClick,
  disabled = false,
}: {
  label: string;
  icon: Icon;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Glyph />
    </Button>
  );
}

export function BrowserWindow({
  pages = NO_PAGES,
  url,
  children,
  chrome = "compact",
  aspect = 1.6,
  height,
  fill = false,
  fit = "cover",
  transition = "blur",
  interval = 4600,
  autoplay = true,
  loop = true,
  pauseOnHover = true,
  typing = true,
  loader = true,
  scroll = true,
  controls = true,
  layout = "auto",
  defaultPage = 0,
  onPageChange,
  className,
  ref,
}: BrowserWindowProps) {
  const t = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timersRef = useRef<number[]>([]);
  const tokenRef = useRef(0);
  const keyRef = useRef(1);
  const busyRef = useRef(false);
  const hoverRef = useRef(false);
  const elapsedRef = useRef(0);
  const changeRef = useRef(onPageChange);
  const reduced = useSyncExternalStore(
    subscribeToMotion,
    readMotion,
    () => false,
  );
  const single = children !== undefined && children !== null;
  const list: BrowserPage[] = single
    ? [{ url: url ?? "", content: children }]
    : pages;
  const count = list.length;
  const start = clamp(Math.round(finite(defaultPage, 0)), 0, count - 1);
  const pageRef = useRef(start);
  const [layers, setLayers] = useState<Layer[]>([{ key: 0, index: start }]);
  const [active, setActive] = useState(start);
  const [typed, setTyped] = useState(list[start]?.url ?? "");
  const [caret, setCaret] = useState(false);
  const [progress, setProgress] = useState({
    value: 0,
    visible: false,
    speed: 0,
  });
  const [paused, setPaused] = useState<boolean | null>(null);
  const playing = paused === null ? autoplay : !paused;
  const listRef = useRef(list);

  useEffect(() => {
    changeRef.current = onPageChange;
    listRef.current = list;
  });

  const later = useCallback((callback: () => void, wait: number) => {
    const handle = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((item) => item !== handle);
      callback();
    }, wait);
    timersRef.current.push(handle);
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((handle) => window.clearTimeout(handle));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const swap = useCallback(
    (index: number, token: number) => {
      if (token !== tokenRef.current) return;
      const key = keyRef.current++;
      pageRef.current = index;
      setActive(index);
      setLayers((current) => [...current.slice(-1), { key, index }]);
      changeRef.current?.(index);
      const settle = reduced ? 0 : 700;
      later(() => {
        if (token !== tokenRef.current) return;
        setLayers((current) => current.filter((layer) => layer.key === key));
        busyRef.current = false;
      }, settle + 40);
    },
    [later, reduced],
  );

  const navigate = useCallback(
    (target: number, replay = false) => {
      const pagesNow = listRef.current;
      const total = pagesNow.length;
      if (!total) return;
      const index = ((Math.round(target) % total) + total) % total;
      if (index === pageRef.current && !replay) return;
      clearTimers();
      tokenRef.current += 1;
      const token = tokenRef.current;
      busyRef.current = true;
      elapsedRef.current = 0;
      const from = pagesNow[pageRef.current]?.url ?? "";
      const to = pagesNow[index]?.url ?? "";
      if (reduced) {
        setTyped(to);
        setProgress({ value: 0, visible: false, speed: 0 });
        swap(index, token);
        return;
      }
      let shared = 0;
      while (
        shared < from.length &&
        shared < to.length &&
        from[shared] === to[shared]
      )
        shared++;
      const erase = typing && !replay ? from.length - shared : 0;
      const write = typing && !replay ? to.length - shared : 0;
      let wait = 0;
      if (erase + write > 0) {
        setCaret(true);
        for (let k = 1; k <= erase; k++) {
          const text = from.slice(0, from.length - k);
          later(
            () => {
              if (token === tokenRef.current) setTyped(text);
            },
            (wait += 22),
          );
        }
        wait += erase ? 90 : 0;
        for (let k = 1; k <= write; k++) {
          const text = to.slice(0, shared + k);
          later(
            () => {
              if (token === tokenRef.current) setTyped(text);
            },
            (wait += 34 + (to[shared + k - 1] === "/" ? 40 : 0)),
          );
        }
        wait += 120;
        later(() => {
          if (token === tokenRef.current) setCaret(false);
        }, wait);
      } else {
        setTyped(to);
      }
      if (loader) {
        later(() => {
          if (token === tokenRef.current)
            setProgress({ value: 0, visible: true, speed: 0 });
        }, wait);
        later(() => {
          if (token === tokenRef.current)
            setProgress({ value: 0.72, visible: true, speed: 520 });
        }, wait + 30);
      }
      later(() => swap(index, token), wait + (loader ? 560 : 120));
      if (loader) {
        later(() => {
          if (token === tokenRef.current)
            setProgress({ value: 1, visible: true, speed: 260 });
        }, wait + 600);
        later(() => {
          if (token === tokenRef.current)
            setProgress((current) => ({ ...current, visible: false }));
        }, wait + 900);
      }
    },
    [clearTimers, later, loader, reduced, swap, typing],
  );

  const advance = useCallback(() => {
    const total = listRef.current.length;
    if (!loop && pageRef.current >= total - 1) {
      setPaused(true);
      return;
    }
    navigate(pageRef.current + 1);
  }, [loop, navigate]);

  const running = playing && count > 1 && !reduced && !single;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !running) return;
    const wait = Math.max(1800, finite(interval, 4600));
    let raf = 0;
    let last = 0;
    let visible = false;
    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 0;
      last = now;
      if (!busyRef.current && !(pauseOnHover && hoverRef.current))
        elapsedRef.current += dt;
      if (elapsedRef.current >= wait) {
        elapsedRef.current = 0;
        advance();
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) wake();
      },
      { threshold: 0.2 },
    );
    observer.observe(root);
    document.addEventListener("visibilitychange", wake);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", wake);
      cancelAnimationFrame(raf);
    };
  }, [advance, interval, pauseOnHover, running]);

  useImperativeHandle(
    ref,
    () => ({
      next: () => navigate(pageRef.current + 1),
      prev: () => navigate(pageRef.current - 1),
      goTo: (index: number) => navigate(index),
      reload: () => navigate(pageRef.current, true),
      play: () => setPaused(false),
      pause: () => setPaused(true),
    }),
    [navigate],
  );

  const enter = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || node.dataset.played) return;
      node.dataset.played = "1";
      if (reduced || node.dataset.initial !== undefined) return;
      node.animate(ENTER[transition], {
        duration: 680,
        easing: bezier(REVEAL),
      });
    },
    [reduced, transition],
  );

  const pan = useCallback(
    (image: HTMLImageElement | null) => {
      if (!image) return;
      const run = () => {
        const viewport = viewportRef.current;
        if (!viewport || !scroll || reduced || !image.naturalWidth) return;
        const rendered =
          viewport.clientWidth * (image.naturalHeight / image.naturalWidth);
        const travel = rendered - viewport.clientHeight;
        if (travel < 4) return;
        image.getAnimations().forEach((animation) => animation.cancel());
        const wait = Math.max(1800, finite(interval, 4600));
        image.animate(
          [
            { transform: "translateY(0px)", offset: 0 },
            { transform: "translateY(0px)", offset: 0.12 },
            { transform: `translateY(${-travel}px)`, offset: 0.92 },
            { transform: `translateY(${-travel}px)`, offset: 1 },
          ],
          {
            duration: wait + 1400,
            easing: bezier(EASE_SMOOTH),
            fill: "forwards",
          },
        );
      };
      if (image.complete) run();
      else image.addEventListener("load", run, { once: true });
    },
    [interval, reduced, scroll],
  );

  const onTabKey = (event: ReactKeyboardEvent, index: number) => {
    let target = -1;
    if (event.key === "ArrowRight") target = (index + 1) % count;
    else if (event.key === "ArrowLeft") target = (index - 1 + count) % count;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = count - 1;
    if (target < 0) return;
    event.preventDefault();
    tabRefs.current[target]?.focus();
    navigate(target);
  };

  const compact = chrome === "compact";
  const wide = layout === "wide";
  const parts = splitUrl(typed);
  const atStart = single || count < 2 || (!loop && active === 0);
  const atEnd = single || count < 2 || (!loop && active === count - 1);

  const back = () => navigate(pageRef.current - 1);
  const forward = () => navigate(pageRef.current + 1);
  const reload = () => navigate(pageRef.current, true);

  const address = (
    <div
      className={cn(
        "relative flex h-7 min-w-0 flex-1 items-center gap-1.5 overflow-hidden rounded-lg bg-background px-3 font-sans text-xs font-medium whitespace-nowrap",
        compact &&
          (wide
            ? "absolute left-1/2 w-(--address-w) flex-none -translate-x-1/2 justify-center"
            : "justify-center @md:absolute @md:left-1/2 @md:w-(--address-w) @md:flex-none @md:-translate-x-1/2"),
      )}
    >
      {typed ? (
        <LockIcon className="size-3 flex-none text-muted-foreground" />
      ) : null}
      <span className="min-w-0 truncate">
        <span>{parts.host}</span>
        <span className="text-muted-foreground">{parts.path}</span>
        {caret ? (
          <span aria-hidden="true" className="browser-caret bg-primary" />
        ) : null}
      </span>
    </div>
  );

  const bar = loader ? (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-opacity duration-260",
        progress.visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className={cn(
          "h-full origin-left scale-x-(--progress) rounded-full bg-primary ease-(--loader-ease)",
          progress.speed
            ? "transition-transform duration-(--speed)"
            : "transition-none",
        )}
        style={
          {
            "--progress": progress.value,
            "--speed": `${progress.speed}ms`,
            "--loader-ease": bezier(EASE_EXPO),
          } as CSSProperties
        }
      />
    </div>
  ) : null;

  const header = compact ? (
    <div className="relative flex h-11 flex-none items-center gap-2.5 pr-2.25 pl-3.25">
      <WindowDots />
      {controls && !single && count > 1 ? (
        <div className={cn("ml-1 gap-0.5", wide ? "flex" : "hidden @md:flex")}>
          <Control
            label={t.common.a11y.browserBack}
            icon={CaretLeftIcon}
            onClick={back}
            disabled={atStart}
          />
          <Control
            label={t.common.a11y.browserForward}
            icon={CaretRightIcon}
            onClick={forward}
            disabled={atEnd}
          />
        </div>
      ) : null}
      {address}
      <div className={cn("flex-1", wide ? "block" : "hidden @md:block")} />
      {controls ? (
        <div className={wide ? "flex" : "hidden @md:flex"}>
          <Control
            label={t.common.a11y.browserReload}
            icon={ArrowClockwiseIcon}
            onClick={reload}
          />
        </div>
      ) : null}
      {bar}
    </div>
  ) : (
    <div className="flex-none">
      <div className="flex h-10 items-center gap-3 pr-2.25 pl-3.25">
        <WindowDots />
        <div
          role="tablist"
          aria-label={t.common.a11y.browserPages}
          className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto window-tabs"
        >
          {list.map((item, index) => {
            const selected = index === active;
            const name = item.title || splitUrl(item.url).host;
            return (
              <button
                key={index}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => navigate(index)}
                onKeyDown={(event) => onTabKey(event, index)}
                className={cn(
                  "flex h-7 flex-none cursor-pointer items-center gap-1.75 rounded-lg pr-2.75 pl-2 font-sans text-xs font-medium whitespace-nowrap transition-colors duration-200",
                  selected
                    ? "bg-background text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-3.5 place-items-center rounded-sm text-3xs font-bold transition-colors duration-200",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/12 text-muted-foreground",
                  )}
                >
                  {name.slice(0, 1).toUpperCase()}
                </span>
                {name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="relative flex h-10 items-center gap-1 px-2.25 pb-1.5">
        {controls ? (
          <div className="mr-1 flex gap-1">
            <Control
              label={t.common.a11y.browserBack}
              icon={CaretLeftIcon}
              onClick={back}
              disabled={atStart}
            />
            <Control
              label={t.common.a11y.browserForward}
              icon={CaretRightIcon}
              onClick={forward}
              disabled={atEnd}
            />
            <Control
              label={t.common.a11y.browserReload}
              icon={ArrowClockwiseIcon}
              onClick={reload}
            />
          </div>
        ) : null}
        {address}
        {bar}
      </div>
    </div>
  );

  const renderPage = (index: number) => {
    const item = list[index];
    if (!item) return null;
    if (item.content !== undefined)
      return (
        <div className="window-content absolute inset-0 overflow-auto">
          {item.content}
        </div>
      );
    if (!item.src) return null;
    const tall = fit === "cover" && scroll;
    return (
      <img
        ref={tall ? pan : undefined}
        src={item.src}
        alt={item.alt ?? item.title ?? ""}
        draggable={false}
        className={cn(
          "absolute block w-full object-top",
          tall
            ? "top-0 left-0 min-h-full object-cover"
            : "inset-0 h-full data-[fit=contain]:object-contain data-[fit=cover]:object-cover",
        )}
        data-fit={fit}
      />
    );
  };

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={t.common.a11y.browserWindow.replace(
        "{url}",
        list[active]?.url ?? "",
      )}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
      className={cn(WINDOW_FRAME, "@container", className)}
      style={{ "--address-w": ADDRESS_WIDTH } as CSSProperties}
    >
      {header}
      <div
        ref={viewportRef}
        className={cn(
          WINDOW_PANEL,
          "isolate",
          fill
            ? "min-h-0 flex-1"
            : height
              ? "h-(--page-h) flex-none"
              : "aspect-(--page-aspect) flex-none",
        )}
        style={
          {
            "--page-h": `${Math.max(80, finite(height, 360))}px`,
            "--page-aspect": clamp(finite(aspect, 1.6), 0.4, 4),
          } as CSSProperties
        }
      >
        {layers.map((layer) => (
          <div
            key={layer.key}
            ref={enter}
            data-initial={layer.key === 0 ? "" : undefined}
            className="absolute inset-0"
          >
            {renderPage(layer.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
