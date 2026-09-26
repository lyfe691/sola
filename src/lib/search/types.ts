/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/** One heading of a deep dive and the text under it (vite/deep-dive-index.ts). */
export interface DeepDiveSection {
  /** the heading's anchor on the page */
  id: string;
  heading: string;
  /** the h2 an h3 sits under */
  parent?: string;
  /** the prose and captions under the heading, as plain text */
  text: string;
}
