/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useLanguage, useTranslation } from "@/lib/language-provider";
import { Reveal } from "@/components/Reveal";
import ExperienceSection from "@/components/experience/ExperienceSection";
import { WORK, EDUCATION, resolveEntries } from "@/lib/experience";

const Experience = () => {
  const { language } = useLanguage();
  const t = useTranslation();
  const chips = t.experience.chips as Record<string, string>;

  const work = resolveEntries(WORK, t, language);
  const education = resolveEntries(EDUCATION, t, language);

  return (
    <div className="flex w-full flex-col">
      <meta name="description" content={t.seo.experience.description} />

      <Reveal as="h1" className="mb-4 text-4xl font-bold">
        {t.experience.title}
      </Reveal>
      <Reveal as="p" className="mb-10 max-w-2xl text-muted-foreground">
        {t.experience.subtitle}
      </Reveal>

      <div className="mb-16 sm:mb-24">
        <ExperienceSection
          title={t.experience.sections.work}
          entries={work}
          isWork
          language={language}
          chips={chips}
        />
      </div>

      <ExperienceSection
        title={t.experience.sections.education}
        entries={education}
        isWork={false}
        language={language}
        chips={chips}
      />
    </div>
  );
};

export default Experience;
