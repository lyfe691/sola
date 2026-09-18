/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The source button of a project whose repository is private: disabled,
 * with a tooltip that says why, instead of a link that would 404. The
 * wrapper takes the hover and the focus, because a disabled button drops
 * its pointer events and would never show the cursor or open the tooltip.
 */

import { Github01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function PrivateSourceButton({
  label,
  reason,
  variant = "outline",
  className,
}: {
  label: string;
  /** Why there is no link; shown in the tooltip. */
  reason: string;
  variant?: "default" | "outline";
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            tabIndex={0}
            className={cn(
              "inline-flex cursor-not-allowed rounded-4xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
              className,
            )}
          />
        }
      >
        <Button
          disabled
          tabIndex={-1}
          size="lg"
          variant={variant}
          className="w-full gap-2"
        >
          <HugeiconsIcon
            icon={Github01Icon}
            strokeWidth={2}
            className="size-4"
            aria-hidden="true"
          />
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-64 text-center">{reason}</TooltipContent>
    </Tooltip>
  );
}
