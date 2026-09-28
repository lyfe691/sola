/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * React Bits' WarmTooltip in the site's tooltip design. A group shares one
 * surface: the first hover waits out the delay and pops it in; from there it
 * springs from trigger to trigger, leaning into the travel and resizing as it
 * goes, while the label
 * cross-fades in the direction of travel. Reopening within the warm window
 * skips both the delay and the pop.
 */

import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
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
  type Variants,
} from "motion/react";
import { useRender } from "@base-ui/react/use-render";
import { Kbd } from "@/components/ui/kbd";
import { EASE_EXPO } from "@/utils/transitions";

type Side = "top" | "right" | "bottom" | "left";

type Payload = {
  id: string;
  trigger: HTMLElement;
  content: ReactNode;
  shortcut?: ReactNode;
  side: Side;
};

type Shown = {
  payload: Payload;
  phase: "open" | "closing";
  /** move: the surface was already up and travels to the new trigger */
  mode: "cold" | "warm" | "instant" | "move";
  /** opened by keyboard focus, so it also closes without the fade */
  instant: boolean;
  /** which way the label swaps: -1/1 along the row, 0 for no swap */
  swap: { dir: number; across: boolean };
};

type GroupApi = {
  tooltipId: string;
  activeId: string | null;
  enter: (payload: Payload) => void;
  leave: (id: string) => void;
  focus: (payload: Payload) => void;
  dismiss: (id: string) => void;
};

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

const alongX = (side: Side) => side === "top" || side === "bottom";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

