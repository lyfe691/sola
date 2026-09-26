/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { createElement, lazy, type ComponentType } from "react";

/**
 * A code-split component that renders at once when its chunk is already in.
 *
 * React.lazy suspends on its first render even for a loaded chunk, and a
 * Suspense boundary then holds the content back for ~300ms: an entrance
 * that starts with the mount plays on the fallback and the content pops in
 * after it. Call `load` ahead (when the transition starts) and the first
 * render skips Suspense entirely.
 */
export function preloadable(load: () => Promise<{ default: ComponentType }>) {
  let loaded: ComponentType | undefined;
  const preload = () =>
    load().then((module) => {
      loaded = module.default;
      return module;
    });
  const Lazy = lazy(preload);

  function Preloadable() {
    return createElement(loaded ?? Lazy);
  }

  return { load: preload, Component: Preloadable };
}
