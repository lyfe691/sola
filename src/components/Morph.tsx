/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A box that glides to the size of what it holds instead of jumping to it.
 * The content lays out at its new size at once; the box follows on the glide
 * and clips whatever is not inside it yet.
 *
 * Wrap only what changes. What stays where it is (a close button, a footer,
 * the label beside a spinner) sits outside the Morph and rides on the box.
 * What stays but moves (a title going from a card's header into a reader's
 * toolbar) is a part: rendered once and never remounted, it travels on the
 * same spring to the <MorphSlot> of its name in whatever is showing.
 *
 * `face` names what is showing: a new face crossfades in place of the old
 * one. The height glides by default, and lands at once when the width
 * changed, because that was a reflow, not new content. An `axis` with the
 * width in it lets the content set its own width. `inline` renders spans,
 * for inside a button, a heading or a label.
 *
 * Everything a change sets moving (the box, the faces, the parts) starts
 * together, two frames on: once the new content has been laid out and
 * painted. Until then the old face stays as it was and the new one waits
 * unseen, so the cost of mounting it never shows as a jump in the motion.
 *
 * A Morph inside another one's face (a section opening inside a menu) is
 * that face's content moving: while its box moves, the outer box follows it
 * frame for frame instead of gliding after it.
 *
 * A popup holding one resets what it shows as it opens, never as it
 * closes: a face changed while the popup plays its exit glides the box on
 * the way out, two motions at once.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import { flushSync } from "react-dom";
import {
  animate,
  AnimatePresence,
  motion,
  useIsPresent,
  useMotionValue,
  usePresence,
  type MotionValue,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";
import { GLIDE_SPRING, HIDDEN_OPACITY, SWAP } from "@/utils/transitions";

type Box = { width: number; height: number; rendered: boolean };

const LAND: Transition = { duration: 0 };

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** border-box size, fractional and untouched by transforms (the page
 *  transition scales the whole page); not rendered under display: none */
const boxOf = (el: Element, observed?: ResizeObserverSize): Box => {
  const rendered = el.getClientRects().length > 0;
  if (observed) {
    return {
      width: observed.inlineSize,
      height: observed.blockSize,
      rendered,
    };
  }
  const style = getComputedStyle(el);
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);
  return {
    width: Number.isFinite(width) ? width : 0,
    height: Number.isFinite(height) ? height : 0,
    rendered,
  };
};

// the preference as it is now: motion's useReducedMotion reads it once at
// mount, and a box mounted before it changed must follow it too
const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const prefersReduced = () => window.matchMedia(REDUCED).matches;

/** a size as CSS: -1 is "not sized yet", which leaves the box to its content */
const toLength = (value: number) => (value < 0 ? "auto" : `${value}px`);

/** the same size: a size read from computed style is rounded where the
 *  observer's is not */
const near = (a: number, b: number) => Math.abs(a - b) < 0.01;

/** what takes focus by Tab (a roving item at -1 does not) */
const focusables = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => el.tabIndex >= 0,
  );

/** the Morph whose face this one sits in, told when this box starts and
 *  stops moving; `land` is false for a box going away, which has no last
 *  frame to be measured in */
type Nest = (box: HTMLElement, moving: boolean, land: boolean) => void;
const NestContext = createContext<Nest | null>(null);

// ---- faces ----

/** the face whose motion has started: the newest, once the clock runs */
const StartedContext = createContext<string | number | undefined>(undefined);

/** A face waits unseen until the clock starts, then fades in; the face it
 *  replaces stays as it was until then, then fades out and goes. One on
 *  its way out stops taking presses at once, and after the commit hands
 *  focus on (it would be lost with the face) and goes inert, in that
 *  order, since inert drops the focus it holds. A face that comes back
 *  before it has gone is measured again: it is the same element, so no
 *  ref is attached anew. */
