// Registro de providers de geração (ai/v2 — provider registration/selection).
// Permite descoberta dinâmica e troca de provider sem acoplar o núcleo.
import type { GenerationProvider } from "@/lib/providers/provider";
import { anthropicProvider } from "@/lib/providers/anthropic";

const registry = new Map<string, GenerationProvider>();

export function registerProvider(provider: GenerationProvider): void {
  registry.set(provider.id, provider);
}

export function getProvider(id: string): GenerationProvider | undefined {
  return registry.get(id);
}

export function listProviders(): GenerationProvider[] {
  return [...registry.values()];
}

// Provider padrão desta rodada (geração via Anthropic).
export const DEFAULT_PROVIDER_ID = "anthropic";

export function defaultProvider(): GenerationProvider {
  const provider = registry.get(DEFAULT_PROVIDER_ID);
  if (!provider) throw new Error("Provider de geração padrão não registrado.");
  return provider;
}

// Registra os providers embutidos na carga do módulo.
registerProvider(anthropicProvider);
