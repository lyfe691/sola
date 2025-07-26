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
 * Smooth and polished scroll animation system
 * Balanced timing for elegant user experience
 */

// CONSISTENT ANIMATION FOUNDATION
const STANDARD_EASING = [0.25, 0.1, 0.25, 1] as const; // Perfect cubic-bezier
const STANDARD_THRESHOLD = 0.15; // Trigger when 15% visible - optimal balance
const FAST_DURATION = 0.6;
const STANDARD_DURATION = 0.8;
const SMOOTH_DURATION = 1.0;

// Page transition variants - restored smooth transitions
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
};

export const pageTransition = { 
  duration: 0.5, // Much smoother page transitions
  ease: STANDARD_EASING
};

// SCROLL ANIMATION VARIANTS - Balanced and Polished

// Main scroll animation - smooth and elegant
export const scrollRevealVariants = {
  hidden: { 
    opacity: 0, 
    y: 24,
    scale: 0.97
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: STANDARD_DURATION,
      ease: STANDARD_EASING
    }
  }
};

// For page titles - clean slide from left (truly different!)
export const scrollPageTitleVariants = {
  hidden: { 
    opacity: 0,
    x: -20,
    filter: "blur(2px)"
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: SMOOTH_DURATION,
      ease: STANDARD_EASING
    }
  }
};

// For section titles - subtle upward reveal
export const scrollTitleVariants = {
  hidden: { 
    opacity: 0, 
    y: 28,
    scale: 0.96
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: STANDARD_DURATION,
      ease: STANDARD_EASING
    }
  }
};

// For subtle elements - still fast but not rushed
export const scrollSubtleVariants = {
  hidden: { 
    opacity: 0, 
    y: 16
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: FAST_DURATION,
      ease: STANDARD_EASING
    }
  }
};

// For containers - elegant staggering
export const scrollContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // More elegant staggering
      delayChildren: 0.15,
      duration: 0.4,
      ease: STANDARD_EASING
    }
  }
};

// For container children - smooth reveals
export const scrollChildVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: FAST_DURATION,
      ease: STANDARD_EASING
    }
  }
};

// PERFECTED SCROLL HOOKS - Optimized for elegance
// Unified hook to rule them all
export const useScrollReveal = (
  delay: number = 0,
  options?: {
    threshold?: number;
    once?: boolean;
  }
) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: options?.threshold || STANDARD_THRESHOLD,
    once: options?.once ?? true
  });

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (delay > 0) {
      if (isInView && !shouldAnimate) {
        const timer = setTimeout(() => {
          setShouldAnimate(true);
        }, delay);
        return () => clearTimeout(timer);
      }
    } else {
      setShouldAnimate(isInView);
    }
  }, [isInView, shouldAnimate, delay]);

  return { ref, isInView: shouldAnimate };
};


// LEGACY VARIANTS (maintaining compatibility)
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

