/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, useMemo, type ReactNode } from "react";
import {
  ArrowUpRight,
  SortAsc,
  Star,
  Calendar,
  CalendarClock,
  ArrowDownAZ,
  ArrowUpAZ,
  FileSearch,
  Info,
} from "lucide-react";
import { FaGithubAlt } from "react-icons/fa";
import { Link } from "react-router";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
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
import { RichText } from "@/components/i18n/RichText";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TagRow } from "@/components/ui/custom/tag-row";
import { cn } from "@/lib/utils";
import { PROJECTS, type ProjectMeta } from "@/config/projects";

interface Project extends ProjectMeta {
  title: string;
  description: string;
}

type SortOption =
  | "priority"
  | "date-newest"
  | "date-oldest"
  | "name-asc"
  | "name-desc";

type SortOptionItem = {
  value: SortOption;
  label: string;
  icon: ReactNode;
};

const buildSortOptions = (t: Translation): SortOptionItem[] => [
  {
    value: "priority",
    label: t.projects.sortOptions.priority,
    icon: <Star className="w-4 h-4" />,
  },
  {
    value: "date-newest",
    label: t.projects.sortOptions.dateNewest,
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    value: "date-oldest",
    label: t.projects.sortOptions.dateOldest,
    icon: <CalendarClock className="w-4 h-4" />,
  },
  {
    value: "name-asc",
    label: t.projects.sortOptions.nameAsc,
    icon: <ArrowDownAZ className="w-4 h-4" />,
  },
  {
    value: "name-desc",
    label: t.projects.sortOptions.nameDesc,
    icon: <ArrowUpAZ className="w-4 h-4" />,
  },
];

const localizeProjects = (t: Translation): Project[] =>
  PROJECTS.map((p) => ({
    ...p,
    title: t.projects.list[p.i18nKey].title,
    description: t.projects.list[p.i18nKey].description,
  }));

const cardClassName =
  "group h-full gap-0 overflow-hidden bg-card/40 p-0 backdrop-blur-md transition-shadow duration-300 hover:shadow-lg";

