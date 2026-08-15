/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { TechFileMark } from "@/components/ui/custom/tech-file-mark";
import { statusLetter, type FileNode } from "@/lib/github-commits";
import { cn } from "@/lib/utils";

const iconClass = "size-3 shrink-0";

function FileTreeNode({
  node,
  selected,
  onSelect,
}: {
  node: FileNode;
  selected: string | null;
  onSelect: (filename: string) => void;
}) {
  const file = node.file;
  const selectedFile = !!file && file.filename === selected;

  return (
    <li className="min-w-0">
      {file ? (
        <button
          type="button"
          onClick={() => onSelect(file.filename)}
          aria-pressed={selectedFile}
          className={cn(
            "flex w-full min-w-0 items-center gap-2 rounded-md px-1.5 text-left transition-colors duration-200 ease-out",
            "can-hover:hover:bg-muted/60",
            selectedFile && "bg-muted/70",
          )}
        >
          <TechFileMark filename={file.filename} className={iconClass} />
          <span className="min-w-0 flex-1 truncate text-foreground">
            {node.name}
          </span>
          <span className="shrink-0 tabular-nums text-muted-foreground">
            <span className="text-foreground/70">
              {statusLetter(file.status)}
            </span>
            <span className="ml-2 text-(--diff-add-fg)">+{file.additions}</span>{" "}
            <span className="text-(--diff-del-fg)">−{file.deletions}</span>
          </span>
        </button>
      ) : (
        <div className="flex min-w-0 items-center gap-2 px-1.5 text-muted-foreground">
          <TechFileMark className={iconClass} />
          <span className="min-w-0 truncate">{node.name}/</span>
        </div>
      )}
      {node.children.length > 0 ? (
        <ul className="min-w-0 border-l border-foreground/10 pl-2">
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              selected={selected}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTree({
  nodes,
  selected,
  onSelect,
}: {
  nodes: FileNode[];
  selected: string | null;
  onSelect: (filename: string) => void;
}) {
  if (nodes.length === 0) return null;

  return (
    <ul className="min-w-0 font-mono text-[12px] leading-6">
      {nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          selected={selected}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
