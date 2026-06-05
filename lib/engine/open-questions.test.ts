import { describe, it, expect } from "vitest";
import { extractOpenQuestions } from "@/lib/engine/open-questions";

describe("extractOpenQuestions", () => {
  it("captura itens de lista sob o cabeçalho", () => {
    const content = `# Requirements
## Requisitos
- RF-001 algo
## Perguntas em aberto
- Qual provedor de pagamento usar?
- Haverá suporte offline?
## Rastreabilidade
_Origens: DEC-001_`;
    expect(extractOpenQuestions(content)).toEqual([
      "Qual provedor de pagamento usar?",
      "Haverá suporte offline?",
    ]);
  });

  it("aceita 'Open Questions' e numeração", () => {
    const content = `## Open Questions
1. Which currency?
2) Multi-tenant?`;
    expect(extractOpenQuestions(content)).toEqual(["Which currency?", "Multi-tenant?"]);
  });

  it("ignora placeholders de 'nenhuma'", () => {
    const content = `## Perguntas em aberto
(nenhuma)`;
    expect(extractOpenQuestions(content)).toEqual([]);
  });

  it("retorna vazio quando a seção não existe", () => {
    expect(extractOpenQuestions("# Spec\n## Escopo\nalgo")).toEqual([]);
  });

  it("para no próximo cabeçalho", () => {
    const content = `## Perguntas em aberto
- P1
## Outra seção
- não é pergunta`;
    expect(extractOpenQuestions(content)).toEqual(["P1"]);
  });
});
