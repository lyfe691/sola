/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { memo, useMemo, useRef, useState, type ReactNode } from "react";
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
import { useLanguage, useTranslation } from "@/lib/language-provider";
import {
  PROJECT_SORT_OPTIONS,
  sortProjects,
  type ProjectSortOption,
} from "@/lib/project-sort";
import type { Translation } from "@/lib/translations";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/Reveal";
import { PrivateLinkButton } from "@/components/private-link-button";
import { useGridSwap } from "@/hooks/use-grid-swap";
import { RichText } from "@/components/i18n/RichText";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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

const cardClassName = "group h-full gap-0 overflow-hidden p-0";

/** The cover sits in the card the way the About page mounts its media: a
 *  6px mat, corners nesting inside the card's own radius (the card is
 *  rounded-4xl, so the inset radius is that minus the mat). No hairline:
 *  the date's notch cuts the outline, and a ring can't follow the cut. */
const coverClassName = "rounded-4xl-inner";

const ProjectActions = ({
  project,
  t,
}: {
  project: Project;
  t: Translation;
}) => {
  if (
    !project.slug &&
    !project.github &&
    !project.link &&
    !project.sourcePrivate &&
    !project.linkPrivate
  )
    return null;

  return (
    <div className="flex flex-wrap gap-3 pt-2">
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
          {!project.github && project.sourcePrivate && (
            <PrivateLinkButton
              label={t.projects.viewGithub}
              reason={
                project.kind === "commercial"
                  ? t.common.sourcePrivateClient
                  : t.common.sourcePrivate
              }
              icon={
                <HugeiconsIcon
                  icon={Github01Icon}
                  strokeWidth={2}
                  className="size-4"
                  aria-hidden="true"
                />
              }
              variant="default"
              className="flex-1"
            />
          )}
          {!project.link && project.linkPrivate && (
            <PrivateLinkButton
              label={t.projects.visitProject}
              reason={
                project.kind === "commercial"
                  ? t.common.linkPrivateClient
                  : t.common.linkPrivate
              }
              icon={
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  strokeWidth={2}
                  className="size-4"
                  aria-hidden="true"
                />
              }
              variant="default"
              className="flex-1"
            />
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

// memo: a re-sort re-renders the page with the same project objects, and the
// cards only need to move
const ProjectCard = memo(
  ({ project, t }: { project: Project; t: Translation }) => (
    <Card variant="translucent" lift className={cardClassName}>
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
              className="block px-5 py-2 font-mono text-2xs leading-4 font-bold tracking-label text-foreground uppercase sm:px-6"
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
  ),
);
ProjectCard.displayName = "ProjectCard";

const Projects = () => {
  const [sortBy, setSortBy] = useState<ProjectSortOption>("featured");
  const [kind, setKind] = useState<KindFilter>("all");
  // set by the first re-sort or filter: from then on every card is shown
  // outright, so a swap never lands a card that is still waiting to reveal
  const [settled, setSettled] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation();

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

  const all = useMemo(() => localizeProjects(t, language), [t, language]);
  const projects = useMemo(
    () =>
      sortProjects(
        all.filter((p) => kind === "all" || p.kind === kind),
        sortBy,
        INTL_LOCALE[language],
      ),
    [all, kind, sortBy, language],
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const gridSwap = useGridSwap(gridRef);
  const swap = (update: () => void) =>
    gridSwap(() => {
      setSettled(true);
      update();
    });

  return (
    <div className="flex flex-col w-full">
      <meta name="description" content={t.seo.projects.description} />

      <Reveal as="h1" className="mb-8 text-4xl font-bold sm:mb-12">
        {t.projects.title}
      </Reveal>
      <Reveal className="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={kind}
          onValueChange={(value: KindFilter) => swap(() => setKind(value))}
        >
          {/* spans the row on phones with equal tabs, like the sort
                select under it; content-sized from sm up */}
          <TabsList
            aria-label={t.projects.kind.label}
            className="w-full sm:w-fit"
          >
            {kindOptions.map(({ value, label }) => (
              <TabsTrigger key={value} value={value} className="flex-1">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Select
          value={sortBy}
          onValueChange={(value) =>
            swap(() => setSortBy(value as ProjectSortOption))
          }
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
      </Reveal>

      {/* keyed by project, so a re-sort moves cards instead of re-mounting
          them */}
      <div
        ref={gridRef}
        data-reveal-settled={settled ? "" : undefined}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
      >
        {projects.length === 0 && (
          <Reveal className="col-span-full">
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
          </Reveal>
        )}
        {projects.map((project) => (
          <Reveal key={project.id} className="h-full">
            <ProjectCard project={project} t={t} />
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default Projects;
