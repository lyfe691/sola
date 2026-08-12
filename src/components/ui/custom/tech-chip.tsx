/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * One tech chip, one icon registry (src/config/tech-icons.ts), two skins —
 * an owner decision, not drift:
 *   - "badge": the site's secondary Badge look, now with the brand mark.
 *     Dense rows: project cards and experience items (via TagRow).
 *   - "pill":  a quiet hairline pill for the deep-dive tech-stack section.
 * Every chip carries an icon: brand mark when one exists, semantic lucide
 * glyph for concept tags, Tag as the last resort — no bare chips. Chips
 * aren't interactive, so no hover states.
 */

import { badgeVariants } from "@/components/ui/badge";
import { TECH_ICONS, TECH_ICON_FALLBACK } from "@/config/tech-icons";
import { cn } from "@/lib/utils";

const PILL_BASE =
  "inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] font-medium whitespace-nowrap text-foreground/75";

const PILL_SIZE = {
  sm: { chip: "px-2.5 py-1 text-xs", icon: 12 },
  /** the deep-dive tech-stack section — roomier on a full-bleed page */
  md: { chip: "px-3 py-1.5 text-[13px]", icon: 14 },
} as const;

export function TechChip({
  name,
  variant = "pill",
  size = "sm",
  className,
}: {
  name: string;
  variant?: "pill" | "badge";
  /** pill only — the badge skin has Badge's own fixed metrics */
  size?: keyof typeof PILL_SIZE;
  className?: string;
}) {
  const Icon = TECH_ICONS[name] ?? TECH_ICON_FALLBACK;

  if (variant === "badge") {
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

  return (
    <span className={cn(PILL_BASE, PILL_SIZE[size].chip, className)}>
      <Icon
        size={PILL_SIZE[size].icon}
        aria-hidden="true"
        className="shrink-0"
      />
      {name}
    </span>
  );
}
