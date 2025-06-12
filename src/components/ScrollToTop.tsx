/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react"

const SCROLL_THRESHOLD = 100; // Pixels scrolled before showing the button
const SCROLL_DEBOUNCE_DELAY = 100; // ms

/**
 * ScrollToTop - A component that:
 * 1. Automatically scrolls to top on route change
 * 2. Provides a button to manually scroll to top when scrolled down
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    if (window.pageYOffset > SCROLL_THRESHOLD) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  // Add scroll event listener with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const debouncedScrollHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handleScroll(), SCROLL_DEBOUNCE_DELAY);
    };

    window.addEventListener("scroll", debouncedScrollHandler);
    
    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary/10 
                   border border-primary/20 backdrop-blur-sm 
                   hover:bg-primary/20 transition-colors duration-300
                   focus:outline-none focus:ring-2 focus:ring-primary/20
                   focus:ring-offset-2 focus:ring-offset-background z-50"
        >
          <ArrowUp className="w-5 h-5 text-primary" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
