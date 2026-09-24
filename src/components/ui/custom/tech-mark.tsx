/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * A tech mark from the icon registry, which loads as its own chunk
 * (useTechIcons). Until it arrives each mark holds an empty box of its own
 * size, so nothing moves when it does.
 */

import { createElement, type ComponentProps } from "react";
import type { TechIcon } from "@/config/tech-icons";
import { useTechIcons } from "@/hooks/use-tech-icons";

type MarkProps = ComponentProps<TechIcon>;

/**
 * The box a mark will fill: an <svg> like the marks themselves, so every
 * rule that sizes a mark (a Badge's [&>svg], a size-* class) sizes it too.
 */
export function MarkSlot({ className, size }: MarkProps) {
  return (
    <svg
      aria-hidden
      className={className}
      width={size ?? "1em"}
      height={size ?? "1em"}
    />
  );
}

/** A technology's mark by its display name; unmapped names get the Tag glyph. */
export function TechMark({ name, ...props }: { name: string } & MarkProps) {
  const icons = useTechIcons();
  if (!icons) return <MarkSlot {...props} />;
  return createElement(
    icons.TECH_ICONS[name] ?? icons.TECH_ICON_FALLBACK,
    props,
  );
}
