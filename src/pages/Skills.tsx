/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { ReactOriginal, TypescriptOriginal, DockerOriginal, JavascriptOriginal, AntdesignOriginal, TailwindcssOriginal, NextjsOriginal, MongodbOriginal, SpringOriginal, NginxOriginal, RedisOriginal, NodejsOriginal, BashOriginal, GitOriginal, VisualstudioOriginal, VscodeOriginal, LinuxOriginal, BunOriginal, EslintLineWordmark, EslintOriginal, KubernetesOriginal, GrafanaOriginal, JenkinsOriginal, PythonOriginal, JavaOriginal } from "devicons-react";
import { 
  SiEagle,
  SiShadcnui,
  SiKalilinux,
  SiOpensourceinitiative,
} from "react-icons/si";
import ScrollReveal from "@/components/ScrollReveal";

const Skills = () => {
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

  const getGroupTitle = (title: string) => {
    const titleMap = {
      "Frontend": t.skills.groups.frontend,
      "Backend": t.skills.groups.backend,
      "Tools": t.skills.groups.tools,
      "Other": t.skills.groups.other
    };
    return titleMap[title as keyof typeof titleMap] || title;
  };

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>Skills • Yanis Sebastian Zürcher</title>
      </Helmet>

      <ScrollReveal variant="pageTitle">
        <h1 className="text-4xl font-bold mb-8 sm:mb-12">
          {t.skills.title}
        </h1>
      </ScrollReveal>
          
      {/* Grid with forced equal heights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 md:grid-rows-2">
        {skillGroups.map((group, groupIndex) => (
          <ScrollReveal key={groupIndex} variant="default" delay={groupIndex * 100}>
            <div className="h-full p-5 sm:p-6 rounded-lg border border-foreground/10 
                           bg-foreground/5 backdrop-blur-sm flex flex-col">
              {/* Header */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl font-medium">
                  {getGroupTitle(group.title)}
                </h2>
              </div>
              
              {/* Skills List - fills remaining space */}
              <div className="flex-1 space-y-4 sm:space-y-5">
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
                        <skill.icon className="transition-colors duration-300" />
                        <span className="text-sm font-medium">{skill.name}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: (groupIndex * 0.1) + (skillIndex * 0.1) }}
                        className={`h-full transition-colors duration-300 ${
                          hoveredSkill === skill.name ? 'bg-primary' : 'bg-primary/60'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default Skills;

