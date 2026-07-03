/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The diff renderer: per-file sections with sticky headers, hunk rows and
 * numbered +/- lines. Colors read the `--diff-*-fg` custom properties set by
 * CodeView (theme-type aware — the `dark:` variant can't see custom dark
 * themes, see use-scheme.ts), so this stays presentational.
 */

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Translation } from "@/lib/translations";
import { parsePatch, type DiffLine } from "./parse-patch";
import type { DeployCommit, DeployCommitFile } from "./use-deploy-commit";

export type DiffStrings = Translation["common"]["diff"];

// caps keep a giant commit from stalling the render; the page's GitHub link
// always offers the full diff
const MAX_FILES = 40;
const MAX_ROWS_PER_FILE = 400;

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  added: { label: "A", className: "text-(--diff-add-fg)" },
  removed: { label: "D", className: "text-(--diff-del-fg)" },
  modified: { label: "M", className: "text-(--diff-mod-fg)" },
  renamed: { label: "R", className: "text-(--diff-ren-fg)" },
  copied: { label: "C", className: "text-(--diff-ren-fg)" },
};

type Row =
  | { kind: "hunk"; key: string; text: string }
  | { kind: "line"; key: string; line: DiffLine };

function DiffLineRow({ line }: { line: DiffLine }) {
  if (line.type === "meta") {
    return (
      <tr>
        <td colSpan={2} className="w-20 min-w-20 select-none" />
        <td className="w-full pr-4 whitespace-pre text-muted-foreground/60 italic">
          <span className="inline-block w-4 select-none" />
          {line.text}
        </td>
      </tr>
    );
  }

  const numberClass = cn(
    "w-10 min-w-10 px-2 text-right align-top tabular-nums select-none",
    line.type === "add" && "text-(--diff-add-fg)/60",
    line.type === "del" && "text-(--diff-del-fg)/60",
    line.type === "context" && "text-muted-foreground/40",
  );

  return (
    <tr
      className={cn(
        line.type === "add" && "bg-emerald-500/10",
        line.type === "del" && "bg-rose-500/10",
      )}
    >
      <td className={numberClass}>{line.oldNo}</td>
      <td className={numberClass}>{line.newNo}</td>
      <td className="w-full pr-4 whitespace-pre align-top">
        <span
          className={cn(
            "inline-block w-4 select-none",
            line.type === "add" && "text-(--diff-add-fg)",
            line.type === "del" && "text-(--diff-del-fg)",
          )}
        >
          {line.type === "add" ? "+" : line.type === "del" ? "−" : ""}
        </span>
        {line.text}
      </td>
    </tr>
  );
}

function FileSection({ file, t }: { file: DeployCommitFile; t: DiffStrings }) {
  const { rows, truncated } = useMemo(() => {
    const hunks = file.patch ? parsePatch(file.patch) : [];
    const out: Row[] = [];
    let truncated = false;

    for (const [hi, hunk] of hunks.entries()) {
      // never leave an orphaned hunk header right at the cap
      if (out.length + 1 >= MAX_ROWS_PER_FILE) {
        truncated = true;
        break;
      }
      out.push({ kind: "hunk", key: `h${hi}`, text: hunk.header });
      for (const [li, line] of hunk.lines.entries()) {
        if (out.length >= MAX_ROWS_PER_FILE) {
          truncated = true;
          break;
        }
        out.push({ kind: "line", key: `h${hi}l${li}`, line });
      }
      if (truncated) break;
    }
    return { rows: out, truncated };
  }, [file.patch]);

  const badge = STATUS_BADGE[file.status] ?? STATUS_BADGE.modified;
  const hasChanges = file.additions > 0 || file.deletions > 0;

  return (
    <section className="border-t border-border/60 first:border-t-0">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border/60 bg-card/95 px-4 py-2 font-mono text-xs backdrop-blur-sm">
        <span className={cn("w-3 shrink-0 font-semibold", badge.className)}>
          {badge.label}
        </span>
        <span className="min-w-0 flex-1 truncate" title={file.filename}>
          {file.previousFilename
            ? `${file.previousFilename} → ${file.filename}`
            : file.filename}
        </span>
        {file.additions > 0 && (
          <span className="shrink-0 text-(--diff-add-fg)">
            +{file.additions}
          </span>
        )}
        {file.deletions > 0 && (
          <span className="shrink-0 text-(--diff-del-fg)">
            −{file.deletions}
          </span>
        )}
      </div>

      {rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 font-mono text-xs leading-5">
            <tbody>
              {rows.map((row) =>
                row.kind === "hunk" ? (
                  <tr key={row.key}>
                    <td
                      colSpan={3}
                      className="bg-muted/40 px-4 py-1.5 text-[11px] whitespace-pre text-muted-foreground/70 select-none"
                    >
                      {row.text}
                    </td>
                  </tr>
                ) : (
                  <DiffLineRow key={row.key} line={row.line} />
                ),
              )}
              {truncated && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-2 text-[11px] text-muted-foreground/70 italic"
                  >
                    {t.truncated}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // binary or oversized diff — GitHub omits the patch (pure renames
        // legitimately have none, so stay quiet for those)
        hasChanges && (
          <p className="px-4 py-2.5 font-mono text-xs text-muted-foreground/70 italic">
            {t.unavailable}
          </p>
        )
      )}
    </section>
  );
}

export function CommitDiff({
  commit,
  t,
}: {
  commit: DeployCommit;
  t: DiffStrings;
}) {
  const files = commit.files.slice(0, MAX_FILES);
  const hiddenCount = commit.files.length - files.length;

  return (
    <div>
      {files.map((file) => (
        <FileSection key={file.filename} file={file} t={t} />
      ))}
      {hiddenCount > 0 && (
        <p className="border-t border-border/60 px-4 py-2.5 font-mono text-xs text-muted-foreground/70 italic">
          {t.truncated}
        </p>
      )}
    </div>
  );
}
