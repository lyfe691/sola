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
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ProjectMeta } from "@/config/projects";
import { skillLabels, type Skill } from "@/config/skills";
import { TECH_ICONS } from "@/config/tech-icons";
import { useTranslation } from "@/lib/language-provider";
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
  return count === 1 ? t.usedInOne : t.usedIn.replace("{count}", String(count));
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
    <span aria-hidden="true" className="flex items-center gap-1.5 pt-1">
      {stack.map(({ tech, Icon, active }) => (
        <Icon
          key={tech}
          size={14}
          className={cn("size-3.5 shrink-0", !active && "opacity-55 grayscale")}
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

/** Desktop: the row itself opens a card of the projects beside it. */
export function SkillPopover({
  skill,
  projects,
  className,
  children,
}: {
  skill: Skill;
  projects: ProjectMeta[];
  className?: string;
  children: ReactNode;
}) {
  const usedIn = useUsedIn(projects.length);

  return (
    <Popover>
      <PopoverTrigger openOnHover delay={300} className={className}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        sideOffset={12}
        className="w-80 gap-0 rounded-2xl p-1.5"
      >
        <PopoverTitle className="px-2.5 pt-1.5 pb-1 text-xs font-normal text-muted-foreground">
          {usedIn}
        </PopoverTitle>
        <ProjectList skill={skill} projects={projects} className="max-h-96" />
      </PopoverContent>
    </Popover>
  );
}

/** Phones: one drawer for the page, showing whichever skill was tapped. */
export function SkillDrawer({
  skill,
  projects,
  level,
  open,
  onOpenChange,
}: {
  skill: Skill;
  projects: ProjectMeta[];
  level: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  const usedIn = useUsedIn(projects.length);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent ref={popupRef} initialFocus={popupRef}>
        <DrawerHeader className="items-center gap-1.5 pt-3">
          <SkillTile skill={skill} className="mb-1 size-14 rounded-2xl" />
          <DrawerTitle className="text-lg">{skill.name}</DrawerTitle>
          <DrawerDescription>
            {level} · {usedIn}
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
