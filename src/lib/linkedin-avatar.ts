/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/** Profile photo URL via unavatar (LinkedIn slug from a /in/… URL). */
export function getLinkedInAvatarUrl(linkedin: string): string | undefined {
  const slug = linkedin.match(/linkedin\.com\/in\/([^/?#]+)/i)?.[1];
  if (!slug) return undefined;
  return `https://unavatar.io/linkedin/${slug}`;
}