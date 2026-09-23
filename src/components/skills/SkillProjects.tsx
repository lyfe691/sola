/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router";
import { PreviewCard } from "@base-ui/react/preview-card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
    // Lenis would take the wheel for the page; the list scrolls itself
    <div
      data-lenis-prevent
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

const CardHandle = createContext<PreviewCard.Handle<Skill> | null>(null);

// how long the pointer must hold still before a pending switch is decided
const SETTLE_MS = 120;

function SkillCardBody({ skill }: { skill: Skill }) {
  const projects = projectsUsing(skill.name);
  const usedIn = useUsedIn(projects.length);

  return (
    <>
      <p className="px-2.5 pt-1.5 pb-1 text-xs text-muted-foreground">
        {usedIn}
      </p>
      <ProjectList skill={skill} projects={projects} className="max-h-96" />
    </>
  );
}

/**
 * Desktop: one hover card for the page, gliding to whichever row is hovered
 * (the theme menu's preview moves the same way). Base UI hands an open card
 * to any row the pointer touches, so a sweep from a row into its card would
 * give it away to every neighbour crossed on the way. Instead a switch
 * waits until the pointer comes to rest: on the new row the card follows,
 * on the old row or the card it stays, anywhere else it closes.
 */
export function SkillCards({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const [handle] = useState(() => PreviewCard.createHandle<Skill>());
  const active = useRef<Element | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [intent] = useState(() => {
    let pending: Element | null = null;
    let timer: number | undefined;

    const decide = () => {
      stop();
      const row = pending;
      pending = null;
      if (row?.matches(":hover")) {
        active.current = row;
        handle.open(row.id);
      } else if (
        !active.current?.matches(":hover") &&
        !popupRef.current?.matches(":hover")
      ) {
        handle.close();
      }
    };
    const restart = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(decide, SETTLE_MS);
    };
    const stop = () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointermove", restart);
    };

    return {
      isPending: () => pending !== null,
      switchTo: (row: Element) => {
        pending = row;
        restart();
        document.addEventListener("pointermove", restart);
      },
      stop,
    };
  });

  useEffect(() => intent.stop, [intent]);

  const onOpenChange = (
    open: boolean,
    details: PreviewCard.Root.ChangeEventDetails,
  ) => {
    const trigger = details.trigger ?? null;
    if (
      open &&
      details.reason === "trigger-hover" &&
      handle.isOpen &&
      trigger &&
      trigger !== active.current
    ) {
      details.cancel();
      intent.switchTo(trigger);
      return;
    }
    // the old row letting go while a switch is pending: the rest decides
    if (!open && intent.isPending()) {
      details.cancel();
      return;
    }
    if (open && trigger) active.current = trigger;
  };

  return (
    <CardHandle.Provider value={handle}>
      {children}
      {enabled ? (
        <PreviewCard.Root handle={handle} onOpenChange={onOpenChange}>
          {({ payload }) => (
            <PreviewCard.Portal>
              <PreviewCard.Positioner
                side="right"
                sideOffset={12}
                className="isolate z-50 transition-[top,left,right,bottom] duration-200 ease-out"
              >
                <PreviewCard.Popup
                  ref={popupRef}
                  className="h-(--popup-height,auto) w-80 origin-(--transform-origin) overflow-clip rounded-2xl bg-popover p-1.5 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-hidden transition-[height,opacity,scale] duration-200 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 dark:ring-foreground/10"
                >
                  <PreviewCard.Viewport className="relative size-full [&_[data-current]]:transition-opacity [&_[data-current]]:duration-200 [&_[data-current][data-starting-style]]:opacity-0 [&_[data-previous]]:w-full [&_[data-previous]]:transition-opacity [&_[data-previous]]:duration-100 [&_[data-previous][data-ending-style]]:opacity-0">
                    {payload ? <SkillCardBody skill={payload} /> : null}
                  </PreviewCard.Viewport>
                </PreviewCard.Popup>
              </PreviewCard.Positioner>
            </PreviewCard.Portal>
          )}
        </PreviewCard.Root>
      ) : null}
    </CardHandle.Provider>
  );
}

/** A row that shows the page's hover card for its skill. A click does nothing. */
export function SkillCardTrigger({
  skill,
  className,
  children,
}: {
  skill: Skill;
  className?: string;
  children: ReactNode;
}) {
  const handle = useContext(CardHandle) ?? undefined;

  return (
    <PreviewCard.Trigger
      handle={handle}
      payload={skill}
      delay={300}
      render={<div />}
      className={className}
    >
      {children}
    </PreviewCard.Trigger>
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
