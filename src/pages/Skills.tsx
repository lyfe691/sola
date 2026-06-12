/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import {
  SKILL_GROUPS,
  type Skill,
  type SkillGroup,
  type Proficiency,
} from "@/config/skills";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ScrollReveal from "@/components/ScrollReveal";

const ProficiencyDots = ({ level }: { level: Proficiency }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((dot) => (
      <div
        key={dot}
        className={`size-1.5 rounded-full transition-colors ${
          dot <= level ? "bg-primary/70" : "bg-foreground/10"
        }`}
      />
    ))}
  </div>
);

const SkillRow = ({ skill: { name, icon: Icon, level } }: { skill: Skill }) => (
  <div className="-mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/50">
    <div className="flex min-w-0 items-center gap-2.5">
      <Icon className="size-5 shrink-0" size={20} />
      <span className="truncate text-sm font-medium text-foreground/80">
        {name}
      </span>
    </div>
    <ProficiencyDots level={level} />
  </div>
);

const SkillCard = ({
  group,
  title,
  delay,
}: {
  group: SkillGroup;
  title: string;
  delay: number;
}) => (
  <ScrollReveal variant="default" delay={delay}>
    <Card className="bg-card/40 backdrop-blur-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5">
        {group.skills.map((skill) => (
          <SkillRow key={skill.name} skill={skill} />
        ))}
      </CardContent>
    </Card>
  </ScrollReveal>
);

const Skills = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const groups = t.skills.groups as Record<string, string>;

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
        <p className="text-foreground/60 mb-10 max-w-2xl">{t.skills.subtitle}</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {SKILL_GROUPS.map((group, index) => (
          <SkillCard
            key={group.id}
            group={group}
            title={groups[group.id] ?? group.id}
            delay={index * 80}
          />
        ))}
      </div>
    </div>
  );
};

export default Skills;
