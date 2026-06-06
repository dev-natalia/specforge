"use client";

// Painel de Clarificação + Intake (Fase 2). Lê a intenção do projeto, levanta
// perguntas priorizadas via IA (BYOK) e transforma respostas em conhecimento
// durável. Também sugere conhecimento extraído da descrição.
import { useState } from "react";
import Link from "next/link";
import { useWorkspaceStore } from "@/lib/workspace/store";
import { getStoredKey } from "@/lib/byok";
import { detectClarifications } from "@/lib/engine/clarification";
import { suggestKnowledge, type KnowledgeSuggestion } from "@/lib/engine/knowledge-gen";
import type { ScopeRecommendation } from "@/lib/engine/classify";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Textarea";
import { PanelIntro } from "@/components/workspace/PanelIntro";
import type { ProjectSnapshot } from "@/lib/domain/project";
import type { ClarificationPriority } from "@/lib/domain/clarification";
import { CLARIFICATION_BUDGET, SCOPE_LABEL } from "@/lib/domain/scope";

const PRIORITY_BADGE: Record<ClarificationPriority, "warning" | "info" | "neutral"> = {
  critical: "warning",
  high: "warning",
  medium: "info",
  low: "neutral",
};
const PRIORITY_LABEL: Record<ClarificationPriority, string> = {
  critical: "Crítica",
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

export function ClarifyPanel({ snapshot }: { snapshot: ProjectSnapshot }) {
  const addClarifications = useWorkspaceStore((s) => s.addClarifications);
  const answerClarification = useWorkspaceStore((s) => s.answerClarification);
  const removeClarification = useWorkspaceStore((s) => s.removeClarification);
  const promoteClarification = useWorkspaceStore((s) => s.promoteClarification);
  const addKnowledge = useWorkspaceStore((s) => s.addKnowledge);
  const evaluateScopeChange = useWorkspaceStore((s) => s.evaluateScopeChange);
  const changeInitiativeScope = useWorkspaceStore((s) => s.changeInitiativeScope);

  const [description, setDescription] = useState(snapshot.project.description);
  const [loadingKind, setLoadingKind] = useState<null | "clarify" | "knowledge" | "scope">(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<KnowledgeSuggestion[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<ScopeRecommendation | null>(null);
  const [scopeMessage, setScopeMessage] = useState<string | null>(null);

  const hasKey = Boolean(getStoredKey());
  // Iniciativa ativa: scope governa profundidade/orçamento; id para mudar scope.
  const initiative = snapshot.initiatives[0];
  const scope = initiative?.scope;

  async function runEvaluateScope() {
    const apiKey = getStoredKey();
    if (!apiKey) return;
    setLoadingKind("scope");
    setError(null);
    setScopeMessage(null);
    setRecommendation(null);
    try {
      const rec = await evaluateScopeChange({ apiKey });
      if (rec) setRecommendation(rec);
      else setScopeMessage("O scope atual continua adequado.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao reavaliar o scope.");
    } finally {
      setLoadingKind(null);
    }
  }

  async function applyScopeChange() {
    if (!recommendation || !initiative) return;
    await changeInitiativeScope(initiative.id, recommendation.to, recommendation.classification);
    setRecommendation(null);
  }

  async function runClarify() {
    const apiKey = getStoredKey();
    if (!apiKey) return;
    setLoadingKind("clarify");
    setError(null);
    try {
      const found = await detectClarifications(description, snapshot, { apiKey }, scope);
      await addClarifications(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar perguntas.");
    } finally {
      setLoadingKind(null);
    }
  }

  async function runSuggest() {
    const apiKey = getStoredKey();
    if (!apiKey) return;
    setLoadingKind("knowledge");
    setError(null);
    try {
      setSuggestions(await suggestKnowledge(description, { apiKey }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao sugerir conhecimento.");
    } finally {
      setLoadingKind(null);
    }
  }

  const openClarifications = snapshot.clarifications.filter((c) => c.status !== "closed");

  return (
    <div className="space-y-6">
      <PanelIntro>
        A IA detecta lacunas, ambiguidades e contradições na sua intenção e levanta
        perguntas priorizadas. Cada resposta vira conhecimento durável — nada some no chat.
      </PanelIntro>

      {/* Intake */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="font-medium text-slate-800">Intenção do projeto</h3>
        <p className="mb-3 text-sm text-slate-500">
          Descreva o que você quer construir. A IA levanta as perguntas que faltam e
          extrai conhecimento durável — nada some no chat.
        </p>
        {scope && (
          <p className="mb-3 text-xs text-slate-400">
            Scope <span className="font-medium text-slate-500">{SCOPE_LABEL[scope]}</span> —
            profundidade adaptada: até {CLARIFICATION_BUDGET[scope].max} perguntas.
          </p>
        )}
        <Textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex.: um app local-first para preservar decisões de engenharia…"
        />

        {!hasKey && (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Configure sua chave da Anthropic para usar a IA.{" "}
            <Link href="/settings" className="font-medium underline">
              Configurar
            </Link>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={runClarify} disabled={!hasKey || loadingKind !== null}>
            {loadingKind === "clarify" && <Spinner className="h-4 w-4" />}
            Gerar perguntas
          </Button>
          <Button variant="outline" onClick={runSuggest} disabled={!hasKey || loadingKind !== null}>
            {loadingKind === "knowledge" && <Spinner className="h-4 w-4" />}
            Sugerir conhecimento
          </Button>
          {initiative && (
            <Button
              variant="outline"
              onClick={runEvaluateScope}
              disabled={!hasKey || loadingKind !== null}
            >
              {loadingKind === "scope" && <Spinner className="h-4 w-4" />}
              Reavaliar scope
            </Button>
          )}
        </div>

        {scopeMessage && <p className="mt-3 text-sm text-slate-500">{scopeMessage}</p>}

        {/* Recomendação de escalação/redução (nunca aplicada silenciosamente) */}
        {recommendation && (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="warning">
                {recommendation.direction === "escalate" ? "Escalar scope" : "Reduzir scope"}
              </Badge>
              <span className="text-sm font-medium text-amber-900">
                {SCOPE_LABEL[recommendation.from]} → {SCOPE_LABEL[recommendation.to]}
              </span>
              <span className="text-xs text-amber-700">
                {Math.round(recommendation.classification.confidence * 100)}%
              </span>
            </div>
            {recommendation.classification.reason && (
              <p className="mt-1 text-sm text-amber-800">{recommendation.classification.reason}</p>
            )}
            {recommendation.classification.signals.length > 0 && (
              <ul className="mt-1 list-inside list-disc text-xs text-amber-700">
                {recommendation.classification.signals.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setRecommendation(null)}>
                Manter {SCOPE_LABEL[recommendation.from]}
              </Button>
              <Button size="sm" onClick={() => void applyScopeChange()}>
                Aplicar {SCOPE_LABEL[recommendation.to]}
              </Button>
            </div>
          </div>
        )}

        {/* Histórico de scope (escalações/reduções) persistido na iniciativa */}
        {initiative && initiative.scopeHistory.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Histórico de scope
            </p>
            <ul className="mt-1 space-y-0.5">
              {initiative.scopeHistory.map((change, i) => (
                <li key={i} className="text-xs text-slate-500">
                  {SCOPE_LABEL[change.from]} → {SCOPE_LABEL[change.to]}
                  {change.reason ? ` — ${change.reason}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sugestões de conhecimento (transitórias) */}
      {suggestions.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-3 font-medium text-slate-800">Conhecimento sugerido</h3>
          <div className="space-y-2">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div className="min-w-0">
                  <Badge variant="neutral">{s.kind}</Badge>{" "}
                  <span className="text-sm text-slate-700">{s.label}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await addKnowledge(s.kind, s.data);
                    setSuggestions((prev) => prev.filter((_, i) => i !== idx));
                  }}
                >
                  Adicionar
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clarificações abertas */}
      <div className="space-y-3">
        <h3 className="font-medium text-slate-800">
          Clarificações {openClarifications.length > 0 && `(${openClarifications.length})`}
        </h3>
        {openClarifications.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            Nenhuma clarificação aberta. Gere perguntas a partir da intenção acima.
          </p>
        ) : (
          openClarifications.map((clar) => {
            const draft = drafts[clar.id] ?? clar.answer;
            const answered = clar.answer.trim().length > 0;
            return (
              <div key={clar.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">{clar.id}</span>
                  <Badge variant={PRIORITY_BADGE[clar.priority]}>
                    {PRIORITY_LABEL[clar.priority]}
                  </Badge>
                  <Badge variant="neutral">{clar.category}</Badge>
                </div>
                <p className="mt-2 font-medium text-slate-900">{clar.question}</p>
                {clar.context && <p className="mt-1 text-sm text-slate-500">{clar.context}</p>}
                {clar.impact && (
                  <p className="mt-1 text-xs text-slate-400">Impacto: {clar.impact}</p>
                )}

                <div className="mt-3">
                  <Textarea
                    rows={2}
                    value={draft}
                    placeholder="Sua resposta…"
                    onChange={(e) =>
                      setDrafts((prev) => ({ ...prev, [clar.id]: e.target.value }))
                    }
                  />
                </div>
                <div className="mt-2 flex flex-wrap justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => void removeClarification(clar.id)}>
                    Remover
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void answerClarification(clar.id, draft)}
                  >
                    Salvar resposta
                  </Button>
                  <Button
                    size="sm"
                    disabled={!answered && draft.trim().length === 0}
                    onClick={async () => {
                      await answerClarification(clar.id, draft);
                      await promoteClarification(clar.id);
                    }}
                  >
                    Virar conhecimento
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
