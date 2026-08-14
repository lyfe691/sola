/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

type GlyphProps = {
  className?: string;
  size?: string | number;
  strokeWidth?: string | number;
  "aria-hidden"?: boolean | "true" | "false";
};

/**
 * Lift a Hugeicons path set into a component so config tables can keep
 * `<Icon className />` — brand marks (devicons / simple-icons) stay components.
 */
export function hugeIcon(icon: IconSvgElement) {
  function HugeGlyph({
    className,
    size,
    strokeWidth = 2,
    ...rest
  }: GlyphProps) {
    return (
      <HugeiconsIcon
        icon={icon}
        strokeWidth={
          typeof strokeWidth === "string" ? Number(strokeWidth) : strokeWidth
        }
        className={className}
        size={size}
        {...rest}
      />
    );
  }
  return HugeGlyph;
}

export type HugeGlyph = ReturnType<typeof hugeIcon>;
