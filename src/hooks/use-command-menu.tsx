/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { create } from 'zustand'
import { useEffect } from 'react'

interface CommandMenuState {
  isOpen: boolean
  toggleCommandMenu: () => void
  openCommandMenu: () => void
  closeCommandMenu: () => void
}

export const useCommandMenu = create<CommandMenuState>((set) => ({
  isOpen: false,
  toggleCommandMenu: () => set((state) => ({ isOpen: !state.isOpen })),
  openCommandMenu: () => set({ isOpen: true }),
  closeCommandMenu: () => set({ isOpen: false }),
}))

// this hook can be used to add keyboard shortcut support separately
export function useCommandMenuKeyboardShortcut() {
  const { toggleCommandMenu } = useCommandMenu()
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleCommandMenu()
      }
    }
    
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggleCommandMenu])
} 