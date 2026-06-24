/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import ScrollReveal from "@/components/ScrollReveal";
import ExperienceItem from "@/components/experience/ExperienceItem";
import { formatDuration, type ExperienceEntry } from "@/lib/experience";

interface ExperienceSectionProps {
  title: string;
  entries: ExperienceEntry[];
  isWork: boolean;
  language: string;
  /** Localized chip labels for employment + location types. */
  chips: Record<string, string>;
}

/** Section header + a list of logo-led rows. Reused for Work and Education. */
const ExperienceSection = ({
  title,
  entries,
  isWork,
  language,
  chips,
}: ExperienceSectionProps) => {
  return (
    <section>
      <ScrollReveal variant="default">
        <div className="mb-2 flex items-center gap-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="h-px flex-1 bg-foreground/10" />
        </div>
      </ScrollReveal>

      <div>
        {entries.map((entry, index) => (
          <ScrollReveal key={entry.key} variant="default" delay={index * 160}>
            <ExperienceItem
              entry={entry}
              isWork={isWork}
              isLast={index === entries.length - 1}
              duration={
                isWork ? formatDuration(language, entry.start, entry.end) : null
              }
              employmentLabel={chips[entry.employmentType] ?? entry.employmentType}
              locationLabel={chips[entry.locationType] ?? entry.locationType}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
