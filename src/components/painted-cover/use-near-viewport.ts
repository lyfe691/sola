/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useState, type RefObject } from "react";

/**
 * Two observers, two questions: is the element close enough to deserve a
 * WebGL context (`near`, viewport ± margin), and is it actually on screen so
 * its frame loop should run (`visible`)? Both follow the scroll; neither
 * latches, unlike the reveal hook in transitions.ts.
 */
export function useNearViewport(
  ref: RefObject<Element | null>,
  margin = "50% 0px",
) {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const nearObserver = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: margin },
    );
    const visibleObserver = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    nearObserver.observe(element);
    visibleObserver.observe(element);
    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
    };
  }, [ref, margin]);

  return { near, visible };
}
