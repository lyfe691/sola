/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../lib/language-provider";
import { translations } from "../lib/translations";
import { ReactOriginal, TypescriptOriginal, DockerOriginal, JavascriptOriginal, AntdesignOriginal, TailwindcssOriginal, NextjsOriginal, MongodbOriginal, SpringOriginal, NginxOriginal, RedisOriginal, NodejsOriginal, BashOriginal, GitOriginal, VisualstudioOriginal, VscodeOriginal, LinuxOriginal, BunOriginal, EslintLineWordmark, EslintOriginal, KubernetesOriginal, GrafanaOriginal, JenkinsOriginal, PythonOriginal, JavaOriginal } from "devicons-react";
import { 
  SiEagle,
  SiShadcnui,
  SiKalilinux,
  SiOpensourceinitiative,
} from "react-icons/si";
import { containerVariants, itemVariants, titleVariants, usePageInit } from "@/utils/transitions";

const Skills = () => {
  const isLoaded = usePageInit(100);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language];

  const skillGroups = [
    {
      title: "Frontend",
      skills: [
        { name: "React", icon: ReactOriginal, level: 80},
        { name: "Next.js", icon: NextjsOriginal, level: 80 },
        { name: "shadcn/ui", icon: SiShadcnui, level: 70 },
        { name: "Tailwind CSS", icon: TailwindcssOriginal, level: 65 },
        { name: "Ant Design", icon: AntdesignOriginal, level: 60 },
        { name: "JavaScript", icon: JavascriptOriginal, level: 60 },  
        { name: "TypeScript", icon: TypescriptOriginal, level: 50 },
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "MongoDB", icon: MongodbOriginal, level: 80 },
        { name: "Spring Boot", icon: SpringOriginal, level: 75 },
        { name: "Java", icon: JavaOriginal, level: 70 },
        { name: "Nginx", icon: NginxOriginal, level: 61 },
        { name: "Redis", icon: RedisOriginal, level: 50 },
        { name: "Node.js", icon: NodejsOriginal, level: 40 },
        { name: "Bash for automation", icon: BashOriginal, level: 35 },
      ]
    },
    {
      title: "Tools",
      skills: [
        { name: "Git", icon: GitOriginal, level: 90 },
        { name: "Visual Studio Code", icon: VscodeOriginal, level: 80},
        { name: "Docker", icon: DockerOriginal, level: 75 },
        { name: "Linux", icon: LinuxOriginal, level: 72 },
        { name: "Bun", icon: BunOriginal, level: 71 },
        { name: "ESLint", icon: EslintOriginal, level: 70 },
        { name: "Kubernetes", icon: KubernetesOriginal, level: 62 },
        { name: "Grafana", icon: GrafanaOriginal, level: 60 }
      ]
    },
    {
      title: "Other",
      skills: [
        { name: "Agile Methodologies", icon: SiEagle, level: 80 },
        { name: "CI/CD", icon: JenkinsOriginal, level: 75 },
        { name: "OSINT", icon: SiOpensourceinitiative, level: 70 },
        { name: "Kali Linux", icon: SiKalilinux, level: 60 },
        { name: "Python", icon: PythonOriginal, level: 45}
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

          <Helmet>
            <title>Skills • Yanis Sebastian Zürcher</title>
          </Helmet>

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
                variants={itemVariants}
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
                            className={" transition-colors duration-300"}
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

