import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import {
  saveSnapshot,
  loadSnapshot,
  listProjects,
  deleteProject,
  artifactHistory,
} from "@/lib/storage/repository";
import { _resetDbForTests } from "@/lib/storage/db";
import { emptySnapshot, type Project, type ProjectSnapshot } from "@/lib/domain/project";
import type { Discovery } from "@/lib/domain/knowledge";

const now = "2026-06-05T00:00:00.000Z";

function makeProject(): Project {
  return {
    id: "PROJ-001",
    name: "Demo",
    slug: "demo",
    description: "",
    createdAt: now,
    updatedAt: now,
  };
}

function makeDiscovery(title: string): Discovery {
  return {
    kind: "discovery",
    id: "DISC-001",
    title,
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
}

beforeEach(() => {
  // Banco limpo a cada teste.
  globalThis.indexedDB = new IDBFactory();
  _resetDbForTests();
});

describe("repository round-trip", () => {
  it("salva e recarrega um snapshot preservando os artefatos", async () => {
    const snapshot: ProjectSnapshot = emptySnapshot(makeProject());
    snapshot.knowledge.push(makeDiscovery("Aprendizado A"));

    await saveSnapshot(snapshot);
    const loaded = await loadSnapshot("PROJ-001");

    expect(loaded).not.toBeNull();
    expect(loaded?.project.name).toBe("Demo");
    expect(loaded?.knowledge).toHaveLength(1);
    expect(loaded?.knowledge[0]?.id).toBe("DISC-001");
  });

  it("lista projetos e remove com seus artefatos", async () => {
    await saveSnapshot(emptySnapshot(makeProject()));
    expect(await listProjects()).toHaveLength(1);

    await deleteProject("PROJ-001");
    expect(await listProjects()).toHaveLength(0);
    expect(await loadSnapshot("PROJ-001")).toBeNull();
  });

  it("versiona um artefato no histórico quando o conteúdo muda", async () => {
    const snapshot = emptySnapshot(makeProject());
    snapshot.knowledge.push(makeDiscovery("V1"));
    await saveSnapshot(snapshot);

    // Mesma chave (DISC-001), conteúdo diferente.
    const updated = emptySnapshot(makeProject());
    updated.knowledge.push(makeDiscovery("V2"));
    await saveSnapshot(updated);

    const history = await artifactHistory("PROJ-001", "discovery", "DISC-001");
    expect(history.map((h) => h.rev)).toEqual([1, 2]);

    const loaded = await loadSnapshot("PROJ-001");
    const first = loaded?.knowledge[0];
    expect(first?.kind).toBe("discovery");
    if (first?.kind === "discovery") expect(first.title).toBe("V2");
  });

  it("não cria nova revisão quando nada muda", async () => {
    const snapshot = emptySnapshot(makeProject());
    snapshot.knowledge.push(makeDiscovery("estável"));
    await saveSnapshot(snapshot);
    await saveSnapshot(snapshot);

    const history = await artifactHistory("PROJ-001", "discovery", "DISC-001");
    expect(history).toHaveLength(1);
  });

  it("persiste e recarrega iniciativas", async () => {
    const snapshot = emptySnapshot(makeProject());
    snapshot.initiatives.push({
      kind: "initiative",
      id: "INIT-001",
      title: "Exportar CSV",
      intent: "Adicionar botão de exportação",
      scope: "story",
      scopeHistory: [],
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
    await saveSnapshot(snapshot);

    const loaded = await loadSnapshot("PROJ-001");
    expect(loaded?.initiatives).toHaveLength(1);
    expect(loaded?.initiatives[0]?.scope).toBe("story");
  });

  it("migra projeto legado (artefatos sem iniciativa) no load", async () => {
    // Simula dados V2: discovery sem initiativeId, nenhuma iniciativa.
    const snapshot = emptySnapshot(makeProject());
    snapshot.knowledge.push(makeDiscovery("legado"));
    await saveSnapshot(snapshot);

    const loaded = await loadSnapshot("PROJ-001");
    expect(loaded?.initiatives).toHaveLength(1);
    expect(loaded?.initiatives[0]?.scope).toBe("product");
    expect(loaded?.knowledge[0]?.initiativeId).toBe(loaded?.initiatives[0]?.id);
  });
});
