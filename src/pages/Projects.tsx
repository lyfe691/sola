/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, useMemo } from "react";
import { 
  ExternalLink, 
  Info, 
  MoveRight, 
  SortAsc, 
  Star, 
  Calendar, 
  CalendarClock,
  ArrowDownAZ,
  ArrowUpAZ
} from "lucide-react";
import { FaGithubAlt } from "react-icons/fa";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconButton } from "@/components/ui/custom/IconButton";
import ScrollReveal from "@/components/ScrollReveal";

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
}

type SortOption = 'priority' | 'date-newest' | 'date-oldest' | 'name-asc' | 'name-desc';

const sortOptions: ComboboxOption[] = [
  {
    value: 'priority',
    label: 'Priority',
    icon: <Star className="w-4 h-4" />
  },
  {
    value: 'date-newest',
    label: 'Date (Newest)',
    icon: <Calendar className="w-4 h-4" />
  },
  {
    value: 'date-oldest',
    label: 'Date (Oldest)',
    icon: <CalendarClock className="w-4 h-4" />
  },
  {
    value: 'name-asc',
    label: 'Name (A-Z)',
    icon: <ArrowDownAZ className="w-4 h-4" />
  },
  {
    value: 'name-desc',
    label: 'Name (Z-A)',
    icon: <ArrowUpAZ className="w-4 h-4" />
  }
];

const createProjectsData = (t: any): Project[] => [
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
      display: "May 2025"
    },
    priority: 3,
    slug: "self"
  },
  {
    id: "sola",
    title: t.projects.list.sola.title,
    description: t.projects.list.sola.description,
    image: "/projects/sola.png",
    link: "https://sola.ysz.life",
    github: "https://github.com/lyfe691/sola",
    tags: ["Portfolio", "shadcn/ui", "TypeScript", "React", "Vite", "Tailwind CSS", "SEO"],
    featured: true,
    date: {
      start: "2025-02",
      display: "Feb 2025 - Present"
    },
    priority: 1,
    slug: "sola"
  },
  {
    id: "applicare",
    title: t.projects.list.applicare.title,
    description: t.projects.list.applicare.description,
    image: "/projects/applicare.svg",
    link: "https://applicare.app",
    github: "https://github.com/lyfe691/AppliCare",
    tags: ["React (Vite)", "Spring Boot", "Ant Design", "MongoDB", "Java", "JavaScript", "Docker", "SEO"],
    featured: true,
    date: {
      start: "2024-12",
      end: "2025-02",
      display: "Dec 2024 - Feb 2025"
    },
    priority: 2,
    slug: "applicare"
  },
  {
    id: "code-extractor",
    title: t.projects.list.codeExtractor.title,
    description: t.projects.list.codeExtractor.description + " (600+ Users)",
    image: "/projects/website-code-extractor.svg",
    link: "https://chromewebstore.google.com/detail/website-code-extractor/foppgeakfpkdghmmmflmblcidoofpohm",
    github: "https://github.com/lyfe691/Website-Code-Extractor",
    tags: ["Chrome Extension", "JSZip", "HTML", "CSS", "JavaScript"],
    featured: true,
    date: {
      start: "2024-08",
      display: "Aug 2024"
    },
    priority: 4,
    slug: "code-extractor"
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
      display: "Nov 2024 - Dec 2024"
    },
    priority: 5
  },
  {
    id: "chatapp",
    title: t.projects.list.chatapp.title,
    description: t.projects.list.chatapp.description,
    image: "/projects/chatapp.svg",
    link: "https://chat-app.ch",
    github: "https://github.com/lyfe691/chatapp",
    tags: ["React", "Spring Boot", "MongoDB", "Java", "JavaScript", "WebSocket"],
    featured: true,
    date: {
      start: "2024-09",
      display: "Sep 2024"
    },
    priority: 6
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
      display: "Aug 2024"
    },
    priority: 7
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
      display: "Aug 2024"
    },
    priority: 8
  },
  {
    id: "docker-service",
    title: t.projects.list.dockerService.title,
    description: t.projects.list.dockerService.description,
    github: "https://github.com/lyfe691/LB-WISS_169-347",
    tags: ["Docker", "Docker Compose", "MediaWiki", "Nextcloud", "Gogs", "Teamwork", "Documentation"],
    featured: false,
    date: {
      start: "2024-06",
      display: "Jun 2024"
    },
    priority: 9
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
      display: "Apr 2024"
    },
    priority: 10
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
      display: "Apr 2024"
    },
    priority: 11
  }
];

