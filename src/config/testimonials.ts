/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import type { Translation } from "@/lib/translations";

/** quote + role live in the locale files under about.testimonials.items */
export type TestimonialI18nKey =
  keyof Translation["about"]["testimonials"]["items"];

export interface Testimonial {
  i18nKey: TestimonialI18nKey;
  author: string;
  company: string;
  rating: number;
  website?: string;
  linkedin?: string;
}

export const testimonials: Testimonial[] = [
  {
    i18nKey: "koenitzer",
    author: "Dominik Könitzer",
    company: "mpa international ag",
    rating: 5,
    website: "https://dominikkoenitzer.ch",
  },
  {
    i18nKey: "bichsel",
    author: "Jason Bichsel",
    company: "WISS",
    rating: 5,
    website: "https://jasonbichsel.com",
    linkedin: "https://linkedin.com/in/jason-bichsel",
  },
  {
    i18nKey: "venzin",
    author: "Patrick Venzin",
    company: "WISS",
    rating: 5,
    linkedin: "https://linkedin.com/in/patrick-venzin-68314a100",
  },
];
