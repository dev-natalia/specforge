"use client";

import { useMemo } from "react";
import type { GeneratedFile } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface FileTreeProps {
  files: GeneratedFile[];
  activePath: string | null;
  onSelect: (path: string) => void;
}

interface TreeNode {
  name: string;
  path: string;
  children: Map<string, TreeNode>;
  isFile: boolean;
}

function buildTree(files: GeneratedFile[]): TreeNode {
  const root: TreeNode = {
    name: "",
    path: "",
    children: new Map(),
    isFile: false,
  };

  for (const file of files) {
    const parts = file.path.split("/").filter(Boolean);
    let current = root;
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const existing = current.children.get(part);
      if (existing) {
        current = existing;
      } else {
        const node: TreeNode = {
          name: part,
          path: isFile ? file.path : parts.slice(0, index + 1).join("/"),
          children: new Map(),
          isFile,
        };
        current.children.set(part, node);
        current = node;
      }
    });
  }

  return root;
}

function TreeNodeView({
  node,
  depth,
  activePath,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  activePath: string | null;
  onSelect: (path: string) => void;
}) {
  const children = Array.from(node.children.values()).sort((a, b) => {
    if (a.isFile !== b.isFile) return a.isFile ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  return (
    <ul className={depth === 0 ? "space-y-0.5" : "space-y-0.5"}>
      {children.map((child) =>
        child.isFile ? (
          <li key={child.path}>
            <button
              type="button"
              onClick={() => onSelect(child.path)}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              className={cn(
                "flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm",
                activePath === child.path
                  ? "bg-brand-100 font-medium text-brand-800"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <span aria-hidden>📄</span>
              <span className="truncate">{child.name}</span>
            </button>
          </li>
        ) : (
          <li key={child.path}>
            <div
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-slate-700"
            >
              <span aria-hidden>📁</span>
              <span className="truncate">{child.name}</span>
            </div>
            <TreeNodeView
              node={child}
              depth={depth + 1}
              activePath={activePath}
              onSelect={onSelect}
            />
          </li>
        ),
      )}
    </ul>
  );
}

export function FileTree({ files, activePath, onSelect }: FileTreeProps) {
  const tree = useMemo(() => buildTree(files), [files]);

  return (
    <nav
      aria-label="Arquivos gerados"
      className="rounded-md border border-slate-200 bg-white p-2"
    >
      <TreeNodeView
        node={tree}
        depth={0}
        activePath={activePath}
        onSelect={onSelect}
      />
    </nav>
  );
}
