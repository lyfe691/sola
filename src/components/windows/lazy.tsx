/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The windows as chunks of their own. The bar's menu shows them and the bar
 * reaches every visitor, so nothing here may import a window statically:
 * each loads with the first thing that draws one, or ahead of it through
 * its `load`.
 */

import { createElement, lazy, type ComponentType } from "react";
import type { BrowserWindowProps } from "./browser-window";
import type { CodeMorphProps } from "./code-morph";
import type { ShotWindowProps } from "./shot-window";
import type { TerminalReplayProps } from "./terminal-replay";

/**
 * lib/preloadable.ts for a component that takes props: React.lazy suspends on
 * its first render even when the chunk is in, so once `load` has resolved
 * the component renders directly. (That helper is typed for pages, which
 * take none, and its callers lean on the module type it hands back.)
 */
function preloadable<P extends object>(
  load: () => Promise<{ default: ComponentType<P> }>,
) {
  let loaded: ComponentType<P> | undefined;
  const preload = () =>
    load().then((module) => {
      loaded = module.default;
      return module;
    });
  const Lazy = lazy(preload);
  const Component = (props: P) => createElement(loaded ?? Lazy, props);
  return { load: preload, Component };
}

export const { Component: LazyBrowserWindow, load: loadBrowserWindow } =
  preloadable<BrowserWindowProps>(() =>
    import("./browser-window").then((module) => ({
      default: module.BrowserWindow,
    })),
  );
export const { Component: LazyTerminalReplay, load: loadTerminalReplay } =
  preloadable<TerminalReplayProps>(() =>
    import("./terminal-replay").then((module) => ({
      default: module.TerminalReplay,
    })),
  );
export const { Component: LazyCodeMorph } = preloadable<CodeMorphProps>(() =>
  import("./code-morph").then((module) => ({ default: module.CodeMorph })),
);
/** The small window of a card or a preview, with the lists it reads. */
export const { Component: LazyShotWindow, load: loadShotWindow } =
  preloadable<ShotWindowProps>(() =>
    import("./shot-window").then((module) => ({ default: module.ShotWindow })),
  );
