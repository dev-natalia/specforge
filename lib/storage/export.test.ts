import { describe, it, expect } from "vitest";
import { exportProjectFiles } from "@/lib/storage/export";
import { importProjectFromJson } from "@/lib/storage/import";
import { emptySnapshot, type Project, type ProjectSnapshot } from "@/lib/domain/project";
import type { Discovery } from "@/lib/domain/knowledge";
import { AppError } from "@/lib/errors";

const now = "2026-06-05T00:00:00.000Z";

function makeSnapshot(): ProjectSnapshot {
  const project: Project = {
    id: "PROJ-001",
    name: "Meu App",
    slug: "meu-app",
    description: "",
    createdAt: now,
    updatedAt: now,
  };
  const snapshot = emptySnapshot(project);
  const discovery: Discovery = {
    kind: "discovery",
    id: "DISC-001",
    title: "Usuários preferem exemplos",
    category: "user",
    description: "Observado em entrevistas.",
    evidence: "",
    implications: "",
    traceRefs: [],
    createdAt: now,
    updatedAt: now,
  };
  snapshot.knowledge.push(discovery);
  snapshot.specifications.push({
    kind: "specification",
    id: "SPEC-001",
    specType: "requirements",
    title: "Requisitos",
    status: "draft",
    version: 1,
    content: "# Requisitos\n\nRF-001...",
    traceRefs: ["DISC-001"],
    createdAt: now,
    updatedAt: now,
  });
  return snapshot;
}

describe("export/import round-trip", () => {
  it("inclui specforge.json e arquivos legíveis", () => {
    const files = exportProjectFiles(makeSnapshot());
    const paths = files.map((f) => f.path);
    expect(paths).toContain("specforge.json");
    expect(paths).toContain("knowledge/discovery/DISC-001.md");
    expect(paths).toContain("specs/001-meu-app/requirements.md");
    expect(paths).toContain("MEMORY.md");
  });

  it("semeia o MEMORY.md com as decisões do conhecimento", () => {
    const snapshot = makeSnapshot();
    snapshot.knowledge.push({
      kind: "decision",
      id: "DEC-001",
      title: "Usar BYOK",
      category: "product",
      context: "Sem backend.",
      decision: "Chave fica no navegador.",
      rationale: "Privacidade e custo.",
      alternatives: ["Proxy server"],
      tradeoffs: "",
      consequences: "",
      version: 1,
      traceRefs: ["DISC-001"],
      createdAt: now,
      updatedAt: now,
    });
    const memory = exportProjectFiles(snapshot).find((f) => f.path === "MEMORY.md");
    expect(memory).toBeDefined();
    expect(memory!.content).toContain("# MEMORY.md");
    expect(memory!.content).toContain("## [DEC-001] Usar BYOK");
    expect(memory!.content).toContain("Privacidade e custo.");
  });

  it("reimporta o snapshot a partir do specforge.json", () => {
    const files = exportProjectFiles(makeSnapshot());
    const json = files.find((f) => f.path === "specforge.json");
    expect(json).toBeDefined();

    const reimported = importProjectFromJson(json!.content);
    expect(reimported.project.id).toBe("PROJ-001");
    expect(reimported.knowledge).toHaveLength(1);
    expect(reimported.specifications[0]?.traceRefs).toEqual(["DISC-001"]);
  });

  it("rejeita JSON incompatível", () => {
    expect(() => importProjectFromJson('{"foo":1}')).toThrow(AppError);
  });
});
