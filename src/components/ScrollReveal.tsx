/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from 'react';
import { motion, Variants } from 'motion/react';
import { 
  useScrollAnimation,
  useScrollAnimationWithDelay,
  scrollRevealVariants,
  scrollTitleVariants,
  scrollSubtleVariants,
  scrollContainerVariants,
  scrollChildVariants
} from '@/utils/transitions';

interface ScrollRevealProps {
  children: React.ReactNode;
  /**
   * Animation variant to use
   */
  variant?: 'default' | 'title' | 'subtle' | 'container' | 'child';
  /**
   * Custom animation variants
   */
  customVariants?: Variants;
  /**
   * CSS class names
   */
  className?: string;
  /**
   * Animation options
   */
  options?: {
    threshold?: number;
    once?: boolean;
  };
  /**
   * Delay before animation starts (in milliseconds)
   */
  delay?: number;
  /**
   * HTML element to render as
   */
  as?: keyof React.JSX.IntrinsicElements;
}

const variantMap = {
  default: scrollRevealVariants,
  title: scrollTitleVariants,
  subtle: scrollSubtleVariants,
  container: scrollContainerVariants,
  child: scrollChildVariants,
};

/**
 * ScrollReveal component that smoothly animates content when it comes into view
 * Uses optimized intersection observer settings for smooth performance
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'default',
  customVariants,
  className = '',
  options,
  delay = 0,
  as: Component = 'div'
}) => {
  // Use delay hook if delay is specified, otherwise use regular hook
  const { ref, isInView } = delay > 0 
    ? useScrollAnimationWithDelay(delay, options)
    : useScrollAnimation(options);

  const variants = customVariants || variantMap[variant];
  const MotionComponent = motion[Component] as any;

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