/** The point on the trigger's edge that the surface hangs from. */
function anchorOf({ trigger, side }: Payload): [number, number] {
  const r = trigger.getBoundingClientRect();
  if (side === "top") return [r.left + r.width / 2, r.top - GAP];
  if (side === "bottom") return [r.left + r.width / 2, r.bottom + GAP];
  if (side === "left") return [r.left - GAP, r.top + r.height / 2];
  return [r.right + GAP, r.top + r.height / 2];
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

const GroupContext = createContext<GroupApi | null>(null);

type WarmTooltipGroupProps = {
  children: ReactNode;
  /** Hover time before a cold open, in ms. */
  delay?: number;
  /** How long after a close the next hover opens at once, in ms. */
  warmWindow?: number;
  /** Degrees the surface tilts as it glides at full speed; 0 keeps it level. */
  lean?: number;
};

export function WarmTooltipGroup({
  children,
  delay = 400,
  warmWindow = 300,
  lean = 16,
}: WarmTooltipGroupProps) {
  const tooltipId = useId();
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState<Shown | null>(null);
  // the latest `shown`, for handlers that run between renders
  const live = useRef<Shown | null>(null);
  const warmUntil = useRef(-Infinity);
  const pending = useRef<{ id: string; timer: Timer } | null>(null);
  const leaveTimer = useRef<Timer>(undefined);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  const anchorX = useMotionValue(0);
  const anchorY = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const side = useMotionValue<Side>("top");
  const origin = () =>
    originOf(
      side.get(),
      anchorX.get(),
      anchorY.get(),
      width.get(),
      height.get(),
    );
  const x = useTransform(() => origin()[0]);
  const y = useTransform(() => origin()[1]);
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

  const commit = (next: Shown | null) => {
    live.current = next;
    setShown(next);
  };

  const cancelPending = () => {
    clearTimeout(pending.current?.timer);
    pending.current = null;
  };

  const show = (payload: Payload, mode: "cold" | "warm" | "instant") => {
    cancelPending();
    clearTimeout(leaveTimer.current);
    const prev = live.current;
    const across = !alongX(payload.side);
    let dir = 0;
    if (prev && prev.payload.id !== payload.id) {
      const [px, py] = anchorOf(prev.payload);
      const [nx, ny] = anchorOf(payload);
      dir = Math.sign(across ? ny - py : nx - px) || 1;
    }
    commit({
      payload,
      phase: "open",
      mode: prev && mode !== "instant" ? "move" : mode,
      instant: mode === "instant",
      swap: { dir, across },
    });
  };

  const close = (instant: boolean) => {
    clearTimeout(leaveTimer.current);
    const current = live.current;
    if (!current || current.phase !== "open") return;
    warmUntil.current = performance.now() + warmWindow;
    commit(
      instant || current.instant ? null : { ...current, phase: "closing" },
    );
  };

  const hide = () => {
    clearTimeout(leaveTimer.current);
    if (live.current?.instant) close(true);
    else leaveTimer.current = setTimeout(() => close(false), GRACE);
  };

  const group: GroupApi = {
    tooltipId,
    activeId: shown?.payload.id ?? null,
    enter: (payload) => {
      clearTimeout(leaveTimer.current);
      if (live.current || performance.now() < warmUntil.current) {
        show(payload, "warm");
        return;
      }
      cancelPending();
      pending.current = {
        id: payload.id,
        timer: setTimeout(() => show(payload, "cold"), delay),
      };
    },
    leave: (id) => {
      if (pending.current?.id === id) cancelPending();
      if (live.current?.payload.id === id) hide();
    },
    focus: (payload) => show(payload, "instant"),
    dismiss: (id) => {
      if (live.current?.payload.id === id) close(true);
    },
  };

  // measure the new label, then spring the surface to it (or land there)
  useLayoutEffect(() => {
    const label = labelRef.current;
    if (!shown || shown.phase !== "open" || !label) return;
    const [ax, ay] = anchorOf(shown.payload);
    side.set(shown.payload.side);
    const targets = [
      [anchorX, ax],
      [anchorY, ay],
      [width, label.offsetWidth],
      [height, label.offsetHeight],
    ] as const;
    for (const [value, to] of targets) {
      if (shown.mode === "move" && !reduceMotion) animate(value, to, GLIDE);
      else value.jump(to);
    }
  }, [shown, reduceMotion, anchorX, anchorY, width, height, side]);

  const follow = useEffectEvent(() => {
    const current = live.current;
    if (!current) return;
    const [ax, ay] = anchorOf(current.payload);
    anchorX.jump(ax);
    anchorY.jump(ay);
  });
  const onPointerDown = useEffectEvent(hide);
  const onVisibilityChange = useEffectEvent(() => {
    if (document.visibilityState === "hidden") close(true);
  });

  const isShown = shown !== null;
  useEffect(() => {
    if (!isShown) return;
    let frame = 0;
    const onMove = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(follow);
    };
    window.addEventListener("scroll", onMove, { capture: true, passive: true });
    window.addEventListener("resize", onMove);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onMove, { capture: true });
      window.removeEventListener("resize", onMove);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isShown]);

  useEffect(
    () => () => {
      clearTimeout(pending.current?.timer);
      clearTimeout(leaveTimer.current);
    },
    [],
  );

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
                data-side={shown.payload.side}
                style={
                  { "--tilt": tilt, "--lean": `${lean}deg` } as MotionStyle
                }
                custom={shown.payload.side}
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
                  if (
                    definition === "hidden" &&
                    live.current?.phase === "closing"
                  )
                    commit(null);
                }}
                className="absolute inset-0 rotate-[calc(var(--tilt)*var(--lean))] rounded-2xl bg-foreground text-background shadow-sm data-[side=bottom]:origin-top data-[side=left]:origin-right data-[side=right]:origin-left data-[side=top]:origin-bottom motion-reduce:rotate-none"
              >
                <AnimatePresence initial={false} custom={shown.swap}>
                  <motion.div
                    key={shown.payload.id}
                    custom={shown.swap}
                    variants={LABEL_VARIANTS}
                    initial="enter"
                    animate="show"
                    exit="exit"
                    transition={SWAP}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Label payload={shown.payload} measureRef={labelRef} />
                  </motion.div>
                </AnimatePresence>
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
  payload,
  measureRef,
}: {
  payload: Payload;
  measureRef: RefObject<HTMLSpanElement | null>;
}) {
  const present = useIsPresent();

  return (
    <span
      ref={present ? measureRef : undefined}
      className="flex items-center gap-1.5 px-2.5 py-1 text-[13px] leading-5.5 font-semibold whitespace-nowrap has-data-[slot=kbd]:pr-1 *:data-[slot=kbd]:rounded-full *:data-[slot=kbd]:px-2"
    >
      {payload.content}
      {payload.shortcut && <Kbd>{payload.shortcut}</Kbd>}
    </span>
  );
}

type WarmTooltipProps = {
  content: ReactNode;
  shortcut?: ReactNode;
  side?: Side;
  /** The trigger: must be focusable; the tooltip's handlers merge into it. */
  children: ReactElement;
};

export function WarmTooltip({
  content,
  shortcut,
  side = "top",
  children,
}: WarmTooltipProps) {
  const group = useContext(GroupContext);
  const id = useId();
  if (!group) throw new Error("WarmTooltip must sit inside a WarmTooltipGroup");

  const payload = (trigger: HTMLElement): Payload => ({
    id,
    trigger,
    content,
    shortcut,
    side,
  });

  return useRender({
    render: children,
    props: {
      "aria-describedby": group.activeId === id ? group.tooltipId : undefined,
      onPointerEnter: (e: PointerEvent<HTMLElement>) => {
        if (e.pointerType !== "touch" && e.buttons === 0)
          group.enter(payload(e.currentTarget));
      },
      onPointerLeave: (e: PointerEvent<HTMLElement>) => {
        if (e.pointerType !== "touch") group.leave(id);
      },
      onPointerDown: () => group.leave(id),
      onFocus: (e: FocusEvent<HTMLElement>) => {
        if (e.currentTarget.matches(":focus-visible"))
          group.focus(payload(e.currentTarget));
      },
      onBlur: () => group.dismiss(id),
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === "Escape") group.dismiss(id);
      },
    },
  });
}
