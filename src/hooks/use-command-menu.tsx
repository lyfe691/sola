/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
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

// This hook can be used to add keyboard shortcut support separately
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