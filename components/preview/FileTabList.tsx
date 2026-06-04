"use client";

import type { GeneratedFile } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface FileTabListProps {
  files: GeneratedFile[];
  activePath: string | null;
  onSelect: (path: string) => void;
}

export function FileTabList({
  files,
  activePath,
  onSelect,
}: FileTabListProps) {
  return (
    <div
      role="tablist"
      aria-label="Arquivos"
      className="flex flex-wrap gap-1 border-b border-slate-200 pb-2"
    >
      {files.map((file) => (
        <button
          key={file.path}
          role="tab"
          aria-selected={activePath === file.path}
          type="button"
          onClick={() => onSelect(file.path)}
          className={cn(
            "rounded-t-md px-3 py-1.5 text-sm",
            activePath === file.path
              ? "bg-brand-100 font-medium text-brand-800"
              : "text-slate-600 hover:bg-slate-100",
          )}
        >
          {file.name}
        </button>
      ))}
    </div>
  );
}
