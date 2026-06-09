/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
  type ReactNode,
} from "react";
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
import { Link } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  github?: string;
  tags: string[];
  featured: boolean;
  date: {
    start: string;
    end?: string;
    display: string;
  };
  priority: number;
  slug?: string;
  vercelSatori?: boolean;
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

const buildSortOptions = (t: any): SortOptionItem[] => [
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

// slug = deepdive
const createProjectsData = (t: any): Project[] => [
  {
    id: "kinoa",
    title: t.projects.list.kinoa.title,
    description: t.projects.list.kinoa.description,
    image: "/projects/kinoa.png",
    link: "https://kinoa.to",
    github: "https://github.com/lyfe691/kinoa",
    tags: [
      "Next.js",
      "shadcn/ui",
      "TypeScript",
      "Tailwind CSS",
      "TMDB API",
      "Streaming",
    ],
    featured: true,
    date: {
      start: "2025-11",
      display: "Nov 2025 - Present",
    },
    priority: 1,
    slug: "kinoa",
    vercelSatori: true,
  },
  {
    id: "luma",
    title: t.projects.list.luma.title,
    description: t.projects.list.luma.description,
    image: "/projects/luma.png",
    link: "https://luma.ysz.life",
    github: "https://github.com/lyfe691/luma",
    tags: [
      "Next.js 16",
      "Vercel AI SDK",
      "TypeScript",
      "Supabase",
      "shadcn/ui",
      "Tailwind CSS",
    ],
    featured: true,
    date: {
      start: "2026-03",
      end: "2026-04",
      display: "Mar 2026 - Apr 2026",
    },
    priority: 2,
    slug: "luma",
  },
  {
    id: "sola",
    title: t.projects.list.sola.title,
    description: t.projects.list.sola.description,
    image: "/projects/sola.png",
    link: "https://sola.ysz.life",
    github: "https://github.com/lyfe691/sola",
    tags: [
      "Portfolio",
      "shadcn/ui",
      "TypeScript",
      "React",
      "Vite",
      "Tailwind CSS",
    ],
    featured: true,
    date: {
      start: "2025-02",
      display: "Feb 2025 - Present",
    },
    priority: 3,
    slug: "sola",
  },
  {
    id: "applicare",
    title: t.projects.list.applicare.title,
    description: t.projects.list.applicare.description,
    image: "/projects/applicare.svg",
    link: "https://applicare.app",
    github: "https://github.com/lyfe691/AppliCare",
    tags: [
      "React (Vite)",
      "Spring Boot",
      "Ant Design",
      "MongoDB",
      "Java",
      "JavaScript",
      "Docker",
    ],
    featured: true,
    date: {
      start: "2024-12",
      end: "2025-02",
      display: "Dec 2024 - Feb 2025",
    },
    priority: 4,
    slug: "applicare",
  },
  {
    id: "self",
    title: t.projects.list.self.title,
    description: t.projects.list.self.description,
    image: "/projects/self.png",
    github: "https://github.com/lyfe691/self",
    tags: ["Neofetch", "Python", "Terminal", "Windows"],
    featured: true,
    date: {
      start: "2025-05",
      display: "May 2025",
    },
    priority: 5,
    slug: "self",
  },
  {
    id: "code-extractor",
    title: t.projects.list.codeExtractor.title,
    description: t.projects.list.codeExtractor.description + "(1000+ Users)",
    image: "/projects/website-code-extractor.svg",
    link: "https://chromewebstore.google.com/detail/website-code-extractor/foppgeakfpkdghmmmflmblcidoofpohm",
    github: "https://github.com/lyfe691/Website-Code-Extractor",
    tags: ["Chrome Extension", "JSZip", "HTML", "CSS", "JavaScript"],
    featured: true,
    date: {
      start: "2024-08",
      display: "Aug 2024",
    },
    priority: 6,
    slug: "code-extractor",
  },
  {
    id: "thoughts",
    title: t.projects.list.thoughts.title,
    description: t.projects.list.thoughts.description,
    image: "/projects/thoughts.svg",
    link: "https://thoughts.ysz.life",
    github: "https://github.com/lyfe691/thoughts",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
    featured: true,
    date: {
      start: "2025-08",
      display: "Aug 2025",
    },
    priority: 7,
    slug: "thoughts",
  },
  {
    id: "Taco",
    title: t.projects.list.taco.title,
    description: t.projects.list.taco.description,
    image: "/projects/taco.png",
    link: "https://takitwo.vercel.app",
    github: "https://github.com/lyfe691/taco",
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "i18n",
      "Localization",
      "Blog",
      "Template",
    ],
    featured: true,
    date: {
      start: "2025-04",
      display: "Apr 2025",
    },
    priority: 7,
    slug: "taco",
  },
  {
    id: "osint",
    title: t.projects.list.osint.title,
    description: t.projects.list.osint.description,
    image: "/projects/osint-website.svg",
    link: "https://osint.ysz.life",
    github: "https://github.com/lyfe691/osint-ysz-life",
    tags: ["React (Vite)", "shadcn/ui", "JavaScript"],
    featured: true,
    date: {
      start: "2024-11",
      end: "2024-12",
      display: "Nov 2024 - Dec 2024",
    },
    priority: 8,
  },
  {
    id: "chatapp",
    title: t.projects.list.chatapp.title,
    description: t.projects.list.chatapp.description,
    image: "/projects/chatapp.svg",
    link: "https://chat-app.ch",
    github: "https://github.com/lyfe691/chatapp",
    tags: [
      "React",
      "Spring Boot",
      "MongoDB",
      "Java",
      "JavaScript",
      "WebSocket",
    ],
    featured: true,
    date: {
      start: "2024-09",
      display: "Sep 2024",
    },
    priority: 9,
  },
  // non-featured projects
  {
    id: "vm-detector",
    title: t.projects.list.vmDetector.title,
    description: t.projects.list.vmDetector.description,
    github: "https://github.com/lyfe691/Virtual-Machine-Detector",
    tags: ["Java", "Virtual Machine", "Detection"],
    featured: false,
    date: {
      start: "2024-08",
      display: "Aug 2024",
    },
    priority: 10,
  },
  {
    id: "view-counter",
    title: t.projects.list.viewCounter.title,
    description: t.projects.list.viewCounter.description,
    github: "https://github.com/lyfe691/View_Counter",
    tags: ["Spring Boot", "Redis", "Java"],
    featured: false,
    date: {
      start: "2024-08",
      display: "Aug 2024",
    },
    priority: 11,
  },
  {
    id: "docker-service",
    title: t.projects.list.dockerService.title,
    description: t.projects.list.dockerService.description,
    github: "https://github.com/lyfe691/LB-WISS_169-347",
    tags: ["Docker", "Teamwork", "Documentation"],
    featured: false,
    date: {
      start: "2024-06",
      display: "Jun 2024",
    },
    priority: 12,
  },
  {
    id: "phishing",
    title: t.projects.list.phishing.title,
    description: t.projects.list.phishing.description,
    github: "https://github.com/lyfe691/phishing-website-tutorial",
    tags: ["HTML", "CSS", "JavaScript", "Node.js", "Tutorial"],
    featured: false,
    date: {
      start: "2024-04",
      display: "Apr 2024",
    },
    priority: 13,
  },
  {
    id: "otw",
    title: t.projects.list.otw.title,
    description: t.projects.list.otw.description,
    github: "https://github.com/lyfe691/OverTheWire-bandit",
    tags: ["Kali Linux", "OverTheWire", "Linux", "Tutorial", "Ethical Hacking"],
    featured: false,
    date: {
      start: "2024-04",
      display: "Apr 2024",
    },
    priority: 14,
  },
];

