// from reactbits.dev--adjusted to my needs
// though i do think they stole it from the paid version of motion.dev

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { useIsMobile } from "@/hooks/use-mobile";

// Types
export interface CursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
}

interface CursorConstants {
  borderWidth: number;
  cornerSize: number;
  parallaxStrength: number;
}

interface Position {
  x: number;
  y: number;
}

// Configuration
const CURSOR_CONFIG: CursorConstants = {
  borderWidth: 2.5,
  cornerSize: 10,
  parallaxStrength: 0.015,
};

const ANIMATION_CONFIG = {
  cursorDuration: 0.08,
  cornerDuration: 0.25,
  resetDuration: 0.3,
  minSpinCompletion: 30,
  minCompletionDuration: 0.2,
  restartDelay: 150,
} as const;

// Custom hooks
const useCursorMovement = (cursorRef: React.RefObject<HTMLDivElement>) => {
  const lastMousePosition = useRef<Position>({ x: 0, y: 0 });

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    
    lastMousePosition.current = { x, y };
    
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: ANIMATION_CONFIG.cursorDuration,
      ease: "power2.out",
      overwrite: "auto"
    });
  }, []);

  return { moveCursor, lastMousePosition };
};

const useCursorSpinning = (
  cursorRef: React.RefObject<HTMLDivElement>,
  spinDuration: number
) => {
  const spinTl = useRef<gsap.core.Timeline | null>(null);

  const getShortestRotationPath = useCallback((from: number, to: number) => {
    const diff = to - from;
    if (diff > 180) return diff - 360;
    if (diff < -180) return diff + 360;
    return diff;
  }, []);

  const stopSpinning = useCallback(() => {
    if (spinTl.current) {
      spinTl.current.kill();
      spinTl.current = null;
    }
    if (cursorRef.current) {
      gsap.set(cursorRef.current, { rotation: 0 });
    }
  }, []);

  const stopSpinningMagnetic = useCallback(() => {
    if (!cursorRef.current || !spinTl.current) return;
    
    const currentRotation = gsap.getProperty(cursorRef.current, "rotation") as number;
    const normalizedCurrent = ((currentRotation % 360) + 360) % 360;
    
    spinTl.current.kill();
    spinTl.current = null;
    
    const shortestPath = getShortestRotationPath(normalizedCurrent, 0);
    const finalRotation = currentRotation + shortestPath;
    
    const rotationDistance = Math.abs(shortestPath);
    const baseDuration = 0.2;
    const maxDuration = 0.6;
    const dynamicDuration = baseDuration + (rotationDistance / 180) * (maxDuration - baseDuration);
    const easing = rotationDistance > 90 ? "power3.out" : "power2.out";
    
    gsap.to(cursorRef.current, {
      rotation: finalRotation,
      duration: dynamicDuration,
      ease: easing,
      overwrite: "auto"
    });
  }, [getShortestRotationPath]);

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

  const startSpinningFromPosition = useCallback(() => {
    if (!cursorRef.current || spinTl.current) return;
    
    const currentRotation = gsap.getProperty(cursorRef.current, "rotation") as number;
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    
    spinTl.current = gsap.timeline({ repeat: -1 });
    
    const remainingToComplete = 360 - normalizedRotation;
    const completionDuration = spinDuration * (remainingToComplete / 360);
    
    if (remainingToComplete > ANIMATION_CONFIG.minSpinCompletion && 
        completionDuration > ANIMATION_CONFIG.minCompletionDuration) {
      spinTl.current.to(cursorRef.current, {
        rotation: currentRotation + remainingToComplete,
        duration: completionDuration,
        ease: "none"
      });
    }
    
    spinTl.current.to(cursorRef.current, {
      rotation: `+=${360}`,
      duration: spinDuration,
      ease: "none",
      repeat: -1
    });
  }, [spinDuration]);

  return {
    startSpinning,
    startSpinningFromPosition,
    stopSpinning,
    stopSpinningMagnetic,
    spinTl,
  };
};

const useCursorCorners = (cursorRef: React.RefObject<HTMLDivElement>) => {
  const cornersRef = useRef<HTMLDivElement[]>([]);

  const updateCorners = useCallback((target: Element, mouseX?: number, mouseY?: number) => {
    if (!cursorRef.current || !target || cornersRef.current.length === 0) return;

    const rect = target.getBoundingClientRect();
    const cursorRect = cursorRef.current.getBoundingClientRect();
    
    if (!rect || !cursorRect) return;
    
    const cursorCenterX = cursorRect.left + cursorRect.width / 2;
    const cursorCenterY = cursorRect.top + cursorRect.height / 2;

    const { borderWidth, cornerSize, parallaxStrength } = CURSOR_CONFIG;

    let positions = [
      { x: rect.left - cursorCenterX - borderWidth, y: rect.top - cursorCenterY - borderWidth },
      { x: rect.right - cursorCenterX + borderWidth - cornerSize, y: rect.top - cursorCenterY - borderWidth },
      { x: rect.right - cursorCenterX + borderWidth - cornerSize, y: rect.bottom - cursorCenterY + borderWidth - cornerSize },
      { x: rect.left - cursorCenterX - borderWidth, y: rect.bottom - cursorCenterY + borderWidth - cornerSize },
    ];

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

    const tl = gsap.timeline();
    cornersRef.current.forEach((corner, index) => {
      if (corner && positions[index]) {
        tl.to(corner, {
          x: positions[index].x,
          y: positions[index].y,
          duration: ANIMATION_CONFIG.cornerDuration,
          ease: "power2.out",
          overwrite: "auto"
        }, 0);
      }
    });
  }, []);

  const resetCorners = useCallback(() => {
    if (cornersRef.current.length === 0) return;

    const { cornerSize } = CURSOR_CONFIG;
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
          duration: ANIMATION_CONFIG.resetDuration,
          ease: "power3.out",
          overwrite: "auto"
        }, 0);
      }
    });
  }, []);

  return { cornersRef, updateCorners, resetCorners };
};

