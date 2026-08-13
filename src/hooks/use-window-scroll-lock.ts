/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useEffect } from "react";
import { lockWindowScroll, unlockWindowScroll } from "@/utils/scroll";

/** Hold the window Lenis lock for the lifetime of `locked`. */
export const useWindowScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;
    lockWindowScroll();
    return unlockWindowScroll;
  }, [locked]);
};
