/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'motion/react';

/**
 * Smooth scroll-based animation system with consistent timing and easing
 */

// Page transition variants (for route changes) - optimized for smoother scroll animations
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 }
};

export const pageTransition = { 
  duration: 0.2,
  ease: [0.25, 0.1, 0.25, 1] as const
};

// SMOOTH SCROLL ANIMATION VARIANTS
// Using consistent timing and smooth easing for all animations

const smoothTransition = {
  duration: 0.8,
  ease: [0.25, 0.1, 0.25, 1] as const, // Custom cubic-bezier for smooth motion
};

const fastTransition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

// Main scroll animation variant - smooth and consistent
export const scrollRevealVariants = {
  hidden: { 
    opacity: 0, 
    y: 24,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: smoothTransition
  }
};

// For titles - slightly more dramatic
export const scrollTitleVariants = {
  hidden: { 
    opacity: 0, 
    y: 32,
    scale: 0.96
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: smoothTransition
  }
};

// For subtle animations - faster and lighter
export const scrollSubtleVariants = {
  hidden: { 
    opacity: 0, 
    y: 16
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: fastTransition
  }
};

// For containers with staggered children
export const scrollContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
      duration: 0.3
    }
  }
};

// For items within staggered containers
export const scrollChildVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: fastTransition
  }
};

// OPTIMIZED SCROLL ANIMATION HOOK
export const useScrollAnimation = (options?: {
  threshold?: number;
  once?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: options?.threshold || 0.3, // Trigger when 30% is visible
    once: options?.once ?? true
  });

  return { ref, isInView };
};

// Hook with delay for staggered animations
export const useScrollAnimationWithDelay = (
  delay: number = 0,
  options?: {
    threshold?: number;
    once?: boolean;
  }
) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: options?.threshold || 0.3,
    once: options?.once ?? true
  });

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isInView && !shouldAnimate) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInView, shouldAnimate, delay]);

  return { ref, isInView: shouldAnimate };
};

// LEGACY VARIANTS (keeping for compatibility)
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } }
};

export const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  })
};

export const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
};

// Page initialize hook utility (legacy)
export const usePageInit = (delay = 100) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);
  
  return isLoaded;
};

