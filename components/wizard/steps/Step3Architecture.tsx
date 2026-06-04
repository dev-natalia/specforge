"use client";

import { useWizardStore } from "@/lib/wizard/store";
import { Textarea } from "@/components/ui/Textarea";

export function Step3Architecture() {
  const formData = useWizardStore((state) => state.formData);
  const updateForm = useWizardStore((state) => state.updateForm);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Arquitetura & Convenções
        </h2>
        <p className="text-sm text-slate-500">
          Tudo opcional — quanto mais contexto, melhor o resultado.
        </p>
      </div>

      <Textarea
        label="Convenções de arquitetura / padrões do time"
        placeholder="Ex: Server Components por padrão, sem any, validação com Zod."
        value={formData.architectureConventions ?? ""}
        onChange={(event) =>
          updateForm({ architectureConventions: event.target.value })
        }
      />

      <Textarea
        label="Constraints técnicas / o que NÃO deve ser feito"
        placeholder="Ex: Não usar Pages Router, não chamar IA do cliente."
        value={formData.constraints ?? ""}
        onChange={(event) => updateForm({ constraints: event.target.value })}
      />

      <Textarea
        label="Estrutura de pastas preferida"
        placeholder="Ex: app/, components/, lib/, prisma/"
        value={formData.folderStructure ?? ""}
        onChange={(event) =>
          updateForm({ folderStructure: event.target.value })
        }
      />
    </div>
  );
}
