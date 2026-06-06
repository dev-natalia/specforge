"use client";

// Shell do Workspace knowledge-first (Fase 1). Abas por tipo de conhecimento;
// painel de edição inline; persistência automática via store (IndexedDB).
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useWorkspaceStore } from "@/lib/workspace/store";
import { downloadProjectZip } from "@/lib/workspace/download";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { KnowledgeCard } from "@/components/workspace/KnowledgeCard";
import { InitiativesBar } from "@/components/workspace/InitiativesBar";
import { GenerationFeedback } from "@/components/workspace/GenerationFeedback";
import { GenerationStatus } from "@/components/workspace/GenerationStatus";
import { ClarifyPanel } from "@/components/workspace/ClarifyPanel";
import { SpecsPanel } from "@/components/workspace/SpecsPanel";
import { HarnessPanel } from "@/components/workspace/HarnessPanel";
import { TasksPanel } from "@/components/workspace/TasksPanel";
import {
  DiscoveryForm,
  DecisionForm,
  ConstraintForm,
  ProductDnaForm,
} from "@/components/workspace/forms";
import { initiativeSnapshot } from "@/lib/domain/project";
import type { KnowledgeObject, KnowledgeKind } from "@/lib/domain/knowledge";

type TabKey =
  | "clarify"
  | "discovery"
  | "decision"
  | "productDna"
  | "constraint"
  | "specs"
  | "harness"
  | "tasks";

const TABS: { key: TabKey; label: string }[] = [
  { key: "clarify", label: "Clarificação" },
  { key: "discovery", label: "Discoveries" },
  { key: "decision", label: "Decisões" },
  { key: "productDna", label: "Product DNA" },
  { key: "constraint", label: "Constraints" },
  { key: "specs", label: "Specs" },
  { key: "harness", label: "Harness" },
  { key: "tasks", label: "Tasks" },
];

interface EditorState {
  kind: KnowledgeKind;
  id?: string;
  initial?: Record<string, unknown>;
}

