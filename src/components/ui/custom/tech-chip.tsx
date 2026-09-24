/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * THE tech chip: the site's secondary Badge carrying the technology's mark —
 * one design across project cards, the deep-dive tech stack, and experience
 * rows, backed by one icon registry (src/config/tech-icons.ts). Every chip
 * gets an icon: brand mark when one exists, semantic hugeicons glyph for
 * concept tags, Tag as the last resort. Chips aren't interactive, so no
 * hover states.
 */

import type { ComponentProps } from "react";
import { badgeVariants } from "@/components/ui/badge";
import { TechMark } from "@/components/ui/custom/tech-mark";
import { cn } from "@/lib/utils";

export function TechChip({
  name,
  className,
  ...props
}: { name: string } & ComponentProps<"span">) {
  // Badge's base classes size any direct <svg> child to 12px themselves
  return (
    <span
      {...props}
      className={cn(badgeVariants({ variant: "chip" }), className)}
    >
      <TechMark name={name} aria-hidden="true" className="shrink-0" />
      {name}
    </span>
  );
}
