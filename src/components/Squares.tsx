import React, { useRef, useEffect } from "react";

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
  x: number;
  y: number;
}

interface SquaresProps {
  direction?: "diagonal" | "up" | "right" | "down" | "left";
  speed?: number;
  squareSize?: number;
}

// Function to get theme-aware colors from CSS variables
const getThemeColors = () => {
  if (typeof window === 'undefined') {
    return {
      borderColor: 'rgba(128, 128, 128, 0.2)',
      hoverFillColor: 'rgba(128, 128, 128, 0.1)',
      gradientColor: 'rgba(0, 0, 0, 0.02)'
    };
  }
  
  const computedStyle = getComputedStyle(document.documentElement);
  const borderHsl = computedStyle.getPropertyValue('--border').trim();
  const mutedHsl = computedStyle.getPropertyValue('--muted').trim();
  const backgroundHsl = computedStyle.getPropertyValue('--background').trim();
  
  // Check if we're in a light or dark theme
  const isLightTheme = () => {
    if (backgroundHsl) {
      const [, , l] = backgroundHsl.split(' ').map(val => parseFloat(val.replace('%', '')));
      return l > 50; // Light theme if lightness > 50%
    }
    return true; // Default to light
  };
  
  // Convert HSL to RGBA with opacity
  const hslToRgba = (hsl: string, opacity: number = 1) => {
    const [h, s, l] = hsl.split(' ').map(val => parseFloat(val.replace('%', '')));
    
    const hue = h / 360;
    const saturation = s / 100;
    const lightness = l / 100;
    
    const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = c * (1 - Math.abs((hue * 6) % 2 - 1));
    const m = lightness - c / 2;
    
    let r, g, b;
    if (hue < 1/6) [r, g, b] = [c, x, 0];
    else if (hue < 2/6) [r, g, b] = [x, c, 0];
    else if (hue < 3/6) [r, g, b] = [0, c, x];
    else if (hue < 4/6) [r, g, b] = [0, x, c];
    else if (hue < 5/6) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    
    const red = Math.round((r + m) * 255);
    const green = Math.round((g + m) * 255);
    const blue = Math.round((b + m) * 255);
    
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  };
  
  const lightMode = isLightTheme();
  
  return {
    borderColor: borderHsl ? hslToRgba(borderHsl, 0.3) : 'rgba(128, 128, 128, 0.2)',
    hoverFillColor: mutedHsl ? hslToRgba(mutedHsl, 0.5) : 'rgba(128, 128, 128, 0.1)',
    gradientColor: lightMode 
      ? 'rgba(0, 0, 0, 0.02)' // Very subtle in light mode
      : 'rgba(0, 0, 0, 0.15)'  // More visible in dark mode
  };
};

const Squares: React.FC<SquaresProps> = ({
  direction = "right",
  speed = 1,
  squareSize = 40,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);
  const themeColorsRef = useRef(getThemeColors());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Update theme colors
    const updateThemeColors = () => {
      themeColorsRef.current = getThemeColors();
    };

    // Theme change observer
    const observer = new MutationObserver(updateThemeColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Initial color update
    updateThemeColors();

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const colors = themeColorsRef.current;
      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          if (
            hoveredSquareRef.current &&
            Math.floor((x - startX) / squareSize) ===
              hoveredSquareRef.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y
          ) {
            ctx.fillStyle = colors.hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = colors.borderColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      // Create a subtle gradient overlay that adapts to theme
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, colors.gradientColor);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case "right":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case "left":
          gridOffset.current.x =
            (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case "up":
          gridOffset.current.y =
            (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case "down":
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case "diagonal":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor(
        (mouseX + gridOffset.current.x - startX) / squareSize
      );
      const hoveredSquareY = Math.floor(
        (mouseY + gridOffset.current.y - startY) / squareSize
      );

      if (
        !hoveredSquareRef.current ||
        hoveredSquareRef.current.x !== hoveredSquareX ||
        hoveredSquareRef.current.y !== hoveredSquareY
      ) {
        hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      observer.disconnect();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [direction, speed, squareSize]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full border-none block"
    ></canvas>
  );
};

export default Squares;
