/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Chip list for the deep-dive tech-stack section. Motion lives on the parent
 * section — this component stays presentational.
 */

export function TechStack({ technologies }: { technologies: string[] }) {
  return (
    <ul className="flex list-none flex-wrap gap-2.5 p-0">
      {technologies.map((tech) => (
        <li
          key={tech}
          className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors duration-200 hover:border-primary/30 hover:bg-primary/10"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}
