/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { create } from "zustand";

interface MobileMenuState {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

/** The phone menu: Navigation opens it, and the theme callout steps aside. */
export const useMobileMenu = create<MobileMenuState>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}));
