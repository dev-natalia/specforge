"use client";

// Perguntas em aberto das specs (V3). Lê a seção "Perguntas em aberto" do
// markdown das specs geradas e mostra cards respondíveis — como na clarificação.
// Responder vira conhecimento (discovery); depois é só regenerar a spec.
import { useState } from "react";
import { useWorkspaceStore } from "@/lib/workspace/store";
import { extractOpenQuestions } from "@/lib/engine/open-questions";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Textarea";
import type { ProjectSnapshot } from "@/lib/domain/project";

export function OpenQuestionsPanel({ snapshot }: { snapshot: ProjectSnapshot }) {
  const addKnowledge = useWorkspaceStore((s) => s.addKnowledge);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Tipo de conhecimento por pergunta: aprendizado (discovery) ou escolha (decision).
  const [kinds, setKinds] = useState<Record<string, "discovery" | "decision">>({});
  // Racional (o "porquê") quando é decisão — capturado agora, não depois.
  const [rationales, setRationales] = useState<Record<string, string>>({});
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);

  // Perguntas de todas as specs da iniciativa (por-tipo + consolidadas), únicas.
  const sources = [
    ...snapshot.specifications.map((s) => s.content),
    ...snapshot.consolidatedSpecs.map((s) => s.content),
  ];
  const questions = Array.from(new Set(sources.flatMap(extractOpenQuestions))).filter(
    (q) => !resolved.has(q),
  );

  if (questions.length === 0) return null;

  async function turnIntoKnowledge(question: string) {
    const answer = (answers[question] ?? "").trim();
    if (!answer) return;
    const kind = kinds[question] ?? "discovery";
    setBusy(question);
    try {
      if (kind === "decision") {
        // Uma escolha: a resposta é a decisão; a pergunta vira o título. O
        // racional é capturado junto para a decisão nascer completa.
        await addKnowledge("decision", {
          title: question,
          category: "product",
          decision: answer,
          rationale: (rationales[question] ?? "").trim(),
          context: "Pergunta em aberto de uma spec",
        });
      } else {
        // Um aprendizado: a resposta é a descrição.
        await addKnowledge("discovery", {
          title: question,
          category: "product",
          description: answer,
        });
      }
      setResolved((prev) => new Set(prev).add(question));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-medium text-slate-800">
          Perguntas em aberto ({questions.length})
        </h3>
        <p className="text-sm text-slate-500">
          A IA registrou o que não conseguiu definir a partir do conhecimento. Responda
          o que importa — vira conhecimento — e depois regenere a spec para incorporar.
        </p>
      </div>

      {questions.map((question) => (
        <div key={question} className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="font-medium text-slate-900">{question}</p>
          <div className="mt-2">
            <Textarea
              rows={2}
              value={answers[question] ?? ""}
              placeholder={
                (kinds[question] ?? "discovery") === "decision"
                  ? "A decisão (o que foi escolhido)…"
                  : "Sua resposta…"
              }
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [question]: e.target.value }))
              }
            />
          </div>
          {(kinds[question] ?? "discovery") === "decision" && (
            <div className="mt-2">
              <Textarea
                rows={2}
                value={rationales[question] ?? ""}
                placeholder="Por quê? (racional da decisão)"
                onChange={(e) =>
                  setRationales((prev) => ({ ...prev, [question]: e.target.value }))
                }
              />
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            {/* Tipo de conhecimento: aprendizado ou escolha */}
            <div className="inline-flex overflow-hidden rounded-md border border-slate-200 text-xs">
              {(["discovery", "decision"] as const).map((k) => {
                const active = (kinds[question] ?? "discovery") === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKinds((prev) => ({ ...prev, [question]: k }))}
                    className={
                      "px-2.5 py-1 transition-colors " +
                      (active
                        ? "bg-brand-50 font-medium text-brand-700"
                        : "text-slate-500 hover:text-slate-800")
                    }
                  >
                    {k === "discovery" ? "Discovery" : "Decisão"}
                  </button>
                );
              })}
            </div>
            <Button
              size="sm"
              disabled={
                busy !== null ||
                (answers[question] ?? "").trim().length === 0 ||
                // Decisão exige racional (nasce completa, sem gate de revisão).
                ((kinds[question] ?? "discovery") === "decision" &&
                  (rationales[question] ?? "").trim().length === 0)
              }
              onClick={() => void turnIntoKnowledge(question)}
            >
              {busy === question && <Spinner className="h-4 w-4" />}
              Virar conhecimento
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
