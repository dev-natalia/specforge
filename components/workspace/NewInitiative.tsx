"use client";

// Criação de iniciativa com seleção de scope HÍBRIDA (V3 — 007). A usuária
// descreve a intenção, a IA SUGERE o scope (story/feature/product) com confiança
// e sinais, e a usuária confirma ou troca antes de criar. Sem chave/IA, é
// possível escolher o scope manualmente.
import { useState } from "react";
import Link from "next/link";
import { useWorkspaceStore } from "@/lib/workspace/store";
import { getStoredKey } from "@/lib/byok";
import { classifyScope } from "@/lib/engine/classify";
import { SCOPE_ORDER, SCOPE_LABEL, SCOPE_DESCRIPTION, type Scope } from "@/lib/domain/scope";
import type { ScopeClassification } from "@/lib/domain/initiative";
import type { ProjectSnapshot } from "@/lib/domain/project";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

function confidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return "Confiança alta";
  if (confidence >= 0.7) return "Confiança média";
  return "Confiança baixa";
}

export function NewInitiative({
  snapshot,
  onDone,
  onCancel,
}: {
  snapshot: ProjectSnapshot;
  onDone: (id: string) => void;
  onCancel: () => void;
}) {
  const createInitiative = useWorkspaceStore((s) => s.createInitiative);

  const [title, setTitle] = useState("");
  const [intent, setIntent] = useState("");
  const [scope, setScope] = useState<Scope>("feature");
  const [classification, setClassification] = useState<ScopeClassification | null>(null);
  const [classifying, setClassifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasKey = Boolean(getStoredKey());

  async function runClassify() {
    const apiKey = getStoredKey();
    if (!apiKey) return;
    setClassifying(true);
    setError(null);
    try {
      const result = await classifyScope(intent || title, { apiKey }, snapshot);
      setClassification(result);
      setScope(result.suggested); // pré-seleciona a sugestão (modo híbrido)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao classificar o scope.");
    } finally {
      setClassifying(false);
    }
  }

  async function handleCreate() {
    const finalTitle = title.trim() || intent.trim().split("\n")[0]?.slice(0, 60) || "Nova iniciativa";
    setSaving(true);
    setError(null);
    try {
      // Registra a classificação confirmada, marcando override se divergiu.
      const confirmed: ScopeClassification | undefined = classification
        ? { ...classification, overridden: classification.suggested !== scope }
        : undefined;
      const id = await createInitiative(finalTitle, scope, intent, confirmed);
      if (id) onDone(id);
      else setError("Não foi possível criar a iniciativa.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
      <div>
        <h3 className="font-medium text-slate-800">Nova iniciativa</h3>
        <p className="text-sm text-slate-500">
          Descreva o que você quer construir. O processo se adapta ao tamanho do problema.
        </p>
      </div>

      <Input
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ex.: Autenticação com Google"
      />
      <Textarea
        rows={4}
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
        placeholder="O que você quer construir? Ex.: permitir login com Google, vinculando contas existentes…"
      />

      {!hasKey && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Configure sua chave da Anthropic para sugestão automática de scope.{" "}
          <Link href="/settings" className="font-medium underline">
            Configurar
          </Link>{" "}
          — ou escolha o scope manualmente abaixo.
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={runClassify}
          disabled={!hasKey || classifying || (!intent.trim() && !title.trim())}
        >
          {classifying && <Spinner className="h-4 w-4" />}
          Sugerir scope com IA
        </Button>
      </div>

      {/* Recomendação (modo híbrido) */}
      {classification && (
        <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-blue-900">
              Sugestão: {SCOPE_LABEL[classification.suggested]}
            </span>
            <Badge variant="info">
              {confidenceLabel(classification.confidence)} · {Math.round(classification.confidence * 100)}%
            </Badge>
          </div>
          {classification.reason && (
            <p className="mt-1 text-sm text-blue-800">{classification.reason}</p>
          )}
          {classification.signals.length > 0 && (
            <ul className="mt-1 list-inside list-disc text-xs text-blue-700">
              {classification.signals.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Seleção de scope (confirma ou troca a sugestão) */}
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Scope</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {SCOPE_ORDER.map((s) => {
            const active = scope === s;
            const suggested = classification?.suggested === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setScope(s)}
                className={
                  "rounded-md border p-3 text-left transition-colors " +
                  (active
                    ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                    : "border-slate-200 hover:border-slate-300")
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">{SCOPE_LABEL[s]}</span>
                  {suggested && <Badge variant="info">sugerido</Badge>}
                </div>
                <p className="mt-1 text-xs text-slate-500">{SCOPE_DESCRIPTION[s]}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleCreate} disabled={saving}>
          {saving && <Spinner className="h-4 w-4" />}
          Criar iniciativa
        </Button>
      </div>
    </div>
  );
}