export function Workspace({ projectId }: { projectId: string }) {
  const snapshot = useWorkspaceStore((s) => s.snapshot);
  const activeInitiativeId = useWorkspaceStore((s) => s.activeInitiativeId);
  const loading = useWorkspaceStore((s) => s.loading);
  const error = useWorkspaceStore((s) => s.error);
  const openProject = useWorkspaceStore((s) => s.openProject);
  const addKnowledge = useWorkspaceStore((s) => s.addKnowledge);
  const updateKnowledge = useWorkspaceStore((s) => s.updateKnowledge);
  const removeKnowledge = useWorkspaceStore((s) => s.removeKnowledge);
  const invariantIssues = useWorkspaceStore((s) => s.invariantIssues);
  const qualityReport = useWorkspaceStore((s) => s.qualityReport);

  const [tab, setTab] = useState<TabKey>("clarify");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [saving, setSaving] = useState(false);
  // Acordeão da lista de conhecimento: no máximo um card expandido por vez.
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  // Container do formulário inline — usado para rolar até ele ao editar/criar.
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void openProject(projectId);
  }, [projectId, openProject]);

  // Ao abrir o formulário (editar ou adicionar), rola a tela até ele.
  useEffect(() => {
    if (editor) formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [editor]);

  // View recortada para a iniciativa ativa: abas/painéis operam só sobre ela.
  const view = useMemo(
    () => (snapshot && activeInitiativeId ? initiativeSnapshot(snapshot, activeInitiativeId) : null),
    [snapshot, activeInitiativeId],
  );

  if (loading && !snapshot) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Spinner className="h-4 w-4" /> Carregando projeto…
      </div>
    );
  }

  if (error && !snapshot) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/projects" className="text-sm font-medium text-brand-600 underline">
          Voltar aos projetos
        </Link>
      </div>
    );
  }

  if (!snapshot) return null;

  const items = (view?.knowledge ?? []).filter((i) => i.kind === tab);
  const productDna = view?.knowledge.find((i) => i.kind === "productDna");
  const issues = invariantIssues();
  const report = qualityReport();
  const failingGates = report?.results.filter((r) => r.outcome !== "pass") ?? [];

  async function handleSubmit(data: Record<string, unknown>) {
    if (!editor) return;
    setSaving(true);
    try {
      if (editor.id) await updateKnowledge(editor.id, data);
      else await addKnowledge(editor.kind, data);
      setEditor(null);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: KnowledgeObject) {
    setEditor({ kind: item.kind, id: item.id, initial: item as unknown as Record<string, unknown> });
  }

  function renderForm() {
    if (!editor) return null;
    const common = {
      initial: editor.initial,
      submitting: saving,
      onCancel: () => setEditor(null),
      onSubmit: handleSubmit,
    };
    switch (editor.kind) {
      case "discovery":
        return <DiscoveryForm {...common} />;
      case "decision":
        return <DecisionForm {...common} />;
      case "constraint":
        return <ConstraintForm {...common} />;
      case "productDna":
        return <ProductDnaForm {...common} />;
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho do projeto */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400">{snapshot.project.id}</span>
            {issues.length === 0 ? (
              <Badge variant="success">Rastreabilidade ok</Badge>
            ) : (
              <Badge variant="warning">{issues.length} alerta(s)</Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{snapshot.project.name}</h1>
          {snapshot.project.description && (
            <p className="text-sm text-slate-500">{snapshot.project.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href="/projects">
            <Button variant="ghost" size="sm">Projetos</Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => void downloadProjectZip(snapshot)}>
            Exportar .zip
          </Button>
        </div>
      </div>

      {/* Iniciativas (V3): scope por iniciativa */}
      <InitiativesBar snapshot={snapshot} />

      {!view ? (
        snapshot.initiatives.length > 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            Selecione uma iniciativa acima para trabalhar.
          </p>
        ) : null
      ) : (
        <div className="space-y-6">
      {/* Status: arquivos geráveis da iniciativa (verde quando gerados) */}
      <GenerationStatus snapshot={view} />

      {/* Feedback de geração (atividade + validação) */}
      <GenerationFeedback />

      {/* Resumo de quality gates */}
      {failingGates.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
          <p className="text-xs font-medium text-amber-800">Quality gates</p>
          <ul className="mt-1 space-y-0.5">
            {failingGates.map((g) => (
              <li key={g.id} className="text-xs text-amber-700">
                <span className="font-medium">{g.label}:</span> {g.outcome}
                {g.issues[0] ? ` — ${g.issues[0].message}` : ""}
                {g.issues.length > 1 ? ` (+${g.issues.length - 1})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Abas */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setEditor(null);
              setOpenCardId(null);
            }}
            className={
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors " +
              (tab === t.key
                ? "border-brand-500 text-brand-700"
                : "border-transparent text-slate-500 hover:text-slate-800")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba */}
      {tab === "clarify" ? (
        <ClarifyPanel snapshot={view} />
      ) : tab === "specs" ? (
        <SpecsPanel snapshot={view} />
      ) : tab === "harness" ? (
        <HarnessPanel snapshot={view} />
      ) : tab === "tasks" ? (
        <TasksPanel snapshot={view} />
      ) : tab === "productDna" ? (
        <div className="space-y-4">
          {editor?.kind === "productDna" ? (
            <div ref={formRef} className="rounded-lg border border-slate-200 bg-white p-5">{renderForm()}</div>
          ) : productDna ? (
            <KnowledgeCard
              item={productDna}
              onEdit={() => startEdit(productDna)}
              onRemove={() => void removeKnowledge(productDna.id)}
            />
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
              <p className="text-sm text-slate-500">O Product DNA define a identidade do projeto.</p>
              <Button className="mt-3" size="sm" onClick={() => setEditor({ kind: "productDna" })}>
                Definir Product DNA
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{items.length} item(ns)</p>
            {!editor && (
              <Button size="sm" onClick={() => setEditor({ kind: tab })}>
                Adicionar
              </Button>
            )}
          </div>

          {editor && editor.kind === tab && (
            <div ref={formRef} className="rounded-lg border border-slate-200 bg-white p-5">{renderForm()}</div>
          )}

          {items.length === 0 && !editor && (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
              Nenhum item ainda.
            </div>
          )}

          <div className="grid gap-3">
            {items.map((item) => (
              <KnowledgeCard
                key={item.id}
                item={item}
                open={openCardId === item.id}
                onToggle={() =>
                  setOpenCardId((id) => (id === item.id ? null : item.id))
                }
                onEdit={() => startEdit(item)}
                onRemove={() => void removeKnowledge(item.id)}
              />
            ))}
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
}
