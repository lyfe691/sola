/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * React Bits' WarmTooltip behind shadcn's tooltip parts. A provider is a
 * group that shares one surface: the first hover waits out the delay and pops
 * it in; from there it springs from trigger to trigger, leaning into the
 * travel and resizing as it goes, while the label cross-fades in the
 * direction of travel. Reopening within the warm window skips both the delay
 * and the pop. `arrow` hangs the surface from the theme callout's tail, which
 * keeps pointing at the trigger when the viewport pushes the surface aside.
 */

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  animate,
  motion,
  PresenceContext,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
  type MotionStyle,
  type MotionValue,
  type Variants,
} from "motion/react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { tailDrop, tailFill } from "@/lib/tail-path";
import { cn } from "@/lib/utils";
import { EASE_EXPO } from "@/utils/transitions";

type Side = "top" | "right" | "bottom" | "left";

type Content = {
  children: ReactNode;
  side: Side;
  arrow: boolean;
  className?: string;
};

type Entry = ReturnType<typeof createEntry>;

type Target = { id: string; trigger: Element; entry: Entry };

type Mode = "cold" | "warm" | "instant";

type Shown = {
  target: Target;
  side: Side;
  arrow: boolean;
  phase: "open" | "closing";
  /** move: the surface was already up and travels to the new trigger */
  mode: Mode | "move";
  /** opened by keyboard focus, so it also closes without the fade */
  instant: boolean;
  /** which way the label swaps: -1/1 along the row, 0 for no swap */
  swap: { dir: number; across: boolean };
};

type Group = ReturnType<typeof createGroup>;

type Timer = ReturnType<typeof setTimeout> | undefined;

const GAP = 6;
const MARGIN = 8;
/** a leave waits this long (ms), so crossing between triggers doesn't close */
const GRACE = 80;
const GLIDE = { type: "spring", duration: 0.32, bounce: 0.1 } as const;
const POP = { duration: 0.16, ease: EASE_EXPO };
const UNPOP = { duration: 0.13, ease: EASE_EXPO };
const REPOP = { duration: 0.12, ease: EASE_EXPO };
const SWAP = { duration: 0.14, ease: EASE_EXPO };
const SWAP_SHIFT = 10;
const RISE = 4;
/** anchor speed (px/s) at which the surface leans its whole angle */
const FULL_LEAN_SPEED = 1200;
const LEAN_SPRING = { stiffness: 260, damping: 22, mass: 0.4 };
/** per side, the turn that makes the surface trail its travel */
const LEAN_SIGN: Record<Side, number> = {
  top: 1,
  bottom: -1,
  left: -1,
  right: 1,
};
const ARROW_W = 16;
const ARROW_H = 6;
/** how far short of the trigger the tail's tip stops */
const TIP_GAP = 3;
/** rounded-2xl, the surface's corners away from a tail */
const RADIUS = 18;
const TAIL = tailFill(ARROW_W, ARROW_H);
/** per side, the way the tail points */
const OUTWARD: Record<Side, [number, number]> = {
  top: [0, 1],
  bottom: [0, -1],
  left: [1, 0],
  right: [-1, 0],
};
/** without a tail the surface pops from its edge facing the trigger */
const EDGE_PIVOT: Record<Side, string> = {
  top: "50% 100%",
  bottom: "50% 0%",
  left: "100% 50%",
  right: "0% 50%",
};
const LABEL =
  "flex w-max max-w-xs shrink-0 items-center justify-center gap-1.5 px-2.5 py-1 text-center text-[13px] leading-5.5 font-semibold has-data-[slot=kbd]:pr-1 *:data-[slot=kbd]:rounded-full *:data-[slot=kbd]:px-2";

const alongX = (side: Side) => side === "top" || side === "bottom";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

/** The point on the trigger's edge that the surface hangs from. */
function anchorOf({
  target,
  side,
  arrow,
}: Pick<Shown, "target" | "side" | "arrow">): [number, number] {
  const r = target.trigger.getBoundingClientRect();
  const gap = arrow ? ARROW_H + TIP_GAP : GAP;
  if (side === "top") return [r.left + r.width / 2, r.top - gap];
  if (side === "bottom") return [r.left + r.width / 2, r.bottom + gap];
  if (side === "left") return [r.left - gap, r.top + r.height / 2];
  return [r.right + gap, r.top + r.height / 2];
}

