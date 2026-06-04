"use client";

import { useState } from "react";
import { useWizardStore } from "@/lib/wizard/store";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Textarea";
import { generateClarifications } from "@/lib/api-client";

// Fase de clarificação: a IA levanta perguntas de ambiguidade e o usuário
// responde antes de gerar os specs. As respostas entram no contexto da geração.
export function ClarifyQuestions() {
  const formData = useWizardStore((state) => state.formData);
  const clarifications = useWizardStore(
    (state) => state.formData.clarifications ?? [],
  );
  const setQuestions = useWizardStore(
    (state) => state.setClarificationQuestions,
  );
  const updateAnswer = useWizardStore(
    (state) => state.updateClarificationAnswer,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClarify() {
    setLoading(true);
    setError(null);
    try {
      const questions = await generateClarifications(formData);
      setQuestions(questions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao levantar perguntas.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-slate-800">
          Clarificação{" "}
          <span className="font-normal text-slate-400">(opcional)</span>
        </h3>
        <p className="text-sm text-slate-500">
          A IA levanta as perguntas que provavelmente ficaram em aberto. Responder
          melhora bastante a precisão dos specs.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {clarifications.length > 0 && (
        <ul className="space-y-3">
          {clarifications.map((item, index) => (
            <li key={item.question} className="space-y-1.5">
              <Textarea
                label={`${index + 1}. ${item.question}`}
                rows={2}
                placeholder="Sua resposta (deixe em branco para ignorar)"
                value={item.answer}
                onChange={(event) => updateAnswer(index, event.target.value)}
              />
            </li>
          ))}
        </ul>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleClarify}
        disabled={loading}
      >
        {loading && <Spinner className="h-4 w-4" />}
        {loading
          ? "Levantando..."
          : clarifications.length > 0
            ? "Gerar novas perguntas"
            : "Levantar perguntas"}
      </Button>
    </div>
  );
}
