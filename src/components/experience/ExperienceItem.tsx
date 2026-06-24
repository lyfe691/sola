/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CompanyLogo from "@/components/experience/CompanyLogo";
import type { ExperienceEntry } from "@/lib/experience";

interface ExperienceItemProps {
  entry: ExperienceEntry;
  /** Work rows carry an employment + location type; education rows stay lighter. */
  isWork: boolean;
  /** Localized duration string (e.g. "1 yr 2 mos"). */
  duration: string;
  employmentLabel: string;
  locationLabel: string;
}

/**
 * One logo-led experience row. Identity sits beside the logo; the date range +
 * duration float to a quiet right rail on desktop and fold under the role on
 * mobile. The whole row lifts into a soft panel on hover.
 */
const ExperienceItem = ({
  entry,
  isWork,
  duration,
  employmentLabel,
  locationLabel,
}: ExperienceItemProps) => {
  return (
    <article className="group relative -mx-3 flex gap-4 rounded-2xl px-3 py-6 transition-all duration-300 hover:bg-foreground/[0.04] hover:ring-1 hover:ring-foreground/5 sm:-mx-4 sm:gap-5 sm:px-4">
      <CompanyLogo
        company={entry.company}
        logo={entry.logo}
        monogram={entry.monogram}
        isCurrent={entry.isCurrent}
      />

      <div className="min-w-0 flex-1">
        {/* identity + date rail */}
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
          <div className="min-w-0">
            <h3 className="text-base font-medium text-foreground transition-colors duration-300 group-hover:text-primary sm:text-lg">
              {entry.role}
            </h3>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-sm text-foreground/60">
              <a
                href={entry.companyLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${entry.company} (opens in a new tab)`}
                className="group/link inline-flex items-center gap-0.5 rounded-sm font-medium text-foreground/75 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {entry.company}
                <ArrowUpRight className="size-3.5 -translate-x-1 translate-y-px opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100 group-focus-within/link:translate-x-0 group-focus-within/link:opacity-100" />
              </a>
              {isWork && (
                <>
                  <span aria-hidden="true" className="text-foreground/40">
                    ·
                  </span>
                  <span>{employmentLabel}</span>
                </>
              )}
            </p>
          </div>

          <div className="shrink-0 font-mono text-xs leading-snug sm:pt-1 sm:text-right">
            <p className="whitespace-nowrap text-foreground/70">{entry.period}</p>
            <p className="whitespace-nowrap text-foreground/60">{duration}</p>
          </div>
        </div>

        {/* location */}
        <p className="mt-1 text-xs text-foreground/60">
          {entry.location}
          {isWork && (
            <>
              <span aria-hidden="true"> · </span>
              {locationLabel}
            </>
          )}
        </p>

        {/* description */}
        <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-foreground/70">
          {entry.description}
        </p>

        {/* achievements — dot markers with a real hanging indent */}
        {entry.achievements.length > 0 && (
          <ul className="mt-3.5 max-w-2xl space-y-2">
            {entry.achievements.map((achievement, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-sm leading-relaxed text-foreground/65"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] size-1 shrink-0 rounded-full bg-primary/50"
                />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        )}

        {/* skills */}
        {entry.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {entry.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="font-normal">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default ExperienceItem;
