// Provider Abstraction V2 (ai/v2 — 42-provider-abstraction). Isola o núcleo do
// provider de IA que GERA texto. O conhecimento e o pipeline não dependem de
// nenhum provider específico — falam com esta interface.
//
// Nota: "provider de geração" (quem gera, ex. Anthropic) é diferente dos
// "provider adapters de saída" (claude/cursor/gpt/gemini — harness → arquivo),
// que são transformações puras e ficam em lib/providers/adapters.

export interface GenerationRequest {
  // Instruções invioláveis (system prompt).
  system: string;
  // Conteúdo da tarefa (dados são tratados como dados, nunca instruções).
  prompt: string;
  maxTokens?: number;
}

export interface GenerationOptions {
  // Chave BYOK do usuário — nunca trafega por servidor nosso.
  apiKey: string;
}

export interface ProviderCapabilities {
  id: string;
  label: string;
  models: string[];
  // Capacidade declarada (capability-based design do v2).
  textGeneration: boolean;
}

// Provider de geração provider-neutro.
export interface GenerationProvider {
  readonly id: string;
  readonly capabilities: ProviderCapabilities;
  // Gera texto bruto a partir de system+prompt.
  generateText(request: GenerationRequest, options: GenerationOptions): Promise<string>;
  // Valida a chave BYOK com uma chamada mínima.
  validateKey(apiKey: string): Promise<void>;
}
