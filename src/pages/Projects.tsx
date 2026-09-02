/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight01Icon,
  Calendar03Icon,
  Calendar04Icon,
  FileSearchIcon,
  Github01Icon,
  ArrowDownAZIcon,
  ArrowUpZAIcon,
  SortByDown01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Link } from "react-router";
import type { Language } from "@/config/languages";
import { formatProjectDate, INTL_LOCALE } from "@/lib/dates";
import { useLanguage } from "@/lib/language-provider";
import {
  PROJECT_SORT_OPTIONS,
  sortProjects,
  type ProjectSortOption,
} from "@/lib/project-sort";
import { translations, type Translation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconButton } from "@/components/ui/custom/icon-button";
import ScrollReveal from "@/components/ScrollReveal";
import {
  CONSUME_IN,
  HEADER_LEAD,
  staggerDelay,
  useEntranceWindow,
  scrollPageTitleVariants,
  scrollSubtleVariants,
} from "@/utils/transitions";
import { RichText } from "@/components/i18n/RichText";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TagRow } from "@/components/ui/custom/tag-row";
import {
  CoverCaption,
  PaintedCover,
} from "@/components/painted-cover/PaintedCover";
import { PROJECTS, type ProjectMeta } from "@/config/projects";

interface Project extends ProjectMeta {
  title: string;
  tagline: string;
  description: string;
  /** Preformatted for the active locale — set once in localizeProjects. */
  dateLabel: string;
}

type SortOptionItem = {
  value: ProjectSortOption;
  label: string;
  icon: ReactNode;
};

const SORT_ICONS: Record<ProjectSortOption, IconSvgElement> = {
  priority: StarIcon,
  "date-newest": Calendar03Icon,
  "date-oldest": Calendar04Icon,
  "name-asc": ArrowDownAZIcon,
  "name-desc": ArrowUpZAIcon,
};

const SORT_LABELS: Record<
  ProjectSortOption,
  keyof Translation["projects"]["sortOptions"]
> = {
  priority: "priority",
  "date-newest": "dateNewest",
  "date-oldest": "dateOldest",
  "name-asc": "nameAsc",
  "name-desc": "nameDesc",
};

const buildSortOptions = (t: Translation): SortOptionItem[] =>
  PROJECT_SORT_OPTIONS.map((value) => ({
    value,
    label: t.projects.sortOptions[SORT_LABELS[value]],
    icon: (
      <HugeiconsIcon
        icon={SORT_ICONS[value]}
        strokeWidth={2}
        className="size-4"
      />
    ),
  }));

const localizeProjects = (t: Translation, language: Language): Project[] => {
  const locale = INTL_LOCALE[language];
  const present = t.common.present;
  return PROJECTS.map((p) => ({
    ...p,
    title: t.projects.list[p.i18nKey].title,
    tagline: t.projects.list[p.i18nKey].tagline,
    description: t.projects.list[p.i18nKey].description,
    dateLabel: formatProjectDate(locale, p.date, present),
  }));
};

const cardClassName =
  "group h-full gap-0 overflow-hidden bg-card/40 p-0 backdrop-blur-md transition-shadow duration-300 hover:shadow-lg";

