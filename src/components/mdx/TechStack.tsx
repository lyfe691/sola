/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Chip list for the deep-dive tech-stack section — the shared TechChip, so
 * this section, the project cards, and the experience rows all speak one
 * design. Motion lives on the parent section; this stays presentational.
 */

import { TechChip } from "@/components/ui/custom/tech-chip";

export function TechStack({ technologies }: { technologies: string[] }) {
  return (
    <ul className="flex list-none flex-wrap gap-2.5 p-0">
      {technologies.map((tech) => (
        <li key={tech}>
          <TechChip name={tech} size="md" />
        </li>
      ))}
    </ul>
  );
}