/** The surface's top-left: centred on the anchor, kept inside the viewport. */
function originOf(side: Side, ax: number, ay: number, w: number, h: number) {
  if (alongX(side)) {
    const x = clamp(ax - w / 2, MARGIN, window.innerWidth - MARGIN - w);
    return [x, side === "top" ? ay - h : ay];
  }
  const y = clamp(ay - h / 2, MARGIN, window.innerHeight - MARGIN - h);
  return [side === "left" ? ax - w : ax, y];
}

/** One tooltip's content and gate: its TooltipContent writes, the surface reads. */
function createEntry() {
  let content: Content | null = null;
  let disabled = false;
  const listeners = new Set<() => void>();

  return {
    content: () => content,
    ready: () => content !== null && !disabled,
    publish(next: Content) {
      content = next;
      for (const listener of listeners) listener();
    },
    gate(next: boolean) {
      disabled = next;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/** A provider's state machine: which tooltip is up, and how it got there. */
function createGroup(tooltipId: string, render: (shown: Shown | null) => void) {
  let delay = 400;
  let warmWindow = 300;
  let live: Shown | null = null;
  let warmUntil = -Infinity;
  // a timer counting down the delay, or none while the tooltip isn't ready
  let pending: { target: Target; mode: Mode; timer: Timer } | null = null;
  let leaveTimer: Timer;
  const listeners = new Set<() => void>();

  const commit = (next: Shown | null) => {
    const moved = live?.target.id !== next?.target.id;
    live = next;
    render(next);
    if (moved) for (const listener of listeners) listener();
  };

  const cancelPending = () => {
    clearTimeout(pending?.timer);
    pending = null;
  };

  const show = (target: Target, mode: Mode) => {
    cancelPending();
    clearTimeout(leaveTimer);
    const content = target.entry.content();
    if (!content) return;
    const next = { target, side: content.side, arrow: content.arrow };
    const prev = live;
    const across = !alongX(next.side);
    let dir = 0;
    if (prev && prev.target.id !== target.id) {
      const [px, py] = anchorOf(prev);
      const [nx, ny] = anchorOf(next);
      dir = Math.sign(across ? ny - py : nx - px) || 1;
    }
    commit({
      ...next,
      phase: "open",
      mode: prev && mode !== "instant" ? "move" : mode,
      instant: mode === "instant",
      swap: { dir, across },
    });
  };

  const open = (target: Target, mode: Mode) => {
    if (target.entry.ready()) {
      show(target, mode);
      return;
    }
    cancelPending();
    pending = { target, mode, timer: undefined };
    // the surface doesn't linger on the trigger the pointer left
    if (live && live.target.id !== target.id) hide();
  };

  const close = (instant: boolean) => {
    clearTimeout(leaveTimer);
    if (!live || live.phase !== "open") return;
    warmUntil = performance.now() + warmWindow;
    commit(instant || live.instant ? null : { ...live, phase: "closing" });
  };

  const hide = () => {
    clearTimeout(leaveTimer);
    if (live?.instant) close(true);
    else leaveTimer = setTimeout(() => close(false), GRACE);
  };

  return {
    tooltipId,
    configure(nextDelay: number, nextWarmWindow: number) {
      delay = nextDelay;
      warmWindow = nextWarmWindow;
    },
    current: () => live,
    isActive: (id: string) => live?.target.id === id,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    enter(target: Target) {
      clearTimeout(leaveTimer);
      if (live || performance.now() < warmUntil) {
        open(target, "warm");
        return;
      }
      cancelPending();
      pending = {
        target,
        mode: "cold",
        timer: setTimeout(() => open(target, "cold"), delay),
      };
    },
    leave(id: string) {
      if (pending?.target.id === id) cancelPending();
      if (live?.target.id === id) hide();
    },
    focus: (target: Target) => open(target, "instant"),
    dismiss(id: string) {
      if (pending?.target.id === id) cancelPending();
      if (live?.target.id === id) close(true);
    },
    /** A waiting tooltip got its content or was enabled: open it now. */
    ready(id: string) {
      if (pending?.target.id !== id || pending.timer !== undefined) return;
      if (!pending.target.entry.ready()) return;
      // a wait that outlasted the surface and the warm window pops in fresh
      const cold = !live && performance.now() >= warmUntil;
      show(
        pending.target,
        pending.mode === "warm" && cold ? "cold" : pending.mode,
      );
    },
    /** The surface finished its closing pop. */
    closed() {
      if (live?.phase === "closing") commit(null);
    },
    hide,
    close,
    dispose() {
      cancelPending();
      clearTimeout(leaveTimer);
    },
  };
}

/** Hidden, the surface sits smaller, blurred and nudged toward its trigger. */
const POP_VARIANTS: Variants = {
  hidden: (side: Side) => ({
    opacity: 0,
    scale: 0.94,
    filter: "blur(4px)",
    x: side === "left" ? RISE : side === "right" ? -RISE : 0,
    y: side === "top" ? RISE : side === "bottom" ? -RISE : 0,
  }),
  shown: { opacity: 1, scale: 1, filter: "blur(0px)", x: 0, y: 0 },
};

const LABEL_VARIANTS: Variants = {
  enter: ({ dir, across }: Shown["swap"]) => ({
    opacity: dir === 0 ? 1 : 0,
    x: across ? 0 : SWAP_SHIFT * dir,
    y: across ? SWAP_SHIFT * dir : 0,
    filter: dir === 0 ? "blur(0px)" : "blur(3px)",
  }),
  show: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
  exit: ({ dir, across }: Shown["swap"]) => ({
    opacity: 0,
    x: across ? 0 : -SWAP_SHIFT * dir,
    y: across ? -SWAP_SHIFT * dir : 0,
    filter: "blur(3px)",
  }),
};

const GroupContext = createContext<Group | null>(null);

const TooltipContext = createContext<{
  group: Group;
  id: string;
  entry: Entry;
} | null>(null);

type TooltipProviderProps = {
  children: ReactNode;
  /** Hover time before a cold open, in ms. */
  delay?: number;
  /** How long after a close the next hover opens at once, in ms. */
  warmWindow?: number;
  /** Degrees the surface tilts as it glides at full speed; 0 keeps it level. */
  lean?: number;
};

function TooltipProvider({
  children,
  delay = 400,
  warmWindow = 300,
  lean = 16,
}: TooltipProviderProps) {
  const tooltipId = useId();
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState<Shown | null>(null);
  const [group] = useState(() => createGroup(tooltipId, setShown));
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    group.configure(delay, warmWindow);
  }, [group, delay, warmWindow]);

  const anchorX = useMotionValue(0);
  const anchorY = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const side = useMotionValue<Side>("top");
  const tailed = useMotionValue(false);
  const corner = () =>
    originOf(
      side.get(),
      anchorX.get(),
      anchorY.get(),
      width.get(),
      height.get(),
    );
  const x = useTransform(() => corner()[0]);
  const y = useTransform(() => corner()[1]);
  const w = useTransform(() => `${width.get()}px`);
  const h = useTransform(() => `${height.get()}px`);
  // only a glide moves the anchor with velocity: opens and scroll-follows
  // jump it, which zeroes the velocity, so the surface leans only in travel
  const velocityX = useVelocity(anchorX);
  const velocityY = useVelocity(anchorY);
  const leanUnit = useSpring(
    useTransform(() => {
      const speed = alongX(side.get()) ? velocityX.get() : velocityY.get();
      return -clamp(speed / FULL_LEAN_SPEED, -1, 1);
    }),
    LEAN_SPRING,
  );
  const tilt = useTransform(() => leanUnit.get() * LEAN_SIGN[side.get()]);
  // the tail sits across from the trigger's centre; where that leaves its
  // feet no flat edge, the corner beside it tightens (the theme callout's
  // rule). A pill's round end has no flat edge at all: there the tail grows
  // out of the curve, from the end's middle
  const tail = () => {
    const [left, top] = corner();
    const along = alongX(side.get());
    const length = along ? width.get() : height.get();
    const far = Math.min(RADIUS, width.get() / 2, height.get() / 2);
    const round = length - 2 * far < 1;
    const half = ARROW_W / 2;
    const at =
      round || length < ARROW_W
        ? length / 2
        : clamp(
            along ? anchorX.get() - left : anchorY.get() - top,
            half,
            length - half,
          );
    const start = round ? far : clamp(at - half, 0, far);
    const end = round ? far : clamp(length - at - half, 0, far);
    return { at, far, start, end, round };
  };
  // motion subscribes a transform to what its render-time run reads, and
  // `tailed`/`side` change after that render: each transform reads every
  // input before it branches. The tail is a function, not a transform: one
  // transform fed by another can miss that one's update in the same frame
  const foot = (): [number, number] => {
    const [s, { at }, w, h] = [side.get(), tail(), width.get(), height.get()];
    if (s === "top") return [at, h];
    if (s === "bottom") return [at, 0];
    return [s === "left" ? w : 0, at];
  };
  const tailPath = useTransform(() => {
    const { round, far } = tail();
    return round ? tailDrop(ARROW_W, ARROW_H, far) : TAIL;
  });
  const tailX = useTransform(() => `${foot()[0] - ARROW_W / 2}px`);
  const tailY = useTransform(() => `${foot()[1] - ARROW_H}px`);
  const corners = useTransform(() => {
    const [s, { far, start, end }] = [side.get(), tail()];
    if (!tailed.get()) return "var(--radius-2xl)";
    const [f, a, b] = [`${far}px`, `${start}px`, `${end}px`];
    // top-left, top-right, bottom-right, bottom-left
    if (s === "top") return `${f} ${f} ${b} ${a}`;
    if (s === "bottom") return `${a} ${b} ${f} ${f}`;
    if (s === "left") return `${f} ${a} ${b} ${f}`;
    return `${a} ${f} ${f} ${b}`;
  });
  // a tailed surface pops from, and leans on, the tip of its tail
  const pivot = useTransform(() => {
    const [s, [fx, fy]] = [side.get(), foot()];
    if (!tailed.get()) return EDGE_PIVOT[s];
    const [ox, oy] = OUTWARD[s];
    return `${fx + ox * ARROW_H}px ${fy + oy * ARROW_H}px`;
  });

  // measure the new label, then spring the surface to it (or land there);
  // a label that changes size while up springs the surface along
  useLayoutEffect(() => {
    const label = labelRef.current;
    if (!shown || shown.phase !== "open" || !label) return;
    const [ax, ay] = anchorOf(shown);
    side.set(shown.side);
    tailed.set(shown.arrow);
    const to = (value: MotionValue<number>, target: number, glide: boolean) => {
      if (glide) animate(value, target, GLIDE);
      else value.jump(target);
    };
    const glide = shown.mode === "move" && !reduceMotion;
    let [labelW, labelH] = [label.offsetWidth, label.offsetHeight];
    to(anchorX, ax, glide);
    to(anchorY, ay, glide);
    to(width, labelW, glide);
    to(height, labelH, glide);
    const resize = new ResizeObserver(() => {
      if (label.offsetWidth === labelW && label.offsetHeight === labelH) return;
      [labelW, labelH] = [label.offsetWidth, label.offsetHeight];
      to(width, labelW, !reduceMotion);
      to(height, labelH, !reduceMotion);
    });
    resize.observe(label);
    return () => resize.disconnect();
  }, [shown, reduceMotion, anchorX, anchorY, width, height, side, tailed]);

  const isShown = shown !== null;
  useEffect(() => {
    if (!isShown) return;
    let frame = 0;
    const follow = () => {
      const current = group.current();
      if (!current) return;
      const [ax, ay] = anchorOf(current);
      anchorX.jump(ax);
      anchorY.jump(ay);
    };
    const onMove = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(follow);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") group.close(true);
    };
    window.addEventListener("scroll", onMove, { capture: true, passive: true });
    window.addEventListener("resize", onMove);
    document.addEventListener("pointerdown", group.hide, true);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onMove, { capture: true });
      window.removeEventListener("resize", onMove);
      document.removeEventListener("pointerdown", group.hide, true);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isShown, group, anchorX, anchorY]);

  useEffect(() => () => group.dispose(), [group]);

  return (
    <GroupContext.Provider value={group}>
      {children}
      {shown &&
        createPortal(
          // its own presence scope: under an AnimatePresence initial={false}
          // (the nav's) motion would skip the pop
          <PresenceContext.Provider value={null}>
            <motion.div
              id={tooltipId}
              role="tooltip"
              data-slot="tooltip-content"
              style={{ x, y, "--w": w, "--h": h } as MotionStyle}
              className="pointer-events-none fixed top-0 left-0 z-50 h-(--h) w-(--w)"
            >
              <motion.div
                style={
                  {
                    "--tilt": tilt,
                    "--lean": `${lean}deg`,
                    "--pivot": pivot,
                    "--corners": corners,
                  } as MotionStyle
                }
                custom={shown.side}
                variants={POP_VARIANTS}
                initial={shown.mode === "cold" ? "hidden" : false}
                animate={shown.phase === "open" ? "shown" : "hidden"}
                transition={
                  shown.phase === "closing"
                    ? UNPOP
                    : shown.mode === "move"
                      ? REPOP
                      : POP
                }
                onAnimationComplete={(definition) => {
                  if (definition === "hidden") group.closed();
                }}
                className="absolute inset-0 origin-(--pivot) rotate-[calc(var(--tilt)*var(--lean))] rounded-(--corners) bg-foreground text-background shadow-sm motion-reduce:rotate-none"
              >
                <AnimatePresence initial={false} custom={shown.swap}>
                  <motion.div
                    key={shown.target.id}
                    custom={shown.swap}
                    variants={LABEL_VARIANTS}
                    initial="enter"
                    animate="show"
                    exit="exit"
                    transition={SWAP}
                    className="absolute inset-0 flex items-center justify-center rounded-[inherit]"
                  >
                    <Label entry={shown.target.entry} measureRef={labelRef} />
                  </motion.div>
                </AnimatePresence>
                {shown.arrow && (
                  <motion.span
                    aria-hidden="true"
                    data-side={shown.side}
                    style={
                      { "--tail-x": tailX, "--tail-y": tailY } as MotionStyle
                    }
                    className="absolute top-0 left-0 flex origin-[50%_calc(100%-1px)] translate-x-(--tail-x) translate-y-(--tail-y) data-[side=left]:rotate-90 data-[side=right]:-rotate-90 data-[side=top]:rotate-180"
                  >
                    <svg
                      width={ARROW_W}
                      height={ARROW_H + 1}
                      viewBox={`0 0 ${ARROW_W} ${ARROW_H + 1}`}
                      className="overflow-visible fill-foreground"
                    >
                      <motion.path d={tailPath} />
                    </svg>
                  </motion.span>
                )}
              </motion.div>
            </motion.div>
          </PresenceContext.Provider>,
          document.body,
        )}
    </GroupContext.Provider>
  );
}

