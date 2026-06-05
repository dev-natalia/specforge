import { describe, it, expect } from "vitest";
import { generateConsolidatedSpec } from "@/lib/engine/consolidated-spec-gen";
import { emptySnapshot, type Project, type ProjectSnapshot } from "@/lib/domain/project";
import type { Discovery } from "@/lib/domain/knowledge";
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

function snapshotWithDiscovery(): ProjectSnapshot {
  const snap = emptySnapshot(project);
  const disc: Discovery = {
    kind: "discovery",
    id: "DISC-001",
    title: "Usuárias exportam dados manualmente",
    category: "user",
    description: "",
    source: "",
    evidence: "",
    implications: "",
    confidence: "low",
    traceRefs: [],
    createdAt: now,
    updatedAt: now,
  };
  snap.knowledge.push(disc);
  return snap;
}

describe("generateConsolidatedSpec", () => {
  it("gera markdown e rastreia o conhecimento usado", async () => {
    const provider = fakeProvider("# Story Specification\n\n## Objetivo\nExportar CSV.");
    const result = await generateConsolidatedSpec(
      "story",
      "Adicionar botão de export",
      snapshotWithDiscovery(),
      { apiKey: "x", provider },
    );
    expect(result.content).toContain("# Story Specification");
    expect(result.traceRefs).toContain("DISC-001");
  });

  it("remove cercas de código que envolvem todo o conteúdo", async () => {
    const provider = fakeProvider("```markdown\n# Feature Specification\n```");
    const result = await generateConsolidatedSpec("feature", "OAuth", snapshotWithDiscovery(), {
      apiKey: "x",
      provider,
    });
    expect(result.content).toBe("# Feature Specification");
  });
});
