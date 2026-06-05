// Import de projeto a partir do `specforge.json` exportado (round-trip).
// Valida o conteúdo contra o schema de domínio antes de devolver o snapshot.
import { z } from "zod";
import { AppError } from "@/lib/errors";
import {
  projectSnapshotSchema,
  ensureInitiatives,
  type ProjectSnapshot,
} from "@/lib/domain/project";

const importEnvelopeSchema = z.object({
  schemaVersion: z.number().int().positive(),
  snapshot: projectSnapshotSchema,
});

/**
 * Lê o texto de um `specforge.json` e devolve um ProjectSnapshot validado.
 * Lança AppError("INVALID_INPUT") se o conteúdo não for compatível.
 */
export function importProjectFromJson(jsonText: string): ProjectSnapshot {
  let raw: unknown;
  try {
    raw = JSON.parse(jsonText);
  } catch (cause) {
    throw new AppError("INVALID_INPUT", "Arquivo de projeto inválido (JSON malformado).", {
      cause,
    });
  }

  const parsed = importEnvelopeSchema.safeParse(raw);
  if (!parsed.success) {
    throw new AppError(
      "INVALID_INPUT",
      "Arquivo de projeto incompatível com o formato esperado.",
      { cause: parsed.error },
    );
  }

  // Round-trip de exports legados (sem iniciativas) recebe a migração V3.
  return ensureInitiatives(parsed.data.snapshot);
}
