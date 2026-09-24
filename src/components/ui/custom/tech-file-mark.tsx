/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { createElement } from "react";
import { MarkSlot } from "@/components/ui/custom/tech-mark";
import { useTechIcons } from "@/hooks/use-tech-icons";

/** Filename-inferred TECH_ICONS mark — same registry as deep-dive chips. */
export function TechFileMark({
  filename,
  lang,
  className,
  size = 12,
}: {
  filename?: string;
  lang?: string;
  className?: string;
  size?: number;
}) {
  const icons = useTechIcons();
  if (!icons) return <MarkSlot className={className} size={size} />;
  return createElement(icons.techIconForCode({ filename, lang }), {
    "aria-hidden": true,
    className,
    size,
  });
}
