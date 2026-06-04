"use client";

import { useWizardStore } from "@/lib/wizard/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

// Editor de tópicos adicionais: a pessoa cria os temas que acha que ficaram
// faltando e preenche o conteúdo, antes de gerar os specs.
export function CustomTopics() {
  const topics = useWizardStore((state) => state.formData.customTopics ?? []);
  const addCustomTopic = useWizardStore((state) => state.addCustomTopic);
  const updateCustomTopic = useWizardStore((state) => state.updateCustomTopic);
  const removeCustomTopic = useWizardStore((state) => state.removeCustomTopic);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-slate-800">Tópicos adicionais</h3>
        <p className="text-sm text-slate-500">
          Faltou alguma informação? Adicione tópicos livres — eles entram no
          contexto enviado à IA.
        </p>
      </div>

      {topics.length > 0 && (
        <ul className="space-y-3">
          {topics.map((topic, index) => (
            <li
              key={topic.id}
              className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <Input
                    label={`Tópico ${index + 1} — título`}
                    placeholder="Ex: Requisitos de observabilidade"
                    value={topic.title}
                    onChange={(event) =>
                      updateCustomTopic(topic.id, { title: event.target.value })
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomTopic(topic.id)}
                  className="mt-7 rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                  aria-label={`Remover tópico ${index + 1}`}
                >
                  Remover
                </button>
              </div>
              <Textarea
                label="Conteúdo"
                placeholder="Descreva o que a IA precisa saber sobre este tópico."
                value={topic.content}
                onChange={(event) =>
                  updateCustomTopic(topic.id, { content: event.target.value })
                }
              />
            </li>
          ))}
        </ul>
      )}

      <Button variant="outline" size="sm" onClick={addCustomTopic}>
        + Adicionar tópico
      </Button>
    </div>
  );
}
