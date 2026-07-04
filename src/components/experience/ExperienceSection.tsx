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

/** A quiet mono section label + a list of logo-led rows. Reused for Work and Education. */
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
        <div className="mb-6 flex items-center gap-2.5">
          <h2 className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {title}
          </h2>
          <span className="font-mono text-[11px] text-muted-foreground/50">
            {String(entries.length).padStart(2, "0")}
          </span>
        </div>
      </ScrollReveal>

      <div className="flex flex-col">
        {entries.map((entry, index) => (
          <ScrollReveal key={entry.key} variant="default" delay={index * 60}>
            <ExperienceItem
              entry={entry}
              isWork={isWork}
              duration={formatDuration(language, entry.start, entry.end)}
              employmentLabel={
                chips[entry.employmentType] ?? entry.employmentType
              }
              locationLabel={chips[entry.locationType] ?? entry.locationType}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
