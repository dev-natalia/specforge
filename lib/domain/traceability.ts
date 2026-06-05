// Modelo de Rastreabilidade V2 (ai/v2 — 20-traceability-model).
// Todo artefato derivado deve permanecer ligado às suas origens. Aqui ficam o
// tipo de referência, a interface base de artefatos rastreáveis e as checagens
// de integridade do grafo (refs órfãs, quebradas, ciclos).
import { z } from "zod";
import { isArtifactId } from "@/lib/domain/ids";

// Uma referência de rastreabilidade é o ID de outro artefato (DISC-001, DEC-002).
export type TraceRef = string;

export const traceRefSchema = z
  .string()
  .refine((value) => isArtifactId(value), {
    message: "Referência de rastreabilidade deve ser um ID de artefato (ex: DISC-001).",
  });

// Base comum a todo artefato durável: ID próprio + referências às origens.
// `initiativeId` (V3) liga o artefato à sua Initiative; ausente em projetos
// legados (V2), tratado como pertencente à iniciativa product padrão na migração.
export const traceableSchema = z.object({
  id: z.string(),
  // IDs de artefatos a montante que originaram/influenciaram este.
  traceRefs: z.array(traceRefSchema).default([]),
  // ID da Initiative (V3) à qual este artefato pertence. Opcional p/ retrocompat.
  initiativeId: z.string().optional(),
});

export interface Traceable {
  id: string;
  traceRefs: TraceRef[];
  initiativeId?: string;
}

// Severidade e tipos de problema de integridade do grafo.
export type TraceIssueKind =
  | "broken" // referência aponta para ID inexistente
  | "orphan" // artefato derivado sem nenhuma origem
  | "cycle"; // dependência circular

export interface TraceIssue {
  kind: TraceIssueKind;
  id: string;
  message: string;
  related?: string[];
}

/**
 * Valida a integridade de rastreabilidade de uma coleção de artefatos.
 *
 * - `broken`: alguma `traceRef` aponta para um ID que não está na coleção.
 * - `orphan`: artefato listado em `requireOrigin` sem nenhuma `traceRef`.
 * - `cycle`: ciclo nas dependências de `traceRefs`.
 *
 * `requireOrigin` recebe os IDs cujos artefatos DEVEM ter origem (ex.: specs,
 * harness) — conhecimento de topo (Product DNA, Vision) pode ser raiz.
 */
export function checkTraceIntegrity(
  artifacts: Traceable[],
  requireOrigin: Iterable<string> = [],
): TraceIssue[] {
  const issues: TraceIssue[] = [];
  const byId = new Map<string, Traceable>();
  for (const artifact of artifacts) byId.set(artifact.id, artifact);

  const requireSet = new Set(requireOrigin);

  // Referências quebradas + órfãos.
  for (const artifact of artifacts) {
    for (const ref of artifact.traceRefs) {
      if (!byId.has(ref)) {
        issues.push({
          kind: "broken",
          id: artifact.id,
          message: `Referência ${ref} de ${artifact.id} não existe.`,
          related: [ref],
        });
      }
    }
    if (requireSet.has(artifact.id) && artifact.traceRefs.length === 0) {
      issues.push({
        kind: "orphan",
        id: artifact.id,
        message: `${artifact.id} não referencia nenhuma origem.`,
      });
    }
  }

  // Detecção de ciclos via DFS com cores (0=branco, 1=cinza, 2=preto).
  const color = new Map<string, number>();
  const visit = (id: string, path: string[]): void => {
    color.set(id, 1);
    const node = byId.get(id);
    if (node) {
      for (const ref of node.traceRefs) {
        if (!byId.has(ref)) continue; // quebrada já reportada acima
        const c = color.get(ref) ?? 0;
        if (c === 1) {
          const start = path.indexOf(ref);
          const cycle = start >= 0 ? path.slice(start) : [ref];
          issues.push({
            kind: "cycle",
            id: ref,
            message: `Ciclo de rastreabilidade: ${[...cycle, ref].join(" → ")}.`,
            related: cycle,
          });
        } else if (c === 0) {
          visit(ref, [...path, ref]);
        }
      }
    }
    color.set(id, 2);
  };

  for (const artifact of artifacts) {
    if ((color.get(artifact.id) ?? 0) === 0) {
      visit(artifact.id, [artifact.id]);
    }
  }

  return issues;
}
