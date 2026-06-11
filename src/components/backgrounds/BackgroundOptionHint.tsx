/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type BackgroundOptionHintProps = {
  label: string;
};

export function BackgroundOptionHint({ label }: BackgroundOptionHintProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            aria-label={label}
          />
        }
      >
        <Info className="size-3" />
      </TooltipTrigger>
      <TooltipContent side="left" align="center" className="max-w-48">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}