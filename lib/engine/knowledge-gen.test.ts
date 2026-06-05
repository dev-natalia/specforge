import { describe, it, expect } from "vitest";
import {
  parseKnowledgeSuggestions,
  suggestKnowledge,
} from "@/lib/engine/knowledge-gen";
import type { GenerationProvider } from "@/lib/providers/provider";

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

describe("parseKnowledgeSuggestions", () => {
  it("normaliza discovery/decision/constraint", () => {
    const raw = JSON.stringify({
      suggestions: [
        { kind: "discovery", title: "Usuários X", summary: "s", category: "user" },
        { kind: "decision", title: "Adotar Y", summary: "usar Y", rationale: "porque", category: "technical" },
        { kind: "constraint", title: "Local first", summary: "sem backend" },
      ],
    });
    const out = parseKnowledgeSuggestions(raw);
    expect(out).toHaveLength(3);
    expect(out[0]?.kind).toBe("discovery");
    expect(out[1]?.data.rationale).toBe("porque");
    expect(out[2]?.kind).toBe("constraint");
  });

  it("cai para categoria padrão quando inválida", () => {
    const raw = JSON.stringify({
      suggestions: [{ kind: "discovery", title: "T", category: "zzz" }],
    });
    const out = parseKnowledgeSuggestions(raw);
    expect(out[0]?.data.category).toBe("product");
  });

  it("ignora itens malformados", () => {
    const raw = JSON.stringify({ suggestions: [{ kind: "discovery" }, { foo: 1 }] });
    expect(parseKnowledgeSuggestions(raw)).toHaveLength(0);
  });
});

describe("suggestKnowledge", () => {
  it("usa o provider injetado", async () => {
    const provider = fakeProvider(
      JSON.stringify({ suggestions: [{ kind: "constraint", title: "C" }] }),
    );
    const out = await suggestKnowledge("desc", { apiKey: "x", provider });
    expect(out[0]?.label).toBe("C");
  });
});
