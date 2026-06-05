import { describe, it, expect } from "vitest";
import {
  parseScopeClassification,
  classifyScope,
  recommendScopeChange,
} from "@/lib/engine/classify";
import type { ScopeClassification } from "@/lib/domain/initiative";
import type { Scope } from "@/lib/domain/scope";
import type { GenerationProvider } from "@/lib/providers/provider";

function classification(suggested: Scope, confidence: number): ScopeClassification {
  return { suggested, confidence, reason: "", signals: [], overridden: false };
}

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

describe("parseScopeClassification", () => {
  it("parseia scope/confiança/sinais", () => {
    const raw = JSON.stringify({
      scope: "feature",
      confidence: 0.88,
      reason: "Capacidade com integração externa",
      signals: ["múltiplos componentes", "integração OAuth"],
    });
    const c = parseScopeClassification(raw);
    expect(c.suggested).toBe("feature");
    expect(c.confidence).toBe(0.88);
    expect(c.signals).toHaveLength(2);
    expect(c.overridden).toBe(false);
  });

  it("normaliza confiança em porcentagem (0..100 → 0..1)", () => {
    const raw = JSON.stringify({ scope: "story", confidence: 80 });
    expect(parseScopeClassification(raw).confidence).toBe(0.8);
  });

  it("limita confiança fora do intervalo e usa fallback quando inválida", () => {
    expect(parseScopeClassification(JSON.stringify({ scope: "product", confidence: 250 })).confidence).toBe(1);
    expect(parseScopeClassification(JSON.stringify({ scope: "product", confidence: "x" })).confidence).toBe(0.5);
  });

  it("rejeita scope inválido", () => {
    expect(() => parseScopeClassification(JSON.stringify({ scope: "epic", confidence: 0.9 }))).toThrow();
  });

  it("aceita JSON com cercas de código (parse robusto)", () => {
    const raw = "```json\n" + JSON.stringify({ scope: "product", confidence: 0.95 }) + "\n```";
    expect(parseScopeClassification(raw).suggested).toBe("product");
  });
});

describe("classifyScope", () => {
  it("usa o provider injetado e devolve a classificação", async () => {
    const provider = fakeProvider(
      JSON.stringify({ scope: "story", confidence: 0.82, reason: "Botão", signals: ["UI única"] }),
    );
    const c = await classifyScope("Adicionar botão de export", { apiKey: "x", provider });
    expect(c.suggested).toBe("story");
    expect(c.confidence).toBe(0.82);
  });
});

describe("recommendScopeChange", () => {
  it("não recomenda quando o scope sugerido é o atual", () => {
    expect(recommendScopeChange("story", classification("story", 0.95))).toBeNull();
  });

  it("não recomenda com confiança insuficiente", () => {
    expect(recommendScopeChange("story", classification("feature", 0.5))).toBeNull();
  });

  it("recomenda escalação (story → feature)", () => {
    const rec = recommendScopeChange("story", classification("feature", 0.8));
    expect(rec).toEqual(
      expect.objectContaining({ direction: "escalate", from: "story", to: "feature" }),
    );
  });

  it("recomenda redução (product → story)", () => {
    const rec = recommendScopeChange("product", classification("story", 0.7));
    expect(rec).toEqual(
      expect.objectContaining({ direction: "reduce", from: "product", to: "story" }),
    );
  });
});
