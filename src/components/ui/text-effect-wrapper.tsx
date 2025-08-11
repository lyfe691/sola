"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  type TargetAndTransition,
  type Transition,
  type Variant,
  type Variants,
} from "motion/react";
import React, { useState, useEffect, useRef } from "react";

export type PresetType = "blur" | "fade-in-blur" | "scale" | "fade" | "slide";

export type PerType = "word" | "char" | "line";

export type TextEffectProps = {
  children: string;
  per?: PerType;
  as?: keyof React.JSX.IntrinsicElements;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: PresetType;
  delay?: number;
  speedReveal?: number;
  speedSegment?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  segmentWrapperClassName?: string;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  style?: React.CSSProperties;
};

const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
  exit: { opacity: 0 },
};

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(12px)", y: 8 },
      visible: { opacity: 1, filter: "blur(0px)", y: 0 },
      exit: { opacity: 0, filter: "blur(12px)", y: 8 },
    },
  },
  "fade-in-blur": {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 15, filter: "blur(12px)" },
      visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      exit: { opacity: 0, y: 15, filter: "blur(12px)" },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 25 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -25 },
    },
  },
};

const AnimationComponent: React.FC<{
  segment: string;
  variants: Variants;
  per: "line" | "word" | "char";
  segmentWrapperClassName?: string;
}> = React.memo(({ segment, variants, per, segmentWrapperClassName }) => {
  // Render plain whitespace segments without motion to avoid spacing glitches
  if (segment.trim() === "") {
    const WrapperTag = per === "line" ? "span" : "span";
    const plainClass = per === "line" ? "block" : "inline whitespace-pre select-none";
    return (
      <span aria-hidden="true" className={plainClass}>
        {segment}
      </span>
    );
  }

  const content =
    per === "line" ? (
      <motion.span variants={variants} className="block">
        {segment}
      </motion.span>
    ) : per === "word" ? (
      <motion.span
        aria-hidden="true"
        variants={variants}
        className="inline-block whitespace-pre"
      >
        {segment}
      </motion.span>
    ) : (
      <motion.span className="inline-block whitespace-pre">
        {segment.split("").map((char, charIndex) => (
          char === " " ? (
            // render raw space without motion to prevent layout jitter
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={`space-${charIndex}`}
              aria-hidden="true"
              className="inline whitespace-pre select-none"
            >
              {char}
            </span>
          ) : (
            <motion.span
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={`char-${charIndex}`}
              aria-hidden="true"
              variants={variants}
              className="inline-block"
            >
              {char}
            </motion.span>
          )
        ))}
      </motion.span>
    );

  if (!segmentWrapperClassName) {
    return content;
  }

  const defaultWrapperClassName = per === "line" ? "block" : "inline-block";

  return (
    <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
      {content}
    </span>
  );
});

AnimationComponent.displayName = "AnimationComponent";

const splitText = (text: string, per: "line" | "word" | "char") => {
  if (per === "line") return text.split("\n");
  return text.split(/(\s+)/);
};

const hasTransition = (
  variant: Variant,
): variant is TargetAndTransition & { transition?: Transition } => {
  return (
    typeof variant === "object" && variant !== null && "transition" in variant
  );
};

const createVariantsWithTransition = (
  baseVariants: Variants,
  transition?: Transition & { exit?: Transition },
): Variants => {
  if (!transition) return baseVariants;

  const { exit: _, ...mainTransition } = transition;

  return {
    ...baseVariants,
    visible: {
      ...baseVariants.visible,
      transition: {
        ...(hasTransition(baseVariants.visible)
          ? baseVariants.visible.transition
          : {}),
        ...mainTransition,
      },
    },
    exit: {
      ...baseVariants.exit,
      transition: {
        ...(hasTransition(baseVariants.exit)
          ? baseVariants.exit.transition
          : {}),
        ...mainTransition,
        staggerDirection: -1,
      },
    },
  };
};

export function TextEffectWrapper({
  children,
  per = "word",
  as = "p",
  variants,
  className,
  preset = "fade",
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
}: TextEffectProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setPrefersReducedMotion(mql.matches);
    handler();
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);
  const segments = splitText(children, per);
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  const chosenPreset: PresetType = prefersReducedMotion ? "fade" : preset;

  const baseVariants = chosenPreset
    ? presetVariants[chosenPreset]
    : { container: defaultContainerVariants, item: defaultItemVariants };

  const stagger = defaultStaggerTimes[per] / speedReveal;

  const baseDuration = (prefersReducedMotion ? 0.15 : 0.35) / speedSegment;

  const customStagger = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition
        ?.staggerChildren
    : undefined;

  const customDelay = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition
        ?.delayChildren
    : undefined;

  const computedVariants = {
    container: createVariantsWithTransition(
      variants?.container || baseVariants.container,
      {
        staggerChildren: prefersReducedMotion ? 0 : (customStagger ?? stagger),
        delayChildren: prefersReducedMotion ? 0 : (customDelay ?? delay),
        ...containerTransition,
        exit: {
          staggerChildren: prefersReducedMotion ? 0 : (customStagger ?? stagger),
          staggerDirection: -1,
        },
      },
    ),
    item: createVariantsWithTransition(variants?.item || baseVariants.item, {
      duration: baseDuration,
      ...segmentTransition,
    }),
  };

  return (
    <MotionTag
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={computedVariants.container}
      className={className}
      onAnimationComplete={onAnimationComplete}
      onAnimationStart={onAnimationStart}
      style={style}
    >
      {per !== "line" ? <span className="sr-only">{children}</span> : null}
      {segments.map((segment, index) => (
        <AnimationComponent
          key={`${per}-${index}-${segment}`}
          segment={segment}
          variants={computedVariants.item}
          per={per}
          segmentWrapperClassName={segmentWrapperClassName}
        />
      ))}
    </MotionTag>
  );
}

export function CyclingTextEffect({
  texts,
  per = "char",
  preset = "blur",
  as = "span",
  className,
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  displayDuration = 2000,
  style,
  useCurve = true,
}: {
  texts: string[];
  per?: PerType;
  preset?: PresetType;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  speedReveal?: number;
  speedSegment?: number;
  displayDuration?: number;
  style?: React.CSSProperties;
  useCurve?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % texts.length);
    }, displayDuration);

    return () => clearInterval(interval);
  }, [texts.length, displayDuration]);

  if (texts.length === 0) return null;

  return (
    <div 
      style={style}
      className={className}
    >
      <AnimatePresence mode="wait">
        <TextEffectWrapper
          key={currentIndex}
          per={per}
          preset={preset}
          as={as || "span"}
          delay={delay}
          speedReveal={speedReveal}
          speedSegment={speedSegment}
          trigger={true}
          style={{ display: 'block' }}
        >
          {texts[currentIndex]}
        </TextEffectWrapper>
      </AnimatePresence>
    </div>
  );
} 