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
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentName = names[currentNameIndex];
  
  return (
    <>
      <span className="text-foreground inline-block">{greeting} </span>
      <motion.span 
        className="relative inline-block overflow-hidden"
        initial={false}
        animate={{ 
          width: `${currentName.length * 0.6}em`,
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}
        style={{ 
          display: "inline-flex", 
          justifyContent: "flex-start",
          padding: "0.05em 0.1em",
          borderRadius: "0.1em",
          backgroundColor: "hsl(var(--muted) / 0.5)",
          verticalAlign: "baseline"
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentName}
            className="inline-flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {currentName.split('').map((letter, index) => (
              <motion.span
                key={`${currentName}-${index}`}
                initial={{ 
                  opacity: 0, 
                  filter: "blur(6px)",
                  y: -10,
                  scale: 0.95
                }}
                animate={{ 
                  opacity: 1, 
                  filter: "blur(0px)",
                  y: 0,
                  scale: 1
                }}
                exit={{ 
                  opacity: 0, 
                  filter: "blur(6px)",
                  y: 10,
                  scale: 0.95,
                  transition: {
                    duration: 0.3,
                    delay: 0.015 * (currentName.length - index - 1)
                  }
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.03,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-primary inline-block"
                style={{
                  textShadow: "0 0 8px hsl(var(--primary) / 0.2)",
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