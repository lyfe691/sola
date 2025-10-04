/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, useMemo } from "react";
import {
  ArrowUpRight,
  MoveRight,
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
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Combobox, type ComboboxOption } from "@/components/ui/custom/combobox";
import { IconButton } from "@/components/ui/custom/icon-button";
import ScrollReveal from "@/components/ScrollReveal";
import { RichText } from "@/components/i18n/RichText";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const buildSortOptions = (t: any): ComboboxOption[] => [
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
      "SEO",
    ],
    featured: true,
    date: {
      start: "2025-02",
      display: "Feb 2025 - Present",
    },
    priority: 1,
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
      "SEO",
    ],
    featured: true,
    date: {
      start: "2024-12",
      end: "2025-02",
      display: "Dec 2024 - Feb 2025",
    },
    priority: 2,
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
    priority: 3,
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
    priority: 4,
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
    priority: 5,
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
    priority: 5,
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
    priority: 6,
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
    priority: 7,
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
    priority: 7,
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
    priority: 8,
  },
  {
    id: "docker-service",
    title: t.projects.list.dockerService.title,
    description: t.projects.list.dockerService.description,
    github: "https://github.com/lyfe691/LB-WISS_169-347",
    tags: [
      "Docker",
      "Docker Compose",
      "MediaWiki",
      "Nextcloud",
      "Gogs",
      "Teamwork",
      "Documentation",
    ],
    featured: false,
    date: {
      start: "2024-06",
      display: "Jun 2024",
    },
    priority: 9,
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
    priority: 10,
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
    priority: 11,
  },
];

