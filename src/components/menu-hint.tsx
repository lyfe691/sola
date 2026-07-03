/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A small info glyph that explains a menu row or section — tooltip on
 * desktop, popover on touch. Clicks never reach the row it decorates.
 */

import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
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

type MenuHintProps = {
  text: string;
};

export function MenuHint({ text }: MenuHintProps) {
  const isMobile = useIsMobile();

  const trigger = (
    <button
      type="button"
      className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:text-muted-foreground"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      aria-label={text}
    >
      <Info className="size-3" />
    </button>
  );

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger render={trigger} />
        <PopoverContent
          side="top"
          align="start"
          className="w-60 p-3 text-xs leading-relaxed"
        >
          {text}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger render={trigger} />
      <TooltipContent side="top" className="max-w-60 text-center">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
