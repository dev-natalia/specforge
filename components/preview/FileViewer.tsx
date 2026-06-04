"use client";

import { useEffect, useState } from "react";
import type { GeneratedFile } from "@/lib/types";
import { highlightCode } from "@/lib/shiki";
import { Spinner } from "@/components/ui/Spinner";

interface FileViewerProps {
  file: GeneratedFile;
}

export function FileViewer({ file }: FileViewerProps) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setHtml(null);
    highlightCode(file.content, file.language)
      .then((result) => {
        if (active) setHtml(result);
      })
      .catch(() => {
        if (active) setHtml(null);
      });
    return () => {
      active = false;
    };
  }, [file.content, file.language]);

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2">
        <span className="font-mono text-xs text-slate-600">{file.path}</span>
        <span className="text-xs uppercase text-slate-400">
          {file.language}
        </span>
      </div>
      <div className="max-h-[60vh] overflow-auto bg-white p-3 text-sm [&_pre]:!bg-transparent">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-slate-700">
            <span className="mr-2 inline-flex align-middle text-slate-400">
              <Spinner className="h-4 w-4" />
            </span>
            {file.content}
          </pre>
        )}
      </div>
    </div>
  );
}
