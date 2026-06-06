"use client";

// Painel de Harness + Provider Adapters (Fase 4). Gera o harness provider-neutro
// (BYOK) e renderiza os 4 artefatos de saída (transformação pura, sem chave).
import { useState } from "react";
import Link from "next/link";
import { useWorkspaceStore } from "@/lib/workspace/store";
import { getStoredKey } from "@/lib/byok";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { FilePreview } from "@/components/preview/FilePreview";
import { PanelIntro } from "@/components/workspace/PanelIntro";
import {
  HARNESS_LAYERS,
  PROVIDER_LABEL,
  activeHarnessLayers,
  type Provider,
} from "@/lib/domain/harness";
import { SCOPE_LABEL } from "@/lib/domain/scope";
import type { ProjectSnapshot } from "@/lib/domain/project";
import type { GeneratedFile } from "@/lib/types";

const PROVIDERS: Provider[] = ["claude", "cursor", "gpt", "gemini"];

export function HarnessPanel({ snapshot }: { snapshot: ProjectSnapshot }) {
  const generateHarness = useWorkspaceStore((s) => s.generateHarness);
  const generateProviderArtifacts = useWorkspaceStore((s) => s.generateProviderArtifacts);

  const [busy, setBusy] = useState<"harness" | "artifacts" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasKey = Boolean(getStoredKey());

  const harness = snapshot.harnesses[0];
  const agentRules = snapshot.agentRules[0];
  // Scope da iniciativa ativa: o harness é progressivo (camadas ativas por scope).
  const scope = snapshot.initiatives[0]?.scope;

  async function runHarness() {
    const apiKey = getStoredKey();
    if (!apiKey) return;
    setBusy("harness");
    setError(null);
    try {
      await generateHarness({ apiKey });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar harness.");
    } finally {
      setBusy(null);
    }
  }

  async function runArtifacts(providers: Provider[]) {
    setBusy("artifacts");
    setError(null);
    try {
      await generateProviderArtifacts(providers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar artefatos.");
    } finally {
      setBusy(null);
    }
  }

  const artifactFiles: GeneratedFile[] = snapshot.providerArtifacts.map((a) => ({
    name: a.path,
    path: a.path,
    content: a.content,
    language: "markdown",
  }));

  return (
    <div className="space-y-6">
      <PanelIntro>
        O harness são as <strong>regras de como a IA deve se comportar</strong> neste
        projeto (provider-neutro: identidade, segurança, testes, proibições…). Ele é a
        fonte; em <strong>Exportar para agentes</strong> você o transforma nos arquivos
        que de fato usa — <code>CLAUDE.md</code>, <code>.cursor/rules</code> e afins.
      </PanelIntro>
      {!hasKey && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Configure sua chave da Anthropic para gerar o harness.{" "}
          <Link href="/settings" className="font-medium underline">
            Configurar
          </Link>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Harness */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-medium text-slate-800">Harness</h3>
            <p className="text-sm text-slate-500">
              Ambiente operacional provider-neutro derivado do conhecimento + specs.
            </p>
            {scope && (
              <p className="mt-1 text-xs text-slate-400">
                Progressivo — scope{" "}
                <span className="font-medium text-slate-500">{SCOPE_LABEL[scope]}</span>:{" "}
                {activeHarnessLayers(scope).length} camadas ativas.
              </p>
            )}
          </div>
          <Button onClick={runHarness} disabled={!hasKey || busy !== null}>
            {busy === "harness" && <Spinner className="h-4 w-4" />}
            {harness ? "Regenerar" : "Gerar harness"}
          </Button>
        </div>

        {harness && (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {HARNESS_LAYERS.filter((l) => harness.layers[l].trim()).map((l) => (
                <Badge key={l} variant="neutral">
                  {l}
                </Badge>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-medium text-green-800">
              <span className="text-green-600">✓</span>
              {harness.id} · v{harness.version} · {agentRules?.rules.length ?? 0} regras de agente ·{" "}
              {harness.prohibited.length} proibições
              <span className="font-semibold">(GERADO)</span>
            </span>
          </div>
        )}
      </div>

      {/* Provider adapters */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-medium text-slate-800">Exportar para agentes</h3>
            <p className="text-sm text-slate-500">
              Gera o arquivo de cada agente a partir do harness — CLAUDE.md, .cursor/rules,
              GPT e Gemini. Tradução pura, sem IA e sem chave.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => void runArtifacts(PROVIDERS)}
            disabled={!harness || busy !== null}
          >
            {busy === "artifacts" && <Spinner className="h-4 w-4" />}
            Exportar todos
          </Button>
        </div>
        {!harness && (
          <p className="mt-2 text-xs text-slate-400">Gere o harness acima para habilitar a exportação.</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {PROVIDERS.map((p) => {
            const exists = snapshot.providerArtifacts.some((a) => a.provider === p);
            return (
              <Button
                key={p}
                size="sm"
                variant={exists ? "ghost" : "outline"}
                onClick={() => void runArtifacts([p])}
                disabled={!harness || busy !== null}
              >
                {PROVIDER_LABEL[p]}
                {exists ? " ✓" : ""}
              </Button>
            );
          })}
        </div>
      </div>

      {artifactFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-slate-800">Arquivos exportados</h3>
          <FilePreview files={artifactFiles} />
        </div>
      )}
    </div>
  );
}
