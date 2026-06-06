// Memória do projeto (MEMORY.md) — fonte durável do "o que foi decidido e do que
// já foi feito". Inspirado no modelo de Decision Record (ai/v2 — 11-decision-records):
// projetos lembram decisões, mas esquecem o racional; sem o racional, discussões
// se repetem e a arquitetura sofre drift. O MEMORY.md preserva esse racional e o
// histórico de tarefas realizadas como artefato de primeira classe, e o harness
// instrui o agente a mantê-lo vivo.
import type { ProjectSnapshot } from "@/lib/domain/project";
import type { Decision } from "@/lib/domain/knowledge";
import type { Task } from "@/lib/domain/task";

/** Nome canônico do arquivo de memória dentro do export. */
export const MEMORY_FILENAME = "MEMORY.md";

// Modelo de entrada de DECISÃO (fonte única, reusado pelo CLAUDE.md e pelo MEMORY.md).
// Mantido em PT para coerência com o restante dos artefatos gerados.
export const MEMORY_DECISION_TEMPLATE = `## [DEC-XXX] Título curto da decisão

- **Data:** AAAA-MM-DD
- **Categoria:** product · technical · architecture · process · business
- **Status:** proposed · accepted · superseded · rejected · deprecated
- **Contexto:** que problema motivou a decisão.
- **Decisão:** o que foi escolhido.
- **Racional:** por que foi escolhido (o porquê é o ativo mais importante).
- **Alternativas:** opções consideradas e descartadas.
- **Tradeoffs:** benefícios e custos aceitos.
- **Consequências:** impactos esperados.
- **Rastreabilidade:** IDs relacionados (DISC-…, RF-…, SPEC-…, TASK-…).`;

// Modelo de entrada de TAREFA REALIZADA.
export const MEMORY_TASK_TEMPLATE = `## [TASK-XXX] Título curto da tarefa

- **Data:** AAAA-MM-DD
- **Resultado:** o que foi entregue.
- **Notas:** decisões pontuais, desvios ou pendências surgidas na execução.
- **Rastreabilidade:** IDs relacionados (SPEC-…, DEC-…, RF-…).`;

// Critérios de "decisão maior" — quando uma entrada é obrigatória.
const MEMORY_WHEN_TO_RECORD = `Registre uma **decisão** sempre que ela:
- altere arquitetura, contratos, segurança ou dependências;
- escolha entre alternativas com tradeoffs relevantes;
- substitua ou revise uma decisão anterior (use status \`superseded\`).

Registre uma **tarefa realizada** ao concluir uma task: o que foi entregue e o
que vale lembrar dela.

Decisões triviais e facilmente reversíveis não precisam de entrada.`;

/** Parte de data (AAAA-MM-DD) de um timestamp ISO; placeholder se ausente. */
function dateOnly(iso: string): string {
  return iso ? iso.slice(0, 10) : "AAAA-MM-DD";
}

/** Renderiza uma decisão do conhecimento como entrada de memória. */
export function renderMemoryEntry(decision: Decision): string {
  const lines = [
    `## [${decision.id}] ${decision.title}`,
    "",
    `- **Data:** ${dateOnly(decision.createdAt)}`,
    `- **Categoria:** ${decision.category}`,
    `- **Status:** accepted`,
  ];
  if (decision.context) lines.push(`- **Contexto:** ${decision.context}`);
  if (decision.decision) lines.push(`- **Decisão:** ${decision.decision}`);
  if (decision.rationale) lines.push(`- **Racional:** ${decision.rationale}`);
  if (decision.alternatives.length)
    lines.push(`- **Alternativas:** ${decision.alternatives.join("; ")}`);
  if (decision.tradeoffs) lines.push(`- **Tradeoffs:** ${decision.tradeoffs}`);
  if (decision.consequences) lines.push(`- **Consequências:** ${decision.consequences}`);
  if (decision.traceRefs.length)
    lines.push(`- **Rastreabilidade:** ${decision.traceRefs.join(", ")}`);
  return lines.join("\n");
}

/** Renderiza uma tarefa concluída como entrada de memória. */
export function renderMemoryTaskEntry(task: Task): string {
  const lines = [
    `## [${task.id}] ${task.title}`,
    "",
    `- **Data:** ${dateOnly(task.updatedAt)}`,
  ];
  const result = task.objective || task.description;
  if (result) lines.push(`- **Resultado:** ${result}`);
  if (task.deliverables.length)
    lines.push(`- **Entregáveis:** ${task.deliverables.join("; ")}`);
  if (task.traceRefs.length)
    lines.push(`- **Rastreabilidade:** ${task.traceRefs.join(", ")}`);
  return lines.join("\n");
}

/**
 * Bloco de protocolo injetado no harness (CLAUDE.md e demais providers). Instrui
 * o agente a registrar decisões maiores e tarefas realizadas em MEMORY.md usando
 * os templates canônicos.
 */
export function memoryProtocolSection(): string {
  return `## Memória do Projeto (MEMORY.md)

Toda decisão maior e toda tarefa realizada DEVEM ser registradas em \`${MEMORY_FILENAME}\` antes de prosseguir — é a fonte durável do racional e do histórico do projeto. ${MEMORY_WHEN_TO_RECORD}

Use exatamente estes formatos por entrada:

${MEMORY_DECISION_TEMPLATE}

${MEMORY_TASK_TEMPLATE}`;
}

/**
 * Monta o conteúdo do MEMORY.md: protocolo + modelos de entrada + decisões e
 * tarefas realizadas já conhecidas (semeadas a partir do snapshot do projeto).
 */
export function renderMemoryFile(snapshot: ProjectSnapshot): string {
  const { project } = snapshot;
  const decisions = snapshot.knowledge.filter(
    (k): k is Decision => k.kind === "decision",
  );
  const doneTasks = snapshot.tasks.filter((t) => t.status === "done");

  const seededDecisions = decisions.length
    ? decisions.map(renderMemoryEntry).join("\n\n")
    : "_Nenhuma decisão registrada ainda. Adicione a primeira usando o modelo acima._";

  const seededTasks = doneTasks.length
    ? doneTasks.map(renderMemoryTaskEntry).join("\n\n")
    : "_Nenhuma tarefa concluída ainda. Registre cada task ao finalizá-la._";

  return `# MEMORY.md

Memória do projeto **${project.name}**. Este arquivo é a fonte durável do "o que
foi decidido e do que já foi feito". Toda decisão maior e toda tarefa realizada
DEVEM ser registradas aqui, nos formatos abaixo, antes de seguir.

> Por que existe: projetos lembram decisões, mas esquecem o racional. Sem o
> racional, discussões se repetem e a arquitetura sofre drift. Preserve o porquê
> e o histórico do que foi entregue.

## Quando registrar

${MEMORY_WHEN_TO_RECORD}

## Modelo de decisão

${MEMORY_DECISION_TEMPLATE}

## Modelo de tarefa realizada

${MEMORY_TASK_TEMPLATE}

## Decisões

${seededDecisions}

## Tarefas realizadas

${seededTasks}
`;
}
