/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../lib/language-provider";
import { translations } from "../lib/translations";
import { containerVariants, itemVariants, titleVariants, usePageInit } from "@/utils/transitions";
import { Helmet } from "react-helmet-async";

const Experience = () => {
  const isLoaded = usePageInit(100);
  const [hoveredExp, setHoveredExp] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language];

  const experiences = [
    {
      period: t.experience.period.wiss,
      role: t.experience.wiss.role,
      company: t.experience.wiss.company,
      companyLink: "https://www.wiss.ch/",
      location: t.experience.wiss.location,
      description: t.experience.wiss.description,
      achievements: t.experience.wiss.achievements,
      technologies: ["React", "TypeScript", "JavaScript", "Project Management", "Teamwork", "Java", "Spring Boot", "MongoDB", "Docker", "Git", "Linux", "Figma"]
    },
    {
      period: t.experience.period.sek,
      role: t.experience.sek.role,
      company: t.experience.sek.company,
      companyLink: "https://www.stadt-zuerich.ch/schulen/de/lachenzelg.html",
      location: t.experience.sek.location,
      description: t.experience.sek.description,
      achievements: t.experience.sek.achievements,
      technologies: ["MINT", "English", "German", "French", "Office 365"]
    }
  ];

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
            <title>Experience • Yanis Sebastian Zürcher</title>
          </Helmet>

          <motion.h1 
            variants={titleVariants}
            className="text-4xl font-bold mb-8 sm:mb-12"
          >
            {t.experience.title}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-foreground/60 mb-8 sm:mb-12 max-w-2xl"
          >
            {t.experience.subtitle}
          </motion.p>
          
          <div className="relative space-y-8 sm:space-y-12">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-foreground/10 ml-[7px] sm:ml-[11px]" />
            
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredExp(exp.role)}
                onHoverEnd={() => setHoveredExp(null)}
                className="relative grid grid-cols-[20px_1fr] sm:grid-cols-[25px_1fr] gap-4 sm:gap-6 md:gap-8"
              >
                <div>
                  <motion.div 
                    className="w-[15px] h-[15px] sm:w-[23px] sm:h-[23px] rounded-full border-2 
                              border-primary/40 bg-background transition-colors duration-300"
                    animate={{
                      borderColor: hoveredExp === exp.role ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.4)",
                      scale: hoveredExp === exp.role ? 1.1 : 1
                    }}
                  />
                </div>

                <div className="pb-6 sm:pb-8">
                  <span className="text-xs font-mono text-foreground/40 mb-2 block">
                    {exp.period}
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <h3 className="text-lg font-medium text-primary">
                      {exp.role}
                    </h3>
                    <span className="hidden sm:block text-foreground/40">•</span>
                    <a 
                      href={exp.companyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-sm font-medium text-foreground/60 
                               hover:text-foreground transition-colors"
                    >
                      {exp.company}
                      <ExternalLink className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 
                                             group-hover:translate-y-0 transition-all duration-300" />
                    </a>
                  </div>
                  <p className="text-sm text-foreground/40 mb-4">
                    {exp.location}
                  </p>
                  <p className="text-sm text-foreground/70 mb-5 sm:mb-6 leading-relaxed">
                    {exp.description}
                  </p>
                  
                  <div className="space-y-2 mb-5 sm:mb-6">
                    {exp.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                        <span className="text-primary">-</span>
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-md bg-foreground/5 
                                 text-foreground/60 border border-foreground/10
                                 hover:border-primary/20 hover:text-primary
                                 transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Experience;

