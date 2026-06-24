/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState } from "react";

interface CompanyLogoProps {
  company: string;
  logo?: string;
  /** Optional monogram override; otherwise derived from the company name. */
  monogram?: string;
}

/** 1–2 letter initials from the company name (unicode-safe), or an explicit override. */
const initialsOf = (company: string, monogram?: string): string => {
  const derived =
    company
      .replace(/[^\p{L}\s]/gu, " ")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("") || company.slice(0, 2);
  return (monogram ?? derived).toUpperCase();
};

/**
 * Square company identity tile: a logo on a constant light plate (favicons are drawn
 * for light backgrounds, and several here are dark-on-transparent, so a theme-adaptive
 * surface would swallow them on dark themes), with a monogram fallback on the muted
 * surface when there's no logo or it fails to load.
 */
const CompanyLogo = ({ company, logo, monogram }: CompanyLogoProps) => {
  const [imgError, setImgError] = useState(false);
  const showLogo = Boolean(logo) && !imgError;

  return (
    <span
      className={[
        "flex size-12 shrink-0 items-center justify-center self-start overflow-hidden rounded-xl",
        "ring-1 ring-foreground/10 transition-shadow duration-200 group-hover:ring-foreground/20",
        showLogo ? "bg-white" : "bg-muted",
      ].join(" ")}
    >
      {showLogo ? (
        <img
          src={logo}
          alt={`${company} logo`}
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          className="size-full object-contain p-2"
        />
      ) : (
        <span
          aria-hidden="true"
          className="select-none font-heading text-sm font-medium text-muted-foreground"
        >
          {initialsOf(company, monogram)}
        </span>
      )}
    </span>
  );
};

export default CompanyLogo;
