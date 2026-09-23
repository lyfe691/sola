/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A project link that exists but is not public: a private repository, or a
 * live app that runs inside a client's company. The button renders disabled
 * and says why instead of vanishing or linking to a 404. The wrapper takes
 * the hover, the tap and the focus, because a disabled button drops its
 * pointer events and would never show the cursor or open anything.
 */

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/custom/hint";
import { cn } from "@/lib/utils";

export function PrivateLinkButton({
  label,
  reason,
  icon,
  variant = "outline",
  className,
}: {
  label: string;
  /** Why there is no link; shown on hover, or on a tap. */
  reason: string;
  icon: ReactNode;
  variant?: "default" | "outline";
  className?: string;
}) {
  return (
    <Hint
      className="max-w-64 text-center"
      popoverClassName="w-fit max-w-64 text-center"
      trigger={
        <span
          tabIndex={0}
          className={cn(
            "inline-flex cursor-not-allowed rounded-4xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
            className,
          )}
        >
          <Button
            disabled
            tabIndex={-1}
            size="lg"
            variant={variant}
            className="w-full"
          >
            <span className="inline-flex items-center gap-2">
              {icon}
              {label}
            </span>
          </Button>
        </span>
      }
    >
      {reason}
    </Hint>
  );
}
