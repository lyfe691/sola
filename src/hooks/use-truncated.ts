/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Whether a single-line element is actually cut off, so only the labels that
 * lost something get an affordance to show the rest.
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

    // the element's own box changes with the column; the text inside it does
    // not, so watching the box is enough — until the webfont swaps in and
    // re-measures every glyph under it
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    void document.fonts?.ready.then(measure);

    return () => observer.disconnect();
  }, [measure]);

  return [ref, truncated] as const;
}
