/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * One short answer to "what does this say?" — a tooltip where there is a
 * pointer to hover with, a popover where there is only a finger. The split is
 * the same everywhere it appears (the menu glyph, a tag row's +N, a truncated
 * figure caption), so it lives here once rather than in each of them.
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
  /** What the hint says. */
  children: ReactNode;
  /**
   * The element it hangs off. Both primitives render into it, so it has to
   * take a ref and be reachable by keyboard — a real button, not a span.
   */
  trigger: ReactElement;
  side?: Side;
  align?: Align;
  /** When the panel a finger opens wants to sit differently from the tooltip. */
  popoverAlign?: Align;
  /** On the tooltip, which carries its own padding. */
  className?: string;
  /** On the popover, which is a panel and is given the padding here. */
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
