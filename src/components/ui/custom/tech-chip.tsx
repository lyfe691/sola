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
 * gets an icon: brand mark when one exists, semantic lucide glyph for
 * concept tags, Tag as the last resort. Chips aren't interactive, so no
 * hover states.
 */

import { badgeVariants } from "@/components/ui/badge";
import { TECH_ICONS, TECH_ICON_FALLBACK } from "@/config/tech-icons";
import { cn } from "@/lib/utils";

export function TechChip({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = TECH_ICONS[name] ?? TECH_ICON_FALLBACK;

  // Badge's base classes size any direct <svg> child to 12px themselves
  return (
    <span
      className={cn(
        badgeVariants({ variant: "secondary" }),
        "font-normal",
        className,
      )}
    >
      <Icon aria-hidden="true" className="shrink-0" />
      {name}
    </span>
  );
}
