"use client";

import { useEffect, useState } from "react";
import type { GeneratedFile } from "@/lib/types";
import { FileTree } from "@/components/preview/FileTree";
import { FileViewer } from "@/components/preview/FileViewer";

interface FilePreviewProps {
  files: GeneratedFile[];
}

export function FilePreview({ files }: FilePreviewProps) {
  const [activePath, setActivePath] = useState<string | null>(
    files[0]?.path ?? null,
  );

  // Mantém uma seleção válida quando a lista de arquivos muda (ex: regenerar).
  useEffect(() => {
    const stillExists = files.some((file) => file.path === activePath);
    if (!stillExists) {
      setActivePath(files[0]?.path ?? null);
    }
  }, [files, activePath]);

  const activeFile =
    files.find((file) => file.path === activePath) ?? files[0] ?? null;

  if (files.length === 0) {
    return (
      <p className="text-sm text-slate-500">Nenhum arquivo para exibir.</p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(180px,240px)_1fr]">
      <FileTree
        files={files}
        activePath={activeFile?.path ?? null}
        onSelect={setActivePath}
      />
      {activeFile && <FileViewer file={activeFile} />}
    </div>
  );
}
