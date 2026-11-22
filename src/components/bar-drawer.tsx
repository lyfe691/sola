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
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useWindowScrollLock } from "@/hooks/use-window-scroll-lock";
import { useTranslation } from "@/lib/language-provider";

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
  const close = useTranslation().common.close;

  // mounted closed with the bar, so it slides in when opened: base-ui skips
  // the slide for a drawer that mounts open (a press on the button before
  // this chunk was in, and then the sheet is simply there)
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
        {/* the way out for a screen reader, which has no swipe down and no
            backdrop to tap; it shows itself only to a keyboard, last in
            the tab order */}
        <div className="absolute top-3 right-3">
          <div className="sr-only focus-within:not-sr-only">
            <DrawerClose render={<Button variant="secondary" size="sm" />}>
              {close}
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
