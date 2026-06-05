// Provider de geração Anthropic (BYOK direto no navegador).
// O browser chama a Anthropic com a chave do usuário — sem servidor nosso no
// meio (sem timeout de função). O modelo claude-opus-4-8 rejeita `temperature`,
// então não o enviamos.
import Anthropic from "@anthropic-ai/sdk";
import { AppError } from "@/lib/errors";
import type {
  GenerationProvider,
  GenerationRequest,
  GenerationOptions,
  ProviderCapabilities,
} from "@/lib/providers/provider";

const MODEL_ID = "claude-opus-4-8";
const DEFAULT_MAX_TOKENS = 16000;

// dangerouslyAllowBrowser + header de acesso direto habilitam o CORS da
// Anthropic para apps client-side BYOK. A chave nunca passa por servidor nosso.
function getClient(apiKey: string): Anthropic {
  return new Anthropic({
    apiKey: apiKey.trim(),
    dangerouslyAllowBrowser: true,
    defaultHeaders: { "anthropic-dangerous-direct-browser-access": "true" },
  });
}

function normalizeError(error: unknown): never {
  if (error instanceof AppError) throw error;
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

const capabilities: ProviderCapabilities = {
  id: "anthropic",
  label: "Anthropic (Claude)",
  models: [MODEL_ID],
  textGeneration: true,
};

export const anthropicProvider: GenerationProvider = {
  id: "anthropic",
  capabilities,

  async generateText(
    request: GenerationRequest,
    options: GenerationOptions,
  ): Promise<string> {
    try {
      const message = await getClient(options.apiKey).messages.create({
        model: MODEL_ID,
        max_tokens: request.maxTokens ?? DEFAULT_MAX_TOKENS,
        system: request.system,
        messages: [{ role: "user", content: request.prompt }],
      });
      return message.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("");
    } catch (error) {
      normalizeError(error);
    }
  },

  async validateKey(apiKey: string): Promise<void> {
    await this.generateText(
      { system: "Responda apenas: ok.", prompt: "ok", maxTokens: 1 },
      { apiKey },
    );
  },
};
