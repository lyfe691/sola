/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useState } from "react";

/**
 * True once the deep dive's sticky bar has pinned to the top of the
 * viewport, which is the moment the hero has scrolled away and the reader
 * is in the article. The bar marks itself with data-deep-dive-bar. Both the
 * bar (it only shows once docked) and the section rail (it stays out of the
 * hero) read it, so they arrive together.
 */
export function useDeepDiveBarPinned(): boolean {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const bar = document.querySelector<HTMLElement>("[data-deep-dive-bar]");
    if (!bar) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      // sticky top-0: the bar's top sits above 0 only while it is pinned
      setPinned(bar.getBoundingClientRect().top <= 1);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return pinned;
}
