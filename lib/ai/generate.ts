// Lógica central de geração via Anthropic Claude — roda no NAVEGADOR.
// O browser chama a Anthropic direto com a chave do usuário (BYOK); não há
// servidor nosso no meio (sem timeout de função). O modelo claude-opus-4-8
// rejeita o parâmetro `temperature`, então não o enviamos.
import Anthropic from "@anthropic-ai/sdk";
import type {
  AnalysisFinding,
  AnalysisSeverity,
  GeneratedFile,
  WizardFormData,
} from "@/lib/types";
import { AppError } from "@/lib/errors";
import { sanitizeFormData } from "@/lib/ai/sanitize";
import {
  SPEC_SYSTEM_PROMPT,
  buildSpecUserPrompt,
} from "@/lib/ai/prompts/spec-prompt";
import {
  HARNESS_SYSTEM_PROMPT,
  buildHarnessUserPrompt,
} from "@/lib/ai/prompts/harness-prompt";
import {
  CLARIFY_SYSTEM_PROMPT,
  buildClarifyUserPrompt,
} from "@/lib/ai/prompts/clarify-prompt";
import {
  ANALYZE_SYSTEM_PROMPT,
  buildAnalyzeUserPrompt,
} from "@/lib/ai/prompts/analyze-prompt";

const MODEL_ID = "claude-opus-4-8";
// 4 arquivos de spec em markdown completo podem ser longos — margem para não
// truncar o JSON (truncamento quebra o parsing).
const MAX_TOKENS = 16000;

// Cliente com a chave do usuário (BYOK), chamado DIRETO do navegador.
// dangerouslyAllowBrowser + o header de acesso direto habilitam o CORS da
// Anthropic para apps client-side BYOK. A chave nunca passa por servidor nosso.
function getClient(apiKey: string): Anthropic {
  return new Anthropic({
    apiKey: apiKey.trim(),
    dangerouslyAllowBrowser: true,
    defaultHeaders: { "anthropic-dangerous-direct-browser-access": "true" },
  });
}

/**
 * Extrai e parseia o objeto JSON do texto retornado pela IA, tolerando cercas
 * de código (apenas quando envolvem todo o conteúdo) e prosa residual.
 */
export function parseJsonObject(raw: string): unknown {
  let text = raw.trim();

  // Remove a cerca de código apenas se ela envolve TODO o conteúdo (a resposta
  // começa com ```). Não usar regex global aqui: o conteúdo pode conter blocos
  // ``` (ex: árvores de pastas) que não devem ser confundidos com o invólucro.
  if (text.startsWith("```")) {
    text = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
  }

  // Recorta do primeiro `{` ao último `}` — ignora prosa residual e é robusto
  // a cercas internas (que ficam dentro de strings JSON válidas).
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }

  try {
    return JSON.parse(text);
  } catch (cause) {
    throw new AppError(
      "AI_ERROR",
      "A IA retornou um formato inesperado. Tente regenerar.",
      { cause },
    );
  }
}

/**
 * Extrai o array de arquivos { files: [...] } da resposta da IA.
 */
export function parseFilesResponse(raw: string): GeneratedFile[] {
  const parsed = parseJsonObject(raw);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray((parsed as { files?: unknown }).files)
  ) {
    throw new AppError(
      "AI_ERROR",
      "A IA retornou um formato inesperado. Tente regenerar.",
      { cause: parsed },
    );
  }

  const files = (parsed as { files: unknown[] }).files;
  const result: GeneratedFile[] = [];

  for (const item of files) {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as GeneratedFile).name !== "string" ||
      typeof (item as GeneratedFile).path !== "string" ||
      typeof (item as GeneratedFile).content !== "string"
    ) {
      continue; // ignora itens malformados
    }
    const file = item as Partial<GeneratedFile>;
    result.push({
      name: file.name as string,
      path: file.path as string,
      content: file.content as string,
      language:
        typeof file.language === "string" && file.language
          ? file.language
          : "markdown",
    });
  }

  if (result.length === 0) {
    throw new AppError(
      "AI_ERROR",
      "A IA não retornou nenhum arquivo. Tente regenerar.",
      { cause: parsed },
    );
  }

  return result;
}

interface CallOptions {
  apiKey: string;
  maxTokens?: number;
}

