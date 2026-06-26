/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type SVGProps,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type SpringOptions,
} from "motion/react";

import { cn } from "@/lib/utils";

export type UserCursorTrigger = "always" | "hover" | "press";

export type UserCursorMode =
  | "default"
  | "text"
  | "not-allowed"
  | "grab"
  | "grabbing"
  | "wait";

export interface UserCursorClassNames {
  root?: string;
  cursor?: string;
  arrow?: string;
  label?: string;
  labelText?: string;
}

export interface UserCursorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode;
  name?: string;
  arrow?: ReactNode | ((color: string) => ReactNode);
  label?: ReactNode;
  color?: string;
  textColor?: string;
  size?: number;
  tilt?: number;
  directionAwareTilt?: boolean;
  labelTiltStrength?: number;
  /** Max lean (degrees) for the text I-beam when adaptToNativeCursor + directionAwareTilt. */
  textTiltStrength?: number;
  trigger?: UserCursorTrigger;
  showLabel?: boolean;
  hideNativeCursor?: boolean;
  fullScreen?: boolean;
  /** Morph glyph on inputs / cursor-* utilities. Off by default for site-wide use. */
  adaptToNativeCursor?: boolean;
  spring?: SpringOptions;
  labelSpring?: SpringOptions;
  /** Arrow tracks the pointer directly — label keeps spring lag. */
  followInstant?: boolean;
  offset?: { x?: number; y?: number };
  labelOffset?: { x?: number; y?: number };
  pressScale?: number;
  classNames?: UserCursorClassNames;
  hideOnTouch?: boolean;
  hideOnReducedMotion?: boolean;
  zIndex?: number;
}

interface GlyphProps extends SVGProps<SVGSVGElement> {
  color: string;
  size: number;
}

const ArrowGlyph = ({ color, size, ...rest }: GlyphProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    style={{ filter: "drop-shadow(0 1.5px 2.5px rgba(0,0,0,0.22))" }}
    {...rest}
  >
    <path
      d="M5.2 3.4c-.7-.3-1.5.4-1.2 1.1l5.7 14.8c.3.8 1.5.8 1.8 0l2.4-6 6-2.4c.8-.3.8-1.5 0-1.8L5.2 3.4Z"
      fill={color}
      stroke="rgba(255,255,255,0.42)"
      strokeWidth={1.35}
      strokeLinejoin="round"
      paintOrder="stroke fill"
    />
  </svg>
);

const TextGlyph = ({ color, size, ...rest }: GlyphProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    {...rest}
  >
    <path
      d="M12 4.5v15"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
    />
    <path
      d="M8 4.5h8"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
    />
    <path
      d="M8 19.5h8"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
    />
  </svg>
);

const NotAllowedGlyph = ({ color, size, ...rest }: GlyphProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    {...rest}
  >
    <circle
      cx={12}
      cy={12}
      r={9}
      fill={color}
      fillOpacity={0.18}
      stroke={color}
      strokeWidth={1.4}
    />
    <path
      d="M7.5 7.5l9 9"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </svg>
);

