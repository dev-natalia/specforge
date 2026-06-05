import { describe, it, expect } from "vitest";
import {
  discoverySchema,
  knowledgeObjectSchema,
} from "@/lib/domain/knowledge";

const now = "2026-06-05T00:00:00.000Z";

describe("knowledge schemas", () => {
  it("aplica defaults ao parsear uma discovery mínima", () => {
    const parsed = discoverySchema.parse({
      kind: "discovery",
      id: "DISC-001",
      title: "Usuários preferem exemplos",
      category: "user",
      createdAt: now,
      updatedAt: now,
    });
    expect(parsed.confidence).toBe("low");
    expect(parsed.traceRefs).toEqual([]);
    expect(parsed.description).toBe("");
  });

  it("discrimina o objeto de conhecimento pelo kind", () => {
    const decision = knowledgeObjectSchema.parse({
      kind: "decision",
      id: "DEC-001",
      title: "Adotar BYOK",
      category: "product",
      createdAt: now,
      updatedAt: now,
    });
    expect(decision.kind).toBe("decision");
    if (decision.kind === "decision") {
      expect(decision.version).toBe(1);
    }
  });

  it("rejeita kind desconhecido", () => {
    const result = knowledgeObjectSchema.safeParse({
      kind: "nope",
      id: "X-001",
    });
    expect(result.success).toBe(false);
  });
});