const ProjectActions = ({
  project,
  t,
}: {
  project: Project;
  t: Translation;
}) => {
  if (!project.slug && !project.github && !project.link) return null;

  return (
    <div className="flex flex-col gap-4 pt-2">
      <Separator />
      <div className="flex flex-wrap gap-3">
        {project.slug ? (
          <IconButton
            nativeButton={false}
            render={<Link to={`/projects/${project.slug}`} />}
            label={t.projects.viewDetails}
            icon={
              <HugeiconsIcon
                icon={FileSearchIcon}
                strokeWidth={2}
                className="size-4"
              />
            }
            size="lg"
            fullWidth
          />
        ) : (
          <>
            {project.github && (
              <Button
                nativeButton={false}
                size="lg"
                className="flex-1 gap-2"
                render={
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <HugeiconsIcon
                  icon={Github01Icon}
                  strokeWidth={2}
                  className="size-4"
                  aria-hidden="true"
                />
                {t.projects.viewGithub}
              </Button>
            )}
            {project.link && (
              <Button
                nativeButton={false}
                size="lg"
                className="flex-1 gap-2"
                render={
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
                {t.projects.visitProject}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ProjectBody = ({ project, t }: { project: Project; t: Translation }) => (
  <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
    <time
      className="font-mono text-xs text-foreground/60"
      dateTime={project.date.start}
    >
      {project.dateLabel}
    </time>
    <p className="flex-1 text-sm text-foreground/60">
      <RichText text={project.description} />
    </p>
    {project.technologies.length > 0 && <TagRow tags={project.technologies} />}
    <ProjectActions project={project} t={t} />
  </div>
);

const ProjectCard = ({ project, t }: { project: Project; t: Translation }) => (
  <Card className={cardClassName}>
    <PaintedCover art={project.art} size="card">
      <CoverCaption as="h2" title={project.title} subtitle={project.tagline} />
    </PaintedCover>
    <ProjectBody project={project} t={t} />
  </Card>
);

/**
 * The grid of cards. Keyed by the sort under AnimatePresence, so a re-sort
 * dissolves the old grid and mounts this one fresh — every card that lands
 * in view then rises in one cascade, the way the page loaded, and the
 * covers re-create their canvases through the mount queue. A fresh mount
 * also reopens the cascade window.
 */
const listExit = {
  opacity: 0,
  transition: { duration: 0.24, ease: CONSUME_IN },
};

const ProjectGrid = ({
  projects,
  t,
  lead = 0,
  className,
}: {
  projects: Project[];
  t: Translation;
  /** Wait for the page chrome before the first card (load only). */
  lead?: number;
  className: string;
}) => {
  const entering = useEntranceWindow();

  return (
    <motion.div exit={listExit} className={className}>
      {projects.map((project, index) => (
        <ScrollReveal
          key={project.id}
          delay={entering ? lead + staggerDelay(index) : 0}
          className="h-full"
        >
          <ProjectCard project={project} t={t} />
        </ScrollReveal>
      ))}
    </motion.div>
  );
};

const Projects = () => {
  const [sortBy, setSortBy] = useState<ProjectSortOption>("priority");
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  // at load the cards wait for the page chrome; the grid re-mounts on a
  // re-sort, so afterwards they only stagger among themselves
  const entering = useEntranceWindow();

  const sortOptions = useMemo(() => buildSortOptions(t), [t]);
  const projects = useMemo(
    () =>
      sortProjects(
        localizeProjects(t, language),
        sortBy,
        INTL_LOCALE[language],
      ),
    [t, language, sortBy],
  );

  return (
    <div className="flex flex-col w-full">
      <meta name="description" content={t.seo.projects.description} />

      {/* title then sort — one cascade so the toolbar never lands after the
          first card it sits on */}
      <ScrollReveal variant="header">
        <motion.h1
          variants={scrollPageTitleVariants}
          className="mb-8 text-4xl font-bold sm:mb-12"
        >
          {t.projects.title}
        </motion.h1>
        <motion.div
          variants={scrollSubtleVariants}
          className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <HugeiconsIcon
              icon={SortByDown01Icon}
              strokeWidth={2}
              className="size-4 text-foreground/60"
            />
            <span className="text-sm font-medium text-foreground/60">
              {t.projects.sortBy}:
            </span>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as ProjectSortOption)}
            >
              <SelectTrigger className="w-[160px] sm:w-[180px]">
                <SelectValue placeholder={t.projects.selectSorting}>
                  {() => {
                    const current = sortOptions.find((o) => o.value === sortBy);
                    return current ? (
                      <>
                        {current.icon}
                        <span className="flex-1 truncate-fade">
                          {current.label}
                        </span>
                      </>
                    ) : null;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.icon}
                      <span className="flex-1 truncate-fade">
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </ScrollReveal>

      <AnimatePresence mode="wait">
        <ProjectGrid
          key={sortBy}
          projects={projects}
          t={t}
          lead={entering ? HEADER_LEAD : 0}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
        />
      </AnimatePresence>

      {/* View All Projects Button */}
      <ScrollReveal variant="default">
        <div className="flex justify-center mt-12 sm:mt-16">
          <IconButton
            variant="default"
            size="lg"
            icon={
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                strokeWidth={2}
                className="size-4"
              />
            }
            className="transition-colors duration-150 group border-foreground/20 rounded-full"
            label={t.projects.viewAll}
            onClick={() =>
              window.open(
                "https://github.com/lyfe691?tab=repositories",
                "_blank",
                "noopener,noreferrer",
              )
            }
          />
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Projects;
