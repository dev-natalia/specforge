// Plugin System V2 (ai/v2 — 41-plugin-system). Costura de extensibilidade:
// o núcleo é fechado para modificação, aberto para extensão. Plugins declaram
// capacidades por categoria e são descobertos pelo registry.
import type { ProjectSnapshot } from "@/lib/domain/project";
import type { SpecType } from "@/lib/domain/specs";
import type { Provider } from "@/lib/domain/harness";
import type { GenerationProvider } from "@/lib/providers/provider";
import type { QualityReport } from "@/lib/engine/quality-gates";

export type PluginCategory =
  | "specType"
  | "validator"
  | "generationProvider"
  | "outputAdapter";

interface PluginBase {
  id: string;
  name: string;
  version: string;
  category: PluginCategory;
}

// Novo tipo de spec (estende a cascata sem tocar no núcleo).
export interface SpecTypePlugin extends PluginBase {
  category: "specType";
  specType: SpecType;
  predecessors: SpecType[];
}

// Validador/quality gate plugável.
export interface ValidatorPlugin extends PluginBase {
  category: "validator";
  run: (snapshot: ProjectSnapshot) => QualityReport;
}

// Provider de geração (quem gera texto).
export interface GenerationProviderPlugin extends PluginBase {
  category: "generationProvider";
  provider: GenerationProvider;
}

// Adapter de saída (harness → artefato de provider).
export interface OutputAdapterPlugin extends PluginBase {
  category: "outputAdapter";
  provider: Provider;
}

export type Plugin =
  | SpecTypePlugin
  | ValidatorPlugin
  | GenerationProviderPlugin
  | OutputAdapterPlugin;
