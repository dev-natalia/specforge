"use client";

import { useWizardStore } from "@/lib/wizard/store";
import { Input } from "@/components/ui/Input";

export function Step2Stack() {
  const formData = useWizardStore((state) => state.formData);
  const updateForm = useWizardStore((state) => state.updateForm);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Stack & Tech</h2>
        <p className="text-sm text-slate-500">
          Tecnologias principais do projeto.
        </p>
      </div>

      <Input
        label="Linguagem principal *"
        placeholder="Ex: TypeScript"
        value={formData.language}
        onChange={(event) => updateForm({ language: event.target.value })}
      />

      <Input
        label="Frameworks / libs"
        placeholder="Ex: Next.js, Prisma, Zod"
        value={formData.frameworks ?? ""}
        onChange={(event) => updateForm({ frameworks: event.target.value })}
      />

      <Input
        label="Runtime"
        placeholder="Ex: Node.js 20"
        value={formData.runtime ?? ""}
        onChange={(event) => updateForm({ runtime: event.target.value })}
      />

      <Input
        label="Banco de dados"
        placeholder="Ex: PostgreSQL"
        value={formData.database ?? ""}
        onChange={(event) => updateForm({ database: event.target.value })}
      />
    </div>
  );
}
