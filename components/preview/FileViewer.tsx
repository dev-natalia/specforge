"use client";

import { useEffect, useMemo, useState } from "react";
import type { GeneratedFile } from "@/lib/types";
import { highlightCode } from "@/lib/shiki";
import { renderMarkdown } from "@/lib/markdown";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

type Mode = "rendered" | "code" | "edit";

interface FileViewerProps {
  file: GeneratedFile;
  // Quando fornecido, habilita o modo de edição (salva o markdown editado).
  onSave?: (content: string) => void;
}

// Classes para estilizar o markdown renderizado (mini "prose").
const PROSE =
  "text-sm leading-relaxed text-slate-700 [&_h1]:mt-3 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:mt-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mt-2 [&_h3]:font-semibold [&_h3]:text-slate-900 [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:text-xs [&_pre]:my-2 [&_pre]:overflow-auto [&_pre]:rounded [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre]:text-xs [&_pre]:text-slate-100 [&_pre_code]:bg-transparent [&_pre_code]:text-slate-100 [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-slate-300 [&_blockquote]:pl-3 [&_blockquote]:text-slate-500 [&_strong]:font-semibold [&_hr]:my-3 [&_hr]:border-slate-200";

export function FileViewer({ file, onSave }: FileViewerProps) {
  const isMarkdown = file.language === "markdown";
  const [mode, setMode] = useState<Mode>(isMarkdown ? "rendered" : "code");
  const [draft, setDraft] = useState(file.content);
  const [codeHtml, setCodeHtml] = useState<string | null>(null);

  // Ao trocar de arquivo, volta ao modo padrão e descarta rascunho de edição.
  useEffect(() => {
    setMode(isMarkdown ? "rendered" : "code");
    setDraft(file.content);
  }, [file.path, file.content, isMarkdown]);

  // Realce de sintaxe só é necessário no modo "Código".
  useEffect(() => {
    if (mode !== "code") return;
    let active = true;
    setCodeHtml(null);
    highlightCode(file.content, file.language)
      .then((result) => active && setCodeHtml(result))
      .catch(() => active && setCodeHtml(null));
    return () => {
      active = false;
    };
  }, [mode, file.content, file.language]);

  const renderedHtml = useMemo(
    () => (isMarkdown ? renderMarkdown(file.content) : ""),
    [isMarkdown, file.content],
  );

  function save() {
    onSave?.(draft);
    setMode("rendered");
  }

  function ToggleButton({ value, label }: { value: Mode; label: string }) {
    const active = mode === value;
    return (
      <button
        type="button"
        onClick={() => {
          if (value === "edit") setDraft(file.content);
          setMode(value);
        }}
        className={
          "rounded px-2 py-0.5 text-xs transition-colors " +
          (active ? "bg-white font-medium text-brand-700 shadow-sm" : "text-slate-500 hover:text-slate-800")
        }
      >
        {label}
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
        <span className="truncate font-mono text-xs text-slate-600">{file.path}</span>
        {mode === "edit" ? (
          <div className="flex shrink-0 gap-1">
            <Button variant="ghost" size="sm" onClick={() => setMode("rendered")}>
              Cancelar
            </Button>
            <Button size="sm" onClick={save}>
              Salvar
            </Button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-1 rounded-md bg-slate-100 p-0.5">
            {isMarkdown && <ToggleButton value="rendered" label="Renderizado" />}
            <ToggleButton value="code" label="Código" />
            {onSave && <ToggleButton value="edit" label="Editar" />}
          </div>
        )}
      </div>

      <div className="max-h-[60vh] overflow-auto bg-white p-3 text-sm [&_pre]:!bg-transparent">
        {mode === "edit" ? (
          <Textarea
            rows={20}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="font-mono text-xs [resize:vertical] [&]:bg-transparent"
          />
        ) : mode === "rendered" ? (
          <div className={PROSE} dangerouslySetInnerHTML={{ __html: renderedHtml }} />
        ) : codeHtml ? (
          <div dangerouslySetInnerHTML={{ __html: codeHtml }} />
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
