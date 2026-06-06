import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { useWorkspaceStore } from "@/lib/workspace/store";
import { _resetDbForTests } from "@/lib/storage/db";
import type { GenerationProvider } from "@/lib/providers/provider";

function store() {
  return useWorkspaceStore.getState();
}

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  _resetDbForTests();
  useWorkspaceStore.setState({
    projects: [],
    snapshot: null,
    activeInitiativeId: null,
    feedback: [],
    loading: false,
    error: null,
  });
});

describe("workspace store", () => {
  it("cria, abre e persiste conhecimento", async () => {
    const id = await store().createProject("Demo", "desc");
    expect(id).toBe("PROJ-001");

    await store().openProject(id);
    expect(store().snapshot?.project.name).toBe("Demo");

    const discId = await store().addKnowledge("discovery", {
      title: "Aprendizado",
      category: "user",
    });
    expect(discId).toBe("DISC-001");
    expect(store().snapshot?.knowledge).toHaveLength(1);

    // Segundo item incrementa o ID.
    const discId2 = await store().addKnowledge("discovery", {
      title: "Outro",
      category: "product",
    });
    expect(discId2).toBe("DISC-002");
  });

  it("import nunca sobrescreve um projeto existente (ID em colisão vira novo)", async () => {
    await store().createProject("Original"); // PROJ-001
    const now = "2026-06-05T00:00:00.000Z";
    const envelope = JSON.stringify({
      schemaVersion: 1,
      snapshot: {
        project: { id: "PROJ-001", name: "Importado", slug: "importado", description: "", createdAt: now, updatedAt: now },
      },
    });
    const newId = await store().importProject(envelope);
    expect(newId).not.toBe("PROJ-001");
    expect(store().projects).toHaveLength(2);
    // O original permanece intacto.
    expect(store().projects.find((p) => p.id === "PROJ-001")?.name).toBe("Original");
  });

  it("persiste entre reaberturas (local-first)", async () => {
    const id = await store().createProject("Persistente");
    await store().openProject(id);
    await store().addKnowledge("decision", { title: "Adotar X", category: "technical" });

    // Simula recarregar: limpa estado de memória e reabre do IndexedDB.
    useWorkspaceStore.setState({ snapshot: null });
    await store().openProject(id);
    expect(store().snapshot?.knowledge).toHaveLength(1);
    expect(store().snapshot?.knowledge[0]?.id).toBe("DEC-001");
  });

  it("atualiza e remove conhecimento", async () => {
    const id = await store().createProject("Edits");
    await store().openProject(id);
    const cid = await store().addKnowledge("constraint", { title: "Local First" });
    expect(cid).not.toBeNull();

    await store().updateKnowledge(cid as string, { statement: "Sem backend." });
    const updated = store().snapshot?.knowledge.find((k) => k.id === cid);
    expect(updated?.kind === "constraint" && updated.statement).toBe("Sem backend.");

    await store().removeKnowledge(cid as string);
    expect(store().snapshot?.knowledge).toHaveLength(0);
  });

  it("aceita Product DNA sem título (singleton de identidade)", async () => {
    const id = await store().createProject("DNA");
    await store().openProject(id);
    const dnaId = await store().addKnowledge("productDna", { mission: "Preservar conhecimento" });
    expect(dnaId).toBe("DNA-001");
  });

  it("promove clarificação respondida em conhecimento durável", async () => {
    const id = await store().createProject("Clar");
    await store().openProject(id);
    await store().addClarifications([
      {
        category: "decisionGap",
        context: "ctx",
        question: "Qual storage?",
        impact: "afeta arquitetura",
        priority: "high",
      },
    ]);
    const clar = store().snapshot?.clarifications[0];
    expect(clar?.id).toBe("CLAR-001");

    await store().answerClarification(clar!.id, "Usar IndexedDB");
    const newId = await store().promoteClarification(clar!.id);
    expect(newId).toBe("DEC-001");

    // A clarificação é fechada; a decisão passa a existir.
    const after = store().snapshot;
    expect(after?.clarifications[0]?.status).toBe("closed");
    expect(after?.knowledge.find((k) => k.id === "DEC-001")).toBeDefined();
  });

  it("reporta quality gates do conhecimento", async () => {
    const id = await store().createProject("Q");
    await store().openProject(id);
    const report = store().qualityReport();
    // Sem Product DNA → warning em identity-coverage.
    expect(report?.results.find((r) => r.id === "identity-coverage")?.outcome).toBe("warning");
  });

  it("gera e regenera spec preservando ID e versionando", async () => {
    const provider: GenerationProvider = {
      id: "fake",
      capabilities: { id: "fake", label: "Fake", models: [], textGeneration: true },
      async generateText() {
        return "# Requisitos\n\nRF-001";
      },
      async validateKey() {},
    };

    const id = await store().createProject("Specs");
    await store().openProject(id);
    await store().addKnowledge("decision", { title: "Adotar X", category: "technical" });

    const specId = await store().generateSpecification("requirements", { apiKey: "x", provider });
    expect(specId).toBe("SPEC-001");
    const spec = store().snapshot?.specifications.find((s) => s.id === specId);
    expect(spec?.version).toBe(1);
    expect(spec?.traceRefs).toContain("DEC-001");

    // Regenerar mantém o mesmo ID e incrementa a versão.
    const again = await store().generateSpecification("requirements", { apiKey: "x", provider });
    expect(again).toBe("SPEC-001");
    expect(store().snapshot?.specifications.find((s) => s.id === "SPEC-001")?.version).toBe(2);
  });

  it("gera harness, artefatos de provider e tasks com dependências", async () => {
    const harnessProvider: GenerationProvider = {
      id: "fake",
      capabilities: { id: "fake", label: "Fake", models: [], textGeneration: true },
      async generateText(req) {
        // Distingue harness x tasks pelo system prompt.
        if (req.system.includes("Harness Engineering")) {
          return JSON.stringify({
            layers: { identity: "Local-first" },
            prohibited: ["Inventar"],
            agentRules: ["Preserve rastreabilidade"],
          });
        }
        return JSON.stringify({
          tasks: [
            { title: "Setup", category: "foundation", dependsOn: [] },
            { title: "Feature", category: "feature", dependsOn: [0] },
          ],
        });
      },
      async validateKey() {},
    };

    const id = await store().createProject("Harness");
    await store().openProject(id);
    await store().addKnowledge("decision", { title: "X", category: "technical" });
    await store().generateSpecification("requirements", { apiKey: "x", provider: harnessProvider });

    // Harness.
    const harnessId = await store().generateHarness({ apiKey: "x", provider: harnessProvider });
    expect(harnessId).toBe("HAR-001");
    expect(store().snapshot?.agentRules[0]?.rules).toEqual(["Preserve rastreabilidade"]);

    // Artefatos de provider (puro, sem chave) — invariante: referenciam o harness.
    await store().generateProviderArtifacts(["claude", "cursor"]);
    const artifacts = store().snapshot?.providerArtifacts ?? [];
    expect(artifacts).toHaveLength(2);
    expect(artifacts[0]?.traceRefs).toContain("HAR-001");
    expect(store().invariantIssues()).toHaveLength(0);

    // Tasks com dependência resolvida (índice → ID).
    const count = await store().generateTasks({ apiKey: "x", provider: harnessProvider });
    expect(count).toBe(2);
    const tasks = store().snapshot?.tasks ?? [];
    expect(tasks[1]?.dependencies).toEqual([tasks[0]?.id]);

    // appendTasks acrescenta sem substituir (não regenera).
    const added = await store().appendTasks({ apiKey: "x", provider: harnessProvider });
    expect(added).toBe(2);
    const after = store().snapshot?.tasks ?? [];
    expect(after).toHaveLength(4);
    // IDs únicos (continuam a numeração).
    expect(new Set(after.map((t) => t.id)).size).toBe(4);
  });

  it("cria iniciativa com scope e marca o conhecimento com seu initiativeId", async () => {
    const id = await store().createProject("Multi");
    await store().openProject(id);

    const initId = await store().createInitiative("Exportar CSV", "story", "Botão de export");
    expect(initId).toBe("INIT-001");
    expect(store().activeInitiative()?.scope).toBe("story");

    const discId = await store().addKnowledge("discovery", { title: "X", category: "user" });
    const disc = store().snapshot?.knowledge.find((k) => k.id === discId);
    expect(disc?.initiativeId).toBe("INIT-001");
  });

  it("recusa gerar spec proibida pelo scope da iniciativa (gating da matriz)", async () => {
    const provider: GenerationProvider = {
      id: "fake",
      capabilities: { id: "fake", label: "Fake", models: [], textGeneration: true },
      async generateText() {
        return "# Arquitetura";
      },
      async validateKey() {},
    };
    const id = await store().createProject("Gating");
    await store().openProject(id);
    await store().createInitiative("Story leve", "story");

    const specId = await store().generateSpecification("architecture", { apiKey: "x", provider });
    expect(specId).toBeNull();
    expect(store().error).toContain("scope story");
    expect(store().snapshot?.specifications ?? []).toHaveLength(0);

    // requirements é permitida em story.
    const reqId = await store().generateSpecification("requirements", { apiKey: "x", provider });
    expect(reqId).not.toBeNull();
  });

  it("isola artefatos entre iniciativas distintas", async () => {
    const id = await store().createProject("Iso");
    await store().openProject(id);

    const a = await store().createInitiative("A", "story");
    await store().addKnowledge("discovery", { title: "deA", category: "user" });

    const b = await store().createInitiative("B", "feature");
    await store().addKnowledge("discovery", { title: "deB", category: "user" });

    const all = store().snapshot?.knowledge ?? [];
    expect(all).toHaveLength(2);
    expect(all.filter((k) => k.initiativeId === a)).toHaveLength(1);
    expect(all.filter((k) => k.initiativeId === b)).toHaveLength(1);

    // Remover a iniciativa A apaga só os artefatos dela (cascata).
    await store().removeInitiative(a as string);
    const remaining = store().snapshot?.knowledge ?? [];
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.initiativeId).toBe(b);
    expect(store().snapshot?.initiatives.map((i) => i.id)).toEqual([b]);
  });

  it("gera o spec consolidado para Story e regenera versionando", async () => {
    const provider: GenerationProvider = {
      id: "fake",
      capabilities: { id: "fake", label: "Fake", models: [], textGeneration: true },
      async generateText() {
        return "# Story Specification\n\nConteúdo.";
      },
      async validateKey() {},
    };
    const id = await store().createProject("Consol");
    await store().openProject(id);
    await store().createInitiative("Export", "story", "Botão de export");
    await store().addKnowledge("discovery", { title: "X", category: "user" });

    const cId = await store().generateConsolidatedSpec({ apiKey: "x", provider });
    expect(cId).toBe("CSPEC-001");
    const cspec = store().snapshot?.consolidatedSpecs[0];
    expect(cspec?.format).toBe("story");
    expect(cspec?.version).toBe(1);
    expect(cspec?.traceRefs).toContain("DISC-001");

    // Regenerar mantém ID e incrementa versão.
    const again = await store().generateConsolidatedSpec({ apiKey: "x", provider });
    expect(again).toBe("CSPEC-001");
    expect(store().snapshot?.consolidatedSpecs[0]?.version).toBe(2);
    expect(store().invariantIssues()).toHaveLength(0);
  });

  it("reavalia e aplica mudança de scope preservando conhecimento", async () => {
    const provider: GenerationProvider = {
      id: "fake",
      capabilities: { id: "fake", label: "Fake", models: [], textGeneration: true },
      async generateText() {
        return JSON.stringify({ scope: "feature", confidence: 0.9, reason: "Integração", signals: ["OAuth"] });
      },
      async validateKey() {},
    };
    const id = await store().createProject("Escala");
    await store().openProject(id);
    const initId = await store().createInitiative("Auth", "story", "Adicionar login social");
    await store().addKnowledge("discovery", { title: "X", category: "user" });

    const rec = await store().evaluateScopeChange({ apiKey: "x", provider });
    expect(rec?.direction).toBe("escalate");
    expect(rec?.to).toBe("feature");

    await store().changeInitiativeScope(initId as string, rec!.to, rec!.classification);
    expect(store().activeInitiative()?.scope).toBe("feature");
    // Conhecimento preservado na mudança de scope.
    expect(store().snapshot?.knowledge).toHaveLength(1);
    // Histórico de scope persistido na iniciativa.
    const history = store().activeInitiative()?.scopeHistory ?? [];
    expect(history).toHaveLength(1);
    expect(history[0]).toEqual(
      expect.objectContaining({ from: "story", to: "feature" }),
    );
  });

  it("emite feedback de geração (done e skipped)", async () => {
    const provider: GenerationProvider = {
      id: "fake",
      capabilities: { id: "fake", label: "Fake", models: [], textGeneration: true },
      async generateText() {
        return "# Requisitos";
      },
      async validateKey() {},
    };
    const id = await store().createProject("Feed");
    await store().openProject(id);
    await store().createInitiative("Botão", "story");

    // Spec permitida → evento done.
    await store().generateSpecification("requirements", { apiKey: "x", provider });
    // Spec proibida no scope → evento skipped.
    await store().generateSpecification("architecture", { apiKey: "x", provider });

    const feed = store().feedback;
    expect(feed.some((e) => e.status === "done" && e.label.includes("Requisitos"))).toBe(true);
    expect(feed.some((e) => e.status === "skipped" && e.label.includes("Arquitetura"))).toBe(true);

    store().clearFeedback();
    expect(store().feedback).toHaveLength(0);
  });

  it("edita o conteúdo do spec consolidado (versão incrementa)", async () => {
    const provider: GenerationProvider = {
      id: "fake",
      capabilities: { id: "fake", label: "Fake", models: [], textGeneration: true },
      async generateText() {
        return "# Story Specification\n\nv1";
      },
      async validateKey() {},
    };
    const id = await store().createProject("Edit");
    await store().openProject(id);
    await store().createInitiative("X", "story");
    await store().addKnowledge("discovery", { title: "k", category: "user" });
    const cId = (await store().generateConsolidatedSpec({ apiKey: "x", provider })) as string;

    await store().updateConsolidatedSpecContent(cId, "# Story Specification\n\neditado");
    const spec = store().snapshot?.consolidatedSpecs[0];
    expect(spec?.content).toContain("editado");
    expect(spec?.version).toBe(2);

    // Conteúdo idêntico não cria nova versão.
    await store().updateConsolidatedSpecContent(cId, "# Story Specification\n\neditado");
    expect(store().snapshot?.consolidatedSpecs[0]?.version).toBe(2);
  });

  it("recusa o spec consolidado em iniciativa Product", async () => {
    const provider: GenerationProvider = {
      id: "fake",
      capabilities: { id: "fake", label: "Fake", models: [], textGeneration: true },
      async generateText() {
        return "# X";
      },
      async validateKey() {},
    };
    const id = await store().createProject("Prod");
    await store().openProject(id);
    await store().createInitiative("Plataforma", "product");

    const cId = await store().generateConsolidatedSpec({ apiKey: "x", provider });
    expect(cId).toBeNull();
    expect(store().error).toContain("cascata");
  });
});