function Face({
  inline,
  name,
  onPresent,
  onLeave,
  onHold,
  className,
  children,
  ref,
}: {
  inline: boolean;
  name: string | number;
  onPresent: (face: HTMLElement) => void;
  /** told as the face starts to leave; what it returns hands focus on
   *  once the commit is done */
  onLeave: (face: HTMLElement, name: string | number) => () => void;
  /** keeps the box its size while this face is on its way out */
  onHold: (face: HTMLElement, holding: boolean) => void;
  className?: string;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}) {
  const started = useContext(StartedContext);
  const [present, safeToRemove] = usePresence();
  const node = useRef<HTMLElement | null>(null);
  const fade = useRef<{ stop: () => void } | null>(null);
  const shown = useRef(started === name);
  // read by the leave's microtask: a face back before it runs stays live
  const isPresent = useRef(present);
  const attach = useCallback(
    (el: HTMLElement | null) => {
      node.current = el;
      if (typeof ref === "function") return ref(el);
      if (ref) ref.current = el;
    },
    [ref],
  );

  useLayoutEffect(() => {
    isPresent.current = present;
    const face = node.current;
    if (!face) return;
    if (present) {
      face.inert = false;
      onHold(face, false);
      onPresent(face);
      return;
    }
    onHold(face, true);
    // now, before a new face's autoFocus has run: it comes later in this
    // commit and takes focus out of this face
    const handOff = onLeave(face, name);
    queueMicrotask(() => {
      if (!node.current || isPresent.current) return;
      handOff();
      face.inert = true;
    });
    return () => onHold(face, false);
  }, [present, name, onPresent, onLeave, onHold]);

  // A parent can draw every frame (a clip's clock), and a leaving face's
  // safeToRemove is new on each render: every step below runs once however
  // often this effect does. A fade-out begun again on every frame would ease
  // out from where it is forever and never end.
  const remove = useRef(safeToRemove);
  useLayoutEffect(() => {
    remove.current = safeToRemove;
  });
  const fadingOut = useRef(false);
  // stopped partway (back before it had gone): it stays where it is
  const held = useRef(false);

  useLayoutEffect(() => {
    const face = node.current;
    if (!face) return;
    const showing = started === name;
    if (present && showing && !shown.current) {
      shown.current = true;
      held.current = false;
      fadingOut.current = false;
      fade.current?.stop();
      fade.current = animate(face, { opacity: 1 }, SWAP);
    } else if (present && !showing && !shown.current) {
      if (fade.current) {
        // back before it had gone: it holds where its fade had got to
        fade.current.stop();
        fade.current = null;
        held.current = true;
        fadingOut.current = false;
      } else if (!held.current) {
        face.style.opacity = String(HIDDEN_OPACITY);
      }
    } else if (!present && !showing) {
      if (fadingOut.current) return;
      fadingOut.current = true;
      held.current = false;
      shown.current = false;
      fade.current?.stop();
      const out = animate(face, { opacity: 0 }, SWAP);
      fade.current = out;
      void out.then(() => {
        if (fade.current !== out) return;
        onHold(face, false);
        remove.current?.();
      });
    } else if (!present && fade.current) {
      // on its way out before its successor has started, it holds where
      // its fade had got to
      fade.current.stop();
      fade.current = null;
      held.current = true;
    }
  }, [present, started, name, onHold]);

  const Tag = inline ? "span" : "div";
  return (
    <Tag
      ref={attach}
      // its opacity is written, never transitioned: reduced motion stretches
      // every transition to 0.01ms, which would paint the old value first
      className={cn(
        "transition-none",
        className,
        !present && "pointer-events-none",
      )}
    >
      {children}
    </Tag>
  );
}

// ---- parts: what travels from one face's slot to the next one's ----

type Part = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  show: (shown: boolean) => void;
};

type Stage = {
  sizes: Record<string, { width: number; height: number }>;
  claim: (name: string, slot: HTMLElement) => () => void;
};

const StageContext = createContext<Stage | null>(null);

/** where a part sits in a face: it keeps the part's room, and the part
 *  travels to it whenever this face is the one showing */
export function MorphSlot({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const stage = useContext(StageContext);
  const present = useIsPresent();
  const node = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!stage || !present || !node.current) return;
    return stage.claim(name, node.current);
  }, [stage, name, present]);
  const size = stage?.sizes[name];
  return (
    <div
      ref={node}
      aria-hidden="true"
      className={cn("h-(--part-h) w-(--part-w) shrink-0", className)}
      style={
        {
          "--part-w": `${size?.width ?? 0}px`,
          "--part-h": `${size?.height ?? 0}px`,
        } as CSSProperties
      }
    />
  );
}