const GrabGlyph = ({
  color,
  size,
  closed,
  ...rest
}: GlyphProps & { closed?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    {...rest}
  >
    <path
      d={
        closed
          ? "M8 10.5V8.5c0-.8.7-1.5 1.5-1.5.5 0 .9.2 1.2.6.3-.4.7-.6 1.2-.6.8 0 1.5.7 1.5 1.5v2h.5c.8 0 1.5.7 1.5 1.5v3.5c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4v-3c0-.8.7-1.5 1.5-1.5h.5Z"
          : "M8 10V8c0-1.1.9-2 2-2 .6 0 1.1.3 1.5.7.4-.4.9-.7 1.5-.7 1.1 0 2 .9 2 2v2h1c1.1 0 2 .9 2 2v3c0 2.8-2.2 5-5 5h-1c-2.8 0-5-2.2-5-5v-2.5c0-1.1.9-2 2-2h.5Z"
      }
      fill={color}
      stroke="rgba(0,0,0,0.16)"
      strokeWidth={1.1}
      strokeLinejoin="round"
    />
  </svg>
);

const WaitGlyph = ({ color, size, ...rest }: GlyphProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    {...rest}
  >
    <circle
      cx={12}
      cy={12}
      r={9}
      stroke={color}
      strokeOpacity={0.25}
      strokeWidth={2}
    />
    <path
      d="M12 3a9 9 0 0 1 9 9"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

const DEFAULT_SPRING: SpringOptions = {
  stiffness: 380,
  damping: 32,
  mass: 0.6,
};

const DEFAULT_LABEL_SPRING: SpringOptions = {
  stiffness: 220,
  damping: 26,
  mass: 0.7,
};

const ARROW_NATURAL_DEG = -138;
const VELOCITY_FULL = 600;
const VELOCITY_MIN = 40;

const TEXT_FIELD_SELECTOR =
  "input:not([type=button]):not([type=submit]):not([type=reset]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]), textarea, select, [contenteditable='true']";

const DISABLED_SELECTOR =
  ":disabled, [aria-disabled='true'], [data-disabled='true']";

const ADAPT_GLYPH_MODES: UserCursorMode[] = [
  "default",
  "text",
  "not-allowed",
  "grab",
  "grabbing",
  "wait",
];

const CURSOR_CLASS_MODES: ReadonlyArray<[RegExp, UserCursorMode]> = [
  [/\bcursor-not-allowed\b/, "not-allowed"],
  [/\bcursor-no-drop\b/, "not-allowed"],
  [/\bcursor-grabbing\b/, "grabbing"],
  [/\bcursor-grab\b/, "grab"],
  [/\bcursor-wait\b/, "wait"],
  [/\bcursor-progress\b/, "wait"],
  [/\bcursor-text\b/, "text"],
  [/\bcursor-cell\b/, "text"],
];

const getElementClassName = (el: Element) => {
  const className = el.className;
  if (typeof className === "string") return className;
  if (className && typeof className === "object" && "baseVal" in className) {
    return className.baseVal;
  }
  return "";
};

const modeFromClassName = (className: string) => {
  for (const [pattern, mode] of CURSOR_CLASS_MODES) {
    if (pattern.test(className)) return mode;
  }
  return null;
};

const nearestClassMode = (start: Element) => {
  let el: Element | null = start;
  while (el) {
    const classMode = modeFromClassName(getElementClassName(el));
    if (classMode) return classMode;
    el = el.parentElement;
  }
  return null;
};

/** DOM rules only — getComputedStyle reads `none` while native cursor is hidden. */
const resolveCursorMode = (x: number, y: number): UserCursorMode => {
  const target = document.elementFromPoint(x, y);
  if (!target?.isConnected) return "default";

  const hit = target instanceof Element ? target : target.parentElement;
  if (!hit) return "default";

  if (hit.closest(DISABLED_SELECTOR)) return "not-allowed";

  const classMode = nearestClassMode(hit);
  if (classMode) return classMode;

  if (hit.closest(TEXT_FIELD_SELECTOR)) return "text";

  return "default";
};

const applyNativeCursorLock = (enabled: boolean) => {
  const root = document.documentElement;
  const body = document.body;

  if (enabled) {
    root.classList.add("sola-custom-cursor");
    root.style.cursor = "none";
    body.style.cursor = "none";
    return;
  }

  root.classList.remove("sola-custom-cursor");
  root.style.removeProperty("cursor");
  body.style.removeProperty("cursor");
};

const restingTiltForMode = (mode: UserCursorMode, baseTilt: number) => {
  switch (mode) {
    case "text":
    case "not-allowed":
    case "wait":
      return 0;
    case "grab":
    case "grabbing":
      return -4;
    default:
      return baseTilt;
  }
};

const glyphHotspot = (mode: UserCursorMode, size: number) => {
  if (mode === "text") {
    return { x: -size * 0.5, y: -size * 0.5 };
  }
  return { x: 0, y: 0 };
};

const normalizeDelta = (delta: number) => ((delta + 540) % 360) - 180;

const velocityBlend = (speed: number) =>
  Math.min(1, (speed - VELOCITY_MIN) / (VELOCITY_FULL - VELOCITY_MIN));

const computeArrowTilt = (
  vx: number,
  vy: number,
  baseTilt: number,
  directionAware: boolean,
) => {
  if (!directionAware) return baseTilt;

  const speed = Math.hypot(vx, vy);
  if (speed < VELOCITY_MIN) return baseTilt;

  const k = velocityBlend(speed);
  const dir = (Math.atan2(vy, vx) * 180) / Math.PI;
  const target = dir - ARROW_NATURAL_DEG;
  const delta = normalizeDelta(target - baseTilt);
  return baseTilt + delta * k;
};

const computeAdaptGlyphRotate = (
  vx: number,
  vy: number,
  mode: UserCursorMode,
  baseTilt: number,
  directionAware: boolean,
  textTiltStrength: number,
) => {
  const resting = restingTiltForMode(mode, baseTilt);
  if (!directionAware) return resting;

  const speed = Math.hypot(vx, vy);
  if (speed < VELOCITY_MIN) return resting;

  const k = velocityBlend(speed);

  if (mode === "text") {
    const horizShare = Math.abs(vx) / (speed + 1e-3);
    const vertShare = Math.abs(vy) / (speed + 1e-3);
    return (
      Math.sign(vx) * horizShare * textTiltStrength * k +
      Math.sign(vy) * vertShare * textTiltStrength * 0.4 * k
    );
  }

  if (mode === "default") {
    return computeArrowTilt(vx, vy, baseTilt, true);
  }

  if (mode === "grab" || mode === "grabbing") {
    const horizShare = Math.abs(vx) / (speed + 1e-3);
    return resting + Math.sign(vx) * horizShare * 14 * k;
  }

  return resting;
};

const renderGlyphForMode = (
  mode: UserCursorMode,
  color: string,
  size: number,
  arrow?: UserCursorProps["arrow"],
) => {
  if (typeof arrow === "function" && mode === "default") {
    return arrow(color);
  }
  if (arrow && mode === "default") return arrow;

  switch (mode) {
    case "text":
      return <TextGlyph color={color} size={size} />;
    case "not-allowed":
      return <NotAllowedGlyph color={color} size={size} />;
    case "grab":
      return <GrabGlyph color={color} size={size} />;
    case "grabbing":
      return <GrabGlyph color={color} size={size} closed />;
    case "wait":
      return <WaitGlyph color={color} size={size} />;
    default:
      return <ArrowGlyph color={color} size={size} />;
  }
};

const UserCursor = forwardRef<HTMLDivElement, UserCursorProps>(
  function UserCursor(
    {
      children,
      name = "Sophie",
      arrow,
      label,
      color = "#F39C2A",
      textColor = "#ffffff",
      size = 28,
      tilt = -14,
      directionAwareTilt = false,
      labelTiltStrength = 8,
      textTiltStrength = 22,
      trigger = "hover",
      showLabel = true,
      hideNativeCursor = true,
      fullScreen = false,
      adaptToNativeCursor = false,
      spring,
      labelSpring,
      followInstant = false,
      offset,
      labelOffset,
      pressScale = 0.92,
      classNames,
      hideOnTouch = true,
      hideOnReducedMotion = true,
      zIndex = 9999,
      className,
      style,
      onPointerEnter,
      onPointerLeave,
      onPointerMove,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const surfaceRef = useRef<HTMLDivElement | null>(null);
    const cursorModeRef = useRef<UserCursorMode>("default");
    const [visible, setVisible] = useState(trigger === "always");
    const [pressed, setPressed] = useState(false);
    const [coarsePointer, setCoarsePointer] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [cursorMode, setCursorMode] = useState<UserCursorMode>("default");

    const updateCursorMode = useCallback(
      (x: number, y: number) => {
        if (!adaptToNativeCursor) return;
        const nextMode = resolveCursorMode(x, y);
        if (nextMode === cursorModeRef.current) return;
        cursorModeRef.current = nextMode;
        setCursorMode(nextMode);
      },
      [adaptToNativeCursor],
    );

    const offsetX = offset?.x ?? 0;
    const offsetY = offset?.y ?? 0;
    const labelOffsetX = labelOffset?.x ?? size * 0.9;
    const labelOffsetY = labelOffset?.y ?? size * 0.2 + 6;
    const activeMode = adaptToNativeCursor ? cursorMode : "default";
    const hotspot = adaptToNativeCursor ? glyphHotspot(activeMode, size) : { x: 0, y: 0 };

    const cursorSpring = { ...DEFAULT_SPRING, ...spring };
    const pillSpring = { ...DEFAULT_LABEL_SPRING, ...labelSpring };

    const rawX = useMotionValue(-9999);
    const rawY = useMotionValue(-9999);

    const cursorX = useSpring(rawX, cursorSpring);
    const cursorY = useSpring(rawY, cursorSpring);
    const labelX = useSpring(rawX, pillSpring);
    const labelY = useSpring(rawY, pillSpring);

    const velocityX = useVelocity(rawX);
    const velocityY = useVelocity(rawY);
    const tiltVelocitySpring = followInstant
      ? { stiffness: 520, damping: 38, mass: 0.28 }
      : { stiffness: 120, damping: 26, mass: 0.5 };

    const smoothVx = useSpring(velocityX, tiltVelocitySpring);
    const smoothVy = useSpring(velocityY, tiltVelocitySpring);

    const glyphRotate = useTransform([smoothVx, smoothVy], ([vx, vy]) => {
      if (adaptToNativeCursor) {
        return computeAdaptGlyphRotate(
          vx,
          vy,
          activeMode,
          tilt,
          directionAwareTilt,
          textTiltStrength,
        );
      }
      return computeArrowTilt(vx, vy, tilt, directionAwareTilt);
    });

    const labelRotate = useTransform([smoothVx, smoothVy], ([vx, vy]) => {
      if (!directionAwareTilt || activeMode !== "default") return 0;
      const speed = Math.hypot(vx, vy);
      if (speed < VELOCITY_MIN) return 0;
      const k = velocityBlend(speed);
      const horizShare = Math.abs(vx) / (speed + 1e-3);
      return (
        Math.sign(vy) * horizShare * labelTiltStrength * k +
        Math.sign(vx) * (1 - horizShare) * (labelTiltStrength * 0.4) * k
      );
    });

    const tiltRotateSpring = followInstant
      ? { stiffness: 480, damping: 34, mass: 0.3 }
      : { stiffness: 220, damping: 24, mass: 0.5 };

    const smoothGlyphRotate = useSpring(glyphRotate, tiltRotateSpring);
    const smoothLabelRotate = useSpring(
      labelRotate,
      followInstant
        ? { stiffness: 400, damping: 30, mass: 0.35 }
        : { stiffness: 160, damping: 22, mass: 0.6 },
    );

    const disabled = coarsePointer || reducedMotion;
    const restingTilt = restingTiltForMode(activeMode, tilt);
    const labelVisible = showLabel && activeMode === "default";

    const renderedArrow =
      typeof arrow === "function" ? arrow(color) : (arrow ?? <ArrowGlyph color={color} size={size} />);

    useEffect(() => {
      if (typeof window === "undefined") return;

      const coarseMq = window.matchMedia("(pointer: coarse)");
      const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

      const updateCoarse = () =>
        setCoarsePointer(hideOnTouch && coarseMq.matches);
      const updateMotion = () =>
        setReducedMotion(hideOnReducedMotion && motionMq.matches);

      updateCoarse();
      updateMotion();

      coarseMq.addEventListener("change", updateCoarse);
      motionMq.addEventListener("change", updateMotion);

      return () => {
        coarseMq.removeEventListener("change", updateCoarse);
        motionMq.removeEventListener("change", updateMotion);
      };
    }, [hideOnTouch, hideOnReducedMotion]);

    useLayoutEffect(() => {
      if (typeof document === "undefined" || disabled) return;
      if (!fullScreen || !hideNativeCursor) return;

      applyNativeCursorLock(true);
      return () => applyNativeCursorLock(false);
    }, [disabled, fullScreen, hideNativeCursor]);

    useEffect(() => {
      if (!fullScreen || disabled) return;

      const move = (e: PointerEvent) => {
        rawX.set(e.clientX + offsetX);
        rawY.set(e.clientY + offsetY);
        updateCursorMode(e.clientX, e.clientY);

        if (trigger === "always") return;
        if (!visible) setVisible(true);
      };

      const down = () => {
        setPressed(true);
        if (trigger === "press") setVisible(true);
      };

      const up = () => {
        setPressed(false);
        if (trigger === "press") setVisible(false);
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerdown", down);
      window.addEventListener("pointerup", up);

      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
      };
    }, [
      fullScreen,
      disabled,
      offsetX,
      offsetY,
      rawX,
      rawY,
      trigger,
      visible,
      updateCursorMode,
    ]);

    const handlePointerEnter = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!fullScreen && trigger !== "always") setVisible(true);
        onPointerEnter?.(e);
      },
      [fullScreen, trigger, onPointerEnter],
    );

    const handlePointerLeave = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!fullScreen && trigger !== "always") setVisible(false);
        setPressed(false);
        onPointerLeave?.(e);
      },
      [fullScreen, trigger, onPointerLeave],
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (fullScreen) {
          onPointerMove?.(e);
          return;
        }
        const rect = surfaceRef.current?.getBoundingClientRect();
        if (rect) {
          rawX.set(e.clientX - rect.left + offsetX);
          rawY.set(e.clientY - rect.top + offsetY);
        }
        updateCursorMode(e.clientX, e.clientY);
        onPointerMove?.(e);
      },
      [fullScreen, offsetX, offsetY, onPointerMove, rawX, rawY, updateCursorMode],
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        setPressed(true);
        if (trigger === "press") setVisible(true);
        onPointerDown?.(e);
      },
      [trigger, onPointerDown],
    );

    const handlePointerUp = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        setPressed(false);
        if (trigger === "press" && !fullScreen) setVisible(false);
        onPointerUp?.(e);
      },
      [trigger, fullScreen, onPointerUp],
    );

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        surfaceRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    const surfaceStyle: CSSProperties = {
      ...(hideNativeCursor && !disabled && !fullScreen
        ? { cursor: "none" }
        : null),
      ...style,
    };

    const layerStyle: CSSProperties = fullScreen
      ? { position: "fixed", inset: 0, pointerEvents: "none", zIndex }
      : { position: "absolute", inset: 0, pointerEvents: "none", zIndex };

    const showCursor = !disabled && visible;

    if (disabled) {
      return children ? (
        <div className={className} style={style} {...rest}>
          {children}
        </div>
      ) : null;
    }

    return (
      <div
        ref={setRefs}
        className={cn(
          "relative",
          fullScreen ? "contents" : null,
          classNames?.root,
          className,
        )}
        style={surfaceStyle}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        {...rest}
      >
        {children}

        <div style={layerStyle} aria-hidden>
          <AnimatePresence>
            {showCursor && (
              <>
                <motion.div
                  key="user-cursor-body"
                  className={cn(
                    "absolute left-0 top-0 select-none will-change-transform",
                    classNames?.cursor,
                  )}
                  style={{
                    x: followInstant ? rawX : cursorX,
                    y: followInstant ? rawY : cursorY,
                    rotate: directionAwareTilt
                      ? smoothGlyphRotate
                      : restingTilt,
                  }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    scale: pressed ? pressScale : 1,
                  }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className={cn("block origin-center", classNames?.arrow)}
                    animate={{ x: hotspot.x, y: hotspot.y }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 30,
                      mass: 0.5,
                    }}
                  >
                    {adaptToNativeCursor ? (
                      <div
                        className="relative"
                        style={{ width: size, height: size }}
                      >
                        {ADAPT_GLYPH_MODES.map((mode) => (
                          <motion.div
                            key={mode}
                            className="absolute inset-0 origin-center"
                            initial={false}
                            animate={{
                              opacity: activeMode === mode ? 1 : 0,
                              scale: activeMode === mode ? 1 : 0.94,
                            }}
                            transition={{
                              opacity: {
                                duration: 0.16,
                                ease: [0.23, 1, 0.32, 1],
                              },
                              scale: {
                                duration: 0.16,
                                ease: [0.23, 1, 0.32, 1],
                              },
                            }}
                            style={{ pointerEvents: "none" }}
                            aria-hidden={activeMode !== mode}
                          >
                            {renderGlyphForMode(mode, color, size, arrow)}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ width: size, height: size }}>{renderedArrow}</div>
                    )}
                  </motion.div>
                </motion.div>

                {showLabel && (
                  <motion.div
                    key="user-cursor-label"
                    className={cn(
                      "absolute left-0 top-0 select-none will-change-transform",
                      classNames?.label,
                    )}
                    style={{
                      x: labelX,
                      y: labelY,
                      rotate: directionAwareTilt ? smoothLabelRotate : 0,
                    }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{
                      opacity: labelVisible ? 1 : 0,
                      scale: labelVisible
                        ? pressed
                          ? pressScale
                          : 1
                        : 0.92,
                    }}
                    transition={{
                      opacity: {
                        duration: 0.18,
                        ease: [0.23, 1, 0.32, 1],
                      },
                      scale: {
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                        mass: 0.45,
                      },
                    }}
                  >
                    {label ?? (
                      <div
                        className={cn(
                          "inline-flex items-center rounded-full font-medium leading-none",
                          classNames?.labelText,
                        )}
                        style={
                          {
                            background: color,
                            color: textColor,
                            fontSize: `${Math.max(8, size * 0.34)}px`,
                            paddingInline: `${size * 0.3}px`,
                            paddingBlock: `${size * 0.11}px`,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            transform: `translate(${labelOffsetX}px, ${labelOffsetY}px)`,
                          } as CSSProperties
                        }
                      >
                        {name}
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
);

export default UserCursor;