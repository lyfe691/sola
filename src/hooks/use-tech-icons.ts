/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The tech-icon registry (src/config/tech-icons.ts) is ~50 KiB of brand
 * artwork, so it is a chunk of its own: pages that draw marks render
 * without waiting for it. The first mark to mount starts the load; once
 * loaded it is read synchronously, so a later page draws its marks on the
 * first frame.
 */

import { useSyncExternalStore } from "react";

type Registry = typeof import("@/config/tech-icons");

let registry: Registry | undefined;
let pending: Promise<void> | undefined;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  pending ??= import("@/config/tech-icons").then(
    (loaded) => {
      registry = loaded;
      for (const notify of listeners) notify();
    },
    // a failed chunk is forgotten, so the next mark to mount retries it
    () => {
      pending = undefined;
    },
  );
  return () => {
    listeners.delete(listener);
  };
}

/** The icon registry, or undefined until its chunk has loaded. */
export function useTechIcons(): Registry | undefined {
  return useSyncExternalStore(
    subscribe,
    () => registry,
    () => registry,
  );
}
