/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { ReactElement, ReactNode } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useWindowScrollLock } from "@/hooks/use-window-scroll-lock";

type BarDrawerProps = {
  /** the bar's button, glyph and all: it opens the sheet */
  trigger: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** after the sheet has finished sliding in or out */
  onOpenChangeComplete?: (open: boolean) => void;
  children: ReactNode;
};

/**
 * A bar toggle's menu on a phone: a sheet from the bottom of the screen,
 * where a thumb reaches it, in place of a dropdown hanging from a 40px
 * circle at the top. The language and theme toggles share it so their two
 * sheets read as one piece.
 */
export function BarDrawer({
  trigger,
  title,
  description,
  open,
  onOpenChange,
  onOpenChangeComplete,
  children,
}: BarDrawerProps) {
  useWindowScrollLock(open);

  // mounted closed with the bar: base-ui skips the enter slide for a drawer
  // that mounts already open
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      showSwipeHandle
    >
      <DrawerTrigger render={trigger} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        {/* Lenis would take the wheel for the page; the sheet scrolls itself */}
        <div
          data-lenis-prevent
          className="scroll-fade min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-8"
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
