import {
  CSSProperties,
  PropsWithChildren,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MemoExoticComponent, ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";
import * as math from "mathjs";

import { useGradualBlur } from "@/lib/gradual-blur-provider";

export type GradualBlurProps = PropsWithChildren<{
  position?: "top" | "bottom" | "left" | "right";
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
  responsive?: boolean;
  mobileHeight?: string;
  tabletHeight?: string;
  desktopHeight?: string;
  mobileWidth?: string;
  tabletWidth?: string;
  desktopWidth?: string;
  preset?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "subtle"
    | "intense"
    | "smooth"
    | "sharp"
    | "header"
    | "footer"
    | "sidebar"
    | "page-header"
    | "page-footer";
  gpuOptimized?: boolean;
  hoverIntensity?: number;
  target?: "parent" | "page";
  onAnimationComplete?: () => void;
  className?: string;
  style?: CSSProperties;
}>;

export const GRADUAL_BLUR_DEFAULTS: Readonly<Partial<GradualBlurProps>> = {
  position: "bottom",
  strength: 2,
  height: "6rem",
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "linear",
  responsive: false,
  target: "parent",
  className: "",
  style: {},
};

export const GRADUAL_BLUR_PRESETS: Record<string, Partial<GradualBlurProps>> = {
  top: { position: "top", height: "6rem" },
  bottom: { position: "bottom", height: "6rem" },
  left: { position: "left", height: "6rem" },
  right: { position: "right", height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier", divCount: 10 },
  sharp: { height: "5rem", curve: "linear", divCount: 4 },
  header: { position: "top", height: "8rem", curve: "ease-out" },
  footer: { position: "bottom", height: "8rem", curve: "ease-out" },
  sidebar: { position: "left", height: "6rem", strength: 2.5 },
  "page-header": {
    position: "top",
    height: "10rem",
    target: "page",
    strength: 3,
  },
  "page-footer": {
    position: "bottom",
    height: "10rem",
    target: "page",
    strength: 3,
  },
};

export const GRADUAL_BLUR_CURVES: Record<string, (progress: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

type GradualBlurResolvedConfig =
  Required<
    Pick<
      GradualBlurProps,
      | "position"
      | "strength"
      | "height"
      | "divCount"
      | "exponential"
      | "zIndex"
      | "animated"
      | "duration"
      | "easing"
      | "opacity"
      | "curve"
      | "responsive"
      | "target"
      | "className"
      | "style"
    >
  > &
    GradualBlurProps;

const mergeConfigs = (
  ...configs: Partial<GradualBlurProps>[]
): Partial<GradualBlurProps> =>
  configs.reduce<Partial<GradualBlurProps>>(
    (acc, config) => ({ ...acc, ...config }),
    {},
  );

const getGradientDirection = (position: string): string => {
  const directions: Record<string, string> = {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  };
  return directions[position] || "to bottom";
};

const debounce = <Args extends unknown[]>(fn: (...args: Args) => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

const useResponsiveDimension = (
  responsive: boolean | undefined,
  config: Partial<GradualBlurProps>,
  key: keyof Pick<GradualBlurProps, "height" | "width">
) => {
  const [value, setValue] = useState(config[key]);

  useEffect(() => {
    if (!responsive || typeof window === "undefined") {
      return;
    }

    const calculate = () => {
      const width = window.innerWidth;
      let result = config[key];
      const capitalizedKey = `${String(key).charAt(0).toUpperCase()}${String(key).slice(1)}`;

      if (width <= 480 && (config as Record<string, unknown>)[`mobile${capitalizedKey}`]) {
        result = (config as Record<string, unknown>)[`mobile${capitalizedKey}`];
      } else if (width <= 768 && (config as Record<string, unknown>)[`tablet${capitalizedKey}`]) {
        result = (config as Record<string, unknown>)[`tablet${capitalizedKey}`];
      } else if (width <= 1024 && (config as Record<string, unknown>)[`desktop${capitalizedKey}`]) {
        result = (config as Record<string, unknown>)[`desktop${capitalizedKey}`];
      }

      setValue(result);
    };

    const debounced = debounce(calculate, 100);
    calculate();
    window.addEventListener("resize", debounced);

    return () => {
      window.removeEventListener("resize", debounced);
    };
  }, [responsive, config, key]);

  return responsive ? value : config[key];
};

const useIntersectionObserver = (
  ref: RefObject<HTMLDivElement>,
  shouldObserve = false
) => {
  const [isVisible, setIsVisible] = useState(!shouldObserve);

  useEffect(() => {
    if (!shouldObserve) {
      setIsVisible(true);
      return;
    }

    if (!ref.current || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry?.isIntersecting ?? false);
    }, { threshold: 0.1 });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, shouldObserve]);

  return isVisible;
};

const GradualBlurComponent = (props: GradualBlurProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { defaults, presets, curves, portalNode } = useGradualBlur();

  const combinedPresets = useMemo(
    () => ({ ...GRADUAL_BLUR_PRESETS, ...presets }),
    [presets],
  );

  const baseConfig = useMemo(
    () => mergeConfigs(GRADUAL_BLUR_DEFAULTS, defaults),
    [defaults],
  );

  const config = useMemo(() => {
    const presetConfig =
      props.preset && combinedPresets[props.preset] ? combinedPresets[props.preset] : {};

    return mergeConfigs(baseConfig, presetConfig, props) as GradualBlurResolvedConfig;
  }, [baseConfig, combinedPresets, props]);

  const responsiveHeight = useResponsiveDimension(config.responsive, config, "height");
  const responsiveWidth = useResponsiveDimension(config.responsive, config, "width");

  const isVisible = useIntersectionObserver(containerRef, config.animated === "scroll");

  const curveFunctions = useMemo(
    () => ({ ...GRADUAL_BLUR_CURVES, ...curves }),
    [curves],
  );

  const curveFunction = useMemo(() => {
    const curve = config.curve ?? "linear";
    return curveFunctions[curve] ?? curveFunctions.linear ?? ((progress: number) => progress);
  }, [config.curve, curveFunctions]);

  const blurDivs = useMemo(() => {
    const divs: ReactNode[] = [];
    const effectiveDivCount = Math.max(1, config.divCount);
    const increment = 100 / effectiveDivCount;

    const strength =
      isHovered && config.hoverIntensity ? config.strength * config.hoverIntensity : config.strength;

    for (let i = 1; i <= effectiveDivCount; i += 1) {
      let progress = i / effectiveDivCount;
      progress = curveFunction(progress);

      let blurValue: number;
      if (config.exponential) {
        blurValue = Number(math.pow(2, progress * 4)) * 0.0625 * strength;
      } else {
        blurValue = 0.0625 * (progress * effectiveDivCount + 1) * strength;
      }

      const p1 = Number(math.round((increment * i - increment) * 10)) / 10;
      const p2 = Number(math.round(increment * i * 10)) / 10;
      const p3 = Number(math.round((increment * i + increment) * 10)) / 10;
      const p4 = Number(math.round((increment * i + increment * 2) * 10)) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) {
        gradient += `, black ${p3}%`;
      }
      if (p4 <= 100) {
        gradient += `, transparent ${p4}%`;
      }

      const direction = getGradientDirection(config.position ?? "bottom");

      const divStyle: CSSProperties = {
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`
          .replace("NaN", "0"),
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== "scroll"
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined,
      };

      if (config.gpuOptimized) {
        divStyle.willChange = "filter";
        divStyle.transform = "translateZ(0)";
      }

      divs.push(<div key={i} className="absolute inset-0" style={divStyle} />);
    }

    return divs;
  }, [config, curveFunction, isHovered]);

  const containerStyle: CSSProperties = useMemo(() => {
    const position = config.position ?? "bottom";
    const isVertical = ["top", "bottom"].includes(position);
    const isHorizontal = ["left", "right"].includes(position);
    const isPageTarget = config.target === "page";

    const baseStyle: CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: config.hoverIntensity ? "auto" : "none",
      opacity: isVisible ? 1 : 0,
      transition: config.animated ? `opacity ${config.duration} ${config.easing}` : undefined,
      zIndex: isPageTarget ? (config.zIndex ?? 0) + 100 : config.zIndex,
      ...config.style,
    };

    if (config.gpuOptimized) {
      baseStyle.willChange = "opacity";
      baseStyle.transform = baseStyle.transform ?? "translateZ(0)";
    }

    if (isVertical) {
      baseStyle.height = responsiveHeight ?? config.height;
      baseStyle.width = responsiveWidth ?? "100%";
      baseStyle[position] = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
    } else if (isHorizontal) {
      baseStyle.width = responsiveWidth ?? responsiveHeight ?? config.width ?? config.height ?? "100%";
      baseStyle.height = "100%";
      baseStyle[position] = 0;
      baseStyle.top = 0;
      baseStyle.bottom = 0;
    }

    return baseStyle;
  }, [config, isVisible, responsiveHeight, responsiveWidth]);

  const { hoverIntensity, animated, onAnimationComplete, duration } = config;

  useEffect(() => {
    if (!isVisible || animated !== "scroll" || !onAnimationComplete || typeof window === "undefined") {
      return;
    }

    const parsed = Number.parseFloat(duration);
    const timeoutDuration = Number.isFinite(parsed) ? Math.max(parsed * 1000, 0) : 0;

    const timeout = window.setTimeout(() => {
      onAnimationComplete();
    }, timeoutDuration);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [animated, duration, isVisible, onAnimationComplete]);

  const element = (
    <div
      ref={containerRef}
      className={`gradual-blur relative isolate ${
        config.target === "page" ? "gradual-blur-page" : "gradual-blur-parent"
      } ${config.className ?? ""}`.trim()}
      style={containerStyle}
      onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="gradual-blur-inner relative w-full h-full">{blurDivs}</div>
      {props.children && <div className="relative">{props.children}</div>}
    </div>
  );

  if (config.target === "page" && portalNode) {
    return createPortal(element, portalNode);
  }

  return element;
};

type GradualBlurComponentType = MemoExoticComponent<typeof GradualBlurComponent> & {
  PRESETS: typeof GRADUAL_BLUR_PRESETS;
  CURVES: typeof GRADUAL_BLUR_CURVES;
};

const GradualBlur = memo(GradualBlurComponent) as GradualBlurComponentType;
GradualBlur.displayName = "GradualBlur";
GradualBlur.PRESETS = GRADUAL_BLUR_PRESETS;
GradualBlur.CURVES = GRADUAL_BLUR_CURVES;

export default GradualBlur;

