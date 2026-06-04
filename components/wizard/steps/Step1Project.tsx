"use client";

import { useWizardStore } from "@/lib/wizard/store";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, type SelectOption } from "@/components/ui/Select";
import type { ProjectType } from "@/lib/types";

const PROJECT_TYPE_OPTIONS: SelectOption[] = [
  { value: "API_REST", label: "API REST" },
  { value: "FRONTEND", label: "Frontend" },
  { value: "FULLSTACK", label: "Fullstack" },
  { value: "LIBRARY", label: "Biblioteca" },
  { value: "CLI", label: "CLI" },
  { value: "OTHER", label: "Outro" },
];

export function Step1Project() {
  const formData = useWizardStore((state) => state.formData);
  const updateForm = useWizardStore((state) => state.updateForm);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Projeto</h2>
        <p className="text-sm text-slate-500">
          Conte o básico sobre o que você está construindo.
        </p>
      </div>

      <Input
        label="Nome do projeto *"
        placeholder="Ex: API de Pagamentos"
        value={formData.projectName}
        onChange={(event) =>
          updateForm({ projectName: event.target.value })
        }
      />

      <Textarea
        label="Descrição *"
        placeholder="Descreva o objetivo do projeto, o problema que resolve e quem usa."
        rows={5}
        value={formData.description}
        onChange={(event) => updateForm({ description: event.target.value })}
      />

      <Select
        label="Tipo de projeto"
        options={PROJECT_TYPE_OPTIONS}
        value={formData.projectType}
        onChange={(event) =>
          updateForm({ projectType: event.target.value as ProjectType })
        }
      />
    </div>
  );
}
