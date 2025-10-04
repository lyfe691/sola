/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from "react";
// ✅ Import motion as a runtime import (used at runtime)
import { motion } from "motion/react";
// ✅ Import Variants as a *type-only* import (required when verbatimModuleSyntax is enabled)
import type { Variants } from "motion/react";

import {
  useScrollReveal,
  scrollRevealVariants,
  scrollPageTitleVariants,
  scrollTitleVariants,
  scrollSubtleVariants,
  scrollContainerVariants,
  scrollChildVariants,
} from "@/lib/transitions";

/**
 * ScrollRevealProps - defines component props for reusability and safety
 */
interface ScrollRevealProps {
  children: React.ReactNode;

  /**
   * Animation variant preset to use.
   * 
   * - "default": Standard fade/translate animation for content.
   * - "pageTitle": Slide-in + blur for page headers.
   * - "title": Slight upward movement for section titles.
   * - "subtle": Light and fast reveal for small UI bits.
   * - "container": For wrapping multiple children with stagger.
   * - "child": For staggered elements inside a container.
   */
  variant?: "default" | "pageTitle" | "title" | "subtle" | "container" | "child";

  /**
   * Optional custom animation variants.
   * If defined, overrides the built-in variant.
   */
  customVariants?: Variants;

  /** Optional extra class names for layout/styling */
  className?: string;

  /**
   * Scroll trigger behavior configuration.
   * 
   * @param threshold - How much of the element must be visible to trigger animation (0–1)
   * @param once - Whether the animation should only play once (true by default)
   */
  options?: {
    threshold?: number;
    once?: boolean;
  };

  /** Delay before animation starts (in ms) */
  delay?: number;

  /** HTML element to render as (defaults to "div") */
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Centralized variant mapping for consistency across animations.
 * Keeps ScrollReveal flexible but predictable.
 */
const ANIMATION_VARIANTS = {
  default: scrollRevealVariants,
  pageTitle: scrollPageTitleVariants,
  title: scrollTitleVariants,
  subtle: scrollSubtleVariants,
  container: scrollContainerVariants,
  child: scrollChildVariants,
} as const;

/**
 * ScrollReveal - core animation wrapper for scroll-based reveal effects.
 * 
 * Uses IntersectionObserver via `useScrollReveal` to trigger animations
 * only when the component comes into view.
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
  // Custom hook that returns a ref + visibility boolean.
  // - ref: attach to element to observe visibility
  // - isInView: true when element has entered viewport
  const { ref, isInView } = useScrollReveal(delay, options);

  // Use provided custom variants, otherwise use preset mapping.
  const variants = customVariants || ANIMATION_VARIANTS[variant];

  const MotionComponent = motion(Component as any);

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
