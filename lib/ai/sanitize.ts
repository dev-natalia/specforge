// Sanitização de inputs do usuário antes de montar prompts de IA (RNF03.5).
// trim + limite de caracteres + remoção de sequências de prompt injection.
import type { Clarification, CustomTopic, WizardFormData } from "@/lib/types";

const MAX_FIELD_LENGTH = 2000;

// Caracteres de controle ASCII (mantém \n e \t), construídos via escapes para
// não depender de bytes de controle literais no fonte.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = new RegExp(
  "[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]",
  "g",
);

// Sequências suspeitas de prompt injection (case-insensitive).
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?previous\s+instructions/gi,
  /ignore\s+(as\s+)?instru[çc][õo]es\s+anteriores/gi,
  /disregard\s+(all\s+)?(previous|above)/gi,
  /system\s*prompt/gi,
  /you\s+are\s+now/gi,
  /\bact\s+as\b/gi,
  /<\/?(system|assistant|user|instructions?)>/gi,
];

/**
 * Sanitiza um único campo livre de texto:
 * - trim
 * - remove caracteres de controle e os perigosos `<` `>`
 * - remove sequências conhecidas de injection
 * - corta em MAX_FIELD_LENGTH
 */
export function sanitizeField(value: string): string {
  let out = value.trim();

  // Remove caracteres de controle (mantém \n e \t).
  out = out.replace(CONTROL_CHARS, "");

  // Neutraliza sequências de injection conhecidas (antes de remover os
  // delimitadores, pois algumas dependem dos `<` `>`).
  for (const pattern of INJECTION_PATTERNS) {
    out = out.replace(pattern, "[removido]");
  }

  // Remove os delimitadores angulares para evitar injeção de pseudo-tags.
  out = out.replace(/[<>]/g, "");

  if (out.length > MAX_FIELD_LENGTH) {
    out = out.slice(0, MAX_FIELD_LENGTH);
  }

  return out;
}

function sanitizeOptional(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const cleaned = sanitizeField(value);
  return cleaned.length > 0 ? cleaned : undefined;
}

/**
 * Sanitiza os tópicos customizados, descartando os que ficaram sem título e
 * sem conteúdo após a limpeza.
 */
function sanitizeCustomTopics(
  topics: CustomTopic[] | undefined,
): CustomTopic[] | undefined {
  if (!topics || topics.length === 0) return undefined;
  const cleaned = topics
    .map((topic) => ({
      id: topic.id,
      title: sanitizeField(topic.title),
      content: sanitizeField(topic.content),
    }))
    .filter((topic) => topic.title.length > 0 || topic.content.length > 0);
  return cleaned.length > 0 ? cleaned : undefined;
}

/**
 * Sanitiza as clarificações, mantendo só as que têm resposta preenchida.
 */
function sanitizeClarifications(
  items: Clarification[] | undefined,
): Clarification[] | undefined {
  if (!items || items.length === 0) return undefined;
  const cleaned = items
    .map((item) => ({
      question: sanitizeField(item.question),
      answer: sanitizeField(item.answer),
    }))
    .filter((item) => item.answer.length > 0);
  return cleaned.length > 0 ? cleaned : undefined;
}

/**
 * Sanitiza todos os campos de texto livre do wizard.
 * `projectType` não é texto livre (enum validado por Zod), então passa intacto.
 */
export function sanitizeFormData(data: WizardFormData): WizardFormData {
  return {
    projectName: sanitizeField(data.projectName),
    description: sanitizeField(data.description),
    projectType: data.projectType,
    language: sanitizeField(data.language),
    frameworks: sanitizeOptional(data.frameworks),
    runtime: sanitizeOptional(data.runtime),
    database: sanitizeOptional(data.database),
    architectureConventions: sanitizeOptional(data.architectureConventions),
    constraints: sanitizeOptional(data.constraints),
    folderStructure: sanitizeOptional(data.folderStructure),
    behaviorExamples: sanitizeOptional(data.behaviorExamples),
    businessRules: sanitizeOptional(data.businessRules),
    edgeCases: sanitizeOptional(data.edgeCases),
    customTopics: sanitizeCustomTopics(data.customTopics),
    clarifications: sanitizeClarifications(data.clarifications),
  };
}

export { MAX_FIELD_LENGTH };
