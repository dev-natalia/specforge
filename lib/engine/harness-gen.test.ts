import { describe, it, expect } from "vitest";
import { parseHarnessBundle, generateHarnessBundle } from "@/lib/engine/harness-gen";
import { emptySnapshot, type Project } from "@/lib/domain/project";
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

describe("parseHarnessBundle", () => {
  it("aplica defaults para camadas ausentes", () => {
    const bundle = parseHarnessBundle(
      JSON.stringify({ layers: { identity: "id" }, prohibited: ["x"], agentRules: ["r"] }),
    );
    expect(bundle.layers.identity).toBe("id");
    expect(bundle.layers.security).toBe("");
    expect(bundle.prohibited).toEqual(["x"]);
    expect(bundle.agentRules).toEqual(["r"]);
  });
});

describe("generateHarnessBundle", () => {
  it("anexa traceRefs do conhecimento e specs", async () => {
    const snapshot = emptySnapshot(project);
    snapshot.specifications.push({
      kind: "specification",
      id: "SPEC-001",
      specType: "requirements",
      title: "Req",
      status: "draft",
      version: 1,
      content: "# Req",
      traceRefs: [],
      createdAt: now,
      updatedAt: now,
    });
    const provider = fakeProvider(
      JSON.stringify({ layers: { identity: "x" }, prohibited: [], agentRules: [] }),
    );
    const bundle = await generateHarnessBundle(snapshot, { apiKey: "k", provider });
    expect(bundle.traceRefs).toContain("SPEC-001");
  });

  it("scope story zera camadas inativas (architecture/security), mesmo se a IA preencher", async () => {
    const snapshot = emptySnapshot(project);
    // A IA "vaza" arquitetura e segurança; o perfil de scope deve zerá-las.
    const provider = fakeProvider(
      JSON.stringify({
        layers: { identity: "id", architecture: "arq", security: "sec", execution: "exec" },
        prohibited: [],
        agentRules: [],
      }),
    );
    const bundle = await generateHarnessBundle(snapshot, { apiKey: "k", provider }, "story");
    expect(bundle.layers.architecture).toBe("");
    expect(bundle.layers.security).toBe("");
    // Camadas ativas no story permanecem.
    expect(bundle.layers.identity).toBe("id");
    expect(bundle.layers.execution).toBe("exec");
  });

  it("scope product mantém todas as camadas", async () => {
    const snapshot = emptySnapshot(project);
    const provider = fakeProvider(
      JSON.stringify({
        layers: { architecture: "arq", security: "sec" },
        prohibited: [],
        agentRules: [],
      }),
    );
    const bundle = await generateHarnessBundle(snapshot, { apiKey: "k", provider }, "product");
    expect(bundle.layers.architecture).toBe("arq");
    expect(bundle.layers.security).toBe("sec");
  });
});