/** The measured label is always the entering one, never a leaving copy. */
function Label({
  entry,
  measureRef,
}: {
  entry: Entry;
  measureRef: RefObject<HTMLSpanElement | null>;
}) {
  const present = useIsPresent();
  const content = useSyncExternalStore(entry.subscribe, entry.content);

  return (
    <span
      ref={present ? measureRef : undefined}
      className={cn(LABEL, content?.className)}
    >
      {content?.children}
    </span>
  );
}

function useGroup() {
  const group = useContext(GroupContext);
  if (!group) throw new Error("Tooltip must sit inside a TooltipProvider");
  return group;
}

function useTooltip() {
  const tooltip = useContext(TooltipContext);
  if (!tooltip) throw new Error("Tooltip parts must sit inside a Tooltip");
  return tooltip;
}

type TooltipProps = {
  children: ReactNode;
  /**
   * Holds the tooltip shut. A hover or focus still on the trigger when this
   * turns false opens it then (a preview that waits for its image).
   */
  disabled?: boolean;
};

function Tooltip({ children, disabled = false }: TooltipProps) {
  const group = useGroup();
  const id = useId();
  const [entry] = useState(createEntry);
  const tooltip = useMemo(() => ({ group, id, entry }), [group, id, entry]);

  useLayoutEffect(() => {
    entry.gate(disabled);
    group.ready(id);
  }, [entry, group, id, disabled]);

  // a trigger that goes away takes its tooltip with it
  useEffect(() => () => group.leave(id), [group, id]);

  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}

