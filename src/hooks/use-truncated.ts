/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Whether a single-line element is actually cut off.
 */

import { useCallback, useLayoutEffect, useRef, useState } from "react";

/** Sub-pixel layout can leave scrollWidth a hair over clientWidth. */
const SLACK = 1;

export function useTruncated<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [truncated, setTruncated] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (el) setTruncated(el.scrollWidth > el.clientWidth + SLACK);
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // the box resizes with the column; the webfont swap changes the text
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    void document.fonts?.ready.then(measure);

    return () => observer.disconnect();
  }, [measure]);

  return [ref, truncated] as const;
}