// Extracted components for better organization
const ProjectImage = ({
  project,
  hoveredProject,
  t,
}: {
  project: Project;
  hoveredProject: string | null;
  t: any;
}) => {
  if (!project.image) return null;
  const usesVercelSatori = project.vercelSatori ?? true;

  return (
    <div className="relative h-[200px] md:h-full overflow-hidden bg-foreground/5">
      <motion.img
        src={project.image}
        alt={project.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        animate={{
          scale: hoveredProject === project.id ? 1.05 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:hidden" />
      {usesVercelSatori && (
        <motion.div
          className="absolute left-2 bottom-2 md:left-3 md:bottom-3 pointer-events-none"
          initial={{ opacity: 0, y: 2, filter: "blur(2px)" }}
          animate={{
            opacity: hoveredProject === project.id ? 1 : 0,
            y: hoveredProject === project.id ? 0 : 2,
            filter: hoveredProject === project.id ? "blur(0px)" : "blur(2px)",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="inline-flex items-center px-2 py-[2px] md:px-2.5 md:py-1 rounded-full bg-background/60 backdrop-blur-sm ring-1 ring-foreground/10 shadow-sm pointer-events-auto">
            <span className="text-[10px] md:text-xs font-medium leading-none text-foreground/80">
              <RichText
                text={t.projects.satoriAttribution}
                linkClassName="text-foreground/80 hover:text-primary underline underline-offset-2 decoration-foreground/30 hover:decoration-primary transition-colors"
              />
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ProjectHeader = ({
  project,
  hoveredProject,
}: {
  project: Project;
  hoveredProject: string | null;
}) => (
  <div className="flex items-start justify-between mb-2">
    <motion.h3
      className="text-lg sm:text-xl font-medium text-foreground group-hover:text-primary transition-colors"
      animate={{
        color:
          hoveredProject === project.id
            ? "hsl(var(--primary))"
            : "hsl(var(--foreground))",
      }}
    >
      {project.title}
    </motion.h3>
  </div>
);

const ProjectDate = ({ date }: { date: Project["date"] }) => (
  <div className="mb-3 text-xs font-mono text-foreground/60">
    {date.display}
  </div>
);

const ProjectDescription = ({ description }: { description: string }) => (
  <p className="text-foreground/60 text-sm mb-4 sm:mb-6 flex-grow">
    <RichText text={description} />
  </p>
);

const ProjectTags = ({ tags }: { tags: string[] }) => {
  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 },
    },
  };

  return (
    <motion.div
      className="flex flex-wrap gap-1.5 sm:gap-2"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      {tags.map((tag, i) => (
        <motion.span
          key={i}
          variants={tagVariants}
          className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-foreground/5 
                   text-foreground/60 border border-foreground/10
                   transition-colors duration-300
                   hover:border-primary/20 hover:text-primary/80"
        >
          {tag}
        </motion.span>
      ))}
    </motion.div>
  );
};

const ProjectActions = ({ project, t }: { project: Project; t: any }) => {
  if (!project.slug && !project.github && !project.link) return null;

  return (
    <>
      <div className="w-full h-px bg-foreground/10 mb-4"></div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
        {project.slug ? (
          <Link to={`/projects/${project.slug}`} className="w-full">
            <IconButton
              label={t.projects.viewDetails}
              icon={<FileSearch className="w-4 h-4" />}
              variant="default"
              size="lg"
              className="w-full flex items-center justify-center gap-2 shadow-sm transition-all"
            />
          </Link>
        ) : (
          <>
            {project.github && (
              <Button
                asChild
                variant="default"
                size="lg"
                className="w-full flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithubAlt className="w-4 h-4 mr-1" />
                  {t.projects.viewGithub}
                </a>
              </Button>
            )}
            {project.link && (
              <Button
                asChild
                variant="default"
                size="lg"
                className="w-full flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  {t.projects.visitProject}
                </a>
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
};

const ProjectContent = ({ project, t }: { project: Project; t: any }) => (
  <div className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
    <ProjectHeader project={project} hoveredProject={null} />
    <ProjectDate date={project.date} />
    <ProjectDescription description={project.description} />

    <div className="space-y-4">
      <ProjectTags tags={project.tags} />
      <ProjectActions project={project} t={t} />
    </div>
  </div>
);

const ProjectCard = ({
  project,
  hoveredProject,
  onHover,
  onHoverEnd,
  t,
}: {
  project: Project;
  hoveredProject: string | null;
  onHover: () => void;
  onHoverEnd: () => void;
  t: any;
}) => {
  const cardClassName =
    "group rounded-lg border border-foreground/10 bg-foreground/5 backdrop-blur-sm hover:border-primary/20 transition-all duration-300";

  return (
    <motion.div
      key={project.id}
      onHoverStart={onHover}
      onHoverEnd={onHoverEnd}
      className="relative"
    >
      {project.featured ? (
        <div className={`${cardClassName} overflow-hidden`}>
          <div className="grid md:grid-cols-2 h-full">
            <ProjectImage
              project={project}
              hoveredProject={hoveredProject}
              t={t}
            />
            <ProjectContent project={project} t={t} />
          </div>
        </div>
      ) : (
        <div className={cardClassName}>
          <ProjectContent project={project} t={t} />
        </div>
      )}
    </motion.div>
  );
};

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
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

  const handleProjectClick = (slug: string | undefined) => {
    if (slug) {
      window.location.href = `/projects/${slug}`;
    }
  };

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
            <Combobox
              options={sortOptions}
              value={sortBy}
              onValueChange={(value: string) => setSortBy(value as SortOption)}
              placeholder={t.projects.selectSorting}
              searchPlaceholder={t.projects.searchPlaceholder}
              emptyMessage={t.projects.emptyMessage}
              className="w-[160px] sm:w-[180px]"
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Featured Projects */}
      <div className="grid gap-6 sm:gap-8 mb-12 sm:mb-16">
        {featuredProjects.map((project, index) => (
          <ScrollReveal key={project.id} variant="default" delay={index * 10}>
            <ProjectCard
              project={project}
              hoveredProject={hoveredProject}
              onHover={() => setHoveredProject(project.id)}
              onHoverEnd={() => setHoveredProject(null)}
              t={t}
            />
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal variant="title">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <h2 className="text-2xl font-semibold break-words">
            {t.projects.other}
          </h2>
          <div className="relative group shrink-0">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 hover:text-primary transition-colors duration-300 group-hover:text-primary cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                className="bg-background/85 backdrop-blur-sm"
                side="right"
                align="center"
              >
                {t.projects.otherInfo}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </ScrollReveal>

      {/* Other Projects */}
      <div className="grid gap-4 sm:gap-6">
        {otherProjects.map((project, index) => (
          <ScrollReveal key={project.id} variant="default">
            <ProjectCard
              project={project}
              hoveredProject={hoveredProject}
              onHover={() => setHoveredProject(project.id)}
              onHoverEnd={() => setHoveredProject(null)}
              t={t}
            />
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
