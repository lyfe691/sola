/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/**
 * Runs `task` after the page's load event, once the main thread is idle —
 * for warming chunks the first paint doesn't need. Returns a cancel, so it
 * drops straight into a useEffect.
 */
export function whenIdle(task: () => unknown): () => void {
  let idle: number | undefined;
  let timer: number | undefined;

  const schedule = () => {
    // Safari has no requestIdleCallback
    if (typeof window.requestIdleCallback === "function")
      idle = window.requestIdleCallback(() => task(), { timeout: 4000 });
    else timer = window.setTimeout(task, 300);
  };

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    window.removeEventListener("load", schedule);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    if (timer !== undefined) window.clearTimeout(timer);
  };
}
