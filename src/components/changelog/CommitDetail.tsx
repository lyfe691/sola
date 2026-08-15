/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CommitPatch } from "@/components/changelog/CommitPatch";
import { DIFF_TOKENS } from "@/components/deploy-diff/diff-tokens";
import { useIsDarkScheme } from "@/components/deploy-diff/use-scheme";
import {
  commitDetailQuery,
  statusLetter,
  statTree,
} from "@/lib/github-commits";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

const MAX_FILES = 20;

export function CommitDetail({ sha }: { sha: string }) {
  const { language } = useLanguage();
  const t = translations[language].changelog;
  const isDark = useIsDarkScheme();
  const query = useQuery(commitDetailQuery(sha));
  const [active, setActive] = useState<string | null>(null);

  if (query.isError) {
    return <p className="text-xs text-muted-foreground">{t.error}</p>;
  }

  if (!query.data) {
    return (
      <div className="space-y-4 py-1" aria-hidden="true">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-16 animate-pulse rounded-sm bg-foreground/8" />
          <span className="h-2.5 w-8 animate-pulse rounded-sm bg-(--diff-add-fg)/25" />
          <span className="h-2.5 w-8 animate-pulse rounded-sm bg-(--diff-del-fg)/25" />
        </div>
        <div className="space-y-2">
          <span className="block h-2.5 w-20 animate-pulse rounded-sm bg-foreground/8" />
          <span className="ml-4 block h-2.5 w-28 animate-pulse rounded-sm bg-foreground/8" />
          <span className="ml-8 block h-2.5 w-40 animate-pulse rounded-sm bg-foreground/10" />
          <span className="ml-8 block h-2.5 w-32 animate-pulse rounded-sm bg-foreground/10" />
        </div>
        <div className="h-36 animate-pulse rounded-xl bg-foreground/6 ring-1 ring-border" />
      </div>
    );
  }

  const commit = query.data;
  const shown = commit.files.slice(0, MAX_FILES);
  const tree = statTree(shown);
  const selected =
    shown.find((file) => file.filename === active) ?? shown[0] ?? null;
  const overflow = commit.files.length > MAX_FILES;
  const scheme = isDark ? "dark" : "light";

  return (
    <div className="space-y-4" style={DIFF_TOKENS[scheme]}>
      {commit.body ? (
        <p className="max-w-prose text-sm leading-relaxed whitespace-pre-wrap text-foreground/65">
          {commit.body}
        </p>
      ) : null}

      {tree.length > 0 ? (
        <div>
          <p className="mb-2 font-mono text-[11px] text-muted-foreground">
            {t.files.replace("{count}", String(commit.files.length))}
            <span className="ml-3 text-(--diff-add-fg)">
              +{commit.additions}
            </span>{" "}
            <span className="text-(--diff-del-fg)">−{commit.deletions}</span>
          </p>
          <ul className="font-mono text-[12px] leading-6">
            {tree.map((row) => {
              const selectedFile =
                !!row.file && row.file.filename === selected?.filename;
              const line = (
                <>
                  <span className="select-none text-muted-foreground/50">
                    {row.prefix}
                  </span>
                  <span
                    className={cn(
                      row.file ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {row.name}
                  </span>
                  {row.file ? (
                    <span className="ml-3 shrink-0 tabular-nums text-muted-foreground">
                      <span className="text-foreground/70">
                        {statusLetter(row.file.status)}
                      </span>
                      <span className="ml-2 text-(--diff-add-fg)">
                        +{row.file.additions}
                      </span>{" "}
                      <span className="text-(--diff-del-fg)">
                        −{row.file.deletions}
                      </span>
                    </span>
                  ) : null}
                </>
              );

              return (
                <li key={`${row.prefix}${row.name}`}>
                  {row.file ? (
                    <button
                      type="button"
                      onClick={() => setActive(row.file!.filename)}
                      aria-pressed={selectedFile}
                      className={cn(
                        "-mx-2 flex w-[calc(100%+1rem)] items-baseline rounded-md px-2 text-left transition-colors duration-200 ease-out",
                        "can-hover:hover:bg-muted/60",
                        selectedFile && "bg-muted/70",
                      )}
                    >
                      {line}
                    </button>
                  ) : (
                    <div className="flex items-baseline">{line}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {selected?.patch ? (
        <CommitPatch file={selected} scheme={scheme} />
      ) : selected ? (
        <p className="font-mono text-xs text-muted-foreground">
          {selected.filename} — {t.unavailable}
        </p>
      ) : null}

      {overflow ? (
        <a
          href={commit.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-mono text-xs text-foreground/70 underline decoration-foreground/25 underline-offset-4 hover:text-foreground"
        >
          {t.truncated}
        </a>
      ) : null}
    </div>
  );
}