const ProjectImage = ({ project, t }: { project: Project; t: Translation }) => {
  const [loaded, setLoaded] = useState(false);

  if (!project.image) return null;
  const usesVercelSatori = project.vercelSatori ?? true;

  return (
    <div className="relative h-[200px] overflow-hidden bg-foreground/5 md:h-full md:min-h-[280px]">
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full object-cover transition-[transform,translate,scale,rotate,opacity,filter] duration-200 ease-out can-hover:group-hover:scale-105",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent md:hidden" />
      {usesVercelSatori && (
        <div className="pointer-events-none absolute bottom-2 left-2 translate-y-0.5 opacity-0 blur-[2px] transition-[opacity,filter,transform,translate,scale,rotate] duration-300 ease-out can-hover:group-hover:translate-y-0 can-hover:group-hover:opacity-100 can-hover:group-hover:blur-[0px] md:bottom-3 md:left-3">
          <div className="pointer-events-auto inline-flex items-center rounded-full bg-background/60 px-2 py-[2px] shadow-xs ring-1 ring-foreground/10 backdrop-blur-xs md:px-2.5 md:py-1">
            <span className="text-[10px] font-medium leading-none text-foreground/80 md:text-xs">
              <RichText
                text={t.projects.satoriAttribution}
                linkClassName="text-foreground/80 hover:text-primary underline underline-offset-2 decoration-foreground/30 hover:decoration-primary transition-colors"
              />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

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
            icon={<FileSearch className="h-4 w-4" />}
            size="lg"
            className="w-full"
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
                <FaGithubAlt className="h-4 w-4" aria-hidden="true" />
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
                <ArrowUpRight className="h-4 w-4" />
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
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-medium text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl">
        {project.title}
      </h3>
      <span className="font-mono text-xs text-foreground/60">
        {project.date.display}
      </span>
    </div>
    <p className="flex-1 text-sm text-foreground/60">
      <RichText text={project.description} />
    </p>
    {project.technologies.length > 0 && (
      <TagRow tags={project.technologies} />
    )}
    <ProjectActions project={project} t={t} />
  </div>
);

const ProjectCard = ({ project, t }: { project: Project; t: Translation }) =>
  project.featured && project.image ? (
    <Card className={cardClassName}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <ProjectImage project={project} t={t} />
        <ProjectBody project={project} t={t} />
      </div>
    </Card>
  ) : (
    <Card className={cardClassName}>
      <ProjectBody project={project} t={t} />
    </Card>
  );

const Projects = () => {
  const [sortBy, setSortBy] = useState<SortOption>("priority");
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  const { featuredProjects, otherProjects, sortOptions } = useMemo(() => {
    const projects = localizeProjects(t);
    const sortOptions = buildSortOptions(t);

    const sortedProjects = [...projects].sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return a.priority - b.priority;
        case "date-newest":
          return (
            new Date(b.date.start).getTime() - new Date(a.date.start).getTime()
          );
        case "date-oldest":
          return (
            new Date(a.date.start).getTime() - new Date(b.date.start).getTime()
          );
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return a.priority - b.priority;
      }
    });

    return {
      featuredProjects: sortedProjects.filter((p) => p.featured),
      otherProjects: sortedProjects.filter((p) => !p.featured),
      sortOptions,
    };
  }, [t, sortBy]);

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>{t.seo.projects.title}</title>
        <meta name="description" content={t.seo.projects.description} />
      </Helmet>

      <ScrollReveal variant="pageTitle">
        <h1 className="text-4xl font-bold mb-8 sm:mb-12">{t.projects.title}</h1>
      </ScrollReveal>

      {/* Sort Controls */}
      <ScrollReveal variant="default">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12">
          <div className="flex items-center gap-3">
            <SortAsc className="w-4 h-4 text-foreground/60" />
            <span className="text-sm text-foreground/60 font-medium">
              {t.projects.sortBy}:
            </span>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-[160px] sm:w-[180px]">
                <SelectValue placeholder={t.projects.selectSorting}>
                  {() => {
                    const current = sortOptions.find((o) => o.value === sortBy);
                    return current ? (
                      <>
                        {current.icon}
                        <span className="truncate">{current.label}</span>
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
                      <span className="min-w-0 truncate">{option.label}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollReveal>

      {/* Featured Projects */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {featuredProjects.map((project, index) => (
          <ScrollReveal
            key={project.id}
            variant="default"
            delay={Math.min(index * 60, 360)}
          >
            <ProjectCard project={project} t={t} />
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal variant="title">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <h2 className="text-2xl font-semibold wrap-break-word">
            {t.projects.other}
          </h2>
          <div className="relative group shrink-0">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Info className="w-4 h-4 hover:text-primary transition-colors duration-300 group-hover:text-primary cursor-help" />
                }
              />
              <TooltipContent side="right" align="center">
                {t.projects.otherInfo}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </ScrollReveal>

      {/* Other Projects */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {otherProjects.map((project, index) => (
          <ScrollReveal
            key={project.id}
            variant="default"
            delay={Math.min(index * 60, 360)}
            className="h-full"
          >
            <ProjectCard project={project} t={t} />
          </ScrollReveal>
        ))}
      </div>

      {/* View All Projects Button */}
      <ScrollReveal variant="default">
        <div className="flex justify-center mt-12 sm:mt-16">
          <IconButton
            variant="default"
            size="lg"
            icon={<ArrowUpRight className="w-4 h-4" />}
            className="transition-colors duration-150 group border-foreground/20 rounded-full"
            label={t.projects.viewAll}
            onClick={() =>
              window.open(
                "https://github.com/lyfe691?tab=repositories",
                "_blank",
              )
            }
          />
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Projects;
