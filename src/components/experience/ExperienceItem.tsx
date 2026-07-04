/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  MapPin,
  Building2,
  House,
  Blend,
  type LucideIcon,
} from "lucide-react";
import CompanyLogo from "@/components/experience/CompanyLogo";
import { TagRow } from "@/components/ui/custom/tag-row";
import { LinkPreview } from "@/components/ui/custom/link-preview";
import type { ExperienceEntry, LocationType } from "@/lib/experience";

interface ExperienceItemProps {
  entry: ExperienceEntry;
  /** Work rows carry an employment + location type; education rows stay lighter. */
  isWork: boolean;
  /** Localized duration string (e.g. "1 yr 2 mos"). */
  duration: string;
  employmentLabel: string;
  locationLabel: string;
}

const LOCATION_TYPE_ICON: Record<LocationType, LucideIcon> = {
  onsite: Building2,
  remote: House,
  hybrid: Blend,
};

/** A small muted icon + label pair used across the meta row. */
const MetaItem = ({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
    <Icon className="size-3.5 shrink-0 text-muted-foreground/70" />
    {label}
  </span>
);

/**
 * One logo-led experience row. The role + company sit beside the logo, with a
 * single icon-led meta row beneath (type · dates · location · mode) that wraps
 * cleanly on small screens. The whole row tints onto a muted panel on hover.
 */
const ExperienceItem = ({
  entry,
  isWork,
  duration,
  employmentLabel,
  locationLabel,
}: ExperienceItemProps) => {
  const ModeIcon = LOCATION_TYPE_ICON[entry.locationType] ?? Building2;

  return (
    <article className="group relative -mx-3 flex gap-4 rounded-2xl px-3 py-6 transition-colors duration-200 hover:bg-muted/50 sm:-mx-4 sm:gap-5 sm:px-4">
      <CompanyLogo
        company={entry.company}
        logo={entry.logo}
        monogram={entry.monogram}
      />

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-lg">
          {entry.role}
        </h3>

        <LinkPreview
          href={entry.companyLink}
          aria-label={`${entry.company} (opens in a new tab)`}
          className="group mt-1 flex w-fit items-center gap-1 text-sm text-foreground/50 hover:text-primary transition-colors duration-300 ease-out"
        >
          <span className="border-b border-dotted border-foreground/20 group-hover:border-primary transition-colors duration-300">
            {entry.company}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </LinkPreview>

        {/* meta — icon-led, wraps as whole units on small screens */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {isWork && <MetaItem icon={Briefcase} label={employmentLabel} />}
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">
            <CalendarDays className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span>
              {entry.period}
              <span className="text-muted-foreground/60">
                <span aria-hidden="true"> · </span>
                {duration}
              </span>
            </span>
          </span>
          <MetaItem icon={MapPin} label={entry.location} />
          {isWork && <MetaItem icon={ModeIcon} label={locationLabel} />}
        </div>

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

        {/* skills — single line, overflow collapses into a tooltipped +N */}
        {entry.technologies.length > 0 && (
          <TagRow tags={entry.technologies} className="mt-4 max-w-2xl" />
        )}
      </div>
    </article>
  );
};

export default ExperienceItem;
