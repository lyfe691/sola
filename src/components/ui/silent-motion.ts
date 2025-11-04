import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import type { MotionProps } from "motion/react";

type Intensity = "subtle" | "default" | "bold";

type Strategy = "lift" | "depth";

export interface SilentMotionOptions {
  /**
   * Choose how dramatic the hover/press effect should feel.
   * @default "default"
   */
  intensity?: Intensity;
  /**
   * Controls the direction of the hover animation.
   * `lift` raises the element slightly, while `depth` adds a deeper press-in effect.
   * @default "lift"
   */
  strategy?: Strategy;
  /**
   * Override the default transition.
   */
  transition?: MotionProps["transition"];
  /**
   * Disable the motion entirely (for static surfaces or when nested motion would conflict).
   */
  disabled?: boolean;
}

type MotionScale = {
  hover: { y: number; scale: number };
  tap: { y: number; scale: number };
};

const intensityMap: Record<Intensity, MotionScale> = {
  subtle: {
    hover: { y: -2, scale: 1.005 },
    tap: { y: 1, scale: 0.995 },
  },
  default: {
    hover: { y: -3, scale: 1.012 },
    tap: { y: 1.75, scale: 0.985 },
  },
  bold: {
    hover: { y: -4, scale: 1.02 },
    tap: { y: 2.5, scale: 0.972 },
  },
};

const baseTransition: MotionProps["transition"] = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.6,
};

export function useSilentMotion({
  intensity = "default",
  strategy = "lift",
  transition,
  disabled = false,
}: SilentMotionOptions = {}): MotionProps {
  const shouldReduceMotion = useReducedMotion();

  return useMemo(() => {
    if (shouldReduceMotion || disabled) {
      return {};
    }

    const motionScale = intensityMap[intensity] ?? intensityMap.default;
    const hoverY = strategy === "lift" ? motionScale.hover.y : -motionScale.hover.y;

    return {
      initial: { y: 0, scale: 1 },
      whileHover: { y: hoverY, scale: motionScale.hover.scale },
      whileFocus: { y: hoverY, scale: motionScale.hover.scale },
      whileTap: { y: motionScale.tap.y, scale: motionScale.tap.scale },
      transition: transition ?? baseTransition,
    };
  }, [disabled, intensity, shouldReduceMotion, strategy, transition]);
}
