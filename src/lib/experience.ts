/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { Translation } from "@/lib/translations";

export type EmploymentType =
  "full_time" | "part_time" | "contract" | "internship" | "freelance";
export type LocationType = "onsite" | "remote" | "hybrid";

/** A point in time. `month` is 1-indexed (January = 1) to match `formatDuration`. */
export type DatePoint = { year: number; month: number };

/** Non-translated facts for one entry, keyed to `t.experience[key]`. */
export interface ExperienceFact {
  key: string;
  companyLink: string;
  /** Public path to a logo; falls back to a monogram when absent or it fails to load. */
  logo?: string;
  /** Optional override for the monogram fallback (otherwise derived from the company name). */
  monogram?: string;
  start: DatePoint;
  end: DatePoint | "present";
  locationType: LocationType;
  employmentType: EmploymentType;
  technologies: string[];
}

/** Translated copy for one entry — the shape of `t.experience[key]`. */
export interface ExperienceCopy {
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
}

/** A fully resolved entry: static facts + translated copy + localized range. */
export interface ExperienceEntry extends ExperienceFact, ExperienceCopy {
  period: string;
}

export const WORK: ExperienceFact[] = [
  {
    key: "nadlo",
    companyLink: "https://nadlo.ch",
    logo: "/experience/nadlo.png",
    start: { year: 2026, month: 5 },
    end: "present",
    locationType: "hybrid",
    employmentType: "internship",
    technologies: [
      "TypeScript",
      "React",
      "Next.js",
      "NestJS",
      "Tailwind CSS",
      "Supabase",
      "Docker",
      "GitHub Actions",
      "Git",
    ],
  },
  {
    key: "freelance",
    companyLink: "https://sola.ysz.life/services",
    logo: "/experience/freelance.png",
    start: { year: 2025, month: 7 },
    end: "present",
    locationType: "remote",
    employmentType: "part_time",
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Spring Boot",
      "Java",
      "Git",
    ],
  },
  {
    key: "gz",
    companyLink: "https://www.gesundheitswelt-zollikerberg.ch/",
    logo: "/experience/gz.png",
    start: { year: 2025, month: 8 },
    end: { year: 2026, month: 3 },
    locationType: "hybrid",
    employmentType: "internship",
    technologies: [
      "Identity & Access Management (IAM)",
      "Python",
      "Powershell",
      "Git",
      "Automation",
      "Active Directory",
      "Teamwork",
    ],
  },
];

export const EDUCATION: ExperienceFact[] = [
  {
    key: "wiss",
    companyLink: "https://www.wiss.ch/",
    logo: "/experience/wiss.png",
    start: { year: 2023, month: 8 },
    end: "present",
    locationType: "onsite",
    employmentType: "full_time",
    technologies: [
      "React",
      "TypeScript",
      "JavaScript",
      "Project Management",
      "Teamwork",
      "Java",
      "Spring Boot",
      "MongoDB",
      "Docker",
      "Git",
      "Linux",
      "Figma",
    ],
  },
  {
    key: "sek",
    companyLink: "https://www.stadt-zuerich.ch/schulen/de/lachenzelg.html",
    logo: "/experience/sek.png",
    start: { year: 2020, month: 8 },
    end: { year: 2023, month: 7 },
    locationType: "onsite",
    employmentType: "full_time",
    technologies: ["MINT", "English", "German", "French", "Office 365"],
  },
];

/** Merge static facts with the active language's copy and localized range string. */
export const resolveEntries = (
  facts: ExperienceFact[],
  t: Translation,
): ExperienceEntry[] => {
  const copy = t.experience as unknown as Record<string, ExperienceCopy>;
  const periods = t.experience.period as unknown as Record<string, string>;
  return facts.map((fact) => ({
    ...fact,
    ...copy[fact.key],
    period: periods[fact.key],
  }));
};

/**
 * LinkedIn-style duration string ("1 yr 2 mos"), localized via `Intl` so it needs
 * no translation keys. Inclusive of the start month and clamped to >= 1 month, so a
 * role started this month reads "1 mo" rather than an empty string.
 */
export const formatDuration = (
  lang: string,
  start: DatePoint,
  end: DatePoint | "present",
): string => {
  const now = new Date();
  const e =
    end === "present"
      ? { year: now.getFullYear(), month: now.getMonth() + 1 }
      : end;

  const months = Math.max(
    (e.year - start.year) * 12 + (e.month - start.month) + 1,
    1,
  );
  const years = Math.floor(months / 12);
  const rest = months % 12;

  const yr = new Intl.NumberFormat(lang, {
    style: "unit",
    unit: "year",
    unitDisplay: "short",
  });
  const mo = new Intl.NumberFormat(lang, {
    style: "unit",
    unit: "month",
    unitDisplay: "short",
  });

  return (
    [years > 0 && yr.format(years), rest > 0 && mo.format(rest)]
      .filter(Boolean)
      .join(" ") || mo.format(0)
  );
};
