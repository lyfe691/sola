/**
 * Copyright (c) 2025 Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * The breakpoint at which the layout is considered mobile
 * Matches Tailwind's md breakpoint (768px)
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the current viewport is mobile width
 * @returns {boolean} True if the viewport width is less than MOBILE_BREAKPOINT
 */
export function useIsMobile(): boolean {
  // Initial state is undefined - we'll determine actual value on mount
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  
  // Memoize the query to avoid recreating it on each render
  const mediaQuery = useMemo(
    () => `(max-width: ${MOBILE_BREAKPOINT - 1}px)`, 
    []
  );

  // Handle window resize
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  // Set up the event listener on mount
  useEffect(() => {
    // Initial state setting
    handleResize();
    
    // Watch for media query changes
    const mql = window.matchMedia(mediaQuery);
    
    // Modern API for matchMedia listeners
    mql.addEventListener("change", handleResize);
    
    // Also listen to resize events for more responsive updates
    window.addEventListener("resize", handleResize);
    
    // Cleanup listeners on unmount
    return () => {
      mql.removeEventListener("change", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [mediaQuery, handleResize]);

  // Convert to boolean with nullish fallback
  // If we haven't measured the window yet, we assume it's not mobile
  return windowWidth !== null ? windowWidth < MOBILE_BREAKPOINT : false;
}
