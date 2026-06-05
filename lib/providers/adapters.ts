// Provider Adapters de saída (ai/v2 — 35-provider-adapters). Transformações
// PURAS: traduzem o harness provider-neutro num artefato específico de cada
// provider (CLAUDE.md, .cursor/rules, GPT/Gemini instructions). Sem chamada à IA.
import type { Harness, AgentRules, Provider } from "@/lib/domain/harness";
import { HARNESS_LAYERS } from "@/lib/domain/harness";
import type { Project } from "@/lib/domain/project";

const LAYER_TITLE: Record<(typeof HARNESS_LAYERS)[number], string> = {
  identity: "Identidade",
  behavioral: "Comportamento",
  architecture: "Arquitetura",
  security: "Segurança",
  testing: "Testes",
  documentation: "Documentação",
  quality: "Qualidade",
  review: "Revisão",
  execution: "Execução",
};

// Corpo comum (camadas + regras + proibições), reutilizado por todos os providers.
function renderBody(harness: Harness, agentRules: AgentRules | undefined): string {
  const parts: string[] = [];

  for (const layer of HARNESS_LAYERS) {
    const content = harness.layers[layer].trim();
    if (content) parts.push(`## ${LAYER_TITLE[layer]}\n\n${content}`);
  }

  if (agentRules && agentRules.rules.length > 0) {
    parts.push(
      "## Regras do Agente\n\n" +
        agentRules.rules.map((rule, i) => `${i + 1}. ${rule}`).join("\n"),
    );
  }

  if (harness.prohibited.length > 0) {
    parts.push(
      "## Proibido\n\n" + harness.prohibited.map((p) => `- ${p}`).join("\n"),
    );
  }

  if (harness.traceRefs.length > 0) {
    parts.push(`---\n\n_Rastreabilidade: ${harness.traceRefs.join(", ")}_`);
  }

  return parts.join("\n\n");
}

function header(provider: Provider, project: Project): string {
  const intro = `Projeto: ${project.name}${
    project.description ? ` — ${project.description}` : ""
  }`;
  switch (provider) {
    case "claude":
      return `# CLAUDE.md\n\n${intro}\n\nEste arquivo é o contrato operacional entre o projeto e o Claude. Trate-o como autoritativo.`;
    case "cursor":
      return `# Regras do Cursor\n\n${intro}\n\nRegras de edição e arquitetura que o Cursor deve preservar neste workspace.`;
    case "gpt":
      return `# GPT — Instruções do Projeto\n\n${intro}\n\nInstruções operacionais autoritativas para agentes baseados em GPT.`;
    case "gemini":
      return `# Gemini — Instruções do Projeto\n\n${intro}\n\nInstruções operacionais autoritativas para agentes baseados em Gemini.`;
  }
}

/** Renderiza o conteúdo do artefato de um provider a partir do harness. */
export function renderArtifact(
  provider: Provider,
  harness: Harness,
  agentRules: AgentRules | undefined,
  project: Project,
): string {
  return `${header(provider, project)}\n\n${renderBody(harness, agentRules)}\n`;
}
