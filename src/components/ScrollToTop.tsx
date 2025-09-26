/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react"

const SCROLL_THRESHOLD = 100; // px
const SCROLL_DEBOUNCE_DELAY = 100; // ms

// render
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const handleScroll = useCallback(() => {
    if (window.pageYOffset > SCROLL_THRESHOLD) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

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
