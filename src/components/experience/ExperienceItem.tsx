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
 * One logo-led experience row. The role + company sit beside the logo; the date
 * range and duration form a quiet stamp that floats to the right on desktop and
 * folds under the role on mobile. The whole row lifts onto a muted panel on hover.
 */
const ExperienceItem = ({
  entry,
  isWork,
  duration,
  employmentLabel,
  locationLabel,
}: ExperienceItemProps) => {
  return (
    <article className="group relative -mx-3 flex gap-4 rounded-2xl px-3 py-6 transition-colors duration-200 hover:bg-muted/50 sm:-mx-4 sm:gap-5 sm:px-4">
      <CompanyLogo
        company={entry.company}
        logo={entry.logo}
        monogram={entry.monogram}
      />

      <div className="min-w-0 flex-1">
        {/* role + company, with the date stamp aligned right on desktop */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
          <div className="min-w-0">
            <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-lg">
              {entry.role}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              <a
                href={entry.companyLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${entry.company} (opens in a new tab)`}
                className="group/link inline-flex items-center gap-1 rounded-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {entry.company}
                <ArrowUpRight className="size-3 shrink-0 text-muted-foreground transition-colors group-hover/link:text-primary" />
              </a>
              {isWork && (
                <span>
                  <span aria-hidden="true"> · </span>
                  {employmentLabel}
                </span>
              )}
            </p>
          </div>

          <p className="shrink-0 font-mono text-xs leading-snug text-muted-foreground sm:text-right">
            {entry.period}
            <span className="block">{duration}</span>
          </p>
        </div>

        {/* location */}
        <p className="mt-1.5 text-xs text-muted-foreground">
          {entry.location}
          {isWork && (
            <>
              <span aria-hidden="true"> · </span>
              {locationLabel}
            </>
          )}
        </p>

        {/* description */}
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {entry.description}
        </p>

        {/* achievements */}
        {entry.achievements.length > 0 && (
          <ul className="mt-3 ml-4 max-w-2xl list-disc space-y-1.5 text-sm leading-relaxed text-muted-foreground marker:text-muted-foreground/40">
            {entry.achievements.map((achievement, i) => (
              <li key={i} className="pl-1">
                {achievement}
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
