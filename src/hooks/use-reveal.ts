/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect, useState, type RefObject } from "react";
import { watchReveal } from "@/lib/reveal";

/**
 * The reveal queue for a block that animates itself (a motion component
 * with more states than hidden and shown, like the project grid's cells):
 * null until the block is let in, then the delay its reveal should start
 * after (ms). Anything simpler is a <Reveal>.
 */
export const useReveal = (ref: RefObject<Element | null>) => {
  const [delay, setDelay] = useState<number | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return watchReveal(node, setDelay);
  }, [ref]);
  return delay;
};
