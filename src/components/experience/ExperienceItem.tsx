/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CompanyLogo from "@/components/experience/CompanyLogo";
import type { ExperienceEntry } from "@/lib/experience";

interface ExperienceItemProps {
  entry: ExperienceEntry;
  /** Work rows carry chips + a computed duration; education rows stay lighter. */
  isWork: boolean;
  /** Last row in its section drops the bottom divider. */
  isLast: boolean;
  /** Localized duration string, or null for education. */
  duration: string | null;
  employmentLabel: string;
  locationLabel: string;
}

/** One logo-led experience row. */
const ExperienceItem = ({
  entry,
  isWork,
  isLast,
  duration,
  employmentLabel,
  locationLabel,
}: ExperienceItemProps) => {
  return (
    <div
      className={[
        "group relative flex gap-4 sm:gap-5",
        "-mx-3 rounded-xl px-3 py-5 sm:-mx-4 sm:px-4 sm:py-6",
        "transition-colors duration-300 hover:bg-foreground/[0.03]",
        !isLast && "border-b border-foreground/10",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <CompanyLogo
        company={entry.company}
        logo={entry.logo}
        monogram={entry.monogram}
        isCurrent={entry.isCurrent}
      />

      <div className="min-w-0 flex-1">
        {/* role + employment chip (work only) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className="text-lg font-medium text-primary">{entry.role}</h3>
          {isWork && (
            <Badge variant="secondary" className="font-normal">
              {employmentLabel}
            </Badge>
          )}
        </div>

        {/* company link · location · location type (location type: work only) */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground/40">
          <a
            href={entry.companyLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${entry.company} (opens in a new tab)`}
            className="group/link inline-flex items-center gap-1.5 font-medium text-foreground/70 underline decoration-foreground/30 underline-offset-2 transition-colors hover:text-primary hover:decoration-primary"
          >
            {entry.company}
            <ExternalLink className="h-3 w-3 -translate-y-1 opacity-0 transition-all duration-300 group-hover/link:translate-y-0 group-hover/link:opacity-100" />
          </a>
          <span aria-hidden="true" className="text-foreground/25">
            ·
          </span>
          <span>{entry.location}</span>
          {isWork && (
            <>
              <span aria-hidden="true" className="text-foreground/25">
                ·
              </span>
              <span>{locationLabel}</span>
            </>
          )}
        </div>

        {/* date range + computed duration (work only) */}
        <p className="mt-1.5 font-mono text-xs text-foreground/40">
          {entry.period}
          {isWork && duration && (
            <span className="text-foreground/30"> · {duration}</span>
          )}
        </p>

        {/* description */}
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/70">
          {entry.description}
        </p>

        {/* achievements */}
        {entry.achievements.length > 0 && (
          <div className="mt-4 space-y-2">
            {entry.achievements.map((achievement, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm leading-relaxed text-foreground/70"
              >
                <span aria-hidden="true" className="mt-px text-primary">
                  -
                </span>
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        )}

        {/* tech tags — kept visually distinct from the pill chips above */}
        {entry.technologies.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {entry.technologies.map((tech, i) => (
              <li key={i}>
                <span className="inline-block rounded-md border border-foreground/10 bg-foreground/5 px-2 py-1 text-xs text-foreground/60 transition-colors duration-300 hover:border-primary/20 hover:text-primary">
                  {tech}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExperienceItem;
