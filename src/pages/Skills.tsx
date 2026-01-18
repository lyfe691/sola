/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import {
  SKILL_GROUPS,
  type SkillGroup,
  type Proficiency,
} from "@/config/skills";
import ScrollReveal from "@/components/ScrollReveal";

const ProficiencyDots = ({ level }: { level: Proficiency }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((dot) => (
      <div
        key={dot}
        className={`w-1.5 h-1.5 rounded-full transition-colors ${
          dot <= level ? "bg-primary/70" : "bg-foreground/10"
        }`}
      />
    ))}
  </div>
);

const SkillChip = ({
  name,
  icon: Icon,
  level,
}: {
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  level: Proficiency;
}) => (
  <div className="group flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-foreground/5 border-2 border-border/20 hover:border-border/40 hover:bg-foreground/10 transition-all duration-200">
    <div className="flex items-center gap-2.5">
      <Icon
        className="w-5 h-5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
        size={20}
      />
      <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground/90 transition-colors">
        {name}
      </span>
    </div>
    <ProficiencyDots level={level} />
  </div>
);

const SkillSection = ({
  group,
  title,
  delay,
}: {
  group: SkillGroup;
  title: string;
  delay: number;
}) => (
  <ScrollReveal variant="default" delay={delay}>
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-foreground/90">{title}</h2>
        <div className="h-px flex-1 bg-border/30" />
      </div>
      <div className="grid gap-2">
        {group.skills.map((skill) => (
          <SkillChip
            key={skill.name}
            name={skill.name}
            icon={skill.icon}
            level={skill.level}
          />
        ))}
      </div>
    </div>
  </ScrollReveal>
);

const Skills = () => {
  const { language } = useLanguage();
  const t = translations[language] as Translation;

  const groups = t.skills.groups as Record<string, string>;
  const groupTitles: Record<string, string> = {
    languages: groups.languages || "Languages",
    frontend: groups.frontend,
    backend: groups.backend,
    infrastructure: groups.infrastructure || "Infrastructure",
    security: groups.security || "Security",
    tools: groups.tools || "Tools",
  };

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>{t.seo.skills.title}</title>
        <meta name="description" content={t.seo.skills.description} />
      </Helmet>

      <ScrollReveal variant="pageTitle">
        <h1 className="text-4xl font-bold mb-4">{t.skills.title}</h1>
      </ScrollReveal>

      <ScrollReveal variant="default">
        <p className="text-foreground/60 mb-10 max-w-2xl">
          {(t.skills as { subtitle?: string }).subtitle ||
            "Technologies and tools I work with regularly."}
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {SKILL_GROUPS.map((group, index) => (
          <SkillSection
            key={group.id}
            group={group}
            title={groupTitles[group.id] || group.id}
            delay={index * 80}
          />
        ))}
      </div>
    </div>
  );
};

export default Skills;
