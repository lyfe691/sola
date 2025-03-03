/**
 * Copyright (c) 2025 Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../lib/language-provider";
import { translations } from "../lib/translations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SiReact, SiTypescript, SiNextdotjs, SiTailwindcss, SiVuedotjs,
  SiNodedotjs, SiPython, SiPostgresql, SiDocker,
  SiGit, SiGithub, SiLinux, SiNginx, SiSpringboot, SiMongodb,
  SiJavascript, SiOpenjdk, SiHtml5, SiCss3, SiRedis, SiKubernetes,
  SiJenkins,
  SiVite,
  SiAntdesign,
  SiMysql,
  SiGnubash,
  SiEagle,
  SiScrumalliance,
  SiLanguagetool
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

const Skills = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
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
        staggerChildren: 0.15
      }
    }
  };

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

  const skillGroups = [
    {
      title: "Frontend",
      skills: [
        { name: "HTML", icon: SiHtml5, level: 90},
        { name: "React", icon: SiReact, level: 75},
        { name: "Ant Design", icon: SiAntdesign, level: 70 },
        { name: "CSS", icon: SiCss3, level: 65 },
        { name: "JavaScript", icon: SiJavascript, level: 60 },  
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "MongoDB", icon: SiMongodb, level: 80 },
        { name: "Spring Boot", icon: SiSpringboot, level: 75 },
        { name: "Java", icon: FaJava, level: 70 },
        { name: "Nginx", icon: SiNginx, level: 61 },
        { name: "Redis", icon: SiRedis, level: 50 },
      ]
    },
    {
      title: "Tools",
      skills: [
        { name: "Git", icon: SiGit, level: 90 },
        { name: "Docker", icon: SiDocker, level: 80 },
        { name: "Linux", icon: SiLinux, level: 72 },
        { name: "Kubernetes", icon: SiKubernetes, level: 62 }
      ]
    }, 
    {
      title: "Other",
      skills: [
        { name: "Agile Methodologies", icon: SiEagle, level: 80 },
        { name: "CI/CD", icon: SiJenkins, level: 75 },
        { name: "Bash", icon: SiGnubash, level: 40 },
      ]
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
          <motion.h1 
            variants={titleVariants}
            className="text-4xl font-bold mb-8 sm:mb-12"
          >
            {t.skills.title}
          </motion.h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {skillGroups.map((group, groupIndex) => (
              <motion.div
                key={groupIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="p-5 sm:p-6 rounded-lg border border-foreground/10 
                         bg-foreground/5 backdrop-blur-sm"
              >
                <h2 className="text-xl font-medium mb-4 sm:mb-6">
                  {group.title === "Frontend" && t.skills.groups.frontend}
                  {group.title === "Backend" && t.skills.groups.backend}
                  {group.title === "Tools" && t.skills.groups.tools}
                  {group.title === "Other" && t.skills.groups.other}
                </h2>
                <div className="space-y-4 sm:space-y-5">
                  {group.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (groupIndex * 0.1) + (skillIndex * 0.1) }}
                      onHoverStart={() => setHoveredSkill(skill.name)}
                      onHoverEnd={() => setHoveredSkill(null)}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <skill.icon 
                            className={`w-5 h-5 transition-colors duration-300
                                      ${hoveredSkill === skill.name 
                                        ? 'text-primary' 
                                        : 'text-foreground/60'}`}
                          />
                          <span className="text-sm font-medium">{skill.name}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: (groupIndex * 0.1) + (skillIndex * 0.1) }}
                          className={`h-full transition-colors duration-300
                                    ${hoveredSkill === skill.name 
                                      ? 'bg-primary' 
                                      : 'bg-primary/60'}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Skills;

