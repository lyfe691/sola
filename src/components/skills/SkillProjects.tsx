/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useRef, type ReactNode } from "react";
import { Link } from "react-router";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ProjectMeta } from "@/config/projects";
import { projectsUsing, skillLabels, type Skill } from "@/config/skills";
import { TECH_ICONS } from "@/config/tech-icons";
import { useWindowScrollLock } from "@/hooks/use-window-scroll-lock";
import { useTranslation } from "@/lib/language-provider";
import { countLabel } from "@/lib/plural";
import { cn } from "@/lib/utils";

const STACK_MAX = 7;

export function SkillTile({
  skill,
  className,
}: {
  skill: Skill;
  className?: string;
}) {
  const Icon = skill.icon;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 ring-1 ring-foreground/5 ring-inset",
        className,
      )}
    >
      <Icon className="size-5" size={20} />
    </span>
  );
}

function useUsedIn(count: number): string {
  const t = useTranslation().skills;
  return countLabel(count, t.usedInOne, t.usedIn);
}

/** The project's stack as icons, the skill itself first and in colour. */
function ProjectStack({
  project,
  skill,
}: {
  project: ProjectMeta;
  skill: Skill;
}) {
  const labels = skillLabels(skill.name);
  const stack = project.technologies
    .filter((tech) => TECH_ICONS[tech])
    .map((tech) => ({
      tech,
      Icon: TECH_ICONS[tech],
      active: labels.includes(tech),
    }))
    .sort((a, b) => Number(b.active) - Number(a.active))
    .slice(0, STACK_MAX);

  return (
    <span aria-hidden="true" className="flex items-center gap-2 pt-1.5">
      {stack.map(({ tech, Icon, active }) => (
        <Icon
          key={tech}
          size={16}
          className={cn("size-4 shrink-0", !active && "opacity-60 grayscale")}
        />
      ))}
    </span>
  );
}

function ProjectItem({
  project,
  skill,
}: {
  project: ProjectMeta;
  skill: Skill;
}) {
  const t = useTranslation();
  const { title, tagline } = t.projects.list[project.i18nKey];
  const className =
    "flex min-w-0 flex-col gap-0.5 rounded-xl px-2.5 py-2 transition-colors can-hover:hover:bg-muted/60";
  const body = (
    <>
      <span className="flex min-w-0 items-baseline gap-3">
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {title}
        </span>
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
          {project.date.start.slice(0, 4)}
        </span>
      </span>
      <span className="truncate text-xs text-muted-foreground">{tagline}</span>
      <ProjectStack project={project} skill={skill} />
    </>
  );

  if (project.slug) {
    return (
      <Link to={`/projects/${project.slug}`} className={className}>
        {body}
      </Link>
    );
  }
  const href = project.link ?? project.github;
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}

function ProjectList({
  skill,
  projects,
  className,
}: {
  skill: Skill;
  projects: ProjectMeta[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "scroll-fade flex min-h-0 flex-col overflow-y-auto overscroll-contain",
        className,
      )}
    >
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} skill={skill} />
      ))}
    </div>
  );
}

/** Desktop: the row opens a card of its projects beside it. */
export function SkillPopover({
  skill,
  className,
  children,
}: {
  skill: Skill;
  className?: string;
  children: ReactNode;
}) {
  const projects = projectsUsing(skill.name);
  const usedIn = useUsedIn(projects.length);

  return (
    <Popover>
      <PopoverTrigger className={className}>{children}</PopoverTrigger>
      <PopoverContent
        side="right"
        align="center"
        sideOffset={12}
        className="w-80 gap-0 rounded-2xl p-1.5"
      >
        <PopoverTitle className="sr-only">{skill.name}</PopoverTitle>
        <PopoverDescription className="px-2.5 pt-1.5 pb-1 text-xs">
          {usedIn}
        </PopoverDescription>
        <ProjectList skill={skill} projects={projects} className="max-h-96" />
      </PopoverContent>
    </Popover>
  );
}

/** Phones: one drawer for the page, showing whichever skill was tapped. */
export function SkillDrawer({
  skill,
  open,
  onOpenChange,
}: {
  skill: Skill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  const t = useTranslation().skills;
  const projects = projectsUsing(skill.name);
  const usedIn = useUsedIn(projects.length);
  useWindowScrollLock(open);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent ref={popupRef} initialFocus={popupRef}>
        <DrawerHeader className="items-center gap-1.5 pt-3">
          <SkillTile skill={skill} className="mb-1 size-14 rounded-2xl" />
          <DrawerTitle className="text-lg">{skill.name}</DrawerTitle>
          <DrawerDescription>
            {t.levels[skill.level]} · {usedIn}
          </DrawerDescription>
        </DrawerHeader>
        <ProjectList
          skill={skill}
          projects={projects}
          className="flex-1 px-2 pt-3 pb-8"
        />
      </DrawerContent>
    </Drawer>
  );
}
