/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowUpRight01Icon,
  Calendar03Icon,
  Calendar04Icon,
  FileSearchIcon,
  Folder01Icon,
  Github01Icon,
  ArrowDownAZIcon,
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconButton } from "@/components/ui/custom/icon-button";
import { SegmentedControl } from "@/components/ui/custom/segmented-control";
import ScrollReveal from "@/components/ScrollReveal";
import { useGridSwap, type GridSwap } from "@/hooks/use-grid-swap";
import {
  gridCellVariants,
  HEADER_LEAD,
  staggerDelay,
  useEntranceWindow,
  scrollPageTitleVariants,
  scrollSubtleVariants,
  type GridCellCustom,
} from "@/utils/transitions";
import { RichText } from "@/components/i18n/RichText";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { TagRow } from "@/components/ui/custom/tag-row";
import {
  CoverCaption,
  PaintedCover,
} from "@/components/painted-cover/PaintedCover";
import {
  PROJECTS,
  type ProjectKind,
  type ProjectMeta,
} from "@/config/projects";

interface Project extends ProjectMeta {
  title: string;
  tagline: string;
  description: string;
  /** Preformatted for the active locale — set once in localizeProjects. */
  dateLabel: string;
}

/** The kind tabs: every project, or one kind. */
type KindFilter = "all" | ProjectKind;

type SortOptionItem = {
  value: ProjectSortOption;
  label: string;
  icon: ReactNode;
};

const SORT_ICONS: Record<ProjectSortOption, IconSvgElement> = {
  featured: StarIcon,
  newest: Calendar03Icon,
  oldest: Calendar04Icon,
  name: ArrowDownAZIcon,
};

