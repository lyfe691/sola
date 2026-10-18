/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

/** A CodeBlock's `highlight`: lines as the block numbers them, one by one
 *  or as ranges ("11,15,29", "8-10"), no spaces. */
export const HIGHLIGHT_SPEC = /^\d+(-\d+)?(,\d+(-\d+)?)*$/;

/** the line numbers a `highlight` names; none for a malformed one */
export function linesIn(spec: string | undefined): Set<number> {
  const lines = new Set<number>();
  if (!spec || !HIGHLIGHT_SPEC.test(spec)) return lines;
  for (const part of spec.split(",")) {
    const [from, to = from] = part.split("-").map(Number);
    for (let line = from; line <= to; line++) lines.add(line);
  }
  return lines;
}
