import { describe, it, expect } from "vitest";
import { assembleKnowledgeContext } from "@/lib/engine/context-package";
import { generateSpecContent } from "@/lib/engine/spec-gen";
import { emptySnapshot, type Project, type ProjectSnapshot } from "@/lib/domain/project";
import type { Decision, Discovery } from "@/lib/domain/knowledge";
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

function snapshotWithKnowledge(): ProjectSnapshot {
  const snapshot = emptySnapshot(project);
  const discovery: Discovery = {
    kind: "discovery",
    id: "DISC-001",
    title: "Users prefer examples",
    category: "user",
    description: "x",
    source: "",
    evidence: "",
    implications: "",
    confidence: "low",
    traceRefs: [],
    createdAt: now,
    updatedAt: now,
  };
  const decision: Decision = {
    kind: "decision",
    id: "DEC-001",
    title: "Adopt BYOK",
    category: "product",
    context: "",
    decision: "use BYOK",
    rationale: "cost",
    alternatives: [],
    tradeoffs: "",
    consequences: "",
    version: 1,
    traceRefs: [],
    createdAt: now,
    updatedAt: now,
  };
  snapshot.knowledge.push(discovery, decision);
  return snapshot;
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

describe("assembleKnowledgeContext", () => {
  it("inclui IDs de origem do conhecimento", () => {
    const ctx = assembleKnowledgeContext(snapshotWithKnowledge());
    expect(ctx.sourceRefs).toEqual(expect.arrayContaining(["DISC-001", "DEC-001"]));
    expect(ctx.text).toContain("Decisões");
    expect(ctx.text).toContain("Discoveries");
  });
});

describe("generateSpecContent", () => {
  it("remove cercas e preserva rastreabilidade do conhecimento + predecessores", async () => {
    const provider = fakeProvider("```markdown\n# Requirements\n\nRF-001\n```");
    const result = await generateSpecContent(
      "design",
      snapshotWithKnowledge(),
      [{ id: "SPEC-001", type: "requirements", content: "# Requisitos" }],
      { apiKey: "x", provider },
    );
    expect(result.content.startsWith("# Requirements")).toBe(true);
    expect(result.content).not.toContain("```");
    expect(result.traceRefs).toEqual(
      expect.arrayContaining(["DISC-001", "DEC-001", "SPEC-001"]),
    );
  });
});
