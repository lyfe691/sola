/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/**
 * A translation string without its link markup: `[label](url)` becomes
 * `label`. For the places that cannot render a link — a meta description,
 * an aria-label — where RichText's syntax would otherwise ship verbatim.
 */
export const plainText = (text: string): string =>
  text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