/** Faz a chamada ao modelo e devolve o texto concatenado da resposta. */
async function callModel(
  system: string,
  prompt: string,
  options: CallOptions,
): Promise<string> {
  try {
    const message = await getClient(options.apiKey).messages.create({
      model: MODEL_ID,
      max_tokens: options.maxTokens ?? MAX_TOKENS,
      system,
      messages: [{ role: "user", content: prompt }],
    });

    return message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");
  } catch (error) {
    if (error instanceof AppError) throw error;
    // Chave inválida / sem permissão — mensagem específica para o usuário BYOK.
    if (
      error instanceof Anthropic.APIError &&
      (error.status === 401 || error.status === 403)
    ) {
      throw new AppError(
        "INVALID_API_KEY",
        "A chave da Anthropic é inválida ou não tem permissão. Verifique em Configurações.",
        { cause: error },
      );
    }
    throw new AppError(
      "AI_ERROR",
      "Falha ao gerar com a IA. Tente novamente em instantes.",
      { cause: error },
    );
  }
}

async function runGeneration(
  system: string,
  prompt: string,
  apiKey: string,
): Promise<GeneratedFile[]> {
  const text = await callModel(system, prompt, { apiKey });
  return parseFilesResponse(text);
}

/** Gera os arquivos de spec a partir dos dados do wizard. */
export async function generateSpecFiles(
  formData: WizardFormData,
  apiKey: string,
): Promise<GeneratedFile[]> {
  const clean = sanitizeFormData(formData);
  return runGeneration(SPEC_SYSTEM_PROMPT, buildSpecUserPrompt(clean), apiKey);
}

/** Gera os arquivos de harness a partir do wizard + specs aprovados. */
export async function generateHarnessFiles(
  formData: WizardFormData,
  specs: GeneratedFile[],
  apiKey: string,
): Promise<GeneratedFile[]> {
  const clean = sanitizeFormData(formData);
  return runGeneration(
    HARNESS_SYSTEM_PROMPT,
    buildHarnessUserPrompt(clean, specs),
    apiKey,
  );
}

/**
 * Valida uma chave BYOK com uma chamada mínima. Lança INVALID_API_KEY se a
 * chave não funcionar.
 */
export async function validateApiKey(apiKey: string): Promise<void> {
  await callModel("Responda apenas: ok.", "ok", { maxTokens: 1, apiKey });
}

/**
 * Levanta de 3 a 5 perguntas de clarificação a partir dos dados do wizard.
 */
export async function generateClarifications(
  formData: WizardFormData,
  apiKey: string,
): Promise<string[]> {
  const clean = sanitizeFormData(formData);
  const text = await callModel(
    CLARIFY_SYSTEM_PROMPT,
    buildClarifyUserPrompt(clean),
    { maxTokens: 1500, apiKey },
  );
  const parsed = parseJsonObject(text);
  const questions = (parsed as { questions?: unknown }).questions;
  if (!Array.isArray(questions)) {
    throw new AppError(
      "AI_ERROR",
      "A IA retornou um formato inesperado. Tente novamente.",
      { cause: parsed },
    );
  }
  return questions
    .filter((q): q is string => typeof q === "string" && q.trim().length > 0)
    .slice(0, 5);
}

const VALID_SEVERITIES: AnalysisSeverity[] = ["info", "warning", "error"];

/**
 * Analisa a consistência entre specs e harness, retornando achados.
 */
export async function analyzeConsistency(
  specs: GeneratedFile[],
  harness: GeneratedFile[],
  apiKey: string,
): Promise<AnalysisFinding[]> {
  const text = await callModel(
    ANALYZE_SYSTEM_PROMPT,
    buildAnalyzeUserPrompt(specs, harness),
    { maxTokens: 2000, apiKey },
  );
  const parsed = parseJsonObject(text);
  const findings = (parsed as { findings?: unknown }).findings;
  if (!Array.isArray(findings)) {
    throw new AppError(
      "AI_ERROR",
      "A IA retornou um formato inesperado. Tente novamente.",
      { cause: parsed },
    );
  }

  const result: AnalysisFinding[] = [];
  for (const item of findings) {
    if (typeof item !== "object" || item === null) continue;
    const record = item as Record<string, unknown>;
    if (typeof record.message !== "string" || record.message.trim() === "") {
      continue;
    }
    const severity =
      typeof record.severity === "string" &&
      VALID_SEVERITIES.includes(record.severity as AnalysisSeverity)
        ? (record.severity as AnalysisSeverity)
        : "info";
    result.push({ severity, message: record.message });
  }
  return result.slice(0, 8);
}
