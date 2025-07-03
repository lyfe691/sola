/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, useMemo } from "react";
import { ExternalLink, Info, MoveRight, ArrowRight } from "lucide-react";
import { FaGithubAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { containerVariants, itemVariants, titleVariants, usePageInit } from "@/utils/transitions";

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
  priority: number; // Lower number = higher priority (appears first)
  slug?: string;
}

// Project configuration - easier to maintain
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
    priority: 1,
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
    priority: 2,
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
    priority: 3,
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
  // Non-featured projects
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

const Projects = () => {
  const isLoaded = usePageInit(100);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  // Memoized and sorted projects
  const { featuredProjects, otherProjects } = useMemo(() => {
    const projects = createProjectsData(t);
    
    // Sort by priority (lower number = higher priority)
    const sortedProjects = projects.sort((a, b) => a.priority - b.priority);
    
    return {
      featuredProjects: sortedProjects.filter(p => p.featured),
      otherProjects: sortedProjects.filter(p => !p.featured)
    };
  }, [t]);

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    }
  };

  const renderProjectCard = (project: Project, isFeatured: boolean = true) => (
    <motion.div
      key={project.id}
      variants={itemVariants}
      onHoverStart={() => setHoveredProject(project.id)}
      onHoverEnd={() => setHoveredProject(null)}
      className="relative grid max-sm:grid-cols-1 sm:grid-cols-[25px_1fr] sm:gap-6 md:gap-8"
    >
      {/* Timeline dot - hidden on very small screens */}
      <div className="relative max-sm:hidden">
        <motion.div 
          className="w-[15px] h-[15px] sm:w-[23px] sm:h-[23px] rounded-full border-2 
                    border-primary/40 bg-background transition-colors duration-300"
          animate={{
            borderColor: hoveredProject === project.id ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.4)",
            scale: hoveredProject === project.id ? 1.1 : 1
          }}
        />
      </div>
      
      {/* Project card with date above */}
      <div className="flex flex-col">
        <div className="mb-2 text-xs font-mono text-foreground/60 flex items-center">
          {/* Mobile timeline dot - only visible on small screens */}
          <div className="w-[10px] h-[10px] rounded-full border-[1.5px] border-primary/40 bg-background mr-2 sm:hidden" />
          {project.date.display}
        </div>
        
        {isFeatured ? (
          // Featured project layout
          <div className="group rounded-lg border border-foreground/10 
                   bg-foreground/5 backdrop-blur-sm hover:border-primary/20 
                   transition-all duration-300 overflow-hidden">
            <div className="grid md:grid-cols-2 h-full">
              {/* Image Section */}
              {project.image && (
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
              )}
              
              {/* Content Section */}
              <div className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
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

                <p className="text-foreground/60 text-sm mb-4 sm:mb-6 flex-grow">
                  {project.description}
                </p>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex flex-wrap gap-1.5 sm:gap-2"
                    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                  >
                    {project.tags.map((tag, i) => (
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
                  
                  {/* Links section with separator */}
                  {(project.slug || project.github || project.link) && (
                    <>
                      <div className="w-full h-px bg-foreground/10 mb-4"></div>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                        {project.slug ? (
                          // Show "View Details" button for projects with dedicated pages
                          <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full flex items-center justify-center gap-2 shadow-sm transition-all group border-foreground/20"
                          >
                            <Link to={`/projects/${project.slug}`}>
                              View Details
                              <MoveRight className="w-4 h-4 mr-1" />
                            </Link>
                          </Button>
                        ) : (
                          // Show external links for projects without dedicated pages
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
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // non featured project layout
          <div className="group p-4 sm:p-5 rounded-lg border border-foreground/10 
                       bg-foreground/5 backdrop-blur-sm hover:border-primary/20 
                       transition-all duration-300">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base sm:text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>
            </div>
            
            <p className="text-foreground/60 text-sm mb-3">
              {project.description}
            </p>
            
            <div className="space-y-4">
              <motion.div 
                className="flex flex-wrap gap-1.5 sm:gap-2"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              >
                {project.tags.map((tag, i) => (
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
              
              {/* Links section with separator */}
              {(project.slug || project.github || project.link) && (
                <>
                  <div className="w-full h-px bg-foreground/10 mb-4"></div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                    {project.slug ? (
                      // Show "View Details" button for projects with dedicated pages
                      <Button
                        asChild
                        variant="default"
                        size="lg"
                        className="w-full flex items-center justify-center gap-2 shadow-sm transition-all group"
                      >
                        <Link to={`/projects/${project.slug}`}>
                          <ArrowRight className="w-4 h-4 mr-1" />
                          View Details
                        </Link>
                      </Button>
                    ) : (
                      // Show external links for projects without dedicated pages
                      <>
                        {project.github && (
                          <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full flex items-center justify-center gap-2 shadow-sm transition-all duration-300 group border-foreground/20"
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
                            className="w-full flex items-center justify-center gap-2 shadow-sm transition-all duration-300"
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
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col w-full"
        >
          <Helmet>
            <title>Projects • Yanis Sebastian Zürcher</title>
          </Helmet>

          <motion.h1 
            variants={titleVariants}
            className="text-4xl font-bold mb-8 sm:mb-12 flex items-center gap-3"
          >
            {t.projects.title}
            <TooltipProvider>
              <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                <TooltipTrigger asChild>
                  <span 
                    className="cursor-help" 
                    onClick={() => setTooltipOpen(!tooltipOpen)}
                  >
                    <Info className="w-5 h-5 text-foreground/60 hover:text-primary transition-colors" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-background text-foreground mb-2">
                  <p className="text-sm">{t.projects.imageTooltip} <a href="https://og-playground.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vercel OG Image <ExternalLink className="w-4 h-4 pb-1 inline-block" /></a></p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.h1>
          
          {/* featured projects */}
          <div className="relative mb-12 sm:mb-16">
            {/* Timeline line - hidden on very small screens */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-foreground/10 ml-[7px] sm:ml-[11px] max-sm:hidden" />
            
            <div className="space-y-8 sm:space-y-12">
              {featuredProjects.map((project) => renderProjectCard(project, true))}
            </div>
          </div>

          {/* other projects */}
          <motion.h2 
            variants={itemVariants} 
            className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6"
          >
            {t.projects.other}
          </motion.h2>

          <div className="relative">
            {/* Timeline line - hidden on very small screens */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-foreground/10 ml-[7px] sm:ml-[11px] max-sm:hidden" />
            
            <div className="space-y-5 sm:space-y-8">
              {otherProjects.map((project) => renderProjectCard(project, false))}
            </div>
          </div>

          {/* view all projects button */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mt-12 sm:mt-16"
          >
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Projects;

