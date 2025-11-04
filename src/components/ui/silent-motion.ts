import type { MotionProps } from "motion/react";

type SilentMotionOptions = {
  depth?: number;
  hover?: boolean;
  press?: boolean;
  focus?: boolean;
  reveal?: boolean;
};

const baseTransition = {
  type: "spring" as const,
  bounce: 0.18,
  duration: 0.45,
  mass: 0.65,
};

const hoverTransition = {
  type: "spring" as const,
  stiffness: 240,
  damping: 22,
  mass: 0.7,
};

const pressTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
  mass: 0.6,
};

const focusTransition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 26,
  mass: 0.65,
};

const mergeMotion = (
  base: MotionProps,
  overrides?: MotionProps,
): MotionProps => {
  if (!overrides) return base;

  return {
    ...base,
    ...overrides,
    animate: {
      ...(typeof base.animate === "object" ? base.animate : {}),
      ...(typeof overrides.animate === "object" ? overrides.animate : {}),
    },
    initial: {
      ...(typeof base.initial === "object" ? base.initial : {}),
      ...(typeof overrides.initial === "object" ? overrides.initial : {}),
    },
    whileHover: {
      ...(typeof base.whileHover === "object" ? base.whileHover : {}),
      ...(typeof overrides.whileHover === "object" ? overrides.whileHover : {}),
    },
    whileTap: {
      ...(typeof base.whileTap === "object" ? base.whileTap : {}),
      ...(typeof overrides.whileTap === "object" ? overrides.whileTap : {}),
    },
    whileFocus: {
      ...(typeof base.whileFocus === "object" ? base.whileFocus : {}),
      ...(typeof overrides.whileFocus === "object" ? overrides.whileFocus : {}),
    },
  } satisfies MotionProps;
};

export const silentMotion = (
  options: SilentMotionOptions = {},
  overrides?: MotionProps,
): MotionProps => {
  const { depth = 3, hover = true, press = true, focus = true, reveal = true } = options;

  const revealDistance = depth * 0.6;
  const motion: MotionProps = {
    animate: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: baseTransition,
    },
  };

  if (reveal) {
    motion.initial = {
      y: revealDistance,
      scale: 0.99,
      opacity: 0.92,
    };
  }

  if (hover) {
    motion.whileHover = {
      y: -depth * 0.4,
      scale: 1 + depth * 0.003,
      transition: hoverTransition,
    };
  }

  if (press) {
    motion.whileTap = {
      y: depth * 0.6,
      scale: 1 - depth * 0.005,
      transition: pressTransition,
    };
  }

  if (focus) {
    motion.whileFocus = {
      y: -depth * 0.2,
      scale: 1 + depth * 0.002,
      transition: focusTransition,
    };
  }

  return mergeMotion(motion, overrides);
};

export type { SilentMotionOptions };
