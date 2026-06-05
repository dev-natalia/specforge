// Store do Workspace (Fase 1 — Camada de Conhecimento; V3 — multi-iniciativa).
// Mantém o snapshot do projeto ativo em memória e persiste cada mutação no
// IndexedDB (local-first). Conhecimento é o ativo durável: toda alteração
// sobrevive a recarregar a página.
//
// V3: o projeto é um container de Initiatives. Toda mutação de artefato é feita
// sob uma "iniciativa ativa" e marcada com seu `initiativeId`. A geração respeita
// o scope da iniciativa (matriz de artefatos). Compat: quando nenhuma iniciativa
// existe, criamos uma `product` padrão sob demanda (comportamento single-product).
import { create } from "zustand";
import {
  listProjects as repoListProjects,
  loadSnapshot,
  saveSnapshot,
  deleteProject as repoDeleteProject,
} from "@/lib/storage/repository";
import { importProjectFromJson } from "@/lib/storage/import";
import {
  emptySnapshot,
  projectSlug,
  collectTraceables,
  checkProjectInvariants,
  initiativeSnapshot,
  type Project,
  type ProjectSnapshot,
  type ProjectInvariantIssue,
} from "@/lib/domain/project";
import { nextId } from "@/lib/domain/ids";
import {
  initiativeSchema,
  type Initiative,
  type ScopeClassification,
} from "@/lib/domain/initiative";
import { isSpecAllowed } from "@/lib/domain/artifact-matrix";
import type { Scope } from "@/lib/domain/scope";
import {
  knowledgeObjectSchema,
  type KnowledgeObject,
  type KnowledgeKind,
} from "@/lib/domain/knowledge";
import {
  clarificationSchema,
  type Clarification,
} from "@/lib/domain/clarification";
import {
  clarificationToKnowledge,
  type ClarificationDraft,
  type EngineOptions,
} from "@/lib/engine/clarification";
import {
  runKnowledgeGates,
  runSpecGates,
  type QualityReport,
} from "@/lib/engine/quality-gates";
import {
  specificationSchema,
  specPredecessors,
  SPEC_CASCADE,
  SPEC_LABEL,
  type SpecType,
  type SpecStatus,
} from "@/lib/domain/specs";
import { generateSpecContent } from "@/lib/engine/spec-gen";
import {
  consolidatedSpecSchema,
  CONSOLIDATED_SPEC_LABEL,
} from "@/lib/domain/consolidated-spec";
import { generateConsolidatedSpec as genConsolidatedSpecContent } from "@/lib/engine/consolidated-spec-gen";
import {
  classifyScope,
  recommendScopeChange,
  type ScopeRecommendation,
} from "@/lib/engine/classify";
import {
  harnessSchema,
  agentRulesSchema,
  providerArtifactSchema,
  PROVIDER_OUTPUT_PATH,
  type Provider,
} from "@/lib/domain/harness";
import { taskSchema } from "@/lib/domain/task";
import { generateHarnessBundle } from "@/lib/engine/harness-gen";
import { generateTaskDrafts } from "@/lib/engine/task-gen";
import { renderArtifact } from "@/lib/providers/adapters";
import {
  appendFeedback,
  feedbackEvent,
  type GenerationEvent,
  type FeedbackStatus,
  type GenerationRun,
  type RunStep,
  type RunStatus,
} from "@/lib/workspace/feedback";

function nowIso(): string {
  return new Date().toISOString();
}

// Mapeia o kind de conhecimento para o tipo de artefato usado na geração de ID.
const KNOWLEDGE_ID_KIND: Record<KnowledgeKind, Parameters<typeof nextId>[0]> = {
  discovery: "discovery",
  decision: "decision",
  constraint: "constraint",
  principle: "principle",
  risk: "risk",
  assumption: "assumption",
  productDna: "productDna",
  contextPackage: "contextPackage",
};

// Substitui, dentro de uma coleção project-wide, os artefatos de uma iniciativa
// pelos novos — preservando os das demais iniciativas (regeneração isolada).
function replaceForInitiative<T extends { initiativeId?: string }>(
  all: T[],
  initiativeId: string,
  next: T[],
): T[] {
  return [...all.filter((a) => a.initiativeId !== initiativeId), ...next];
}

interface WorkspaceState {
  projects: Project[];
  snapshot: ProjectSnapshot | null;
  // Iniciativa ativa: alvo de toda mutação de artefato e da geração.
  activeInitiativeId: string | null;
  loading: boolean;
  error: string | null;
  // Feedback de geração (doc 019): log rolante de eventos para a UI.
  feedback: GenerationEvent[];
  pushFeedback: (label: string, status: FeedbackStatus, detail?: string) => void;
  clearFeedback: () => void;
  // Timeline do orquestrador (doc 018): passos planejados + status ao vivo.
  run: GenerationRun | null;
  clearRun: () => void;

  refreshProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<string>;
  openProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  importProject: (jsonText: string) => Promise<string>;
  closeProject: () => void;

  // ── Initiatives (V3) ──────────────────────────────────────────────────────
  activeInitiative: () => Initiative | null;
  setActiveInitiative: (id: string) => void;
  createInitiative: (
    title: string,
    scope: Scope,
    intent?: string,
    classification?: ScopeClassification,
  ) => Promise<string | null>;
  updateInitiative: (id: string, patch: Partial<Initiative>) => Promise<void>;
  removeInitiative: (id: string) => Promise<void>;
  // Garante uma iniciativa ativa (cria uma `product` padrão se necessário).
  ensureActiveInitiative: () => Promise<Initiative | null>;
  // Reavalia o scope da iniciativa ativa com o conhecimento acumulado e sugere
  // escalação/redução (doc 016/017). Não muda nada — só recomenda.
  evaluateScopeChange: (options: EngineOptions) => Promise<ScopeRecommendation | null>;
  // Aplica uma mudança de scope confirmada pela usuária (conhecimento preservado).
  changeInitiativeScope: (id: string, scope: Scope, classification?: ScopeClassification) => Promise<void>;

  addKnowledge: (
    kind: KnowledgeKind,
    data: Record<string, unknown>,
  ) => Promise<string | null>;
  updateKnowledge: (id: string, patch: Record<string, unknown>) => Promise<void>;
  removeKnowledge: (id: string) => Promise<void>;

  addClarifications: (drafts: ClarificationDraft[]) => Promise<void>;
  answerClarification: (id: string, answer: string) => Promise<void>;
  removeClarification: (id: string) => Promise<void>;
  // Converte uma clarificação respondida em conhecimento durável e a fecha.
  promoteClarification: (id: string) => Promise<string | null>;

  // Gera (ou regenera) a spec de um tipo a partir do conhecimento + cascata.
  generateSpecification: (type: SpecType, options: EngineOptions) => Promise<string | null>;
  removeSpecification: (id: string) => Promise<void>;
  setSpecStatus: (id: string, status: SpecStatus) => Promise<void>;
  // Edição manual do markdown de uma spec por-tipo.
  updateSpecificationContent: (id: string, content: string) => Promise<void>;

  // Gera (ou regenera) o spec consolidado Story/Feature (documento único).
  generateConsolidatedSpec: (options: EngineOptions) => Promise<string | null>;
  removeConsolidatedSpec: (id: string) => Promise<void>;
  // Edição manual do markdown do spec consolidado.
  updateConsolidatedSpecContent: (id: string, content: string) => Promise<void>;

  // Gera o harness (camadas + agent rules) a partir do conhecimento + specs.
  generateHarness: (options: EngineOptions) => Promise<string | null>;
  // Renderiza os artefatos dos providers (transformação pura, sem IA/chave).
  generateProviderArtifacts: (providers: Provider[]) => Promise<void>;
  // Gera o grafo de tasks a partir das specs.
  generateTasks: (options: EngineOptions) => Promise<number>;

  // Orquestrador (doc 017): roda o pipeline completo do scope numa ação só —
  // specs (consolidada p/ story/feature, cascata p/ product) → harness → tasks
  // → artefatos de provider. Assume que clarificação/conhecimento já existe.
  generateAll: (options: EngineOptions) => Promise<void>;

  invariantIssues: () => ProjectInvariantIssue[];
  qualityReport: () => QualityReport | null;
  specReport: () => QualityReport | null;
}

