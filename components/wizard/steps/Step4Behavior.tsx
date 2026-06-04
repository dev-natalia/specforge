"use client";

import { useWizardStore } from "@/lib/wizard/store";
import { Textarea } from "@/components/ui/Textarea";

export function Step4Behavior() {
  const formData = useWizardStore((state) => state.formData);
  const updateForm = useWizardStore((state) => state.updateForm);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Comportamento Esperado
        </h2>
        <p className="text-sm text-slate-500">
          Exemplos concretos ajudam a IA a gerar specs precisos. Tudo opcional.
        </p>
      </div>

      <Textarea
        label="Exemplos de inputs / outputs"
        placeholder="Ex: POST /pay {amount} → 201 {id, status}"
        value={formData.behaviorExamples ?? ""}
        onChange={(event) =>
          updateForm({ behaviorExamples: event.target.value })
        }
      />

      <Textarea
        label="Regras de negócio principais"
        placeholder="Ex: Pagamento acima de R$ 10.000 exige aprovação manual."
        value={formData.businessRules ?? ""}
        onChange={(event) => updateForm({ businessRules: event.target.value })}
      />

      <Textarea
        label="Edge cases conhecidos"
        placeholder="Ex: Idempotência em retries, timeout do gateway."
        value={formData.edgeCases ?? ""}
        onChange={(event) => updateForm({ edgeCases: event.target.value })}
      />
    </div>
  );
}
