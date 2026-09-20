/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A short hint: tooltip on a fine pointer, popover on touch. Shared by
 * MenuHint, TagRow's +N and truncated figure captions.
 */

import type { ReactElement, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

type HintProps = {
  children: ReactNode;
  /** Must take a ref and be focusable — both primitives render into it. */
  trigger: ReactElement;
  side?: Side;
  align?: Align;
  popoverAlign?: Align;
  /** `className` lands on the tooltip, `popoverClassName` on the popover. */
  className?: string;
  popoverClassName?: string;
};

export function Hint({
  children,
  trigger,
  side = "top",
  align = "center",
  popoverAlign,
  className,
  popoverClassName,
}: HintProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger render={trigger} />
        <PopoverContent
          side={side}
          align={popoverAlign ?? align}
          className={cn("p-3 text-xs leading-relaxed", popoverClassName)}
        >
          {children}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger render={trigger} />
      <TooltipContent side={side} align={align} className={className}>
        {children}
      </TooltipContent>
    </Tooltip>
  );
}
