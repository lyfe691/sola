import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { GradualBlurProps } from "@/components/GradualBlur";

type CurveFunction = (progress: number) => number;

type GradualBlurContextValue = {
  defaults: Partial<GradualBlurProps>;
  presets: Record<string, Partial<GradualBlurProps>>;
  curves: Record<string, CurveFunction>;
  portalNode: HTMLElement | null;
};

const defaultContextValue: GradualBlurContextValue = {
  defaults: {},
  presets: {},
  curves: {},
  portalNode: null,
};

const GradualBlurContext = createContext<GradualBlurContextValue>(defaultContextValue);

const BASE_STYLE_ID = "gradual-blur-styles";
const BASE_STYLES = `.gradual-blur{pointer-events:none;transition:opacity .3s ease-out}.gradual-blur-inner{pointer-events:none}`;

const injectStyles = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById(BASE_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = BASE_STYLE_ID;
  style.textContent = BASE_STYLES;
  document.head.appendChild(style);
};

export type GradualBlurProviderProps = {
  children: ReactNode;
  defaults?: Partial<GradualBlurProps>;
  presets?: Record<string, Partial<GradualBlurProps>>;
  curves?: Record<string, CurveFunction>;
  /**
   * Provide a custom DOM id for the page-level portal container.
   * @default "gradual-blur-root"
   */
  portalId?: string;
  /**
   * Toggle whether the base CSS required by the GradualBlur component should be injected automatically.
   * @default true
   */
  injectBaseStyles?: boolean;
};

export const GradualBlurProvider = ({
  children,
  defaults,
  presets,
  curves,
  portalId = "gradual-blur-root",
  injectBaseStyles = true,
}: GradualBlurProviderProps) => {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!injectBaseStyles) return;
    injectStyles();
  }, [injectBaseStyles]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    let container = portalId ? document.getElementById(portalId) : null;
    let created = false;

    if (!container) {
      container = document.createElement("div");
      if (portalId) {
        container.id = portalId;
      }
      container.dataset.gradualBlurRoot = "true";
      container.style.position = "relative";
      container.style.zIndex = "0";
      container.style.width = "0";
      container.style.height = "0";
      document.body.appendChild(container);
      created = true;
    }

    setPortalNode(container);

    return () => {
      if (created && container?.parentElement) {
        container.parentElement.removeChild(container);
      }
      setPortalNode(null);
    };
  }, [portalId]);

  const value = useMemo<GradualBlurContextValue>(
    () => ({
      defaults: defaults ?? {},
      presets: presets ?? {},
      curves: curves ?? {},
      portalNode,
    }),
    [defaults, presets, curves, portalNode],
  );

  return <GradualBlurContext.Provider value={value}>{children}</GradualBlurContext.Provider>;
};

export const useGradualBlur = () => useContext(GradualBlurContext);

