/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React, { useMemo } from "react";
import { motion, type DOMMotionComponents, type Variants } from "motion/react";
import {
  useScrollReveal,
  scrollRevealVariants,
  scrollFeatureVariants,
  scrollPageTitleVariants,
  scrollTitleVariants,
  scrollSubtleVariants,
  scrollContainerVariants,
  scrollChildVariants,
} from "@/utils/transitions";

interface ScrollRevealProps {
  children: React.ReactNode;
  /**
   * Animation variant to use (all fade + a long rise on EASE_OUT_QUART)
   * - default: Standard content reveal (80px rise)
   * - feature: Full-width media cards (40px rise — big mass, less travel)
   * - pageTitle: Page headers — quickest of the set so the title lands first
   * - title: Section titles (48px rise)
   * - subtle: Small elements (32px rise, fastest)
   * - container: For sections with staggered children
   * - child: For items within staggered containers
   */
  variant?:
    | "default"
    | "feature"
    | "pageTitle"
    | "title"
    | "subtle"
    | "container"
    | "child";
  /**
   * Custom animation variants (overrides variant)
   */
  customVariants?: Variants;
  /**
   * CSS class names
   */
  className?: string;
  /**
   * Scroll trigger options
   */
  options?: {
    /** Visibility amount (0-1). Unset = trigger at top-90% of viewport */
    threshold?: number;
    /** Whether animation runs only once - defaults to true */
    once?: boolean;
  };
  /**
   * Stagger delay in milliseconds (0 for immediate)
   */
  delay?: number;
  /**
   * HTML element to render as
   */
  as?: keyof DOMMotionComponents;
}

// Variant mapping - perfectly organized
const ANIMATION_VARIANTS = {
  default: scrollRevealVariants,
  feature: scrollFeatureVariants,
  pageTitle: scrollPageTitleVariants,
  title: scrollTitleVariants,
  subtle: scrollSubtleVariants,
  container: scrollContainerVariants,
  child: scrollChildVariants,
} as const;

/**
 * ScrollReveal - The foundation of smooth scroll animations
 *
 * Perfectly tuned for consistency across the entire application.
 * Uses standardized timing, easing, and intersection observer settings.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = "default",
  customVariants,
  className = "",
  options,
  delay = 0,
  as: Component = "div",
}) => {
  const { ref, isInView } = useScrollReveal(options);

  // Apply the stagger delay (ms) natively to the variant's visible transition —
  // no bespoke timer. Reduced motion is handled globally by MotionConfig.
  const baseVariants = customVariants || ANIMATION_VARIANTS[variant];
  const variants = useMemo<Variants>(() => {
    if (!delay) return baseVariants as Variants;
    const v = baseVariants as Record<string, Record<string, unknown>>;
    const visible = v.visible ?? {};
    return {
      ...v,
      visible: {
        ...visible,
        transition: {
          ...((visible.transition as Record<string, unknown>) ?? {}),
          delay: delay / 1000,
        },
      },
    } as Variants;
  }, [baseVariants, delay]);

  // Create motion component
  const MotionComponent = motion[Component] as React.ComponentType<
    Record<string, unknown>
  >;

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

export default ScrollReveal;
