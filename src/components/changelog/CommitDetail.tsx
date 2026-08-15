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
import { FileTree } from "@/components/changelog/FileTree";
import { DIFF_TOKENS } from "@/components/deploy-diff/diff-tokens";
import { useIsDarkScheme } from "@/components/deploy-diff/use-scheme";
import { commitDetailQuery, fileTree } from "@/lib/github-commits";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

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
          <span className="block h-2.5 w-16 animate-pulse rounded-sm bg-foreground/8" />
          <div className="ml-1.5 space-y-2 border-l border-foreground/10 pl-2.5">
            <span className="block h-2.5 w-20 animate-pulse rounded-sm bg-foreground/8" />
            <div className="ml-1.5 space-y-2 border-l border-foreground/10 pl-2.5">
              <span className="block h-2.5 w-36 animate-pulse rounded-sm bg-foreground/10" />
              <span className="block h-2.5 w-28 animate-pulse rounded-sm bg-foreground/10" />
            </div>
          </div>
        </div>
        <div className="h-36 animate-pulse rounded-xl bg-foreground/6 ring-1 ring-border" />
      </div>
    );
  }

  const commit = query.data;
  const shown = commit.files.slice(0, MAX_FILES);
  const tree = fileTree(shown);
  const selected =
    shown.find((file) => file.filename === active) ?? shown[0] ?? null;
  const overflow = commit.files.length > MAX_FILES;
  const scheme = isDark ? "dark" : "light";

  return (
    <div className="min-w-0 space-y-4" style={DIFF_TOKENS[scheme]}>
      {commit.body ? (
        <p className="max-w-prose text-sm leading-relaxed whitespace-pre-wrap text-foreground/65 sm:pl-[4.75rem]">
          {commit.body}
        </p>
      ) : null}

      {tree.length > 0 ? (
        <div className="min-w-0">
          <p className="mb-2 font-mono text-[11px] text-muted-foreground">
            {t.files.replace("{count}", String(commit.files.length))}
            <span className="ml-3 text-(--diff-add-fg)">
              +{commit.additions}
            </span>{" "}
            <span className="text-(--diff-del-fg)">−{commit.deletions}</span>
          </p>
          <FileTree
            nodes={tree}
            selected={selected?.filename ?? null}
            onSelect={setActive}
          />
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