function PartLayer({
  name,
  register,
  measure,
  children,
}: {
  name: string;
  register: (name: string, part: Part) => () => void;
  measure: (name: string, el: HTMLElement | null) => void;
  children: ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // the first time it shows is the mount, with no fade; after that it
  // fades out and back in as faces with and without its slot come and go
  const [seen, setSeen] = useState<"unseen" | "first" | "shown" | "hidden">(
    "unseen",
  );
  const shown = seen === "first" || seen === "shown";
  const show = useCallback((next: boolean) => {
    // asked again before it has ever been hidden, it is still the first show
    setSeen((now) =>
      now === "unseen" || now === "first"
        ? next
          ? "first"
          : now === "first"
            ? "hidden"
            : "unseen"
        : next
          ? "shown"
          : "hidden",
    );
  }, []);
  const attach = useCallback(
    (el: HTMLDivElement | null) => measure(name, el),
    [measure, name],
  );
  useLayoutEffect(
    () => register(name, { x, y, show }),
    [register, name, x, y, show],
  );
  return (
    <motion.div
      ref={attach}
      initial={false}
      animate={{
        opacity: shown ? 1 : seen === "hidden" ? 0 : HIDDEN_OPACITY,
      }}
      transition={seen === "shown" || seen === "hidden" ? SWAP : LAND}
      aria-hidden={shown ? undefined : true}
      className={cn(
        "absolute top-0 left-0 z-10 w-max",
        !shown && "pointer-events-none",
      )}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
}

export function Morph({
  children,
  face,
  parts,
  inline = false,
  axis = inline ? "both" : "height",
  className,
  contentClassName,
  onGlide,
}: {
  children: ReactNode;
  /** what is showing; a new face takes the old one's place */
  face?: string | number;
  /** told as the box sets off and as it comes to rest: heavy drawing
   *  inside it (a PDF's pages) can wait for it to stand still */
  onGlide?: (gliding: boolean) => void;
  /** what stays but moves, by name: each travels to its <MorphSlot>.
   *  Parts come first in the DOM, so one that takes focus comes first in
   *  tab order wherever its slot sits. */
  parts?: Record<string, ReactNode>;
  /** inside a button, a heading or a label: spans, gliding both ways
   *  unless `axis` says otherwise */
  inline?: boolean;
  /** which sides glide; with the width in it the content sets its own */
  axis?: "height" | "width" | "both";
  className?: string;
  contentClassName?: string;
}) {
  const reduced = useSyncExternalStore(subscribeReduced, prefersReduced);
  const glidesWidth = axis !== "height";
  const glidesHeight = axis !== "width";

  // ---- the clock ----
  const queue = useRef<Array<() => void>>([]);
  const tick = useRef(0);
  const soon = useCallback((run: () => void) => {
    queue.current.push(run);
    if (tick.current) return;
    tick.current = requestAnimationFrame(() => {
      tick.current = requestAnimationFrame(() => {
        tick.current = 0;
        const runs = queue.current;
        queue.current = [];
        for (const start of runs) start();
      });
    });
  }, []);

  // what the box settles into before its first frames are painted (fonts,
  // its parts' sizes) is where it starts, not something to glide to
  const settled = useRef(false);
  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        settled.current = true;
      });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // ---- the box ----
  // The box is its content's size (`base`; -1 leaves it to its content)
  // plus an offset that springs to 0. A change moves the base and puts the
  // difference into the offset, so the box sets off from where it is, at
  // the speed it had; a box inside moving the content moves the base alone,
  // so a glide under way carries on on top of it.
  const shell = useRef<HTMLElement | null>(null);
  const base = useRef({ width: -1, height: -1 });
  const dw = useMotionValue(0);
  const dh = useMotionValue(0);
  const last = useRef<Box | null>(null);
  // the latest glide, pending or running; 0 when the box is at rest
  const flight = useRef(0);
  // whether that glide has set off: one waiting for the clock moves nothing
  const running = useRef(false);
  // the face being measured: the newest one
  const measured = useRef<HTMLElement | null>(null);

  const write = useCallback(() => {
    const box = shell.current;
    if (!box) return;
    const { width, height } = base.current;
    box.style.setProperty(
      "--morph-w",
      toLength(width < 0 ? -1 : width + dw.get()),
    );
    box.style.setProperty(
      "--morph-h",
      toLength(height < 0 ? -1 : height + dh.get()),
    );
  }, [dw, dh]);

  // ---- nesting ----
  const nest = useContext(NestContext);
  const latestNest = useRef(nest);
  useLayoutEffect(() => {
    latestNest.current = nest;
  }, [nest]);
  // the boxes of the Morphs inside this one that are moving now
  const inner = useRef(new Set<HTMLElement>());
  // the box the Morph this one sits in was told is moving, held so it can
  // be taken back after the ref has gone
  const moving = useRef<HTMLElement | null>(null);

  /** a box moving inside the face showing (one in a leaving face moves
   *  nothing this box holds) */
  const following = useCallback(() => {
    const face = measured.current;
    if (!face) return false;
    for (const box of inner.current) if (face.contains(box)) return true;
    return false;
  }, []);

  /** this box moves while a glide of its own runs and while it follows one
   *  inside it */
  const report = useCallback(() => {
    const box = shell.current;
    if (!box) return;
    const now = running.current || following();
    if (now === (moving.current !== null)) return;
    moving.current = now ? box : null;
    latestNest.current?.(box, now, true);
  }, [following]);

  useLayoutEffect(
    () => () => {
      const box = moving.current;
      if (!box) return;
      moving.current = null;
      latestNest.current?.(box, false, false);
    },
    [],
  );

  const latestOnGlide = useRef(onGlide);
  useLayoutEffect(() => {
    latestOnGlide.current = onGlide;
  }, [onGlide]);
  const toldGliding = useRef(false);

  /** set as a glide starts or ends (flight first): the box clips only
   *  while it glides */
  const glided = useCallback(
    (gliding: boolean) => {
      const box = shell.current;
      if (box) {
        if (gliding) box.dataset.gliding = "";
        else delete box.dataset.gliding;
      }
      if (gliding !== toldGliding.current) {
        toldGliding.current = gliding;
        latestOnGlide.current?.(gliding);
      }
      report();
    },
    [report],
  );

  /** the box comes to rest on its base, its offsets gone */
  const settle = useCallback(() => {
    flight.current = 0;
    running.current = false;
    dw.jump(0);
    dh.jump(0);
    write();
    glided(false);
  }, [dw, dh, write, glided]);

  /** `fresh`: the size of a face just measured, never a reflow */
  const take = useCallback(
    (next: Box, fresh = false) => {
      const prev = last.current;
      if (
        prev &&
        near(prev.width, next.width) &&
        near(prev.height, next.height) &&
        prev.rendered === next.rendered
      ) {
        return;
      }
      last.current = next;
      if (reduced) return;
      const to = {
        width: glidesWidth ? next.width : -1,
        height: glidesHeight ? next.height : -1,
      };
      // a block is as wide as its container, so the same face at a new
      // width is a reflow (a resized window): it lands. A box that was not
      // rendered (display: none), or not sized yet, has nothing to glide
      // from.
      const reflow =
        !glidesWidth &&
        !fresh &&
        prev !== null &&
        !near(prev.width, next.width);
      const sized =
        (!glidesWidth || base.current.width >= 0) &&
        (!glidesHeight || base.current.height >= 0);
      if (
        !settled.current ||
        !sized ||
        prev === null ||
        !prev.rendered ||
        !next.rendered
      ) {
        base.current = to;
        settle();
        return;
      }
      // a box moving inside this one is the content moving, and a reflow
      // lands: the base goes with them, under any glide already running
      if (following() || (reflow && flight.current === 0)) {
        base.current = to;
        write();
        return;
      }
      const from = base.current;
      const speed = { width: dw.getVelocity(), height: dh.getVelocity() };
      if (glidesWidth) dw.jump(from.width + dw.get() - to.width);
      if (glidesHeight) dh.jump(from.height + dh.get() - to.height);
      base.current = to;
      write();
      const id = ++flight.current;
      glided(true);
      const run = () => {
        if (flight.current !== id) return;
        running.current = true;
        report();
        const runs = [
          ...(glidesWidth
            ? [animate(dw, 0, { ...GLIDE_SPRING, velocity: speed.width })]
            : []),
          ...(glidesHeight
            ? [animate(dh, 0, { ...GLIDE_SPRING, velocity: speed.height })]
            : []),
        ];
        void Promise.all(runs).then(() => {
          if (flight.current !== id) return;
          flight.current = 0;
          running.current = false;
          glided(false);
        });
      };
      // a glide under way takes the change at once, keeping its speed; one
      // from rest sets off on the clock, with the faces
      if (running.current) run();
      else soon(run);
    },
    [
      reduced,
      glidesWidth,
      glidesHeight,
      dw,
      dh,
      soon,
      following,
      report,
      glided,
      write,
      settle,
    ],
  );

  // the box takes its size from these, written as CSS variables. It
  // subscribes once it exists and starts from what they hold then: a size
  // taken while the content mounts (before the box does) is not lost.
  useLayoutEffect(() => {
    write();
    const offWidth = dw.on("change", write);
    const offHeight = dh.on("change", write);
    return () => {
      offWidth();
      offHeight();
    };
  }, [dw, dh, write]);

  // under reduced motion the box is left to its content; back from it, the
  // box starts again from the content's size
  useLayoutEffect(() => {
    const at = last.current;
    base.current = {
      width: reduced || !at || !glidesWidth ? -1 : at.width,
      height: reduced || !at || !glidesHeight ? -1 : at.height,
    };
    settle();
  }, [reduced, glidesWidth, glidesHeight, settle]);

  // ---- measuring ----
  const observer = useRef<ResizeObserver | null>(null);
  // the observers are made once and outlive renders: they call the latest
  // take and place through these
  const latestTake = useRef(take);
  const latestPlace = useRef<((travel: boolean) => void) | null>(null);
  useLayoutEffect(() => {
    latestTake.current = take;
  }, [take]);

  // a box inside stopping: its last frame is this box's last frame too,
  // taken now while it still counts as following, not from the next report,
  // which would glide to it
  const onInner = useCallback<Nest>(
    (box, now, land) => {
      if (now) inner.current.add(box);
      else if (inner.current.has(box)) {
        const face = measured.current;
        if (land && face?.contains(box)) latestTake.current(boxOf(face));
        inner.current.delete(box);
      }
      report();
    },
    [report],
  );

  // only the newest face is measured: the one before it stops being watched
  // as this one mounts, so the box never takes the size of a face leaving.
  // A face resizing can also move a part's slot inside it.
  const measure = useCallback(
    (el: HTMLElement | null) => {
      if (!el || el === measured.current) return;
      observer.current ??= new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target !== measured.current) continue;
          latestTake.current(boxOf(entry.target, entry.borderBoxSize[0]));
          latestPlace.current?.(false);
        }
      });
      if (measured.current) {
        // following a box inside it, the box takes that face's last frame
        // first: the observer stops reporting it from here
        if (following()) take(boxOf(measured.current));
        observer.current.unobserve(measured.current);
      }
      measured.current = el;
      observer.current.observe(el);
      // an empty face (0 × 0) gets no first report from the observer
      take(boxOf(el), true);
    },
    [take, following],
  );

  useEffect(
    () => () => {
      cancelAnimationFrame(tick.current);
      tick.current = 0;
      queue.current = [];
      observer.current?.disconnect();
      observer.current = null;
      measured.current = null;
    },
    [],
  );

  // ---- faces ----
  const [started, setStarted] = useState(face);
  const latest = useRef(face);
  useLayoutEffect(() => {
    latest.current = face;
    if (face === started) return;
    soon(() => flushSync(() => setStarted(latest.current)));
  }, [face, started, soon]);

  // A face on its way out is lifted out of the flow against the box's
  // corner. Along a side the box doesn't glide it would snap to the new
  // face's size, and a box centred in its line would carry the leaving face
  // with it (a spinner dropping as its slot empties): until the face has
  // gone, the box keeps the larger size there.
  // Under reduced motion the box lands at once, so a face still fading out
  // is clipped to it rather than painted over what follows.
  const leaving = useRef(new Map<HTMLElement, number>());
  const hold = useCallback(
    (face: HTMLElement, holding: boolean) => {
      if (holding) {
        leaving.current.set(face, glidesHeight ? 0 : boxOf(face).height);
      } else leaving.current.delete(face);
      const box = shell.current;
      if (!box) return;
      if (reduced) {
        if (leaving.current.size) box.dataset.gliding = "";
        else delete box.dataset.gliding;
      }
      if (glidesHeight) return;
      const height = Math.max(0, ...leaving.current.values());
      box.style.minHeight = height ? `${height}px` : "";
    },
    [glidesHeight, reduced],
  );

  // Focus inside a leaving face goes to the new face: to where it was when
  // that face last left (back from a submenu, the row that opened it), else
  // to its first stop, else to the nearest container that takes focus (a
  // dialog). Where it is in the leaving face is noted as it starts to
  // leave; the hand-off waits for the commit, and a fresh face's autoFocus
  // has taken focus by then.
  const focusAt = useRef(new Map<string | number, number>());
  const handOff = useCallback((leaving: HTMLElement, name: string | number) => {
    const held = document.activeElement;
    if (held instanceof HTMLElement && leaving.contains(held)) {
      const at = focusables(leaving).indexOf(held);
      if (at >= 0) focusAt.current.set(name, at);
    }
    return () => {
      const active = document.activeElement;
      if (!(active instanceof HTMLElement) || !leaving.contains(active)) return;
      const stops = measured.current ? focusables(measured.current) : [];
      const back =
        latest.current === undefined
          ? undefined
          : focusAt.current.get(latest.current);
      const next =
        (back === undefined ? undefined : stops[back]) ??
        stops[0] ??
        shell.current?.closest<HTMLElement>("[tabindex]");
      next?.focus({ preventScroll: true });
    };
  }, []);

  // ---- parts ----
  const stage = useRef<HTMLElement | null>(null);
  const slots = useRef(new Map<string, HTMLElement>());
  const partsByName = useRef(new Map<string, Part>());
  // where each part was last sent, and which are showing
  const partAt = useRef(new Map<string, { x: number; y: number }>());
  const partShown = useRef(new Set<string>());
  const partObserver = useRef<ResizeObserver | null>(null);
  const [partSizes, setPartSizes] = useState<Stage["sizes"]>({});
  const lastFace = useRef(face);

  const sizePart = useCallback((name: string, el: Element) => {
    const { width, height } = boxOf(el);
    setPartSizes((prev) =>
      prev[name]?.width === width && prev[name]?.height === height
        ? prev
        : { ...prev, [name]: { width, height } },
    );
  }, []);

  // a part's element as observed, unobserved as it goes: a detached one
  // reports 0 × 0 and would bring back the size its removal deleted
  const partEls = useRef(new Map<string, HTMLElement>());
  const measurePart = useCallback(
    (name: string, el: HTMLElement | null) => {
      const was = partEls.current.get(name);
      if (was && was !== el) {
        partObserver.current?.unobserve(was);
        partEls.current.delete(name);
      }
      if (!el) return;
      partEls.current.set(name, el);
      el.dataset.morphPart = name;
      partObserver.current ??= new ResizeObserver((entries) => {
        for (const entry of entries) {
          const part = (entry.target as HTMLElement).dataset.morphPart;
          if (part) sizePart(part, entry.target);
        }
      });
      partObserver.current.observe(el);
      sizePart(name, el);
    },
    [sizePart],
  );

  useEffect(
    () => () => {
      partObserver.current?.disconnect();
      partObserver.current = null;
    },
    [],
  );

  // a part taken away forgets where it was, so one given back under the
  // same name starts over
  const register = useCallback((name: string, part: Part) => {
    partsByName.current.set(name, part);
    return () => {
      if (partsByName.current.get(name) !== part) return;
      partsByName.current.delete(name);
      partAt.current.delete(name);
      partShown.current.delete(name);
      setPartSizes(({ [name]: _gone, ...rest }) => rest);
    };
  }, []);

  // the parts whose travel waits for the clock: it goes to wherever their
  // slot is by then, so a slot moving in the meantime is no jump
  const pending = useRef(new Set<string>());

  /** put every part on its slot: travelling there on a new face (on the
   *  clock, with the box, or at once if already travelling), landing there
   *  on a reflow unless travelling, which then takes the new place as its
   *  target, keeping its speed */
  const place = useCallback(
    (travel: boolean) => {
      const frame = stage.current;
      if (!frame) return;
      const origin = frame.getBoundingClientRect();
      // the unrounded width: offsetWidth's whole pixels mid-glide would
      // put the slot a fraction off
      const layout = parseFloat(getComputedStyle(frame).width);
      const scale = layout > 0 ? origin.width / layout : 1;
      for (const [name, part] of partsByName.current) {
        const slot = slots.current.get(name);
        const shown = partShown.current.has(name);
        if (!slot) {
          if (shown) {
            partShown.current.delete(name);
            part.show(false);
          }
          continue;
        }
        const rect = slot.getBoundingClientRect();
        const to = {
          x: (rect.left - origin.left) / scale,
          y: (rect.top - origin.top) / scale,
        };
        const at = partAt.current.get(name);
        const moved =
          !at || Math.abs(at.x - to.x) > 0.25 || Math.abs(at.y - to.y) > 0.25;
        if (moved) {
          partAt.current.set(name, to);
          const flying = part.x.isAnimating() || part.y.isAnimating();
          if (pending.current.has(name)) {
            // its travel reads partAt when the clock runs
          } else if (shown && !reduced && flying) {
            animate(part.x, to.x, GLIDE_SPRING);
            animate(part.y, to.y, GLIDE_SPRING);
          } else if (shown && !reduced && travel) {
            pending.current.add(name);
            soon(() => {
              pending.current.delete(name);
              const at = partAt.current.get(name);
              if (!at || partsByName.current.get(name) !== part) return;
              animate(part.x, at.x, GLIDE_SPRING);
              animate(part.y, at.y, GLIDE_SPRING);
            });
          } else {
            part.x.jump(to.x);
            part.y.jump(to.y);
          }
        }
        if (!shown) {
          partShown.current.add(name);
          part.show(true);
        }
      }
    },
    [reduced, soon],
  );

  const claim = useCallback((name: string, slot: HTMLElement) => {
    slots.current.set(name, slot);
    return () => {
      if (slots.current.get(name) === slot) slots.current.delete(name);
    };
  }, []);

  const stageValue = useMemo<Stage>(
    () => ({ sizes: partSizes, claim }),
    [partSizes, claim],
  );

  const hasParts = parts !== undefined;
  useLayoutEffect(() => {
    latestPlace.current = hasParts ? place : null;
  }, [hasParts, place]);

  // every commit: a new face sends the parts travelling to its slots;
  // anything else only keeps them on theirs
  useLayoutEffect(() => {
    if (!hasParts) return;
    const travel = lastFace.current !== face;
    lastFace.current = face;
    place(travel);
  });

  // the stage reflowing (a resized window, the box gliding) moves slots
  // without a commit
  useEffect(() => {
    const frame = stage.current;
    if (!hasParts || !frame) return;
    const resize = new ResizeObserver(() => latestPlace.current?.(false));
    resize.observe(frame);
    return () => resize.disconnect();
  }, [hasParts]);

  // ---- render ----
  const Shell = inline ? "span" : "div";
  const Inner = inline ? "span" : "div";
  const innerClassName = cn(
    // margins stay inside what is measured
    "flow-root",
    glidesWidth && "w-max",
    contentClassName,
  );
  const display =
    inline && (glidesWidth ? "inline-block align-bottom" : "block");

  const box = (
    <Shell
      ref={shell as RefObject<HTMLDivElement>}
      className={cn(
        glidesWidth && "w-(--morph-w)",
        glidesHeight && "h-(--morph-h)",
        // at rest the box is exactly its content's size, so nothing is
        // clipped and a focus ring or shadow inside reaches past it; only a
        // glide clips, and only the sides it moves. clip, not hidden, so
        // focusing what is inside can never scroll the box.
        glidesWidth && glidesHeight && "data-gliding:overflow-clip",
        glidesWidth && !glidesHeight && "data-gliding:overflow-x-clip",
        !glidesWidth && "data-gliding:overflow-y-clip",
        // a leaving face is lifted out of the flow against the box
        face !== undefined && "relative",
        !parts && display,
        !parts && className,
      )}
    >
      <NestContext.Provider value={onInner}>
        {face === undefined ? (
          <Inner ref={measure} className={innerClassName}>
            {children}
          </Inner>
        ) : (
          <StartedContext.Provider value={started}>
            <AnimatePresence mode="popLayout" initial={false}>
              <Face
                key={face}
                name={face}
                inline={inline}
                onPresent={measure}
                onLeave={handOff}
                onHold={hold}
                className={innerClassName}
              >
                {children}
              </Face>
            </AnimatePresence>
          </StartedContext.Provider>
        )}
      </NestContext.Provider>
    </Shell>
  );

  if (!parts) return box;

  // the parts sit outside the box's clip (one may travel across ground the
  // box is leaving) and before it, so a title reads before what it names
  const Frame = inline ? "span" : "div";
  return (
    <StageContext.Provider value={stageValue}>
      <Frame
        ref={stage as RefObject<HTMLDivElement>}
        className={cn("relative", display, className)}
      >
        {Object.entries(parts).map(([name, part]) => (
          <PartLayer
            key={name}
            name={name}
            register={register}
            measure={measurePart}
          >
            {part}
          </PartLayer>
        ))}
        {box}
      </Frame>
    </StageContext.Provider>
  );
}