/** The trigger: must be focusable; the tooltip's handlers merge into it. */
function TooltipTrigger({
  render,
  ref,
  ...props
}: useRender.ComponentProps<"button">) {
  const { group, id, entry } = useTooltip();
  const active = useSyncExternalStore(group.subscribe, () =>
    group.isActive(id),
  );
  const target = (trigger: Element): Target => ({ id, trigger, entry });

  return useRender({
    render,
    ref,
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? undefined : "button",
        "aria-describedby": active ? group.tooltipId : undefined,
        onPointerEnter: (e: PointerEvent<Element>) => {
          if (e.pointerType !== "touch" && e.buttons === 0)
            group.enter(target(e.currentTarget));
        },
        onPointerLeave: (e: PointerEvent<Element>) => {
          if (e.pointerType !== "touch") group.leave(id);
        },
        onPointerDown: () => group.leave(id),
        onFocus: (e: FocusEvent<Element>) => {
          if (e.currentTarget.matches(":focus-visible"))
            group.focus(target(e.currentTarget));
        },
        onBlur: () => group.dismiss(id),
        onKeyDown: (e: KeyboardEvent<Element>) => {
          if (e.key === "Escape") group.dismiss(id);
        },
      },
      props,
    ),
  });
}

type TooltipContentProps = {
  children: ReactNode;
  side?: Side;
  /** Hangs the surface from a tail that points at the trigger; on by default. */
  arrow?: boolean;
  /** Lands on the label inside the shared surface. */
  className?: string;
};

/** Renders nothing in place: the group's surface shows it while it's up. */
function TooltipContent({
  children,
  side = "top",
  arrow = true,
  className,
}: TooltipContentProps) {
  const { group, id, entry } = useTooltip();

  useLayoutEffect(() => {
    entry.publish({ children, side, arrow, className });
    group.ready(id);
  });

  return null;
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
