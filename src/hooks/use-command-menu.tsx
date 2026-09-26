/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { create } from "zustand";
import { useEffect } from "react";

/** what the palette searches when it opens: everything, or projects only */
export type CommandMenuScope = "all" | "projects";

interface CommandMenuState {
  isOpen: boolean;
  scope: CommandMenuScope;
  toggleCommandMenu: () => void;
  /** open searching `scope`; a project page opens it on projects */
  openCommandMenu: (scope: CommandMenuScope) => void;
  closeCommandMenu: () => void;
}

/**
 * The palette is its own chunk (cmdk and its dialog stack stay out of the
 * first load). It is warmed on intent — a held ⌘/Ctrl, the search button
 * hovered or focused — so the first open doesn't wait on the network.
 */
export const loadCommandMenu = () => import("@/components/Command");

export const useCommandMenu = create<CommandMenuState>((set) => ({
  isOpen: false,
  scope: "all",
  toggleCommandMenu: () =>
    set((state) => ({ isOpen: !state.isOpen, scope: "all" })),
  openCommandMenu: (scope) => set({ isOpen: true, scope }),
  closeCommandMenu: () => set({ isOpen: false }),
}));

// this hook can be used to add keyboard shortcut support separately
export function useCommandMenuKeyboardShortcut() {
  const { toggleCommandMenu } = useCommandMenu();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) void loadCommandMenu();
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandMenu();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleCommandMenu]);
}
