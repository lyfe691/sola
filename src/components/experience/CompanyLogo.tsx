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
  /** Renders a small live dot when the role is ongoing. */
  isCurrent: boolean;
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
 * surface would swallow them on dark themes), with a monogram fallback on the adaptive
 * surface when there's no logo or it fails to load.
 */
const CompanyLogo = ({ company, logo, monogram, isCurrent }: CompanyLogoProps) => {
  const [imgError, setImgError] = useState(false);
  const showLogo = Boolean(logo) && !imgError;

  return (
    <span className="relative shrink-0">
      <span
        className={[
          "flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl",
          "ring-1 ring-foreground/10 transition-shadow duration-300 group-hover:ring-foreground/20",
          showLogo ? "bg-white" : "bg-foreground/5",
        ].join(" ")}
      >
        {showLogo ? (
          <img
            src={logo}
            alt={`${company} logo`}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <span
            aria-hidden="true"
            className="select-none font-heading text-sm font-medium text-foreground/60"
          >
            {initialsOf(company, monogram)}
          </span>
        )}
      </span>

      {isCurrent && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background"
        />
      )}
    </span>
  );
};

export default CompanyLogo;