const buildSortOptions = (t: Translation): SortOptionItem[] =>
  PROJECT_SORT_OPTIONS.map((value) => ({
    value,
    label: t.projects.sortOptions[value],
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

/** The cover sits in the card the way the About page mounts its media: a
 *  6px mat, corners nesting inside the card's own radius (the card is
 *  rounded-4xl, so the inset radius is that minus the mat). No hairline:
 *  the date's notch cuts the outline, and a ring can't follow the cut. */
const coverClassName = "rounded-[calc(var(--radius-4xl)_-_0.375rem)]";

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
  <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
    <p className="flex-1 text-sm text-foreground/60">
      <RichText text={project.description} />
    </p>
    {project.technologies.length > 0 && <TagRow tags={project.technologies} />}
    <ProjectActions project={project} t={t} />
  </div>
);

const ProjectCard = ({ project, t }: { project: Project; t: Translation }) => (
  <Card className={cardClassName}>
    <div className="p-1.5 pb-0">
      <PaintedCover
        art={project.art}
        size="card"
        live={false}
        className={coverClassName}
        // the date is part of the painting: set into a notch in its corner,
        // on the card's surface, left-aligned with the caption below. Set
        // like a readout — bold mono caps, tracked — so it holds its own
        // against the art instead of whispering beside it
        notch={
          <time
            dateTime={project.date.start}
            className="block px-5 py-2 font-mono text-[11px] leading-4 font-bold tracking-[0.14em] text-foreground uppercase sm:px-6"
          >
            {project.dateLabel}
          </time>
        }
      >
        <CoverCaption
          as="h2"
          title={project.title}
          subtitle={project.tagline}
        />
      </PaintedCover>
    </div>
    <ProjectBody project={project} t={t} />
  </Card>
);

/**
 * One slot of the grid. At rest a cell reveals on scroll like every card on
 * the site. While a swap runs, a cell whose occupant changed dissolves where
 * it is and re-enters in its new slot instead; a card that has arrived
 * through a swap is simply shown from then on — it never waits on a scroll
 * reveal again, so one that landed just under the fold can't fade back out.
 */
const ProjectCell = ({
  project,
  t,
  delay,
  swap,
  arrived,
}: {
  project: Project;
  t: Translation;
  /** load-cascade delay (ms), 0 once the page has entered */
  delay: number;
  swap: GridSwap | null;
  arrived: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const phase = swap?.changed.has(project.id) ? swap.phase : null;
  const state =
    phase === "out"
      ? "swapOut"
      : phase === "in" || arrived
        ? "swapIn"
        : inView
          ? "visible"
          : "hidden";
  const custom: GridCellCustom = {
    delay,
    rank: swap?.rank.get(project.id) ?? 0,
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={state}
      variants={gridCellVariants}
      custom={custom}
      className="h-full"
    >
      <ProjectCard project={project} t={t} />
    </motion.div>
  );
};

const Projects = () => {
  const [sortBy, setSortBy] = useState<ProjectSortOption>("featured");
  const [kind, setKind] = useState<KindFilter>("all");
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  // at load the cards wait for the page chrome and cascade; a swap keeps its
  // own clock, so after the window a card only ever rises on scroll
  const entering = useEntranceWindow();

  const sortOptions = useMemo(() => buildSortOptions(t), [t]);
  const kindOptions = useMemo(
    () =>
      [
        { value: "all", label: t.projects.kind.all },
        { value: "personal", label: t.projects.kind.personal },
        { value: "commercial", label: t.projects.kind.commercial },
      ] as const,
    [t],
  );

  // every project, localized: the universe the grid's ids resolve against,
  // so a card leaving through the filter keeps its data while it exits
  const all = useMemo(() => localizeProjects(t, language), [t, language]);
  const byId = useMemo(() => new Map(all.map((p) => [p.id, p])), [all]);
  const order = useMemo(
    () =>
      sortProjects(
        all.filter((p) => kind === "all" || p.kind === kind),
        sortBy,
        INTL_LOCALE[language],
      ).map((p) => p.id),
    [all, kind, sortBy, language],
  );
  const { shownIds, swap, arrived } = useGridSwap(order);
  const shown = shownIds.flatMap((id) => byId.get(id) ?? []);

  return (
    <div className="flex flex-col w-full">
      <meta name="description" content={t.seo.projects.description} />

      {/* title then toolbar — one cascade so the toolbar never lands after
          the first card it sits on */}
      <ScrollReveal variant="header">
        <motion.h1
          variants={scrollPageTitleVariants}
          className="mb-8 text-4xl font-bold sm:mb-12"
        >
          {t.projects.title}
        </motion.h1>
        <motion.div
          variants={scrollSubtleVariants}
          className="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-center sm:justify-between"
        >
          <SegmentedControl
            value={kind}
            onValueChange={setKind}
            options={kindOptions}
            aria-label={t.projects.kind.label}
          />
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as ProjectSortOption)}
          >
            <SelectTrigger
              aria-label={t.projects.sortBy}
              className="w-full sm:w-44"
            >
              <HugeiconsIcon
                icon={SortByDown01Icon}
                strokeWidth={2}
                className="size-4"
                aria-hidden="true"
              />
              <SelectValue>{() => t.projects.sortOptions[sortBy]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t.projects.sortBy}</SelectLabel>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.icon}
                    <span>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </motion.div>
      </ScrollReveal>

      {/* keyed by project, so a re-order moves cards instead of re-mounting
          them; the swap driver decides which cells animate */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        {shown.length === 0 && (
          <motion.div
            variants={gridCellVariants}
            initial="swapOut"
            animate="swapIn"
            className="col-span-full"
          >
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} />
                </EmptyMedia>
                <EmptyTitle>{t.projects.empty}</EmptyTitle>
                <EmptyDescription>
                  {t.projects.emptyDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </motion.div>
        )}
        {shown.map((project, index) => (
          <ProjectCell
            key={project.id}
            project={project}
            t={t}
            delay={entering ? HEADER_LEAD + staggerDelay(index) : 0}
            swap={swap}
            arrived={arrived.has(project.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
