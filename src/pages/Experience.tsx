/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Helmet } from "react-helmet-async";
import ScrollReveal from "@/components/ScrollReveal";

const Experience = () => {
  const [hoveredExp, setHoveredExp] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  type EmploymentType =
    | "full_time"
    | "part_time"
    | "contract"
    | "internship"
    | "freelance";
  type LocationType = "onsite" | "remote" | "hybrid";

  const work = [
    {
      period: t.experience.period.gz,
      role: t.experience.gz.role,
      company: t.experience.gz.company,
      companyLink: "https://www.gesundheitswelt-zollikerberg.ch/",
      location: t.experience.gz.location,
      locationType: "hybrid" as LocationType,
      employmentType: "internship" as EmploymentType,
      description: t.experience.gz.description,
      achievements: t.experience.gz.achievements,
      technologies: [
        "Identity & Access Management (IAM)",
        "Python",
        "Powershell",
        "Git",
        "Automation",
        "Active Directory",
        "Teamwork",
      ],
    },
    {
      period: t.experience.period.freelance,
      role: t.experience.freelance.role,
      company: t.experience.freelance.company,
      companyLink: "https://sola.ysz.life/services",
      location: t.experience.freelance.location,
      locationType: "remote" as LocationType,
      employmentType: "part_time" as EmploymentType,
      description: t.experience.freelance.description,
      achievements: t.experience.freelance.achievements,
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Spring Boot",
        "Java",
        "Git",
      ],
    },
  ];

  const education = [
    {
      period: t.experience.period.wiss,
      role: t.experience.wiss.role,
      company: t.experience.wiss.company,
      companyLink: "https://www.wiss.ch/",
      location: t.experience.wiss.location,
      locationType: "onsite" as LocationType,
      employmentType: "full_time" as EmploymentType,
      description: t.experience.wiss.description,
      achievements: t.experience.wiss.achievements,
      technologies: [
        "React",
        "TypeScript",
        "JavaScript",
        "Project Management",
        "Teamwork",
        "Java",
        "Spring Boot",
        "MongoDB",
        "Docker",
        "Git",
        "Linux",
        "Figma",
      ],
    },
    {
      period: t.experience.period.sek,
      role: t.experience.sek.role,
      company: t.experience.sek.company,
      companyLink: "https://www.stadt-zuerich.ch/schulen/de/lachenzelg.html",
      location: t.experience.sek.location,
      locationType: "onsite" as LocationType,
      employmentType: "full_time" as EmploymentType,
      description: t.experience.sek.description,
      achievements: t.experience.sek.achievements,
      technologies: ["MINT", "English", "German", "French", "Office 365"],
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>{t.seo.experience.title}</title>
        <meta name="description" content={t.seo.experience.description} />
      </Helmet>

      <ScrollReveal variant="pageTitle">
        <h1 className="text-4xl font-bold mb-8 sm:mb-12">
          {t.experience.title}
        </h1>
      </ScrollReveal>

      <ScrollReveal variant="default">
        <p className="text-foreground/60 mb-8 sm:mb-12 max-w-2xl">
          {t.experience.subtitle}
        </p>
      </ScrollReveal>

      {/* Work */}
      <div className="relative space-y-8 sm:space-y-12 mb-12">
        <ScrollReveal variant="default">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">
              {t.experience.sections?.work ?? "Work"}
            </h2>
            <div className="h-px flex-1 bg-foreground/10" />
          </div>
        </ScrollReveal>
        <div className="absolute left-0 top-10 bottom-0 w-px bg-foreground/10 ml-[7px] sm:ml-[11px]" />
        {work.map((exp, index) => (
          <ScrollReveal key={index} variant="default" delay={index * 160}>
            <motion.div
              onHoverStart={() => setHoveredExp(exp.role)}
              onHoverEnd={() => setHoveredExp(null)}
              className="relative grid grid-cols-[20px_1fr] sm:grid-cols-[25px_1fr] gap-4 sm:gap-6 md:gap-8"
            >
              <div>
                <motion.div
                  className="w-[15px] h-[15px] sm:w-[23px] sm:h-[23px] rounded-full border-2 
                            border-primary/40 bg-background transition-colors duration-300"
                  animate={{
                    borderColor:
                      hoveredExp === exp.role
                        ? "hsl(var(--primary))"
                        : "hsl(var(--primary) / 0.4)",
                    scale: hoveredExp === exp.role ? 1.1 : 1,
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
                    className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary underline underline-offset-2 decoration-foreground/30 hover:decoration-primary transition-colors"
                  >
                    {exp.company}
                    <ExternalLink className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                  </a>
                </div>
                <p className="text-sm text-foreground/40 mb-2">
                  {exp.location}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/50 mb-4">
                  {(() => {
                    const chips: any = (t as any).experience?.chips || {};
                    const loc = chips[exp.locationType] || exp.locationType;
                    const emp = chips[exp.employmentType] || exp.employmentType;
                    return (
                      <>
                        <span className="px-2 py-0.5 rounded-md bg-foreground/5 border border-foreground/10">
                          {loc}
                        </span>
                        <span className="px-1 text-foreground/40">•</span>
                        <span className="px-2 py-0.5 rounded-md bg-foreground/5 border border-foreground/10">
                          {emp}
                        </span>
                      </>
                    );
                  })()}
                </div>
                <p className="text-sm text-foreground/70 mb-5 sm:mb-6 leading-relaxed">
                  {exp.description}
                </p>
                <div className="space-y-2 mb-5 sm:mb-6">
                  {exp.achievements.map((achievement, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground/70"
                    >
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
          </ScrollReveal>
        ))}
      </div>

      {/* Education */}
      <div className="relative space-y-8 sm:space-y-12">
        <ScrollReveal variant="default">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">
              {t.experience.sections?.education ?? "Education"}
            </h2>
            <div className="h-px flex-1 bg-foreground/10" />
          </div>
        </ScrollReveal>
        <div className="absolute left-0 top-0 bottom-0 w-px bg-foreground/10 ml-[7px] sm:ml-[11px]" />
        {education.map((exp, index) => (
          <ScrollReveal key={index} variant="default" delay={index * 160}>
            <motion.div
              onHoverStart={() => setHoveredExp(exp.role)}
              onHoverEnd={() => setHoveredExp(null)}
              className="relative grid grid-cols-[20px_1fr] sm:grid-cols-[25px_1fr] gap-4 sm:gap-6 md:gap-8"
            >
              <div>
                <motion.div
                  className="w-[15px] h-[15px] sm:w-[23px] sm:h-[23px] rounded-full border-2 
                              border-primary/40 bg-background transition-colors duration-300"
                  animate={{
                    borderColor:
                      hoveredExp === exp.role
                        ? "hsl(var(--primary))"
                        : "hsl(var(--primary) / 0.4)",
                    scale: hoveredExp === exp.role ? 1.1 : 1,
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
                    className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary underline underline-offset-2 decoration-foreground/30 hover:decoration-primary transition-colors"
                  >
                    {exp.company}
                    <ExternalLink className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
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
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground/70"
                    >
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
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default Experience;
