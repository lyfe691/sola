import * as React from "react";
import {
  useReducedMotion,
  useSpring,
  type MotionProps,
  type MotionStyle,
} from "motion/react";

type Intensity = "subtle" | "default" | "bold";

type SilentMotionProfile = {
  translate: number;
  hoverScale: number;
  pressScale: number;
};

const intensityMap: Record<Intensity, SilentMotionProfile> = {
  subtle: { translate: 1.25, hoverScale: 0.004, pressScale: 0.012 },
  default: { translate: 1.75, hoverScale: 0.007, pressScale: 0.016 },
  bold: { translate: 2.25, hoverScale: 0.01, pressScale: 0.022 },
};

const springConfig = { stiffness: 420, damping: 32, mass: 0.6 } as const;

export interface SilentMotionOptions {
  /**
   * Choose how dramatic the hover/press effect should feel.
   * @default "default"
   */
  intensity?: Intensity;
  /**
   * Override the resolved profile for finer control.
   */
  profile?: Partial<SilentMotionProfile>;
  /**
   * Disable the motion entirely (for static surfaces or when nested motion would conflict).
   */
  disabled?: boolean;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useSilentMotion(
  { intensity = "default", profile: profileOverride, disabled = false }: SilentMotionOptions = {},
  userStyle?: MotionStyle,
): MotionProps {
  const shouldReduceMotion = useReducedMotion();
  const isDisabled = shouldReduceMotion || disabled;

  const profile = React.useMemo(() => {
    const baseProfile = intensityMap[intensity] ?? intensityMap.default;
    return {
      translate: profileOverride?.translate ?? baseProfile.translate,
      hoverScale: profileOverride?.hoverScale ?? baseProfile.hoverScale,
      pressScale: profileOverride?.pressScale ?? baseProfile.pressScale,
    } satisfies SilentMotionProfile;
  }, [intensity, profileOverride]);

  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  const hoveredRef = React.useRef(false);
  const pressedRef = React.useRef(false);

  const mergeStyle = React.useMemo(() => {
    if (isDisabled) {
      return userStyle;
    }

    return userStyle
      ? ({ ...userStyle, x, y, scale } satisfies MotionStyle)
      : ({ x, y, scale } satisfies MotionStyle);
  }, [isDisabled, scale, userStyle, x, y]);

  const reset = React.useCallback(() => {
    hoveredRef.current = false;
    pressedRef.current = false;
    x.set(0);
    y.set(0);
    scale.set(1);
  }, [scale, x, y]);

  type MotionPointerEvent = Parameters<NonNullable<MotionProps["onPointerMove"]>>[0];

  const updateFromEvent = React.useCallback(
    (event: MotionPointerEvent) => {
      if (isDisabled) return;
      const target = event.currentTarget as HTMLElement | null;
      if (!target) return;
      const { left, top, width, height } = target.getBoundingClientRect();
      const relativeX = clamp(((event.clientX - left) / width - 0.5) * 2, -1, 1);
      const relativeY = clamp(((event.clientY - top) / height - 0.5) * 2, -1, 1);

      x.set(relativeX * profile.translate);
      y.set(relativeY * profile.translate);

      if (!pressedRef.current) {
        scale.set(1 + profile.hoverScale);
      }
    },
    [isDisabled, profile.hoverScale, profile.translate, scale, x, y],
  );

  const handlePointerMove = React.useCallback<NonNullable<MotionProps["onPointerMove"]>>(
    (event) => {
      if (isDisabled) return;
      hoveredRef.current = true;
      updateFromEvent(event);
    },
    [isDisabled, updateFromEvent],
  );

  const handlePointerEnter = React.useCallback<NonNullable<MotionProps["onPointerEnter"]>>(
    (event) => {
      if (isDisabled) return;
      hoveredRef.current = true;
      updateFromEvent(event as MotionPointerEvent);
    },
    [isDisabled, updateFromEvent],
  );

  const handlePointerLeave = React.useCallback<NonNullable<MotionProps["onPointerLeave"]>>(
    () => {
      if (isDisabled) return;
      reset();
    },
    [isDisabled, reset],
  );

  const handlePointerDown = React.useCallback<NonNullable<MotionProps["onPointerDown"]>>(
    (event) => {
      if (isDisabled) return;
      pressedRef.current = true;
      updateFromEvent(event as MotionPointerEvent);
      scale.set(1 - profile.pressScale);
    },
    [isDisabled, profile.pressScale, scale, updateFromEvent],
  );

  const handlePointerUp = React.useCallback<NonNullable<MotionProps["onPointerUp"]>>(
    () => {
      if (isDisabled) return;
      pressedRef.current = false;
      scale.set(hoveredRef.current ? 1 + profile.hoverScale : 1);
    },
    [isDisabled, profile.hoverScale, scale],
  );

  const handlePointerCancel = React.useCallback<NonNullable<MotionProps["onPointerCancel"]>>(
    () => {
      if (isDisabled) return;
      reset();
    },
    [isDisabled, reset],
  );

  const handleFocus = React.useCallback<NonNullable<MotionProps["onFocus"]>>(() => {
    if (isDisabled) return;
    hoveredRef.current = true;
    if (!pressedRef.current) {
      scale.set(1 + profile.hoverScale);
    }
  }, [isDisabled, profile.hoverScale, scale]);

  const handleBlur = React.useCallback<NonNullable<MotionProps["onBlur"]>>(() => {
    if (isDisabled) return;
    reset();
  }, [isDisabled, reset]);

  if (isDisabled) {
    return { style: mergeStyle };
  }

  return {
    style: mergeStyle,
    onPointerMoveCapture: handlePointerMove,
    onPointerEnterCapture: handlePointerEnter,
    onPointerLeaveCapture: handlePointerLeave,
    onPointerLeave: handlePointerLeave,
    onPointerDownCapture: handlePointerDown,
    onPointerUpCapture: handlePointerUp,
    onPointerCancelCapture: handlePointerCancel,
    onFocus: handleFocus,
    onBlur: handleBlur,
  } satisfies MotionProps;
}
