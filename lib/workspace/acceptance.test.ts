// Example Pack — testes de aceitação (ai/v3 — 022). Transforma os exemplos
// canônicos do doc em verificações ponta-a-ponta: cada scope gera o conjunto de
// artefatos esperado e NÃO gera os proibidos; escalação/redução são detectadas.
import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { useWorkspaceStore } from "@/lib/workspace/store";
import { _resetDbForTests } from "@/lib/storage/db";
import {
  forbiddenArtifacts,
  requiredArtifacts,
} from "@/lib/domain/artifact-matrix";
import type { Scope } from "@/lib/domain/scope";
import type { GenerationProvider } from "@/lib/providers/provider";

function store() {
  return useWorkspaceStore.getState();
}

// Provider de GERAÇÃO: distingue harness/tasks/spec pelo system prompt.
function generationProvider(): GenerationProvider {
  return {
    id: "fake",
    capabilities: { id: "fake", label: "Fake", models: [], textGeneration: true },
    async generateText(req) {
      if (req.system.includes("Harness Engineering")) {
        return JSON.stringify({ layers: { identity: "id" }, prohibited: [], agentRules: ["r"] });
      }
      if (req.system.includes("tasks de implementação")) {
        return JSON.stringify({ tasks: [{ title: "T1", category: "feature", dependsOn: [] }] });
      }
      return "# Especificação\n\nConteúdo derivado do conhecimento.";
    },
    async validateKey() {},
  };
}

// Provider de CLASSIFICAÇÃO: devolve sempre o scope/confiança configurados.
function classifyProvider(scope: Scope, confidence = 0.9): GenerationProvider {
  return {
    id: "fake",
    capabilities: { id: "fake", label: "Fake", models: [], textGeneration: true },
    async generateText() {
      return JSON.stringify({ scope, confidence, reason: "cenário de teste", signals: ["s"] });
    },
    async validateKey() {},
  };
}

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  _resetDbForTests();
  useWorkspaceStore.setState({
    projects: [],
    snapshot: null,
    activeInitiativeId: null,
    feedback: [],
    run: null,
    loading: false,
    error: null,
  });
});

async function newInitiative(name: string, scope: Scope, intent: string): Promise<void> {
  const id = await store().createProject(name);
  await store().openProject(id);
  await store().createInitiative(name, scope, intent);
  // Conhecimento base → specs/harness/tasks têm origem (sem órfãos).
  await store().addKnowledge("decision", {
    title: "Decisão base",
    category: "technical",
    decision: "Abordagem X",
    rationale: "Porque Y",
  });
}

describe("Example Pack — geração por scope (022)", () => {
  it("Story: gera spec consolidada + harness + tasks + artefatos; sem arquitetura/segurança", async () => {
    await newInitiative("Export CSV", "story", "Adicionar botão de exportar resultados em CSV");
    await store().generateAll({ apiKey: "x", provider: generationProvider() });

    const snap = store().snapshot!;
    expect(snap.consolidatedSpecs).toHaveLength(1);
    expect(snap.consolidatedSpecs[0]?.format).toBe("story");
    expect(snap.harnesses).toHaveLength(1);
    expect(snap.tasks.length).toBeGreaterThan(0);
    expect(snap.providerArtifacts).toHaveLength(4);
    // Proibidos no scope: nenhuma spec por-tipo de arquitetura/segurança/design.
    expect(snap.specifications).toHaveLength(0);
    expect(store().invariantIssues()).toHaveLength(0);
  });

  it("Feature: gera spec consolidada (feature) + harness + tasks + artefatos", async () => {
    await newInitiative("OAuth Google", "feature", "Implementar autenticação com Google");
    await store().generateAll({ apiKey: "x", provider: generationProvider() });

    const snap = store().snapshot!;
    expect(snap.consolidatedSpecs[0]?.format).toBe("feature");
    expect(snap.harnesses).toHaveLength(1);
    expect(snap.providerArtifacts).toHaveLength(4);
    expect(store().invariantIssues()).toHaveLength(0);
  });

  it("Product: gera a cascata de specs por-tipo (sem consolidado) + harness + tasks", async () => {
    await newInitiative("CRM", "product", "Construir uma plataforma de CRM");
    await store().generateAll({ apiKey: "x", provider: generationProvider() });

    const snap = store().snapshot!;
    expect(snap.consolidatedSpecs).toHaveLength(0);
    // Cascata completa (7 tipos) permitida em Product.
    expect(snap.specifications.length).toBe(7);
    const types = snap.specifications.map((s) => s.specType);
    expect(types).toContain("architecture");
    expect(types).toContain("security");
    expect(snap.harnesses).toHaveLength(1);
    expect(snap.providerArtifacts).toHaveLength(4);
    expect(store().invariantIssues()).toHaveLength(0);
  });
});

describe("Example Pack — escalação/redução (022)", () => {
  it("'Add Authentication' (story) escala para Feature na reavaliação", async () => {
    await newInitiative("Auth", "story", "Adicionar autenticação");
    const rec = await store().evaluateScopeChange({
      apiKey: "x",
      provider: classifyProvider("feature"),
    });
    expect(rec?.direction).toBe("escalate");
    expect(rec?.to).toBe("feature");
  });

  it("'Build Reporting Platform' (product) reduz para Story na reavaliação", async () => {
    await newInitiative("Reporting", "product", "Construir plataforma de relatórios");
    const rec = await store().evaluateScopeChange({
      apiKey: "x",
      provider: classifyProvider("story"),
    });
    expect(rec?.direction).toBe("reduce");
    expect(rec?.to).toBe("story");
  });
});

describe("Example Pack — validação da matriz (022)", () => {
  it("Story exige requirements/tasks/harness e proíbe arquitetura", () => {
    const req = requiredArtifacts("story");
    expect(req).toEqual(expect.arrayContaining(["requirements", "tasks", "harness", "storySpec"]));
    expect(forbiddenArtifacts("story")).toEqual(expect.arrayContaining(["architecture", "security"]));
  });

  it("Feature exige design e contracts", () => {
    expect(requiredArtifacts("feature")).toEqual(expect.arrayContaining(["design", "contracts"]));
  });

  it("Product exige knowledge/arquitetura/segurança/testing", () => {
    expect(requiredArtifacts("product")).toEqual(
      expect.arrayContaining(["discoveries", "architecture", "security", "testing"]),
    );
  });
});
