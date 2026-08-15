/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { CopyButton } from "@/components/ui/code-block";
import type { DiffLine } from "@/components/deploy-diff/parse-patch";
import { useCappedDiff } from "@/components/deploy-diff/use-diff-highlight";
import { toUnifiedDiff, type ChangelogFile } from "@/lib/github-commits";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import type { ThemedTokenWithVariants } from "shiki";

function DiffLineRow({
  line,
  tokens,
  scheme,
}: {
  line: DiffLine;
  tokens?: ThemedTokenWithVariants[];
  scheme: "light" | "dark";
}) {
  if (line.type === "meta") {
    return (
      <tr>
        <td className="w-4 min-w-4 px-3 select-none" />
        <td className="pr-4 whitespace-pre text-muted-foreground/60 italic">
          {line.text}
        </td>
      </tr>
    );
  }

  const mark = line.type === "add" ? "+" : line.type === "del" ? "−" : "";

  return (
    <tr
      className={cn(
        line.type === "add" && "bg-(--diff-add-fg)/10",
        line.type === "del" && "bg-(--diff-del-fg)/10",
      )}
    >
      <td
        className={cn(
          "w-4 min-w-4 px-3 select-none",
          line.type === "add" && "text-(--diff-add-fg)",
          line.type === "del" && "text-(--diff-del-fg)",
          line.type === "context" && "text-muted-foreground/40",
        )}
      >
        {mark}
      </td>
      <td className="pr-4 whitespace-pre">
        {tokens
          ? tokens.map((token, i) => (
              <span key={i} style={{ color: token.variants[scheme]?.color }}>
                {token.content}
              </span>
            ))
          : line.text}
      </td>
    </tr>
  );
}

export function CommitPatch({
  file,
  scheme,
}: {
  file: ChangelogFile;
  scheme: "light" | "dark";
}) {
  const { language } = useLanguage();
  const t = translations[language].changelog;
  const { rows, lineTokens, truncated } = useCappedDiff(
    file.patch,
    file.filename,
  );

  if (rows.length === 0) {
    return (
      <p className="font-mono text-xs text-muted-foreground">
        {file.filename} — {t.unavailable}
      </p>
    );
  }

  return (
    <figure className="code-block group relative my-0 overflow-hidden rounded-xl bg-(--code) text-sm ring-1 ring-border">
      <figcaption className="flex items-center gap-2 border-b border-border py-1.5 pl-4 pr-2 font-mono text-xs text-(--code-foreground)">
        <span className="truncate">{file.filename}</span>
        <CopyButton value={toUnifiedDiff(file)} className="ml-auto" />
      </figcaption>
      <div className="max-h-[min(32rem,70vh)] overflow-auto overscroll-contain py-2 font-mono text-xs leading-5 [scrollbar-width:thin]">
        <table className="w-max min-w-full border-separate border-spacing-0">
          <caption className="sr-only">{file.filename}</caption>
          <tbody>
            {rows.map((row) =>
              row.kind === "hunk" ? (
                <tr key={row.key}>
                  <td
                    colSpan={2}
                    className="bg-muted/40 px-3 py-1 text-[11px] whitespace-pre text-muted-foreground/70 select-none"
                  >
                    {row.text}
                  </td>
                </tr>
              ) : (
                <DiffLineRow
                  key={row.key}
                  line={row.line}
                  tokens={lineTokens?.get(row.line)}
                  scheme={scheme}
                />
              ),
            )}
            {truncated ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-3 py-2 text-[11px] text-muted-foreground/70 italic"
                >
                  {t.truncated}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
