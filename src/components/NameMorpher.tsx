/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

export const NameMorpher = ({ greeting }: { greeting: string }) => {
  const names = ["Yanis", "Sebastian", "lyfe691"]; 
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNameIndex((prev) => (prev + 1) % names.length);
    }, 3200);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentName = names[currentNameIndex];
  
  const letterVariants = {
    initial: {
      opacity: 0,
      x: 25,
      y: 8,
      rotateX: 30, 
      rotateY: -60,
      scale: 0.85,
      filter: "blur(4px)"
    },
    animate: (custom: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        // Spring for transform properties
        x: { type: "spring", stiffness: 300, damping: 20, delay: custom * 0.055 },
        y: { type: "spring", stiffness: 300, damping: 20, delay: custom * 0.055 },
        rotateX: { type: "spring", stiffness: 250, damping: 20, delay: custom * 0.055 },
        rotateY: { type: "spring", stiffness: 250, damping: 20, delay: custom * 0.055 },
        scale: { type: "spring", stiffness: 280, damping: 18, delay: custom * 0.055 },
        // Ease for opacity and filter
        opacity: { duration: 0.3, ease: "easeIn", delay: custom * 0.05 }, 
        filter: { duration: 0.3, ease: "easeIn", delay: custom * 0.05 },
      },
    }),
    exit: (custom: number) => ({
      opacity: 0,
      x: -25,
      y: -8,
      rotateX: -30,
      rotateY: 60,
      scale: 0.85,
      filter: "blur(4px)",
      transition: {
        // Using ease for exit for a quicker, cleaner departure
        x: { duration: 0.35, ease: [0.76, 0, 0.24, 1], delay: custom * 0.035 },
        y: { duration: 0.35, ease: [0.76, 0, 0.24, 1], delay: custom * 0.035 },
        rotateX: { duration: 0.35, ease: [0.76, 0, 0.24, 1], delay: custom * 0.035 },
        rotateY: { duration: 0.35, ease: [0.76, 0, 0.24, 1], delay: custom * 0.035 },
        scale: { duration: 0.35, ease: [0.76, 0, 0.24, 1], delay: custom * 0.035 },
        opacity: { duration: 0.25, ease: "easeOut", delay: custom * 0.03 },
        filter: { duration: 0.25, ease: "easeOut", delay: custom * 0.03 },
      },
    }),
  };

  return (
    <>
      <span className="text-foreground inline-block">{greeting}</span>
      <motion.span 
        className="relative inline-block overflow-hidden align-baseline"
        initial={false}
        animate={{ 
          width: `${currentName.length * 0.60}em`, // Further reduced multiplier
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
        style={{ 
          display: "inline-flex", 
          justifyContent: "center", 
          padding: "0.1em 0.1em", // Further reduced horizontal padding
          borderRadius: "0.25em", 
          backgroundColor: "hsl(var(--muted) / 0.65)", 
          verticalAlign: "baseline"
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={currentName}
            initial={{ opacity: 0.9, y: 5 }} 
            animate={{ opacity: 1, y: 0}}
            exit={{ opacity: 0.9, y: -5 }} 
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex"
            style={{ perspective: "500px" }} 
          >
            {currentName.split('').map((letter, index) => (
              <motion.span
                key={`${currentName}-${index}`}
                variants={letterVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={index} 
                className="text-primary inline-block"
                style={{
                  textShadow: "0 0 12px hsl(var(--primary) / 0.2)", 
                  willChange: "transform, opacity, filter"
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.span>
    </>
  );
};