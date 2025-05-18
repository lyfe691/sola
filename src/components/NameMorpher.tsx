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
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentName = names[currentNameIndex];
  
  // find the longest name to set a fixed width
  const longestName = names.reduce((a, b) => a.length > b.length ? a : b, "");
  
  return (
    <div className="relative inline-flex items-baseline">
      <span className="text-foreground">{greeting}</span>
      <span className="text-foreground">&nbsp;</span>
      <div 
        className="relative inline-block overflow-hidden" 
        style={{ 
          minWidth: `${longestName.length * 0.6}em`,
          display: "inline-flex", 
          justifyContent: "flex-start" 
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentName}
            className="inline-flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentName.split('').map((letter, index) => (
              <motion.span
                key={`${currentName}-${index}`}
                initial={{ 
                  opacity: 0, 
                  filter: "blur(8px)",
                  y: -15,
                  scale: 0.9
                }}
                animate={{ 
                  opacity: 1, 
                  filter: "blur(0px)",
                  y: 0,
                  scale: 1
                }}
                exit={{ 
                  opacity: 0, 
                  filter: "blur(8px)",
                  y: 15,
                  scale: 0.9,
                  transition: {
                    duration: 0.4,
                    delay: 0.02 * (currentName.length - index - 1)
                  }
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 inline-block"
                style={{
                  textShadow: "0 0 20px rgba(255,255,255,0.1)",
                  willChange: "transform, opacity, filter"
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};