const useResizeObserver = (
  updateCorners: (target: Element, mouseX?: number, mouseY?: number) => void,
  lastMousePosition: React.RefObject<Position>
) => {
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const animationFrame = useRef<number | null>(null);
  const currentTarget = useRef<Element | null>(null);

  const observeTarget = useCallback((target: Element) => {
    if (!resizeObserver.current) {
      resizeObserver.current = new ResizeObserver((entries) => {
        if (currentTarget.current && entries.length > 0) {
          if (animationFrame.current) {
            cancelAnimationFrame(animationFrame.current);
          }
          animationFrame.current = requestAnimationFrame(() => {
            if (currentTarget.current) {
              updateCorners(
                currentTarget.current,
                lastMousePosition.current?.x,
                lastMousePosition.current?.y
              );
            }
          });
        }
      });
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

  const cleanup = useCallback(() => {
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
  }, [unobserveTarget]);

  return {
    currentTarget,
    animationFrame,
    observeTarget,
    unobserveTarget,
    cleanup,
  };
};

// Main component
const Cursor: React.FC<CursorProps> = ({
  targetSelector = ".cursor-target",
  spinDuration = 2,
  hideDefaultCursor = true,
}) => {
  const isMobile = useIsMobile();
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const { moveCursor, lastMousePosition } = useCursorMovement(cursorRef);
  const { cornersRef, updateCorners, resetCorners } = useCursorCorners(cursorRef);
  const {
    startSpinning,
    startSpinningFromPosition,
    stopSpinning,
    stopSpinningMagnetic,
    spinTl,
  } = useCursorSpinning(cursorRef, spinDuration);
  
  const {
    currentTarget,
    animationFrame,
    observeTarget,
    unobserveTarget,
    cleanup,
  } = useResizeObserver(updateCorners, lastMousePosition);

  // Initialize cursor
  useEffect(() => {
    if (!cursorRef.current || isMobile) return;

    const cursor = cursorRef.current;
    const corners = cursor.querySelectorAll<HTMLDivElement>(".target-cursor-corner");
    cornersRef.current = Array.from(corners);

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    resetCorners();
    startSpinning();
  }, [isMobile, resetCorners, startSpinning]);

  // Event handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
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
  }, [moveCursor, updateCorners]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    if (!e.target) return;
    
    const target = (e.target as Element).closest(targetSelector);
    
    if (!target || target === currentTarget.current) return;

    if (currentTarget.current) {
      unobserveTarget(currentTarget.current);
      resetCorners();
    }

    currentTarget.current = target;
    stopSpinningMagnetic();
    observeTarget(target);
    updateCorners(target, e.clientX, e.clientY);
  }, [targetSelector, unobserveTarget, resetCorners, stopSpinningMagnetic, observeTarget, updateCorners]);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    if (!e.relatedTarget || !currentTarget.current) return;
    
    const relatedTarget = e.relatedTarget as Element;
    
    if (relatedTarget && relatedTarget.closest(targetSelector) === currentTarget.current) {
      return;
    }

    unobserveTarget(currentTarget.current);
    currentTarget.current = null;
    resetCorners();
    
    setTimeout(() => {
      if (!currentTarget.current) {
        startSpinningFromPosition();
      }
    }, ANIMATION_CONFIG.restartDelay);
  }, [targetSelector, unobserveTarget, resetCorners, startSpinningFromPosition]);

  // Setup event listeners
  useEffect(() => {
    if (isMobile) return;

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cleanup();
      stopSpinning();
    };
  }, [isMobile, handleMouseMove, handleMouseOver, handleMouseOut, cleanup, stopSpinning]);

  // Update spinning when duration changes
  useEffect(() => {
    if (spinTl.current && cursorRef.current && !isMobile) {
      const wasActive = spinTl.current.isActive();
      stopSpinning();
      if (wasActive && !currentTarget.current) {
        startSpinning();
      }
    }
  }, [spinDuration, startSpinning, stopSpinning, isMobile]);

  // Manage body class for hiding default cursor
  useEffect(() => {
    if (!isMobile) {
      document.body.classList.add('custom-cursor-active');
      return () => document.body.classList.remove('custom-cursor-active');
    }
  }, [isMobile]);

  if (isMobile) return null;

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
      
      {/* Corner brackets */}
      {[
        "border-r-0 border-b-0 rounded-tl-md -translate-x-[180%] -translate-y-[180%]",
        "border-l-0 border-b-0 rounded-tr-md translate-x-[80%] -translate-y-[180%]",
        "border-l-0 border-t-0 rounded-br-md translate-x-[80%] translate-y-[80%]",
        "border-r-0 border-t-0 rounded-bl-md -translate-x-[180%] translate-y-[80%]",
      ].map((className, index) => (
        <div 
          key={index}
          className={`target-cursor-corner absolute left-1/2 top-1/2 w-2.5 h-2.5 border-[2.5px] border-white transform ${className}`}
          style={{ willChange: 'transform' }}
        />
      ))}
    </div>
  );
};

export default Cursor;