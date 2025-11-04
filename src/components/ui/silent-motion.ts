import * as React from "react";
import type { MotionProps } from "framer-motion";
import { useReducedMotion } from "framer-motion";

type MotionIntensity = "subtle" | "base" | "bold";

type UseSilentMotionOptions = {
  disabled?: boolean;
  intensity?: MotionIntensity;
  focus?: boolean;
};

const intensityMap: Record<MotionIntensity, { lift: number; scale: number }> = {
  subtle: { lift: 1, scale: 0.01 },
  base: { lift: 2, scale: 0.015 },
  bold: { lift: 3, scale: 0.02 },
};

const transition: MotionProps["transition"] = {
  type: "spring",
  stiffness: 520,
  damping: 32,
  mass: 0.45,
};

export const useSilentMotion = (
  { disabled, intensity = "base", focus = true }: UseSilentMotionOptions = {},
): MotionProps => {
  const prefersReducedMotion = useReducedMotion();

  return React.useMemo(() => {
    if (disabled || prefersReducedMotion) {
      return { initial: false };
    }

    const { lift, scale } = intensityMap[intensity];

    const hoverState = {
      y: -lift,
      scale: 1 + scale,
    };

    const tapState = {
      y: lift,
      scale: 1 - scale * 0.6,
    };

    const baseState: MotionProps = {
      initial: false,
      transition,
      whileHover: hoverState,
      whileTap: tapState,
    };

    if (focus) {
      baseState.whileFocus = hoverState;
    }

    return baseState;
  }, [disabled, focus, intensity, prefersReducedMotion]);
};

export type { MotionIntensity, UseSilentMotionOptions };