const cardClassName =
  "group h-full gap-0 overflow-hidden bg-card/40 p-0 backdrop-blur-md transition-shadow duration-300 hover:shadow-lg";

const ProjectImage = ({ project, t }: { project: Project; t: any }) => {
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
          "h-full w-full object-cover transition-all duration-300 ease-out group-hover:scale-105",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent md:hidden" />
      {usesVercelSatori && (
        <div className="pointer-events-none absolute bottom-2 left-2 translate-y-0.5 opacity-0 blur-[2px] transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:blur-[0px] md:bottom-3 md:left-3">
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

const TAG_GAP = 6;

const ProjectTags = ({ tags }: { tags: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;

    const compute = () => {
      if (disposed) return;
      const available = Math.floor(container.clientWidth);
      if (!available) return;

      const widths = Array.from(
        container.querySelectorAll<HTMLElement>("[data-measure='tag']"),
      ).map((el) => el.offsetWidth);
      const moreWidth =
        container.querySelector<HTMLElement>("[data-measure='more']")
          ?.offsetWidth ?? 0;

      let used = 0;
      let count = 0;
      for (let i = 0; i < widths.length; i++) {
        const width = widths[i] + (i > 0 ? TAG_GAP : 0);
        if (used + width > available) break;
        used += width;
        count++;
      }

      if (count < widths.length) {
        while (count > 0 && used + TAG_GAP + moreWidth > available) {
          used -= widths[count - 1] + (count - 1 > 0 ? TAG_GAP : 0);
          count--;
        }
      }

      setVisibleCount(count);
    };

    const observer = new ResizeObserver(compute);
    observer.observe(container);
    compute();
    document.fonts?.ready.then(compute);

    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [tags]);

  const hiddenCount = tags.length - visibleCount;

  return (
    <div ref={containerRef} className="relative flex gap-1.5 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 flex gap-1.5"
      >
        {tags.map((tag) => (
          <Badge
            key={tag}
            data-measure="tag"
            variant="secondary"
            className="font-normal"
          >
            {tag}
          </Badge>
        ))}
        <Badge data-measure="more" variant="secondary" className="font-normal">
          +{tags.length}
        </Badge>
      </div>

      {tags.slice(0, visibleCount).map((tag) => (
        <Badge key={tag} variant="secondary" className="font-normal">
          {tag}
        </Badge>
      ))}
      {hiddenCount > 0 && (
        <Tooltip>
          <TooltipTrigger
            render={
              <Badge
                variant="secondary"
                className="font-normal cursor-default"
              >
                +{hiddenCount}
              </Badge>
            }
          />
          <TooltipContent className="max-w-[220px] text-center">
            {tags.slice(visibleCount).join(", ")}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

const ProjectActions = ({ project, t }: { project: Project; t: any }) => {
  if (!project.slug && !project.github && !project.link) return null;

  return (
    <div className="flex flex-col gap-4 pt-2">
      <Separator />
      <div className="flex flex-col gap-3 sm:flex-row">
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
                className="w-full gap-2 sm:flex-1"
                render={
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <FaGithubAlt className="h-4 w-4" />
                {t.projects.viewGithub}
              </Button>
            )}
            {project.link && (
              <Button
                nativeButton={false}
                size="lg"
                className="w-full gap-2 sm:flex-1"
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

const ProjectBody = ({ project, t }: { project: Project; t: any }) => (
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
    {project.tags.length > 0 && <ProjectTags tags={project.tags} />}
    <ProjectActions project={project} t={t} />
  </div>
);

const ProjectCard = ({ project, t }: { project: Project; t: any }) =>
  project.image ? (
    <Card className={cardClassName}>
      <div className="grid md:grid-cols-2">
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
    const projects = createProjectsData(t);
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
                    const current = sortOptions.find(
                      (o) => o.value === sortBy,
                    );
                    return current ? (
                      <>
                        {current.icon}
                        {current.label}
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
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollReveal>

      {/* Featured Projects */}
      <div className="grid gap-6 sm:gap-8 mb-12 sm:mb-16">
        {featuredProjects.map((project, index) => (
          <ScrollReveal key={project.id} variant="default" delay={index * 10}>
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
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {otherProjects.map((project) => (
          <ScrollReveal key={project.id} variant="default" className="h-full">
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
            className="transition-all duration-300 group border-foreground/20 rounded-full"
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
