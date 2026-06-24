/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import ScrollReveal from "@/components/ScrollReveal";
import ExperienceSection from "@/components/experience/ExperienceSection";
import { WORK, EDUCATION, resolveEntries } from "@/lib/experience";

const Experience = () => {
  const { language } = useLanguage();
  const t = translations[language] as Translation;
  const chips = t.experience.chips as Record<string, string>;

  const work = resolveEntries(WORK, t);
  const education = resolveEntries(EDUCATION, t);

  return (
    <div className="flex w-full flex-col">
      <Helmet>
        <title>{t.seo.experience.title}</title>
        <meta name="description" content={t.seo.experience.description} />
      </Helmet>

      <ScrollReveal variant="pageTitle">
        <h1 className="mb-8 text-4xl font-bold sm:mb-12">{t.experience.title}</h1>
      </ScrollReveal>

      <ScrollReveal variant="default">
        <p className="mb-8 max-w-2xl text-foreground/60 sm:mb-12">
          {t.experience.subtitle}
        </p>
      </ScrollReveal>

      <div className="mb-12 sm:mb-16">
        <ExperienceSection
          title={t.experience.sections?.work ?? "Work"}
          entries={work}
          isWork
          language={language}
          chips={chips}
        />
      </div>

      <ExperienceSection
        title={t.experience.sections?.education ?? "Education"}
        entries={education}
        isWork={false}
        language={language}
        chips={chips}
      />
    </div>
  );
};

export default Experience;
