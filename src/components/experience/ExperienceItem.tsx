/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState } from "react";
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
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import CompanyLogo from "@/components/experience/CompanyLogo";
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
const MetaItem = ({ icon: Icon, label }: { icon: LucideIcon; label: string }) => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
    <Icon className="size-3.5 shrink-0 text-muted-foreground/70" />
    {label}
  </span>
);

/**
 * One logo-led experience row. The role + company sit beside the logo, with a
 * single icon-led meta row beneath (type · dates · location · mode) that wraps
 * cleanly on small screens. The whole row eases onto a muted panel on hover.
 */
const ExperienceItem = ({
  entry,
  isWork,
  duration,
  employmentLabel,
  locationLabel,
}: ExperienceItemProps) => {
  const [hovered, setHovered] = useState(false);
  const ModeIcon = LOCATION_TYPE_ICON[entry.locationType] ?? Building2;

  return (
    <motion.article
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative isolate -mx-3 flex gap-4 rounded-2xl px-3 py-6 sm:-mx-4 sm:gap-5 sm:px-4"
    >
      {/* hover panel — eased opacity rather than an instant color swap */}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-muted/60 ring-1 ring-foreground/5"
      />

      <CompanyLogo
        company={entry.company}
        logo={entry.logo}
        monogram={entry.monogram}
      />

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-lg">
          {entry.role}
        </h3>

        <a
          href={entry.companyLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${entry.company} (opens in a new tab)`}
          className="group/link mt-1 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {entry.company}
          <ArrowUpRight className="size-3 shrink-0 text-muted-foreground transition-colors group-hover/link:text-primary" />
        </a>

        {/* meta — icon-led, wraps as whole units on small screens */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {isWork && <MetaItem icon={Briefcase} label={employmentLabel} />}
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">
            <CalendarDays className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span>
              {entry.period}
              <span className="text-muted-foreground/60"> · {duration}</span>
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
    </motion.article>
  );
};

export default ExperienceItem;
