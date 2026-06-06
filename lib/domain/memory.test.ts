import { describe, it, expect } from "vitest";
import {
  MEMORY_DECISION_TEMPLATE,
  MEMORY_TASK_TEMPLATE,
  memoryProtocolSection,
  renderMemoryEntry,
  renderMemoryTaskEntry,
  renderMemoryFile,
} from "@/lib/domain/memory";
import { emptySnapshot, type Project } from "@/lib/domain/project";
import type { Decision } from "@/lib/domain/knowledge";
import type { Task } from "@/lib/domain/task";

const now = "2026-06-05T12:30:00.000Z";

const project: Project = {
  id: "PROJ-001",
  name: "Meu App",
  slug: "meu-app",
  description: "",
  createdAt: now,
  updatedAt: now,
};

const decision: Decision = {
  kind: "decision",
  id: "DEC-007",
  title: "Adotar SDD",
  category: "process",
  context: "Conhecimento se perde.",
  decision: "Spec-Driven Development.",
  rationale: "Preservar intenção.",
  alternatives: ["Ad-hoc"],
  tradeoffs: "Mais cerimônia.",
  consequences: "Specs como fonte de verdade.",
  version: 1,
  traceRefs: ["DISC-002"],
  createdAt: now,
  updatedAt: now,
};

describe("renderMemoryEntry", () => {
  it("renderiza uma decisão com data, status e campos preenchidos", () => {
    const out = renderMemoryEntry(decision);
    expect(out).toContain("## [DEC-007] Adotar SDD");
    expect(out).toContain("- **Data:** 2026-06-05");
    expect(out).toContain("- **Status:** accepted");
    expect(out).toContain("- **Racional:** Preservar intenção.");
    expect(out).toContain("- **Alternativas:** Ad-hoc");
    expect(out).toContain("- **Rastreabilidade:** DISC-002");
  });

  it("omite campos vazios", () => {
    const bare = { ...decision, tradeoffs: "", consequences: "", traceRefs: [] };
    const out = renderMemoryEntry(bare);
    expect(out).not.toContain("Tradeoffs");
    expect(out).not.toContain("Rastreabilidade");
  });
});

const task: Task = {
  kind: "task",
  id: "TASK-003",
  title: "Implementar export do zip",
  category: "feature",
  objective: "Empacotar artefatos no navegador.",
  description: "",
  dependencies: [],
  acceptanceCriteria: [],
  testingExpectations: "",
  securityExpectations: "",
  deliverables: ["generate-zip.ts"],
  status: "done",
  traceRefs: ["SPEC-001"],
  createdAt: now,
  updatedAt: now,
};

describe("renderMemoryTaskEntry", () => {
  it("renderiza uma tarefa concluída com resultado e entregáveis", () => {
    const out = renderMemoryTaskEntry(task);
    expect(out).toContain("## [TASK-003] Implementar export do zip");
    expect(out).toContain("- **Data:** 2026-06-05");
    expect(out).toContain("- **Resultado:** Empacotar artefatos no navegador.");
    expect(out).toContain("- **Entregáveis:** generate-zip.ts");
    expect(out).toContain("- **Rastreabilidade:** SPEC-001");
  });
});

describe("renderMemoryFile", () => {
  it("inclui cabeçalho, modelos e placeholders quando vazio", () => {
    const out = renderMemoryFile(emptySnapshot(project));
    expect(out).toContain("# MEMORY.md");
    expect(out).toContain("Meu App");
    expect(out).toContain(MEMORY_DECISION_TEMPLATE);
    expect(out).toContain(MEMORY_TASK_TEMPLATE);
    expect(out).toContain("Nenhuma decisão registrada ainda");
    expect(out).toContain("Nenhuma tarefa concluída ainda");
  });

  it("semeia decisões e tarefas concluídas; ignora tasks não concluídas", () => {
    const snapshot = emptySnapshot(project);
    snapshot.knowledge.push(decision);
    snapshot.tasks.push(task, { ...task, id: "TASK-009", status: "pending" });
    const out = renderMemoryFile(snapshot);
    expect(out).toContain("## [DEC-007] Adotar SDD");
    expect(out).toContain("## [TASK-003] Implementar export do zip");
    expect(out).not.toContain("TASK-009");
    expect(out).not.toContain("Nenhuma decisão registrada ainda");
    expect(out).not.toContain("Nenhuma tarefa concluída ainda");
  });
});

describe("memoryProtocolSection", () => {
  it("instrui a registrar decisões e tarefas, com os dois modelos", () => {
    const out = memoryProtocolSection();
    expect(out).toContain("## Memória do Projeto (MEMORY.md)");
    expect(out).toContain("DEVEM ser registradas em `MEMORY.md`");
    expect(out).toContain(MEMORY_DECISION_TEMPLATE);
    expect(out).toContain(MEMORY_TASK_TEMPLATE);
  });
});
