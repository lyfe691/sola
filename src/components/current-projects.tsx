/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { CaretRightIcon } from "@phosphor-icons/react";
import { useState, type ReactElement } from "react";
import { BarDrawer } from "@/components/bar-drawer";
import { PaintedCover } from "@/components/painted-cover/PaintedCover";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PROJECTS } from "@/config/projects";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowScrollLock } from "@/hooks/use-window-scroll-lock";
import { formatProjectDate, INTL_LOCALE } from "@/lib/dates";
import { useLanguage } from "@/lib/language-provider";
import { Link } from "@/lib/locale-router";
import { cn } from "@/lib/utils";

const currentProjects = PROJECTS.flatMap((project) =>
  project.date.end === "present" && project.slug
    ? [{ ...project, to: `/projects/${project.slug}` }]
    : [],
).sort((a, b) => a.priority - b.priority);

function ProjectPicker({ trigger }: { trigger: ReactElement }) {
  const { language, t } = useLanguage();
  const mobile = useIsMobile();
  const [open, setOpen] = useState(false);
  // BarDrawer owns the page scroll lock while the mobile sheet is open.
  useWindowScrollLock(open && !mobile);

  const list = (
    <ul className="grid gap-2">
      {currentProjects.map((project) => {
        const { title, tagline } = t.projects.list[project.i18nKey];
        return (
          <li key={project.id}>
            <Link
              to={project.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3.5 rounded-2xl p-2.5 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <PaintedCover
                art={project.art}
                size="hero"
                live={false}
                scrim="none"
                className="aspect-[4/3] w-20 shrink-0 rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <span className="text-base leading-tight font-semibold tracking-tight">
                  {title}
                </span>
                <p className="mt-0.5 text-xs-plus leading-snug text-foreground/80">
                  {tagline}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {formatProjectDate(
                    INTL_LOCALE[language],
                    project.date,
                    t.common.present,
                  )}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return mobile ? (
    <BarDrawer
      trigger={trigger}
      title={t.index.currentProjects}
      open={open}
      onOpenChange={setOpen}
    >
      {list}
    </BarDrawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[85dvh] grid-rows-[auto_minmax(0,1fr)] gap-3 p-4">
        <DialogHeader className="px-1 pt-2 pr-10">
          <DialogTitle>{t.index.currentProjects}</DialogTitle>
        </DialogHeader>
        <div
          data-lenis-prevent
          className="min-h-0 overflow-y-auto overscroll-contain p-1"
        >
          {list}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CurrentProjects() {
  const { language, t } = useLanguage();
  if (currentProjects.length === 0) return null;

  const names = new Intl.ListFormat(INTL_LOCALE[language], {
    type: "conjunction",
  }).format(
    currentProjects.map((project) => t.projects.list[project.i18nKey].title),
  );
  // Keep the translated space beside the names when the intro is ellipsized.
  const [prefix, space, suffix] =
    t.index.currentlyWorkingOn.split(/(\s*)\{projects\}/);
  const single = currentProjects.length === 1 ? currentProjects[0] : undefined;
  const pill = (
    <Button
      variant="glass"
      size="sm"
      data-current-projects=""
      nativeButton={!single}
      render={single ? <Link to={single.to} /> : undefined}
      // eslint-disable-next-line shadcn/no-restyle -- the nav track's rim: the glass shows under its hairline; a phone's pill is a size down
      className="max-w-full bg-clip-border max-sm:h-7 max-sm:pl-2.5"
    >
      <span className="flex min-w-0 items-baseline text-left text-2xs leading-snug font-normal text-muted-foreground sm:text-xs-plus">
        <span className="truncate">{prefix}</span>
        <span className="max-w-full shrink-0 truncate whitespace-pre">
          {space}
          <strong
            className={cn(
              "shimmer shimmer-color-primary shimmer-duration-3600 font-semibold text-foreground/80",
              "in-[.light]:shimmer-color-muted-foreground in-[.light]:text-foreground",
              "in-[.dark]:shimmer-color-white in-[.dark]:text-muted-foreground/85",
            )}
          >
            {names}
          </strong>
          {suffix}
        </span>
      </span>
      <span
        aria-hidden="true"
        data-icon="inline-end"
        // the button's pr-2 less this margin, plus its hairline, is the
        // circle's inset above and below: the circle stays concentric
        className="-mr-1.25 ml-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground sm:size-6"
      >
        <CaretRightIcon className="size-3 sm:size-3.5" aria-hidden="true" />
      </span>
    </Button>
  );

  return (
    <Reveal className="relative z-30 mb-3 sm:mb-4 md:mb-5">
      {single ? pill : <ProjectPicker trigger={pill} />}
    </Reveal>
  );
}
