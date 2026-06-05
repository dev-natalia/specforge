// Registry de plugins (ai/v2 — 41). In-process; marketplace/sandbox diferidos.
// Registra os built-ins (tipos de spec, validators, providers, adapters) e
// permite estender o sistema sem modificar o núcleo.
import type { Plugin, PluginCategory } from "@/lib/plugins/types";
import {
  SPEC_CASCADE,
  SPEC_LABEL,
  specPredecessors,
} from "@/lib/domain/specs";
import { providerSchema, PROVIDER_LABEL } from "@/lib/domain/harness";
import { anthropicProvider } from "@/lib/providers/anthropic";
import { runKnowledgeGates, runSpecGates } from "@/lib/engine/quality-gates";

const registry = new Map<string, Plugin>();

function key(category: PluginCategory, id: string): string {
  return `${category}:${id}`;
}

export function registerPlugin(plugin: Plugin): void {
  registry.set(key(plugin.category, plugin.id), plugin);
}

export function getPlugin(category: PluginCategory, id: string): Plugin | undefined {
  return registry.get(key(category, id));
}

export function listPlugins<C extends PluginCategory>(
  category: C,
): Extract<Plugin, { category: C }>[] {
  return [...registry.values()].filter(
    (p): p is Extract<Plugin, { category: C }> => p.category === category,
  );
}

let registered = false;

/** Registra os plugins embutidos (idempotente). */
export function registerBuiltins(): void {
  if (registered) return;
  registered = true;

  // Tipos de spec (a cascata como plugins).
  for (const specType of SPEC_CASCADE) {
    registerPlugin({
      id: specType,
      name: `Spec: ${SPEC_LABEL[specType]}`,
      version: "1.0.0",
      category: "specType",
      specType,
      predecessors: specPredecessors(specType),
    });
  }

  // Validators (quality gates).
  registerPlugin({
    id: "knowledge-gates",
    name: "Quality Gates de Conhecimento",
    version: "1.0.0",
    category: "validator",
    run: runKnowledgeGates,
  });
  registerPlugin({
    id: "spec-gates",
    name: "Quality Gates de Specs",
    version: "1.0.0",
    category: "validator",
    run: runSpecGates,
  });

  // Provider de geração.
  registerPlugin({
    id: anthropicProvider.id,
    name: anthropicProvider.capabilities.label,
    version: "1.0.0",
    category: "generationProvider",
    provider: anthropicProvider,
  });

  // Adapters de saída.
  for (const provider of providerSchema.options) {
    registerPlugin({
      id: provider,
      name: `Adapter: ${PROVIDER_LABEL[provider]}`,
      version: "1.0.0",
      category: "outputAdapter",
      provider,
    });
  }
}

// Registra na carga do módulo.
registerBuiltins();
