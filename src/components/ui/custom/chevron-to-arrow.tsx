/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChevronToArrowIcon({ className }: { className?: string }) {
  return (
    <ArrowRight
      className={cn(
        "size-4",
        // The line (first path): starts invisible, scales/fades in on hover
        "[&>path:first-child]:origin-left [&>path:first-child]:scale-x-0 [&>path:first-child]:opacity-0 [&>path:first-child]:transition-all [&>path:first-child]:duration-300 group-hover:[&>path:first-child]:scale-x-100 group-hover:[&>path:first-child]:opacity-100",
        // The chevron/arrowhead (second path): shifts right on hover
        "[&>path:last-child]:-translate-x-1 [&>path:last-child]:transition-transform [&>path:last-child]:duration-300 group-hover:[&>path:last-child]:translate-x-0",
        className,
      )}
    />
  );
}
