import { describe, it, expect } from "vitest";
import {
  parseClarifications,
  clarificationToKnowledge,
  detectClarifications,
} from "@/lib/engine/clarification";
import { emptySnapshot, type Project } from "@/lib/domain/project";
import type { Clarification } from "@/lib/domain/clarification";
import type { GenerationProvider } from "@/lib/providers/provider";

const now = "2026-06-05T00:00:00.000Z";
const project: Project = {
  id: "PROJ-001",
  name: "Demo",
  slug: "demo",
  description: "",
  createdAt: now,
  updatedAt: now,
};

function fakeProvider(response: string): GenerationProvider {
  return {
    id: "fake",
    capabilities: { id: "fake", label: "Fake", models: [], textGeneration: true },
    async generateText() {
      return response;
    },
    async validateKey() {},
  };
}

describe("parseClarifications", () => {
  it("parseia e ordena por prioridade", () => {
    const raw = JSON.stringify({
      clarifications: [
        { category: "scopeGap", question: "Q baixa", priority: "low" },
        { category: "decisionGap", question: "Q crítica", priority: "critical" },
      ],
    });
    const drafts = parseClarifications(raw);
    expect(drafts).toHaveLength(2);
    expect(drafts[0]?.priority).toBe("critical");
  });

  it("usa defaults para categoria/prioridade inválidas", () => {
    const raw = JSON.stringify({
      clarifications: [{ category: "xx", question: "Q", priority: "yy" }],
    });
    const drafts = parseClarifications(raw);
    expect(drafts[0]?.category).toBe("missingInfo");
    expect(drafts[0]?.priority).toBe("medium");
  });

  it("recupera clarificações de um JSON truncado (estouro de tokens)", () => {
    // Resposta cortada no meio da 3ª pergunta (sem fechar array/objeto).
    const truncated =
      '{"clarifications":[' +
      '{"category":"scopeGap","question":"Q1","priority":"high","context":"c","impact":"i"},' +
      '{"category":"missingInfo","question":"Q2","priority":"critical","context":"c","impact":"i"},' +
      '{"category":"riskGap","question":"Q3 incomple';
    const drafts = parseClarifications(truncated);
    expect(drafts).toHaveLength(2); // a 3ª (incompleta) é descartada
    expect(drafts[0]?.priority).toBe("critical"); // ordenado por prioridade
  });

  it("lança erro quando nada pôde ser recuperado", () => {
    expect(() => parseClarifications("desculpe, não posso ajudar")).toThrow();
  });
});

describe("detectClarifications", () => {
  it("usa o provider injetado", async () => {
    const provider = fakeProvider(
      JSON.stringify({ clarifications: [{ category: "ambiguity", question: "Q?", priority: "high" }] }),
    );
    const drafts = await detectClarifications("desc", emptySnapshot(project), {
      apiKey: "x",
      provider,
    });
    expect(drafts[0]?.question).toBe("Q?");
  });

  it("limita as perguntas ao orçamento do scope (story: máx 5)", async () => {
    const many = Array.from({ length: 8 }, (_, i) => ({
      category: "missingInfo",
      question: `Q${i}`,
      priority: "high",
    }));
    const provider = fakeProvider(JSON.stringify({ clarifications: many }));
    const drafts = await detectClarifications("desc", emptySnapshot(project), { apiKey: "x", provider }, "story");
    expect(drafts).toHaveLength(5);
  });

  it("sem scope, não aplica teto", async () => {
    const many = Array.from({ length: 8 }, (_, i) => ({
      category: "missingInfo",
      question: `Q${i}`,
      priority: "high",
    }));
    const provider = fakeProvider(JSON.stringify({ clarifications: many }));
    const drafts = await detectClarifications("desc", emptySnapshot(project), { apiKey: "x", provider });
    expect(drafts).toHaveLength(8);
  });
});

describe("clarificationToKnowledge", () => {
  const base: Clarification = {
    kind: "clarification",
    id: "CLAR-001",
    category: "missingInfo",
    context: "ctx",
    question: "Qual storage?",
    impact: "afeta arquitetura",
    priority: "high",
    answer: "",
    status: "open",
    traceRefs: [],
    createdAt: now,
    updatedAt: now,
  };

  it("retorna null sem resposta", () => {
    expect(clarificationToKnowledge(base)).toBeNull();
  });

  it("vira discovery por padrão", () => {
    const draft = clarificationToKnowledge({ ...base, answer: "IndexedDB" });
    expect(draft?.kind).toBe("discovery");
    expect(draft?.data.description).toBe("IndexedDB");
  });

  it("vira decision quando é decisionGap", () => {
    const draft = clarificationToKnowledge({
      ...base,
      category: "decisionGap",
      answer: "Usar IndexedDB",
    });
    expect(draft?.kind).toBe("decision");
    expect(draft?.data.decision).toBe("Usar IndexedDB");
  });
});
