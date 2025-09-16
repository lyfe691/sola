import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { pow, round } from "mathjs";

import { useGradualBlurDefaults } from "@/lib/gradual-blur-provider";

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

export const DEFAULT_GRADUAL_BLUR_CONFIG: Partial<GradualBlurProps> = {
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

const CURVE_FUNCTIONS: Record<string, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const mergeConfigs = (
  ...configs: Partial<GradualBlurProps>[]
): Partial<GradualBlurProps> => {
  return configs.reduce((acc, config) => ({ ...acc, ...config }), {});
};

const getGradientDirection = (position: string): string => {
  const directions: Record<string, string> = {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  };
  return directions[position] || "to bottom";
};

const debounce = <T extends (...args: unknown[]) => void>(fn: T, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

const useResponsiveDimension = (
  responsive: boolean | undefined,
  config: Required<GradualBlurProps>,
  key: "height" | "width"
) => {
  const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
  const baseDimension = config[key] as string | undefined;
  const mobileDimension = config[
    `mobile${capitalized}` as keyof GradualBlurProps
  ] as string | undefined;
  const tabletDimension = config[
    `tablet${capitalized}` as keyof GradualBlurProps
  ] as string | undefined;
  const desktopDimension = config[
    `desktop${capitalized}` as keyof GradualBlurProps
  ] as string | undefined;

  const [value, setValue] = useState<string | undefined>(baseDimension);

  useEffect(() => {
    if (!responsive) return;

    const calculate = () => {
      const width = window.innerWidth;
      let nextValue = baseDimension;

      if (width <= 480 && mobileDimension) {
        nextValue = mobileDimension;
      } else if (width <= 768 && tabletDimension) {
        nextValue = tabletDimension;
      } else if (width <= 1024 && desktopDimension) {
        nextValue = desktopDimension;
      }

      setValue(nextValue);
    };

    const debounced = debounce(calculate, 100);
    calculate();
    window.addEventListener("resize", debounced);
    return () => window.removeEventListener("resize", debounced);
  }, [
    responsive,
    baseDimension,
    mobileDimension,
    tabletDimension,
    desktopDimension,
  ]);

  useEffect(() => {
    if (!responsive) {
      setValue(baseDimension);
    }
  }, [responsive, baseDimension]);

  return responsive ? value : baseDimension;
};

const useIntersectionObserver = (
  ref: React.RefObject<HTMLDivElement>,
  shouldObserve = false
) => {
  const [isVisible, setIsVisible] = useState(!shouldObserve);

  useEffect(() => {
    if (!shouldObserve || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);

  return isVisible;
};

const GradualBlur: React.FC<GradualBlurProps> = (props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { defaults } = useGradualBlurDefaults();

  const config = useMemo(() => {
    const { children: _children, ...rest } = props;
    const presetConfig =
      rest.preset && GRADUAL_BLUR_PRESETS[rest.preset]
        ? GRADUAL_BLUR_PRESETS[rest.preset]
        : {};

    return mergeConfigs(
      DEFAULT_GRADUAL_BLUR_CONFIG,
      defaults,
      presetConfig,
      rest
    ) as Required<GradualBlurProps>;
  }, [defaults, props]);

  const responsiveHeight = useResponsiveDimension(
    config.responsive,
    config,
    "height"
  );
  const responsiveWidth = useResponsiveDimension(
    config.responsive,
    config,
    "width"
  );

  const isVisible = useIntersectionObserver(
    containerRef,
    config.animated === "scroll"
  );

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const safeDivCount = Math.max(1, config.divCount);
    const increment = 100 / safeDivCount;
    const currentStrength =
      isHovered && config.hoverIntensity
        ? config.strength * config.hoverIntensity
        : config.strength;

    const curveFunc = CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= safeDivCount; i++) {
      let progress = i / safeDivCount;
      progress = curveFunc(progress);

      let blurValue: number;
      if (config.exponential) {
        blurValue = Number(pow(2, progress * 4)) * 0.0625 * currentStrength;
      } else {
        blurValue = 0.0625 * (progress * safeDivCount + 1) * currentStrength;
      }

      const p1 = Number(round(increment * i - increment, 1));
      const p2 = Number(round(increment * i, 1));
      const p3 = Number(round(increment * i + increment, 1));
      const p4 = Number(round(increment * i + increment * 2, 1));

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(config.position);

      const divStyle: CSSProperties = {
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== "scroll"
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined,
        willChange: config.gpuOptimized ? "backdrop-filter, opacity" : undefined,
      };

      divs.push(<div key={i} className="absolute inset-0" style={divStyle} />);
    }

    return divs;
  }, [config, isHovered]);

  const containerStyle: CSSProperties = useMemo(() => {
    const isVertical = ["top", "bottom"].includes(config.position);
    const isHorizontal = ["left", "right"].includes(config.position);
    const isPageTarget = config.target === "page";

    const baseStyle: CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: config.hoverIntensity ? "auto" : "none",
      opacity: isVisible ? 1 : 0,
      transition: config.animated
        ? `opacity ${config.duration} ${config.easing}`
        : undefined,
      zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
      willChange: config.gpuOptimized ? "opacity" : undefined,
      ...config.style,
    };

    if (isVertical) {
      baseStyle.height = responsiveHeight;
      baseStyle.width = responsiveWidth || "100%";
      baseStyle[config.position] = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
    } else if (isHorizontal) {
      baseStyle.width = responsiveWidth || responsiveHeight;
      baseStyle.height = "100%";
      baseStyle[config.position] = 0;
      baseStyle.top = 0;
      baseStyle.bottom = 0;
    }

    return baseStyle;
  }, [config, responsiveHeight, responsiveWidth, isVisible]);

  const { hoverIntensity, animated, onAnimationComplete, duration } = config;

  useEffect(() => {
    if (isVisible && animated === "scroll" && onAnimationComplete) {
      const timeout = setTimeout(() => onAnimationComplete(), parseFloat(duration) * 1000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isVisible, animated, onAnimationComplete, duration]);

  return (
    <div
      ref={containerRef}
      className={`gradual-blur relative isolate ${
        config.target === "page" ? "gradual-blur-page" : "gradual-blur-parent"
      } ${config.className}`}
      style={containerStyle}
      onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="relative w-full h-full">{blurDivs}</div>
      {props.children && <div className="relative">{props.children}</div>}
    </div>
  );
};

const GradualBlurMemo = React.memo(GradualBlur);
GradualBlurMemo.displayName = "GradualBlur";

type GradualBlurComponent = React.MemoExoticComponent<
  React.FC<GradualBlurProps>
> & {
  PRESETS: typeof GRADUAL_BLUR_PRESETS;
  CURVE_FUNCTIONS: typeof CURVE_FUNCTIONS;
};

const GradualBlurComponent = GradualBlurMemo as GradualBlurComponent;
GradualBlurComponent.PRESETS = GRADUAL_BLUR_PRESETS;
GradualBlurComponent.CURVE_FUNCTIONS = CURVE_FUNCTIONS;

export default GradualBlurComponent;

const injectStyles = () => {
  if (typeof document === "undefined") return;
  const id = "gradual-blur-styles";
  if (document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id;
  el.textContent =
    ".gradual-blur{pointer-events:none;transition:opacity .3s ease-out}.gradual-blur-inner{pointer-events:none}";
  document.head.appendChild(el);
};

if (typeof document !== "undefined") {
  injectStyles();
}
