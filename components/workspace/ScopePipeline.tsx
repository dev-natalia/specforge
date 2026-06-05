"use client";

// Pipeline do scope (ai/v3 — 008/017). Mostra os estágios compostos para o
// scope da iniciativa e dispara o orquestrador "Gerar tudo" — pipeline completo
// numa ação só (specs → harness → tasks → artefatos), conforme o scope.
import { useState } from "react";
import Link from "next/link";
import { useWorkspaceStore } from "@/lib/workspace/store";
import { getStoredKey } from "@/lib/byok";
import { composePipeline, type Stage } from "@/lib/engine/pipeline";
import { SCOPE_LABEL } from "@/lib/domain/scope";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { GenerationTimeline } from "@/components/workspace/GenerationTimeline";
import type { ProjectSnapshot } from "@/lib/domain/project";

const STAGE_LABEL: Record<Stage, string> = {
  intentCapture: "Intenção",
  scopeResolution: "Scope",
  clarification: "Clarificação",
  knowledgeCollection: "Conhecimento",
  requirements: "Requisitos",
  design: "Design",
  architecture: "Arquitetura",
  contracts: "Contratos",
  security: "Segurança",
  testing: "Testes",
  harness: "Harness",
  tasks: "Tasks",
  providerOutputs: "Artefatos",
};

export function ScopePipeline({ snapshot }: { snapshot: ProjectSnapshot }) {
  const generateAll = useWorkspaceStore((s) => s.generateAll);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasKey = Boolean(getStoredKey());

  const scope = snapshot.initiatives[0]?.scope;
  if (!scope) return null;

  const { stages } = composePipeline(scope);

  async function run() {
    const apiKey = getStoredKey();
    if (!apiKey) return;
    setBusy(true);
    setError(null);
    try {
      await generateAll({ apiKey });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar o pipeline.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-slate-800">
            Pipeline — scope {SCOPE_LABEL[scope]}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1">
            {stages.map((stage) => (
              <Badge key={stage} variant="neutral">
                {STAGE_LABEL[stage]}
              </Badge>
            ))}
          </div>
        </div>
        <Button onClick={() => void run()} disabled={!hasKey || busy}>
          {busy && <Spinner className="h-4 w-4" />}
          Gerar tudo do scope
        </Button>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Roda specs → harness → tasks → artefatos numa ação. Use a clarificação antes para
        registrar o conhecimento.
      </p>
      {!hasKey && (
        <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Configure sua chave da Anthropic para gerar.{" "}
          <Link href="/settings" className="font-medium underline">
            Configurar
          </Link>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {/* Timeline ao vivo do orquestrador */}
      <GenerationTimeline />
    </div>
  );
}
