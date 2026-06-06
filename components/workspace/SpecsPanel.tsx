"use client";

// Painel de Specs (Fase 3). Gera os 7 tipos em cascata a partir do conhecimento,
// com rastreabilidade e quality gate por tipo. Preview reusa FilePreview.
import { useState } from "react";
import Link from "next/link";
import { useWorkspaceStore } from "@/lib/workspace/store";
import { getStoredKey } from "@/lib/byok";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { FilePreview } from "@/components/preview/FilePreview";
import { OpenQuestionsPanel } from "@/components/workspace/OpenQuestionsPanel";
import { PanelIntro } from "@/components/workspace/PanelIntro";
import {
  SPEC_CASCADE,
  SPEC_LABEL,
  SPEC_FILENAME,
  type SpecType,
} from "@/lib/domain/specs";
import { isSpecAllowed } from "@/lib/domain/artifact-matrix";
import {
  CONSOLIDATED_SPEC_LABEL,
  CONSOLIDATED_SPEC_FILENAME,
} from "@/lib/domain/consolidated-spec";
import type { ProjectSnapshot } from "@/lib/domain/project";
import type { GeneratedFile } from "@/lib/types";

export function SpecsPanel({ snapshot }: { snapshot: ProjectSnapshot }) {
  const generateSpecification = useWorkspaceStore((s) => s.generateSpecification);
  const removeSpecification = useWorkspaceStore((s) => s.removeSpecification);
  const updateSpecificationContent = useWorkspaceStore((s) => s.updateSpecificationContent);
  const generateConsolidatedSpec = useWorkspaceStore((s) => s.generateConsolidatedSpec);
  const removeConsolidatedSpec = useWorkspaceStore((s) => s.removeConsolidatedSpec);
  const updateConsolidatedSpecContent = useWorkspaceStore((s) => s.updateConsolidatedSpecContent);
  const specReport = useWorkspaceStore((s) => s.specReport);

  const [busy, setBusy] = useState<SpecType | "all" | "consolidated" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasKey = Boolean(getStoredKey());

  // Scope da iniciativa ativa (a view recebida contém só ela). Governa quais
  // specs são permitidas pela matriz de artefatos.
  const scope = snapshot.initiatives[0]?.scope ?? "product";
  const allowed = (type: SpecType) => isSpecAllowed(scope, type);

  // Story/Feature usam um DOCUMENTO ÚNICO consolidado (docs 010/011).
  const usesConsolidated = scope === "story" || scope === "feature";
  const consolidated = snapshot.consolidatedSpecs[0];

  const byType = new Map(snapshot.specifications.map((s) => [s.specType, s]));

  async function runConsolidated() {
    const apiKey = getStoredKey();
    if (!apiKey) return;
    setBusy("consolidated");
    setError(null);
    try {
      await generateConsolidatedSpec({ apiKey });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar a especificação.");
    } finally {
      setBusy(null);
    }
  }

  async function generateOne(type: SpecType) {
    const apiKey = getStoredKey();
    if (!apiKey) return;
    setBusy(type);
    setError(null);
    try {
      await generateSpecification(type, { apiKey });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar spec.");
    } finally {
      setBusy(null);
    }
  }

  async function generateAll() {
    const apiKey = getStoredKey();
    if (!apiKey) return;
    setBusy("all");
    setError(null);
    try {
      // Cascata: cada tipo usa os anteriores como contexto. Pula os proibidos
      // pelo scope (matriz de artefatos).
      for (const type of SPEC_CASCADE) {
        if (!allowed(type)) continue;
        await generateSpecification(type, { apiKey });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar specs.");
    } finally {
      setBusy(null);
    }
  }

  // Mapa caminho → id da spec, para salvar a edição no artefato certo.
  const pathToSpecId = new Map<string, string>();
  const previewFiles: GeneratedFile[] = SPEC_CASCADE.filter((t) => byType.has(t)).map(
    (t) => {
      const spec = byType.get(t)!;
      const path = `specs/001-${snapshot.project.slug}/${SPEC_FILENAME[t]}`;
      pathToSpecId.set(path, spec.id);
      return { name: SPEC_FILENAME[t], path, content: spec.content, language: "markdown" };
    },
  );

  const report = specReport();
  const failing = report?.results.filter((r) => r.outcome !== "pass") ?? [];

  return (
    <div className="space-y-6">
      <PanelIntro>
        Especificações derivadas do conhecimento, rastreáveis às origens. Em Story/Feature
        é um <strong>documento único</strong> consolidado; em Product, a <strong>cascata
        por-tipo</strong> (requisitos → design → … → testes).
      </PanelIntro>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Specs derivam do conhecimento, em cascata e rastreáveis.
        </p>
        <Button onClick={generateAll} disabled={!hasKey || busy !== null}>
          {busy === "all" && <Spinner className="h-4 w-4" />}
          Gerar todas (cascata)
        </Button>
      </div>

      {!hasKey && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Configure sua chave da Anthropic para gerar.{" "}
          <Link href="/settings" className="font-medium underline">
            Configurar
          </Link>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Documento consolidado (Story/Feature) — artefato primário do scope */}
      {usesConsolidated && (
        <div className="rounded-lg border border-brand-200 bg-brand-50/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900">{CONSOLIDATED_SPEC_LABEL[scope]}</span>
              {consolidated ? (
                <Badge variant="success">{consolidated.id} · v{consolidated.version}</Badge>
              ) : (
                <Badge variant="neutral">não gerada</Badge>
              )}
            </div>
            <div className="flex gap-1">
              {consolidated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void removeConsolidatedSpec(consolidated.id)}
                  disabled={busy !== null}
                >
                  Remover
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => void runConsolidated()}
                disabled={!hasKey || busy !== null}
              >
                {busy === "consolidated" && <Spinner className="h-4 w-4" />}
                {consolidated ? "Regenerar" : "Gerar"}
              </Button>
            </div>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Documento único de especificação para este scope — derivado do conhecimento da iniciativa.
          </p>
          {consolidated && (
            <div className="mt-3">
              <FilePreview
                files={[
                  {
                    name: CONSOLIDATED_SPEC_FILENAME[scope],
                    path: `specs/001-${snapshot.project.slug}/${CONSOLIDATED_SPEC_FILENAME[scope]}`,
                    content: consolidated.content,
                    language: "markdown",
                  },
                ]}
                onSaveFile={(_, content) =>
                  void updateConsolidatedSpecContent(consolidated.id, content)
                }
              />
            </div>
          )}
        </div>
      )}

      {failing.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
          <p className="text-xs font-medium text-amber-800">Quality gates (specs)</p>
          <ul className="mt-1 space-y-0.5">
            {failing.map((g) => (
              <li key={g.id} className="text-xs text-amber-700">
                <span className="font-medium">{g.label}:</span> {g.outcome}
                {g.issues[0] ? ` — ${g.issues[0].message}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lista da cascata por-tipo (V2). Secundária quando há consolidado. */}
      {usesConsolidated && (
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Specs por-tipo (opcional)
        </p>
      )}
      <div className="grid gap-2">
        {SPEC_CASCADE.map((type, index) => {
          const spec = byType.get(type);
          const isBusy = busy === type || busy === "all";
          const typeAllowed = allowed(type);
          return (
            <div
              key={type}
              className={
                "flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 " +
                (typeAllowed ? "" : "opacity-60")
              }
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="font-mono text-xs text-slate-400">{index + 1}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{SPEC_LABEL[type]}</span>
                    {!typeAllowed ? (
                      <Badge variant="neutral">fora do scope {scope}</Badge>
                    ) : spec ? (
                      <Badge variant="success">{spec.id} · v{spec.version}</Badge>
                    ) : (
                      <Badge variant="neutral">não gerada</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                {spec && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void removeSpecification(spec.id)}
                    disabled={isBusy}
                  >
                    Remover
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void generateOne(type)}
                  disabled={!hasKey || busy !== null || !typeAllowed}
                  title={typeAllowed ? undefined : `Não permitida no scope ${scope}`}
                >
                  {busy === type && <Spinner className="h-4 w-4" />}
                  {spec ? "Regenerar" : "Gerar"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview */}
      {previewFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-slate-800">Specs geradas</h3>
          <FilePreview
            files={previewFiles}
            onSaveFile={(file, content) => {
              const id = pathToSpecId.get(file.path);
              if (id) void updateSpecificationContent(id, content);
            }}
          />
        </div>
      )}

      {/* Perguntas em aberto das specs → respondíveis (viram conhecimento) */}
      <OpenQuestionsPanel snapshot={snapshot} />
    </div>
  );
}
