import { describe, it, expect } from "vitest";
import { renderArtifact } from "@/lib/providers/adapters";
import type { Harness, AgentRules } from "@/lib/domain/harness";
import type { Project } from "@/lib/domain/project";

const now = "2026-06-05T00:00:00.000Z";
const project: Project = {
  id: "PROJ-001",
  name: "Meu App",
  slug: "meu-app",
  description: "Local-first",
  createdAt: now,
  updatedAt: now,
};

const harness: Harness = {
  kind: "harness",
  id: "HAR-001",
  title: "Harness",
  purpose: "",
  scope: "",
  layers: {
    identity: "Local-first, BYOK.",
    behavioral: "Prefira clarificação.",
    architecture: "",
    security: "Nunca exponha segredos.",
    testing: "",
    documentation: "",
    quality: "",
    review: "",
    execution: "",
  },
  prohibited: ["Inventar requisitos"],
  version: 1,
  traceRefs: ["DEC-001"],
  createdAt: now,
  updatedAt: now,
};

const agentRules: AgentRules = {
  kind: "agentRules",
  id: "AGENT-001",
  rules: ["Preserve rastreabilidade"],
  traceRefs: ["HAR-001"],
  createdAt: now,
  updatedAt: now,
};

describe("renderArtifact", () => {
  it("gera CLAUDE.md com cabeçalho, camadas, regras e proibições", () => {
    const out = renderArtifact("claude", harness, agentRules, project);
    expect(out).toContain("# CLAUDE.md");
    expect(out).toContain("Local-first, BYOK.");
    expect(out).toContain("Nunca exponha segredos.");
    expect(out).toContain("Preserve rastreabilidade");
    expect(out).toContain("Inventar requisitos");
    expect(out).toContain("DEC-001");
  });

  it("inclui o protocolo de Memória do Projeto com os modelos de entrada", () => {
    const out = renderArtifact("claude", harness, agentRules, project);
    expect(out).toContain("## Memória do Projeto (MEMORY.md)");
    expect(out).toContain("DEVEM ser registradas em `MEMORY.md`");
    expect(out).toContain("## [DEC-XXX] Título curto da decisão");
    expect(out).toContain("## [TASK-XXX] Título curto da tarefa");
  });

  it("usa cabeçalho específico por provider", () => {
    expect(renderArtifact("cursor", harness, agentRules, project)).toContain("Regras do Cursor");
    expect(renderArtifact("gpt", harness, agentRules, project)).toContain("GPT — Instruções");
    expect(renderArtifact("gemini", harness, agentRules, project)).toContain("Gemini — Instruções");
  });

  it("omite camadas vazias", () => {
    const out = renderArtifact("claude", harness, agentRules, project);
    expect(out).not.toContain("## Documentação");
  });
});