// Extracted components for better organization
const ProjectImage = ({ project, hoveredProject }: { project: Project; hoveredProject: string | null }) => {
  if (!project.image) return null;
  
  return (
    <div className="relative h-[200px] md:h-full overflow-hidden bg-foreground/5">
      <motion.img 
        src={project.image} 
        alt={project.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        animate={{
          scale: hoveredProject === project.id ? 1.05 : 1
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:hidden" />
    </div>
  );
};

const ProjectHeader = ({ project, hoveredProject }: { project: Project; hoveredProject: string | null }) => (
  <div className="flex items-start justify-between mb-2">
    <motion.h3 
      className="text-lg sm:text-xl font-medium text-foreground group-hover:text-primary transition-colors"
      animate={{
        color: hoveredProject === project.id ? "hsl(var(--primary))" : "hsl(var(--foreground))"
      }}
    >
      {project.title}
    </motion.h3>
  </div>
);

const ProjectDate = ({ date }: { date: Project['date'] }) => (
  <div className="mb-3 text-xs font-mono text-foreground/60">
    {date.display}
  </div>
);

const ProjectDescription = ({ description }: { description: string }) => (
  <p className="text-foreground/60 text-sm mb-4 sm:mb-6 flex-grow">
    {description}
  </p>
);

const ProjectTags = ({ tags }: { tags: string[] }) => {
  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    }
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
              variant="outline"  
              size="lg"
              className="w-full flex items-center justify-center gap-2 shadow-sm transition-all group border-foreground/20"
            />
          </Link>
        ) : (
          <>
            {project.github && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-2 shadow-sm transition-all group border-foreground/20"
              >
                <a 
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithubAlt className="w-4 h-4 mr-1" />
                  GitHub
                </a>
              </Button>
            )}
            {project.link && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-2 shadow-sm transition-all group border-foreground/20"
              >
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Visit Project
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

const ProjectCard = ({ project, hoveredProject, onHover, onHoverEnd, t }: {
  project: Project;
  hoveredProject: string | null;
  onHover: () => void;
  onHoverEnd: () => void;
  t: any;
}) => {
  const cardClassName = "group rounded-lg border border-foreground/10 bg-foreground/5 backdrop-blur-sm hover:border-primary/20 transition-all duration-300";
  
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
            <ProjectImage project={project} hoveredProject={hoveredProject} />
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
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const { language } = useLanguage();
  const t = translations[language];

  const { featuredProjects, otherProjects } = useMemo(() => {
    const projects = createProjectsData(t);
    
    const sortedProjects = [...projects].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return a.priority - b.priority;
        case 'date-newest':
          return new Date(b.date.start).getTime() - new Date(a.date.start).getTime();
        case 'date-oldest':
          return new Date(a.date.start).getTime() - new Date(b.date.start).getTime();
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return a.priority - b.priority;
      }
    });
    
    return {
      featuredProjects: sortedProjects.filter(p => p.featured),
      otherProjects: sortedProjects.filter(p => !p.featured)
    };
  }, [t, sortBy]);

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>Projects • Yanis Sebastian Zürcher</title>
      </Helmet>

      <ScrollReveal variant="title">
        <h1 className="text-4xl font-bold mb-8 sm:mb-12 flex items-center gap-3">
          {t.projects.title}
          <TooltipProvider>
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <TooltipTrigger asChild>
                <Info 
                  className="w-5 h-5 text-foreground/60 hover:text-primary transition-colors cursor-help" 
                  onClick={() => setTooltipOpen(!tooltipOpen)}
                />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs sm:max-w-none bg-background text-foreground">
                <p className="text-sm">
                  {t.projects.imageTooltip}{' '}
                  <a 
                    href="https://og-playground.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Vercel OG Image <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
      </ScrollReveal>

      {/* Sort Controls */}
      <ScrollReveal variant="default">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12">
            <div className="flex items-center gap-3">
              <SortAsc className="w-4 h-4 text-foreground/60" />
              <span className="text-sm text-foreground/60 font-medium">{t.projects.sortBy}:</span>
              <Combobox
                options={sortOptions}
                value={sortBy}
                onValueChange={(value: string) => setSortBy(value as SortOption)}
                placeholder="Select sorting..."
                searchPlaceholder="Search options..."
                emptyMessage="No option found."
                className="w-[160px] sm:w-[180px]"
              />
            </div>
          </div>
        </ScrollReveal>
          
      {/* Featured Projects */}
      <div className="grid gap-6 sm:gap-8 mb-12 sm:mb-16">
        {featuredProjects.map((project, index) => (
          <ScrollReveal key={project.id} variant="default" delay={index * 100}>
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

      {/* Other Projects */}
      <ScrollReveal variant="title">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
          {t.projects.other}
        </h2>
      </ScrollReveal>

      <div className="grid gap-4 sm:gap-6">
        {otherProjects.map((project, index) => (
          <ScrollReveal key={project.id} variant="default" delay={index * 80}>
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
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-6 py-3 bg-gradient-to-r from-foreground/5 to-foreground/10 
                       border-foreground/20 hover:border-primary/40 backdrop-blur-sm
                       shadow-lg hover:shadow-xl transition-all duration-300
                       text-foreground hover:text-primary font-medium"
          >
            <a href="https://github.com/lyfe691?tab=repositories" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              {t.projects.viewAll}
              <MoveRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Projects;