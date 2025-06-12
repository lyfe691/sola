/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { useState, useEffect } from 'react';

/**
 * common animation variants and transitions used throughout the website
 * these can be importted and used with framer motion components
 */

// page transition variants
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
};

//  default page transition
export const pageTransition = { 
  duration: 0.3,
  ease: "easeInOut" as const
};

// button hover animations
export const buttonHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

// fad ein animations for elements
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } }
};

// staggered list item animations
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

// Title animation variants (for consistent title animations across pages)
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

// Container variants for staggered children animations
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

// Standard item variants for content blocks
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

// Page initialize hook utility
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

