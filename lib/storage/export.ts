// Export do projeto para arquivos (ai/v2 — File-Based Knowledge / Human
// Readability). Gera um `specforge.json` fiel (para round-trip via import) +
// renders markdown legíveis do conhecimento, specs, harness e artefatos.
import type { ProjectSnapshot } from "@/lib/domain/project";
import { projectSlug } from "@/lib/domain/project";
import { SPEC_FILENAME, type Specification } from "@/lib/domain/specs";
import {
  CONSOLIDATED_SPEC_FILENAME,
  type ConsolidatedSpec,
} from "@/lib/domain/consolidated-spec";
import type { KnowledgeObject } from "@/lib/domain/knowledge";
import { MEMORY_FILENAME, renderMemoryFile } from "@/lib/domain/memory";

export interface ExportFile {
  path: string;
  content: string;
}

const SCHEMA_VERSION = 1;

function refsLine(traceRefs: string[]): string {
  return traceRefs.length ? `\n\n_Origens: ${traceRefs.join(", ")}_\n` : "\n";
}

function renderKnowledge(item: KnowledgeObject): ExportFile {
  const base = `knowledge/${item.kind}`;
  // Product DNA não tem `title`; usa um nome fixo.
  const title = "title" in item ? item.title : "Product DNA";
  const lines: string[] = [`# ${item.id} — ${title}`, ""];

  switch (item.kind) {
    case "discovery":
      lines.push(
        `**Categoria:** ${item.category}`,
        "",
        item.description,
        item.evidence ? `\n**Evidência:** ${item.evidence}` : "",
        item.implications ? `\n**Implicações:** ${item.implications}` : "",
      );
      break;
    case "decision":
      lines.push(
        `**Categoria:** ${item.category}`,
        "",
        `**Contexto:** ${item.context}`,
        `\n**Decisão:** ${item.decision}`,
        `\n**Racional:** ${item.rationale}`,
        item.alternatives.length
          ? `\n**Alternativas:** ${item.alternatives.join("; ")}`
          : "",
        item.tradeoffs ? `\n**Tradeoffs:** ${item.tradeoffs}` : "",
      );
      break;
    case "productDna":
      lines.push(
        `**Missão:** ${item.mission}`,
        `\n**Visão:** ${item.vision}`,
        `\n**Problema:** ${item.problemStatement}`,
        `\n**Público:** ${item.audience}`,
        item.principles.length ? `\n**Princípios:** ${item.principles.join("; ")}` : "",
        item.constraints.length ? `\n**Constraints:** ${item.constraints.join("; ")}` : "",
        item.nonGoals.length ? `\n**Não-objetivos:** ${item.nonGoals.join("; ")}` : "",
      );
      break;
    default:
      if ("statement" in item && item.statement) lines.push(item.statement);
      if ("description" in item && item.description) lines.push(item.description);
      break;
  }

  lines.push(refsLine(item.traceRefs));
  return { path: `${base}/${item.id}.md`, content: lines.filter(Boolean).join("\n") };
}

function renderSpec(slug: string, spec: Specification): ExportFile {
  return {
    path: `specs/001-${slug}/${SPEC_FILENAME[spec.specType]}`,
    content: spec.content,
  };
}

function renderConsolidatedSpec(slug: string, spec: ConsolidatedSpec): ExportFile {
  const prefix = spec.initiativeId ? `${spec.initiativeId.toLowerCase()}-` : "";
  return {
    path: `specs/001-${slug}/${prefix}${CONSOLIDATED_SPEC_FILENAME[spec.format]}`,
    content: spec.content,
  };
}

/**
 * Produz todos os arquivos de export do projeto. O `specforge.json` é a fonte
 * fiel para reimport; o resto é legível por humanos.
 */
export function exportProjectFiles(snapshot: ProjectSnapshot): ExportFile[] {
  const slug = projectSlug(snapshot.project.name);
  const files: ExportFile[] = [];

  // 1) Fidelidade total para round-trip.
  files.push({
    path: "specforge.json",
    content: JSON.stringify({ schemaVersion: SCHEMA_VERSION, snapshot }, null, 2),
  });

  // 2) Conhecimento legível.
  for (const item of snapshot.knowledge) files.push(renderKnowledge(item));

  // 3) Specs em seus caminhos canônicos.
  for (const spec of snapshot.specifications) files.push(renderSpec(slug, spec));

  // 3b) Specs consolidados (Story/Feature). Caminho prefixado pela iniciativa
  // para não colidir quando há várias iniciativas.
  for (const spec of snapshot.consolidatedSpecs) files.push(renderConsolidatedSpec(slug, spec));

  // 4) Artefatos de provider (CLAUDE.md, .cursor/rules, ...).
  for (const artifact of snapshot.providerArtifacts) {
    files.push({ path: artifact.path, content: artifact.content });
  }

  // 5) Tasks de implementação.
  if (snapshot.tasks.length > 0) {
    files.push({ path: `specs/001-${slug}/tasks.md`, content: renderTasks(snapshot) });
  }

  // 6) Memória de decisões: semeada pelas decisões do conhecimento e mantida
  // viva durante a implementação (o harness instrui o agente a registrar aqui).
  files.push({ path: MEMORY_FILENAME, content: renderMemoryFile(snapshot) });

  return files;
}

function renderTasks(snapshot: ProjectSnapshot): string {
  const lines: string[] = ["# Tasks", ""];
  for (const task of snapshot.tasks) {
    lines.push(`## ${task.id} — ${task.title}`);
    lines.push(`Categoria: ${task.category} · Status: ${task.status}`);
    if (task.objective) lines.push(`\nObjetivo: ${task.objective}`);
    if (task.dependencies.length) lines.push(`\nDepende de: ${task.dependencies.join(", ")}`);
    if (task.acceptanceCriteria.length) {
      lines.push("\nCritérios de aceite:");
      for (const ac of task.acceptanceCriteria) lines.push(`- ${ac}`);
    }
    if (task.traceRefs.length) lines.push(`\n_Origens: ${task.traceRefs.join(", ")}_`);
    lines.push("");
  }
  return lines.join("\n");
}
