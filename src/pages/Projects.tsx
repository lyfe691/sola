/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { useState, useEffect } from "react";
import { ExternalLink, Github, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../lib/language-provider";
import { translations } from "../lib/translations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Project {
  title: string;
  description: string;
  image?: string;
  link?: string;
  github?: string;
  tags: string[];
  featured: boolean;
  date: string;
}

const Projects = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const projects: Project[] = [
    {
      title: t.projects.list.sola.title,
      description: t.projects.list.sola.description,
      image: "/projects/sola.png",
      link: "https://sola.ysz.life",
      github: "https://github.com/lyfe691/sola",
      tags: ["Portfolio", "shadcn/ui", "TypeScript", "React", "Vite", "Tailwind CSS", "SEO"],
      featured: true,
      date: "Feb 2025 - Present"
    },
    {
      title: t.projects.list.codeExtractor.title,
      description: t.projects.list.codeExtractor.description + " (600+ Users)",
      image: "/projects/website-code-extractor.svg",
      link: "https://chromewebstore.google.com/detail/website-code-extractor/foppgeakfpkdghmmmflmblcidoofpohm",
      github: "https://github.com/lyfe691/Website-Code-Extractor",
      tags: ["Chrome Extension", "JSZip", "HTML", "CSS", "JavaScript"],
      featured: true,
      date: "Aug 2024"
    },
    {
      title: t.projects.list.applicare.title,
      description: t.projects.list.applicare.description,
      image: "/projects/applicare.jpg",
      link: "https://applicare.app",
      github: "https://github.com/lyfe691/AppliCare",
      tags: ["React (Vite)", "Spring Boot", "Ant Design", "MongoDB", "Java", "JavaScript", "Docker", "SEO"],
      featured: true,
      date: "Dec 2024 - Feb 2025"
    },
    {
      title: t.projects.list.osint.title,
      description: t.projects.list.osint.description,
      image: "/projects/osint-website.svg",
      link: "https://osint.ysz.life",
      github: "https://github.com/lyfe691/osint-ysz-life",
      tags: ["React (Vite)", "shadcn/ui", "JavaScript"],
      featured: true,
      date: "Nov 2024 - Dec 2024"
    },
    {
      title: t.projects.list.chatapp.title,
      description: t.projects.list.chatapp.description,
      image: "/projects/chatapp.svg",
      link: "https://chat-app.ch",
      github: "https://github.com/lyfe691/chatapp",
      tags: ["React", "Spring Boot", "MongoDB", "Java", "JavaScript", "WebSocket"],
      featured: true,
      date: "Sep 2024"
    },
    {
      title: t.projects.list.vmDetector.title,
      description: t.projects.list.vmDetector.description,
      github: "https://github.com/lyfe691/Virtual-Machine-Detector",
      tags: ["Java", "Virtual Machine", "Detection"],
      featured: false,
      date: "Aug 2024"
    },
    {
      title: t.projects.list.viewCounter.title,
      description: t.projects.list.viewCounter.description,
      github: "https://github.com/lyfe691/View_Counter",
      tags: ["Spring Boot", "Redis", "Java"],
      featured: false,
      date: "Aug 2024"
    },
    {
      title: t.projects.list.dockerService.title,
      description: t.projects.list.dockerService.description,
      github: "https://github.com/lyfe691/LB-WISS_169-347",
      tags: ["Docker", "Docker Compose", "MediaWiki", "Nextcloud", "Gogs", "Teamwork", "Documentation"],
      featured: false,
      date: "Jun 2024"
    },
    {
      title: t.projects.list.phishing.title,
      description: t.projects.list.phishing.description,
      github: "https://github.com/lyfe691/phishing-website-tutorial",
      tags: ["HTML", "CSS", "JavaScript", "Node.js", "Tutorial"],
      featured: false,
      date: "Apr 2024"
    },
    {
      title: t.projects.list.otw.title,
      description: t.projects.list.otw.description,
      github: "https://github.com/lyfe691/OverTheWire-bandit",
      tags: ["Kali Linux", "OverTheWire", "Linux", "Tutorial", "Ethical Hacking"],
      featured: false,
      date: "Apr 2024"
    }
  ];

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col w-full"
        >
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
          <div className="space-y-8 sm:space-y-10 md:space-y-12 mb-12 sm:mb-16">
            {projects.filter(p => p.featured).map((project, index) => (
              <motion.div
                key={project.title}
                variants={itemVariants}
                onHoverStart={() => setHoveredProject(project.title)}
                onHoverEnd={() => setHoveredProject(null)}
                className="group rounded-lg border border-foreground/10 
                         bg-foreground/5 backdrop-blur-sm hover:border-primary/20 
                         transition-all duration-300 overflow-hidden"
              >
                <div className="grid md:grid-cols-2 h-full">
                  {/* Image Section */}
                  {project.image && (
                    <div className="relative h-[240px] md:h-full overflow-hidden bg-foreground/5">
                      <motion.img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                        animate={{
                          scale: hoveredProject === project.title ? 1.05 : 1
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
                  <div className="p-5 sm:p-6 md:p-8 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-2">
                      <motion.h3 
                        className="text-xl font-medium text-foreground group-hover:text-primary transition-colors"
                        animate={{
                          color: hoveredProject === project.title ? "hsl(var(--primary))" : "hsl(var(--foreground))"
                        }}
                      >
                        {project.title}
                      </motion.h3>
                      <div className="flex items-center gap-3 text-foreground/40">
                        {project.github && (
                          <motion.a 
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Github className="w-5 h-5" />
                          </motion.a>
                        )}
                        {project.link && (
                          <motion.a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ExternalLink className="w-5 h-5" />
                          </motion.a>
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-mono text-foreground/40 mb-4">
                      {project.date}
                    </span>
                    
                    <p className="text-foreground/60 text-sm mb-6 flex-grow">
                      {project.description}
                    </p>
                    
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                    >
                      {project.tags.map((tag, i) => (
                        <motion.span 
                          key={i}
                          variants={tagVariants}
                          className="text-xs px-2 py-1 rounded-md bg-foreground/5 
                                   text-foreground/60 border border-foreground/10
                                   transition-colors duration-300
                                   hover:border-primary/20 hover:text-primary/80"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* other proj */}
          <motion.h2 
            variants={itemVariants} 
            className="text-2xl font-bold mb-6 sm:mb-8"
          >
            {t.projects.other}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.filter(p => !p.featured).map((project, index) => (
              <motion.div
                key={project.title}
                variants={itemVariants}
                className="group p-5 sm:p-6 rounded-lg border border-foreground/10 
                         bg-foreground/5 backdrop-blur-sm hover:border-primary/20 
                         transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-3 text-foreground/40">
                    {project.github && (
                      <motion.a 
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github className="w-4 h-4" />
                      </motion.a>
                    )}
                    {project.link && (
                      <motion.a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.a>
                    )}
                  </div>
                </div>

                <span className="text-xs font-mono text-foreground/40 mb-3 sm:mb-4 block">
                  {project.date}
                </span>
                
                <p className="text-foreground/60 text-sm mb-3 sm:mb-4">
                  {project.description}
                </p>
                
                <motion.div 
                  className="flex flex-wrap gap-2"
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                >
                  {project.tags.map((tag, i) => (
                    <motion.span 
                      key={i}
                      variants={tagVariants}
                      className="text-xs px-2 py-1 rounded-md bg-foreground/5 
                               text-foreground/60 border border-foreground/10
                               transition-colors duration-300
                               hover:border-primary/20 hover:text-primary/80"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Projects;

