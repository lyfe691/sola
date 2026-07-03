/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * Parses a per-file unified patch (GitHub's `files[].patch` — hunks only, no
 * `diff --git` header) into hunks with old/new line numbers for rendering.
 */

export interface DiffLine {
  type: "context" | "add" | "del" | "meta";
  /** line number in the old file, null for added/meta lines */
  oldNo: number | null;
  /** line number in the new file, null for removed/meta lines */
  newNo: number | null;
  text: string;
}

export interface DiffHunk {
  /** the raw `@@ -a,b +c,d @@ …` line */
  header: string;
  lines: DiffLine[];
}

const HUNK_HEADER = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/;

export function parsePatch(patch: string): DiffHunk[] {
  const hunks: DiffHunk[] = [];
  let current: DiffHunk | null = null;
  let oldNo = 0;
  let newNo = 0;

  const rawLines = patch.split("\n");
  // a newline-terminated patch would otherwise yield one bogus empty
  // context line at the end
  if (rawLines.at(-1) === "") rawLines.pop();

  for (const raw of rawLines) {
    const header = HUNK_HEADER.exec(raw);
    if (header) {
      oldNo = Number(header[1]);
      newNo = Number(header[2]);
      current = { header: raw, lines: [] };
      hunks.push(current);
      continue;
    }
    if (!current) continue;

    if (raw.startsWith("+")) {
      current.lines.push({
        type: "add",
        oldNo: null,
        newNo: newNo++,
        text: raw.slice(1),
      });
    } else if (raw.startsWith("-")) {
      current.lines.push({
        type: "del",
        oldNo: oldNo++,
        newNo: null,
        text: raw.slice(1),
      });
    } else if (raw.startsWith("\\")) {
      // "\ No newline at end of file"
      current.lines.push({ type: "meta", oldNo: null, newNo: null, text: raw });
    } else {
      current.lines.push({
        type: "context",
        oldNo: oldNo++,
        newNo: newNo++,
        text: raw.slice(1),
      });
    }
  }

  return hunks;
}
