/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  BookOpen01Icon,
  GitCommitIcon,
  Note01Icon,
  PackageIcon,
  PaintBoardIcon,
  RepeatIcon,
  Settings01Icon,
  SparklesIcon,
  TestTube01Icon,
  Undo02Icon,
  WorkflowSquare01Icon,
  Wrench01Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { techIconForFile } from "@/config/tech-icons";
import type { ChangelogStats } from "@/lib/github-commits";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<string, IconSvgElement> = {
  feat: SparklesIcon,
  fix: Wrench01Icon,
  perf: ZapIcon,
  style: PaintBoardIcon,
  content: Note01Icon,
  docs: BookOpen01Icon,
  refactor: RepeatIcon,
  test: TestTube01Icon,
  build: PackageIcon,
  chore: Settings01Icon,
  ci: WorkflowSquare01Icon,
  revert: Undo02Icon,
};

const BLOCKS = 5;
const MAX_MARKS = 3;

export function TypeChip({ type }: { type: string }) {
  return (
    <Badge variant="secondary" className="font-normal">
      <HugeiconsIcon
        icon={TYPE_ICON[type] ?? GitCommitIcon}
        strokeWidth={2}
        aria-hidden="true"
      />
      {type}
    </Badge>
  );
}

export function ScopeChip({ scope }: { scope: string }) {
  return (
    <Badge variant="outline" className="font-normal text-muted-foreground">
      {scope}
    </Badge>
  );
}

/** Lit blocks grow with the size of the change (1 → 5 across ~4 → ~1000 lines). */
function litBlocks(total: number): number {
  return Math.min(BLOCKS, Math.max(1, Math.ceil(Math.log2(total + 1) / 2)));
}

function DiffBar({ additions, deletions }: ChangelogStats) {
  const total = additions + deletions;
  const lit = total > 0 ? litBlocks(total) : 0;
  const added = total > 0 ? Math.round((lit * additions) / total) : 0;

  return (
    <span aria-hidden="true" className="flex gap-0.5">
      {Array.from({ length: BLOCKS }, (_, i) => (
        <span
          key={i}
          className={cn(
            "size-2 rounded-[2px]",
            i < added
              ? "bg-(--diff-add-fg)"
              : i < lit
                ? "bg-(--diff-del-fg)"
                : "bg-foreground/12",
          )}
        />
      ))}
    </span>
  );
}

export function CommitStats({
  stats,
  className,
}: {
  stats: ChangelogStats;
  className?: string;
}) {
  const marks = [...new Set(stats.paths.map(techIconForFile))].slice(
    0,
    MAX_MARKS,
  );

  return (
    <span
      className={cn(
        "flex items-center gap-2.5 font-mono text-[11px] tabular-nums",
        className,
      )}
    >
      <span aria-hidden="true" className="flex items-center gap-1">
        {marks.map((Mark, i) => (
          <Mark key={i} size={13} className="shrink-0" />
        ))}
      </span>
      <DiffBar {...stats} />
      <span>
        <span className="text-(--diff-add-fg)">+{stats.additions}</span>{" "}
        <span className="text-(--diff-del-fg)">−{stats.deletions}</span>
      </span>
    </span>
  );
}
