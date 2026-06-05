// Context Package (ai/v2 — 13). Transforma o conhecimento durável em contexto
// pronto para a IA gerar specs. Seleciona o conhecimento relevante e devolve o
// texto + as referências de origem (rastreabilidade).
import type { ProjectSnapshot } from "@/lib/domain/project";
import { SPEC_LABEL } from "@/lib/domain/specs";
import { CONSOLIDATED_SPEC_LABEL } from "@/lib/domain/consolidated-spec";

export interface AssembledContext {
  text: string;
  // IDs do conhecimento incluído — viram traceRefs da spec gerada.
  sourceRefs: string[];
}

function clip(value: string, max = 600): string {
  const trimmed = value.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

/**
 * Monta o contexto de conhecimento do projeto para alimentar a geração de spec.
 * Inclui Product DNA, decisões, discoveries e constraints relevantes.
 */
export function assembleKnowledgeContext(snapshot: ProjectSnapshot): AssembledContext {
  const blocks: string[] = [];
  const refs: string[] = [];

  const dna = snapshot.knowledge.find((k) => k.kind === "productDna");
  if (dna && dna.kind === "productDna") {
    refs.push(dna.id);
    blocks.push(
      `## Product DNA (${dna.id})\n` +
        [
          dna.mission && `Missão: ${dna.mission}`,
          dna.vision && `Visão: ${dna.vision}`,
          dna.problemStatement && `Problema: ${dna.problemStatement}`,
          dna.audience && `Público: ${dna.audience}`,
          dna.principles.length && `Princípios: ${dna.principles.join("; ")}`,
          dna.constraints.length && `Constraints: ${dna.constraints.join("; ")}`,
          dna.nonGoals.length && `Não-objetivos: ${dna.nonGoals.join("; ")}`,
        ]
          .filter(Boolean)
          .join("\n"),
    );
  }

  const decisions = snapshot.knowledge.filter((k) => k.kind === "decision");
  if (decisions.length) {
    blocks.push(
      "## Decisões\n" +
        decisions
          .map((d) =>
            d.kind === "decision"
              ? `- [${d.id}] ${d.title}: ${clip(d.decision)}${
                  d.rationale ? ` — porquê: ${clip(d.rationale, 300)}` : ""
                }`
              : "",
          )
          .join("\n"),
    );
    refs.push(...decisions.map((d) => d.id));
  }

  const discoveries = snapshot.knowledge.filter((k) => k.kind === "discovery");
  if (discoveries.length) {
    blocks.push(
      "## Discoveries\n" +
        discoveries
          .map((d) =>
            d.kind === "discovery" ? `- [${d.id}] ${d.title}: ${clip(d.description, 300)}` : "",
          )
          .join("\n"),
    );
    refs.push(...discoveries.map((d) => d.id));
  }

  const constraints = snapshot.knowledge.filter((k) => k.kind === "constraint");
  if (constraints.length) {
    blocks.push(
      "## Constraints\n" +
        constraints
          .map((c) => (c.kind === "constraint" ? `- [${c.id}] ${c.title}: ${clip(c.statement, 300)}` : ""))
          .join("\n"),
    );
    refs.push(...constraints.map((c) => c.id));
  }

  return {
    text: blocks.join("\n\n") || "(sem conhecimento registrado)",
    sourceRefs: refs,
  };
}

/**
 * Digest das specs do projeto para alimentar harness/tasks. Inclui tanto as
 * specs por-tipo (V2) quanto os specs consolidados Story/Feature (V3), para que
 * a geração downstream seja coerente em qualquer scope.
 */
export function specsDigest(snapshot: ProjectSnapshot): string {
  const items = [
    ...snapshot.specifications.map(
      (s) => `- [${s.id}] ${SPEC_LABEL[s.specType]}: ${clip(s.content, 500)}`,
    ),
    ...snapshot.consolidatedSpecs.map(
      (s) => `- [${s.id}] ${CONSOLIDATED_SPEC_LABEL[s.format]}: ${clip(s.content, 500)}`,
    ),
  ];
  return items.length ? items.join("\n") : "(nenhuma spec gerada)";
}

/** IDs de todas as specs (por-tipo + consolidadas) para rastreabilidade. */
export function allSpecRefs(snapshot: ProjectSnapshot): string[] {
  return [
    ...snapshot.specifications.map((s) => s.id),
    ...snapshot.consolidatedSpecs.map((s) => s.id),
  ];
}
