/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The deep-dive tech-stack section: one ambient marquee row of pills
 * instead of chips wrapping onto a second line. Under reduced motion the
 * stack falls back to the wrapped static list, which keeps every tag
 * visible without any drift.
 */

import { useReducedMotion } from "motion/react";
import { StackItem, TechMarquee } from "@/components/ui/custom/tech-marquee";

export function TechStack({ technologies }: { technologies: string[] }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <ul className="flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
        {technologies.map((tech) => (
          <li key={tech}>
            <StackItem name={tech} />
          </li>
        ))}
      </ul>
    );
  }

  return <TechMarquee tags={technologies} />;
}
