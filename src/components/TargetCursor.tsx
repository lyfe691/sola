// from reactbits.dev--adjusted to my needs
// though i do think they stole it from the paid version of motion.dev

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { useIsMobile } from "@/hooks/use-mobile";

export interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = ".cursor-target",
  spinDuration = 2,
  hideDefaultCursor = true,
}) => {
  // all hooks must be called before any conditional logic
  const isMobile = useIsMobile();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement[]>([]);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const currentTarget = useRef<Element | null>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const animationFrame = useRef<number | null>(null);
  const lastMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const constants = useMemo(
    () => ({
      borderWidth: 2.5,
      cornerSize: 10,
      parallaxStrength: 0.015,
    }),
    []
  );

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    
    lastMousePosition.current = { x, y };
    
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.08,
      ease: "power2.out",
      overwrite: "auto"
    });
  }, []);

  const updateCorners = useCallback((target: Element, mouseX?: number, mouseY?: number) => {
    if (!cursorRef.current || !target || cornersRef.current.length === 0) return;

    const rect = target.getBoundingClientRect();
    const cursorRect = cursorRef.current.getBoundingClientRect();
    
    if (!rect || !cursorRect) return;
    
    const cursorCenterX = cursorRect.left + cursorRect.width / 2;
    const cursorCenterY = cursorRect.top + cursorRect.height / 2;

    const { borderWidth, cornerSize, parallaxStrength } = constants;

    // calculate base positions for all four corners
    let positions = [
      { x: rect.left - cursorCenterX - borderWidth, y: rect.top - cursorCenterY - borderWidth },
      { x: rect.right - cursorCenterX + borderWidth - cornerSize, y: rect.top - cursorCenterY - borderWidth },
      { x: rect.right - cursorCenterX + borderWidth - cornerSize, y: rect.bottom - cursorCenterY + borderWidth - cornerSize },
      { x: rect.left - cursorCenterX - borderWidth, y: rect.bottom - cursorCenterY + borderWidth - cornerSize },
    ];

    // Apply parallax effect if mouse position provided
    if (mouseX !== undefined && mouseY !== undefined) {
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      const mouseOffsetX = (mouseX - targetCenterX) * parallaxStrength;
      const mouseOffsetY = (mouseY - targetCenterY) * parallaxStrength;

      positions = positions.map(pos => ({
        x: pos.x + mouseOffsetX,
        y: pos.y + mouseOffsetY,
      }));
    }

    // Animate all corners simultaneously
    const tl = gsap.timeline();
    cornersRef.current.forEach((corner, index) => {
      if (corner && positions[index]) {
        tl.to(corner, {
          x: positions[index].x,
          y: positions[index].y,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto"
        }, 0);
      }
    });
  }, [constants]);

  const resetCorners = useCallback(() => {
    if (cornersRef.current.length === 0) return;

    const { cornerSize } = constants;
    const positions = [
      { x: -cornerSize * 1.8, y: -cornerSize * 1.8 },
      { x: cornerSize * 0.8, y: -cornerSize * 1.8 },
      { x: cornerSize * 0.8, y: cornerSize * 0.8 },
      { x: -cornerSize * 1.8, y: cornerSize * 0.8 },
    ];

    const tl = gsap.timeline();
    cornersRef.current.forEach((corner, index) => {
      if (corner && positions[index]) {
        tl.to(corner, {
          x: positions[index].x,
          y: positions[index].y,
          duration: 0.3,
          ease: "power3.out",
          overwrite: "auto"
        }, 0);
      }
    });
  }, [constants]);

  const startSpinning = useCallback(() => {
    if (!cursorRef.current || spinTl.current) return;
    
    spinTl.current = gsap.timeline({ repeat: -1 })
      .to(cursorRef.current, { 
        rotation: "+=360", 
        duration: spinDuration, 
        ease: "none",
        transformOrigin: "center center"
      });
  }, [spinDuration]);

  const stopSpinning = useCallback(() => {
    if (spinTl.current) {
      spinTl.current.kill();
      spinTl.current = null;
    }
    if (cursorRef.current) {
      gsap.set(cursorRef.current, { rotation: 0 });
    }
  }, []);

  // Create ResizeObserver to watch for element changes
  const observeTarget = useCallback((target: Element) => {
    if (!target || !resizeObserver.current) {
      if (!resizeObserver.current) {
        resizeObserver.current = new ResizeObserver((entries) => {
          if (currentTarget.current && entries.length > 0) {
            // Use requestAnimationFrame to ensure smooth updates
            if (animationFrame.current) {
              cancelAnimationFrame(animationFrame.current);
            }
            animationFrame.current = requestAnimationFrame(() => {
              if (currentTarget.current) {
                updateCorners(
                  currentTarget.current,
                  lastMousePosition.current.x,
                  lastMousePosition.current.y
                );
              }
            });
          }
        });
      }
    }
    
    if (resizeObserver.current && target) {
      resizeObserver.current.observe(target);
    }
  }, [updateCorners]);

  const unobserveTarget = useCallback((target: Element) => {
    if (resizeObserver.current && target) {
      resizeObserver.current.unobserve(target);
    }
  }, []);

  useEffect(() => {
    if (!cursorRef.current || isMobile) return;

    const cursor = cursorRef.current;
    const corners = cursor.querySelectorAll<HTMLDivElement>(".target-cursor-corner");
    cornersRef.current = Array.from(corners);

    // Initial setup
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    resetCorners();
    startSpinning();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      moveCursor(e.clientX, e.clientY);
      
      if (currentTarget.current) {
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }
        animationFrame.current = requestAnimationFrame(() => {
          if (currentTarget.current) {
            updateCorners(currentTarget.current, e.clientX, e.clientY);
          }
        });
      }
    };

    // Target detection
    const handleMouseOver = (e: MouseEvent) => {
      if (!e.target) return;
      
      const target = (e.target as Element).closest(targetSelector);
      
      if (!target || target === currentTarget.current) return;

      // Clean up previous target
      if (currentTarget.current) {
        unobserveTarget(currentTarget.current);
        resetCorners();
      }

      currentTarget.current = target;
      stopSpinning();
      
      // Start observing the new target for size changes
      observeTarget(target);
      
      // Initial corner update
      updateCorners(target, e.clientX, e.clientY);
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget || !currentTarget.current) return;
      
      const relatedTarget = e.relatedTarget as Element;
      
      if (relatedTarget && relatedTarget.closest(targetSelector) === currentTarget.current) {
        return;
      }

      // Clean up
      unobserveTarget(currentTarget.current);
      currentTarget.current = null;
      resetCorners();
      
      // Restart spinning after a brief delay
      setTimeout(() => {
        if (!currentTarget.current) {
          startSpinning();
        }
      }, 150);
    };

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      
      if (currentTarget.current) {
        unobserveTarget(currentTarget.current);
      }
      
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
        resizeObserver.current = null;
      }
      
      stopSpinning();
    };
  }, [targetSelector, moveCursor, updateCorners, resetCorners, startSpinning, stopSpinning, observeTarget, unobserveTarget, isMobile]);

  // Update spinning duration when prop changes
  useEffect(() => {
    if (spinTl.current && cursorRef.current && !isMobile) {
      const wasActive = spinTl.current.isActive();
      stopSpinning();
      if (wasActive && !currentTarget.current) {
        startSpinning();
      }
    }
  }, [spinDuration, startSpinning, stopSpinning, isMobile]);

  // Add class to hide default cursor when custom cursor is active (desktop only)
  useEffect(() => {
    if (!isMobile) {
      document.body.classList.add('custom-cursor-active');
      
      return () => {
        document.body.classList.remove('custom-cursor-active');
      };
    }
  }, [isMobile]);

  // Don't render on mobile devices - custom cursors are for pointer/mouse only
  if (isMobile) {
    return null;
  }

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ 
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Center dot */}
      <div 
        className="absolute left-1/2 top-1/2 w-0.5 h-0.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" 
        style={{ willChange: 'transform' }}
      />
      
      {/* Corner brackets with rounded edges */}
      <div 
        className="target-cursor-corner absolute left-1/2 top-1/2 w-2.5 h-2.5 border-[2.5px] border-white transform -translate-x-[180%] -translate-y-[180%] border-r-0 border-b-0 rounded-tl-md" 
        style={{ willChange: 'transform' }}
      />
      <div 
        className="target-cursor-corner absolute left-1/2 top-1/2 w-2.5 h-2.5 border-[2.5px] border-white transform translate-x-[80%] -translate-y-[180%] border-l-0 border-b-0 rounded-tr-md" 
        style={{ willChange: 'transform' }}
      />
      <div 
        className="target-cursor-corner absolute left-1/2 top-1/2 w-2.5 h-2.5 border-[2.5px] border-white transform translate-x-[80%] translate-y-[80%] border-l-0 border-t-0 rounded-br-md" 
        style={{ willChange: 'transform' }}
      />
      <div 
        className="target-cursor-corner absolute left-1/2 top-1/2 w-2.5 h-2.5 border-[2.5px] border-white transform -translate-x-[180%] translate-y-[80%] border-r-0 border-t-0 rounded-bl-md" 
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};

export default TargetCursor;