async function persist(snapshot: ProjectSnapshot): Promise<void> {
  await saveSnapshot(snapshot);
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  projects: [],
  snapshot: null,
  activeInitiativeId: null,
  loading: false,
  error: null,
  feedback: [],
  run: null,

  pushFeedback(label, status, detail) {
    set((s) => ({ feedback: appendFeedback(s.feedback, feedbackEvent(label, status, detail)) }));
  },

  clearFeedback() {
    set({ feedback: [] });
  },

  clearRun() {
    set({ run: null });
  },

  async refreshProjects() {
    try {
      const projects = await repoListProjects();
      projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      set({ projects });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Falha ao listar projetos." });
    }
  },

  async createProject(name, description = "") {
    const existing = await repoListProjects();
    const id = nextId("project", existing.map((p) => p.id));
    const now = nowIso();
    const project: Project = {
      id,
      name: name.trim(),
      slug: projectSlug(name),
      description: description.trim(),
      createdAt: now,
      updatedAt: now,
    };
    const snapshot = emptySnapshot(project);
    await persist(snapshot);
    await get().refreshProjects();
    return id;
  },

  async openProject(id) {
    set({ loading: true, error: null });
    try {
      const snapshot = await loadSnapshot(id);
      // Seleciona a primeira iniciativa como ativa (se houver).
      const activeInitiativeId = snapshot?.initiatives[0]?.id ?? null;
      set({ snapshot, activeInitiativeId, loading: false });
      if (!snapshot) set({ error: "Projeto não encontrado." });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Falha ao abrir projeto.",
      });
    }
  },

  async deleteProject(id) {
    await repoDeleteProject(id);
    const { snapshot } = get();
    if (snapshot?.project.id === id) set({ snapshot: null, activeInitiativeId: null });
    await get().refreshProjects();
  },

  async importProject(jsonText) {
    const imported = importProjectFromJson(jsonText);
    // Reusa o ID do export; se já existir, sobrescreve (round-trip).
    imported.project.updatedAt = nowIso();
    await persist(imported);
    await get().refreshProjects();
    return imported.project.id;
  },

  closeProject() {
    set({ snapshot: null, activeInitiativeId: null });
  },

  // ── Initiatives (V3) ────────────────────────────────────────────────────────

  activeInitiative() {
    const { snapshot, activeInitiativeId } = get();
    if (!snapshot || !activeInitiativeId) return null;
    return snapshot.initiatives.find((i) => i.id === activeInitiativeId) ?? null;
  },

  setActiveInitiative(id) {
    const { snapshot } = get();
    if (!snapshot) return;
    if (snapshot.initiatives.some((i) => i.id === id)) set({ activeInitiativeId: id });
  },

  async createInitiative(title, scope, intent = "", classification) {
    const { snapshot } = get();
    if (!snapshot) return null;
    const now = nowIso();
    const id = nextId("initiative", snapshot.initiatives.map((i) => i.id));
    const candidate = {
      kind: "initiative",
      id,
      title: title.trim(),
      intent: intent.trim(),
      scope,
      classification,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    const parsed = initiativeSchema.safeParse(candidate);
    if (!parsed.success) {
      set({ error: "Dados de iniciativa inválidos." });
      return null;
    }
    const next: ProjectSnapshot = {
      ...snapshot,
      initiatives: [...snapshot.initiatives, parsed.data],
      project: { ...snapshot.project, updatedAt: now },
    };
    await persist(next);
    set({ snapshot: next, activeInitiativeId: id });
    return id;
  },

  async updateInitiative(id, patch) {
    const { snapshot } = get();
    if (!snapshot) return;
    const now = nowIso();
    let changed = false;
    const initiatives = snapshot.initiatives.map((item) => {
      if (item.id !== id) return item;
      const merged = { ...item, ...patch, id: item.id, kind: "initiative", updatedAt: now };
      const parsed = initiativeSchema.safeParse(merged);
      if (!parsed.success) return item;
      changed = true;
      return parsed.data;
    });
    if (!changed) return;
    const next: ProjectSnapshot = {
      ...snapshot,
      initiatives,
      project: { ...snapshot.project, updatedAt: now },
    };
    await persist(next);
    set({ snapshot: next });
  },

  async removeInitiative(id) {
    const { snapshot, activeInitiativeId } = get();
    if (!snapshot) return;
    // Cascata: remove a iniciativa e todos os artefatos que pertencem a ela.
    const keep = <T extends { initiativeId?: string }>(items: T[]): T[] =>
      items.filter((a) => a.initiativeId !== id);
    const next: ProjectSnapshot = {
      ...snapshot,
      initiatives: snapshot.initiatives.filter((i) => i.id !== id),
      knowledge: keep(snapshot.knowledge),
      clarifications: keep(snapshot.clarifications),
      specifications: keep(snapshot.specifications),
      harnesses: keep(snapshot.harnesses),
      agentRules: keep(snapshot.agentRules),
      providerArtifacts: keep(snapshot.providerArtifacts),
      tasks: keep(snapshot.tasks),
      project: { ...snapshot.project, updatedAt: nowIso() },
    };
    await persist(next);
    const nextActive =
      activeInitiativeId === id ? next.initiatives[0]?.id ?? null : activeInitiativeId;
    set({ snapshot: next, activeInitiativeId: nextActive });
  },

  async ensureActiveInitiative() {
    const state = get();
    const snapshot = state.snapshot;
    if (!snapshot) return null;

    const activeId = state.activeInitiativeId;
    if (activeId) {
      const found = snapshot.initiatives.find((i) => i.id === activeId);
      if (found) return found;
    }
    if (snapshot.initiatives.length > 0) {
      const first = snapshot.initiatives[0] as Initiative;
      set({ activeInitiativeId: first.id });
      return first;
    }

    // Nenhuma iniciativa: cria a `product` padrão (compat single-product).
    const now = nowIso();
    const id = nextId("initiative", []);
    const parsed = initiativeSchema.safeParse({
      kind: "initiative",
      id,
      title: snapshot.project.name || "Iniciativa principal",
      intent: snapshot.project.description ?? "",
      scope: "product",
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
    if (!parsed.success) return null;
    const next: ProjectSnapshot = {
      ...snapshot,
      initiatives: [parsed.data],
      project: { ...snapshot.project, updatedAt: now },
    };
    await persist(next);
    set({ snapshot: next, activeInitiativeId: id });
    return parsed.data;
  },

  async evaluateScopeChange(options) {
    const initiative = get().activeInitiative();
    if (!initiative) return null;
    const { snapshot } = get();
    if (!snapshot) return null;
    const view = initiativeSnapshot(snapshot, initiative.id);
    const classification = await classifyScope(initiative.intent, options, view);
    return recommendScopeChange(initiative.scope, classification);
  },

  async changeInitiativeScope(id, scope, classification) {
    const current = get().snapshot?.initiatives.find((i) => i.id === id);
    const from = current?.scope;
    // Apenas metadados da iniciativa mudam; os artefatos são preservados
    // (Knowledge First — nenhuma perda na escalação/redução, doc 005/016).
    const patch: Partial<Initiative> = classification ? { scope, classification } : { scope };
    // Registra a mudança no histórico durável da iniciativa.
    if (from && from !== scope) {
      const entry = {
        from,
        to: scope,
        at: nowIso(),
        reason: classification?.reason ?? "",
        ...(classification ? { confidence: classification.confidence } : {}),
      };
      patch.scopeHistory = [...(current?.scopeHistory ?? []), entry];
    }
    await get().updateInitiative(id, patch);
    if (from && from !== scope) {
      get().pushFeedback("Scope alterado", "info", `${from} → ${scope}`);
    }
  },

  async addKnowledge(kind, data) {
    const initiative = await get().ensureActiveInitiative();
    if (!initiative) return null;
    const { snapshot } = get();
    if (!snapshot) return null;
    const id = nextId(
      KNOWLEDGE_ID_KIND[kind],
      collectTraceables(snapshot).map((a) => a.id),
    );
    const now = nowIso();
    const candidate = {
      ...data,
      kind,
      id,
      initiativeId: initiative.id,
      createdAt: now,
      updatedAt: now,
    };
    const parsed = knowledgeObjectSchema.safeParse(candidate);
    if (!parsed.success) {
      set({ error: "Dados de conhecimento inválidos." });
      return null;
    }
    const next: ProjectSnapshot = {
      ...snapshot,
      knowledge: [...snapshot.knowledge, parsed.data],
      project: { ...snapshot.project, updatedAt: now },
    };
    await persist(next);
    set({ snapshot: next });
    return id;
  },

  async updateKnowledge(id, patch) {
    const { snapshot } = get();
    if (!snapshot) return;
    const now = nowIso();
    let changed = false;
    const knowledge: KnowledgeObject[] = snapshot.knowledge.map((item) => {
      if (item.id !== id) return item;
      const merged = { ...item, ...patch, updatedAt: now };
      const parsed = knowledgeObjectSchema.safeParse(merged);
      if (!parsed.success) return item;
      changed = true;
      return parsed.data;
    });
    if (!changed) return;
    const next: ProjectSnapshot = {
      ...snapshot,
      knowledge,
      project: { ...snapshot.project, updatedAt: now },
    };
    await persist(next);
    set({ snapshot: next });
  },

  async removeKnowledge(id) {
    const { snapshot } = get();
    if (!snapshot) return;
    const next: ProjectSnapshot = {
      ...snapshot,
      knowledge: snapshot.knowledge.filter((item) => item.id !== id),
      project: { ...snapshot.project, updatedAt: nowIso() },
    };
    await persist(next);
    set({ snapshot: next });
  },

  async addClarifications(drafts) {
    if (drafts.length === 0) return;
    const initiative = await get().ensureActiveInitiative();
    if (!initiative) return;
    const { snapshot } = get();
    if (!snapshot) return;
    const now = nowIso();
    const existingIds = collectTraceables(snapshot).map((a) => a.id);
    const clarifications: Clarification[] = [...snapshot.clarifications];
    for (const draft of drafts) {
      const id = nextId("clarification", [
        ...existingIds,
        ...clarifications.map((c) => c.id),
      ]);
      const candidate = {
        ...draft,
        kind: "clarification",
        id,
        initiativeId: initiative.id,
        answer: "",
        status: "open",
        traceRefs: [],
        createdAt: now,
        updatedAt: now,
      };
      const parsed = clarificationSchema.safeParse(candidate);
      if (parsed.success) clarifications.push(parsed.data);
    }
    const next: ProjectSnapshot = {
      ...snapshot,
      clarifications,
      project: { ...snapshot.project, updatedAt: now },
    };
    await persist(next);
    set({ snapshot: next });
  },

  async answerClarification(id, answer) {
    const { snapshot } = get();
    if (!snapshot) return;
    const now = nowIso();
    const clarifications = snapshot.clarifications.map((c) =>
      c.id === id
        ? { ...c, answer, status: answer.trim() ? ("answered" as const) : ("open" as const), updatedAt: now }
        : c,
    );
    const next: ProjectSnapshot = { ...snapshot, clarifications };
    await persist(next);
    set({ snapshot: next });
  },

  async removeClarification(id) {
    const { snapshot } = get();
    if (!snapshot) return;
    const next: ProjectSnapshot = {
      ...snapshot,
      clarifications: snapshot.clarifications.filter((c) => c.id !== id),
    };
    await persist(next);
    set({ snapshot: next });
  },

  async promoteClarification(id) {
    const { snapshot } = get();
    if (!snapshot) return null;
    const clar = snapshot.clarifications.find((c) => c.id === id);
    if (!clar) return null;
    const draft = clarificationToKnowledge(clar);
    if (!draft) return null;

    // Gera o conhecimento na mesma iniciativa da clarificação (alvo ativo).
    if (clar.initiativeId) get().setActiveInitiative(clar.initiativeId);
    const newId = await get().addKnowledge(draft.kind, draft.data);
    if (!newId) return null;

    // Fecha a clarificação (a resposta virou conhecimento durável).
    const after = get().snapshot;
    if (after) {
      const now = nowIso();
      const clarifications = after.clarifications.map((c) =>
        c.id === id ? { ...c, status: "closed" as const, updatedAt: now } : c,
      );
      const next: ProjectSnapshot = { ...after, clarifications };
      await persist(next);
      set({ snapshot: next });
    }
    return newId;
  },

  async generateSpecification(type, options) {
    const initiative = await get().ensureActiveInitiative();
    if (!initiative) return null;
    // Gating de scope (matriz de artefatos): recusa spec proibida no scope.
    if (!isSpecAllowed(initiative.scope, type)) {
      set({
        error: `A spec "${SPEC_LABEL[type]}" não é permitida no scope ${initiative.scope}.`,
      });
      get().pushFeedback(`Spec ${SPEC_LABEL[type]}`, "skipped", `fora do scope ${initiative.scope}`);
      return null;
    }
    const { snapshot } = get();
    if (!snapshot) return null;
    const view = initiativeSnapshot(snapshot, initiative.id);

    // Predecessores: specs já geradas dos tipos anteriores na cascata (na iniciativa).
    const predTypes = specPredecessors(type);
    const predecessors = view.specifications
      .filter((s) => predTypes.includes(s.specType))
      .map((s) => ({ id: s.id, type: s.specType, content: s.content }));

    const generated = await generateSpecContent(type, view, predecessors, options);
    const now = nowIso();
    const existing = view.specifications.find((s) => s.specType === type);

    let specifications;
    let id: string;
    if (existing) {
      // Regeneração: preserva o ID, incrementa a versão.
      id = existing.id;
      specifications = snapshot.specifications.map((s) =>
        s.id === existing.id
          ? {
              ...s,
              content: generated.content,
              traceRefs: generated.traceRefs,
              version: s.version + 1,
              updatedAt: now,
            }
          : s,
      );
    } else {
      id = nextId("specification", collectTraceables(snapshot).map((a) => a.id));
      const parsed = specificationSchema.safeParse({
        kind: "specification",
        id,
        initiativeId: initiative.id,
        specType: type,
        title: SPEC_LABEL[type],
        status: "draft",
        version: 1,
        content: generated.content,
        traceRefs: generated.traceRefs,
        createdAt: now,
        updatedAt: now,
      });
      if (!parsed.success) {
        set({ error: "Spec gerada inválida." });
        return null;
      }
      specifications = [...snapshot.specifications, parsed.data];
    }

    const next: ProjectSnapshot = {
      ...snapshot,
      specifications,
      project: { ...snapshot.project, updatedAt: now },
    };
    await persist(next);
    set({ snapshot: next });
    get().pushFeedback(`Spec ${SPEC_LABEL[type]}`, "done", `${id} v${existing ? existing.version + 1 : 1}`);
    return id;
  },

  async removeSpecification(id) {
    const { snapshot } = get();
    if (!snapshot) return;
    const next: ProjectSnapshot = {
      ...snapshot,
      specifications: snapshot.specifications.filter((s) => s.id !== id),
    };
    await persist(next);
    set({ snapshot: next });
  },

  async setSpecStatus(id, status) {
    const { snapshot } = get();
    if (!snapshot) return;
    const now = nowIso();
    const specifications = snapshot.specifications.map((s) =>
      s.id === id ? { ...s, status, updatedAt: now } : s,
    );
    const next: ProjectSnapshot = { ...snapshot, specifications };
    await persist(next);
    set({ snapshot: next });
  },

  async updateSpecificationContent(id, content) {
    const { snapshot } = get();
    if (!snapshot) return;
    const now = nowIso();
    let changed = false;
    const specifications = snapshot.specifications.map((s) => {
      if (s.id !== id || s.content === content) return s;
      changed = true;
      return { ...s, content, version: s.version + 1, updatedAt: now };
    });
    if (!changed) return;
    const next: ProjectSnapshot = {
      ...snapshot,
      specifications,
      project: { ...snapshot.project, updatedAt: now },
    };
    await persist(next);
    set({ snapshot: next });
    get().pushFeedback("Spec editada", "done", id);
  },

  async generateConsolidatedSpec(options) {
    const initiative = await get().ensureActiveInitiative();
    if (!initiative) return null;
    // O documento consolidado existe só para Story e Feature (doc 010/011).
    if (initiative.scope === "product") {
      set({
        error: "Product usa specs por-tipo (cascata), não um documento consolidado.",
      });
      get().pushFeedback("Spec consolidado", "skipped", "Product usa specs por-tipo");
      return null;
    }
    const format = initiative.scope; // "story" | "feature"
    const { snapshot } = get();
    if (!snapshot) return null;
    const view = initiativeSnapshot(snapshot, initiative.id);

    const generated = await genConsolidatedSpecContent(format, initiative.intent, view, options);
    const now = nowIso();
    const existing = view.consolidatedSpecs[0];

    const id = existing?.id ?? nextId("consolidatedSpec", collectTraceables(snapshot).map((a) => a.id));
    const parsed = consolidatedSpecSchema.safeParse({
      kind: "consolidatedSpec",
      id,
      initiativeId: initiative.id,
      format,
      title: CONSOLIDATED_SPEC_LABEL[format],
      status: existing?.status ?? "draft",
      version: existing ? existing.version + 1 : 1,
      content: generated.content,
      traceRefs: generated.traceRefs,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
    if (!parsed.success) {
      set({ error: "Spec consolidado gerado inválido." });
      return null;
    }

    const next: ProjectSnapshot = {
      ...snapshot,
      consolidatedSpecs: replaceForInitiative(snapshot.consolidatedSpecs, initiative.id, [parsed.data]),
      project: { ...snapshot.project, updatedAt: now },
    };
    await persist(next);
    set({ snapshot: next });
    get().pushFeedback(CONSOLIDATED_SPEC_LABEL[format], "done", `${id} v${parsed.data.version}`);
    return id;
  },

  async removeConsolidatedSpec(id) {
    const { snapshot } = get();
    if (!snapshot) return;
    const next: ProjectSnapshot = {
      ...snapshot,
      consolidatedSpecs: snapshot.consolidatedSpecs.filter((s) => s.id !== id),
    };
    await persist(next);
    set({ snapshot: next });
  },

  async updateConsolidatedSpecContent(id, content) {
    const { snapshot } = get();
    if (!snapshot) return;
    const now = nowIso();
    let changed = false;
    const consolidatedSpecs = snapshot.consolidatedSpecs.map((s) => {
      if (s.id !== id || s.content === content) return s;
      changed = true;
      return { ...s, content, version: s.version + 1, updatedAt: now };
    });
    if (!changed) return;
    const next: ProjectSnapshot = {
      ...snapshot,
      consolidatedSpecs,
      project: { ...snapshot.project, updatedAt: now },
    };
    await persist(next);
    set({ snapshot: next });
    get().pushFeedback("Spec editada", "done", id);
  },

  async generateHarness(options) {
    const initiative = await get().ensureActiveInitiative();
    if (!initiative) return null;
    const { snapshot } = get();
    if (!snapshot) return null;
    const view = initiativeSnapshot(snapshot, initiative.id);
    // Harness progressivo: as camadas ativas escalam com o scope (doc 015).
    const bundle = await generateHarnessBundle(view, options, initiative.scope);
    const now = nowIso();

    const existingHarness = view.harnesses[0];
    const existingRules = view.agentRules[0];
    const allIds = collectTraceables(snapshot).map((a) => a.id);

    const harnessId = existingHarness?.id ?? nextId("harness", allIds);
    const harnessParsed = harnessSchema.safeParse({
      kind: "harness",
      id: harnessId,
      initiativeId: initiative.id,
      title: "Harness do projeto",
      purpose: "Ambiente operacional provider-neutro para agentes de IA.",
      scope: `Iniciativa de scope ${initiative.scope}.`,
      layers: bundle.layers,
      prohibited: bundle.prohibited,
      version: existingHarness ? existingHarness.version + 1 : 1,
      traceRefs: bundle.traceRefs,
      createdAt: existingHarness?.createdAt ?? now,
      updatedAt: now,
    });

    const rulesId = existingRules?.id ?? nextId("agentRules", [...allIds, harnessId]);
    const rulesParsed = agentRulesSchema.safeParse({
      kind: "agentRules",
      id: rulesId,
      initiativeId: initiative.id,
      rules: bundle.agentRules,
      traceRefs: [harnessId],
      createdAt: existingRules?.createdAt ?? now,
      updatedAt: now,
    });

    if (!harnessParsed.success || !rulesParsed.success) {
      set({ error: "Harness gerado inválido." });
      return null;
    }

    const next: ProjectSnapshot = {
      ...snapshot,
      harnesses: replaceForInitiative(snapshot.harnesses, initiative.id, [harnessParsed.data]),
      agentRules: replaceForInitiative(snapshot.agentRules, initiative.id, [rulesParsed.data]),
      project: { ...snapshot.project, updatedAt: now },
    };
    await persist(next);
    set({ snapshot: next });
    get().pushFeedback("Harness", "done", `${harnessId} · scope ${initiative.scope}`);
    return harnessId;
  },

  async generateProviderArtifacts(providers) {
    const initiative = await get().ensureActiveInitiative();
    if (!initiative) return;
    const { snapshot } = get();
    if (!snapshot) return;
    const view = initiativeSnapshot(snapshot, initiative.id);
    const harness = view.harnesses[0];
    if (!harness) {
      set({ error: "Gere o harness antes dos artefatos de provider." });
      return;
    }
    const agentRules = view.agentRules[0];
    const now = nowIso();
    const allIds = collectTraceables(snapshot).map((a) => a.id);
    // Conjunto de artefatos da iniciativa ativa (será mesclado de volta).
    const artifacts = [...view.providerArtifacts];

    for (const provider of providers) {
      const content = renderArtifact(provider, harness, agentRules, snapshot.project);
      const existing = artifacts.find((a) => a.provider === provider);
      const id = existing?.id ?? nextId("providerArtifact", [...allIds, ...artifacts.map((a) => a.id)]);
      const parsed = providerArtifactSchema.safeParse({
        kind: "providerArtifact",
        id,
        initiativeId: initiative.id,
        provider,
        path: PROVIDER_OUTPUT_PATH[provider],
        content,
        traceRefs: [harness.id],
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      });
      if (!parsed.success) continue;
      const idx = artifacts.findIndex((a) => a.provider === provider);
      if (idx >= 0) artifacts[idx] = parsed.data;
      else artifacts.push(parsed.data);
    }

    const next: ProjectSnapshot = {
      ...snapshot,
      providerArtifacts: replaceForInitiative(snapshot.providerArtifacts, initiative.id, artifacts),
    };
    await persist(next);
    set({ snapshot: next });
    get().pushFeedback("Artefatos de provider", "done", providers.join(", "));
  },

  async generateTasks(options) {
    const initiative = await get().ensureActiveInitiative();
    if (!initiative) return 0;
    const { snapshot } = get();
    if (!snapshot) return 0;
    const view = initiativeSnapshot(snapshot, initiative.id);
    const drafts = await generateTaskDrafts(view, options);
    const now = nowIso();
    // IDs em uso por outros artefatos (exclui as tasks da iniciativa, que serão
    // substituídas), para manter unicidade project-wide.
    const baseIds = collectTraceables(snapshot)
      .filter((a) => !(a.initiativeId === initiative.id && a.id.startsWith("TASK-")))
      .map((a) => a.id);
    const specRefs = [
      ...view.specifications.map((s) => s.id),
      ...view.consolidatedSpecs.map((s) => s.id),
    ];

    // Atribui IDs em ordem para resolver dependsOn (índices → IDs).
    const ids: string[] = [];
    for (let i = 0; i < drafts.length; i++) {
      ids.push(nextId("task", [...baseIds, ...ids]));
    }

    const newTasks = drafts.map((draft, i) => {
      const dependencies = draft.dependsOn
        .filter((idx) => idx >= 0 && idx < ids.length && idx !== i)
        .map((idx) => ids[idx] as string);
      return taskSchema.parse({
        kind: "task",
        id: ids[i],
        initiativeId: initiative.id,
        title: draft.title,
        category: draft.category,
        objective: draft.objective,
        description: draft.description,
        dependencies,
        acceptanceCriteria: draft.acceptanceCriteria,
        testingExpectations: draft.testingExpectations,
        securityExpectations: draft.securityExpectations,
        deliverables: draft.deliverables,
        status: "pending",
        traceRefs: specRefs,
        createdAt: now,
        updatedAt: now,
      });
    });

    const next: ProjectSnapshot = {
      ...snapshot,
      tasks: replaceForInitiative(snapshot.tasks, initiative.id, newTasks),
      project: { ...snapshot.project, updatedAt: now },
    };
    await persist(next);
    set({ snapshot: next });
    get().pushFeedback("Tasks", "done", `${newTasks.length} tasks`);
    return newTasks.length;
  },

  async generateAll(options) {
    const initiative = await get().ensureActiveInitiative();
    if (!initiative) return;
    const scope = initiative.scope;

    // Passos planejados (timeline): specs (consolidada ou cascata) + harness +
    // tasks + artefatos. Cada passo ganha status ao vivo (doc 018).
    const specSteps: { key: string; label: string; type: SpecType | null }[] =
      scope === "product"
        ? SPEC_CASCADE.filter((t) => isSpecAllowed(scope, t)).map((t) => ({
            key: `spec:${t}`,
            label: `Spec ${SPEC_LABEL[t]}`,
            type: t,
          }))
        : [{ key: "spec", label: "Especificação consolidada", type: null }];

    const steps: RunStep[] = [
      ...specSteps.map((s) => ({ key: s.key, label: s.label, status: "pending" as RunStatus })),
      { key: "harness", label: "Harness", status: "pending" },
      { key: "tasks", label: "Tasks", status: "pending" },
      { key: "artifacts", label: "Artefatos de provider", status: "pending" },
    ];
    set({ run: { scope, steps, startedAt: nowIso() } });
    get().pushFeedback("Gerar tudo do scope", "info", scope);

    const setStep = (key: string, status: RunStatus) =>
      set((s) =>
        s.run
          ? { run: { ...s.run, steps: s.run.steps.map((st) => (st.key === key ? { ...st, status } : st)) } }
          : {},
      );

    const runStep = async (key: string, fn: () => Promise<unknown>) => {
      setStep(key, "running");
      try {
        await fn();
        setStep(key, "done");
      } catch (err) {
        setStep(key, "failed");
        set((s) => (s.run ? { run: { ...s.run, finishedAt: nowIso() } } : {}));
        throw err;
      }
    };

    for (const step of specSteps) {
      const type = step.type;
      await runStep(step.key, () =>
        type === null ? get().generateConsolidatedSpec(options) : get().generateSpecification(type, options),
      );
    }
    await runStep("harness", () => get().generateHarness(options));
    await runStep("tasks", () => get().generateTasks(options));
    await runStep("artifacts", () =>
      get().generateProviderArtifacts(["claude", "cursor", "gpt", "gemini"]),
    );

    set((s) => (s.run ? { run: { ...s.run, finishedAt: nowIso() } } : {}));
    get().pushFeedback("Pipeline concluído", "done", `scope ${scope}`);
  },

  invariantIssues() {
    const { snapshot } = get();
    return snapshot ? checkProjectInvariants(snapshot) : [];
  },

  qualityReport() {
    const { snapshot } = get();
    if (!snapshot) return null;
    // Gates proporcionais ao scope: rodam sobre a iniciativa ativa (ou o projeto
    // inteiro quando não há iniciativa — comportamento V2).
    const init = get().activeInitiative();
    const view = init ? initiativeSnapshot(snapshot, init.id) : snapshot;
    return runKnowledgeGates(view, init?.scope);
  },

  specReport() {
    const { snapshot } = get();
    if (!snapshot) return null;
    const init = get().activeInitiative();
    const view = init ? initiativeSnapshot(snapshot, init.id) : snapshot;
    return runSpecGates(view, init?.scope);
  },
}));
