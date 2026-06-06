"use client";

// Formulários de criação/edição dos objetos de conhecimento (Fase 1).
// Cada form devolve um Record<string, unknown> pronto para addKnowledge/updateKnowledge.
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

// Converte texto multilinha ⇄ array de strings (para campos de lista).
function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
function arrayToLines(value: unknown): string {
  return Array.isArray(value) ? value.join("\n") : "";
}

interface FormProps {
  initial?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function FormActions({
  onCancel,
  submitting,
  disabled,
}: {
  onCancel: () => void;
  submitting?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 pt-1">
      <span className="text-xs text-slate-400">
        <span className="text-red-500">*</span> campo obrigatório
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={submitting || disabled}>
          Salvar
        </Button>
      </div>
    </div>
  );
}

const DISCOVERY_CATEGORIES = [
  { value: "user", label: "Usuário" },
  { value: "product", label: "Produto" },
  { value: "technical", label: "Técnica" },
  { value: "architecture", label: "Arquitetura" },
  { value: "business", label: "Negócio" },
  { value: "process", label: "Processo" },
];
export function DiscoveryForm({ initial, onSubmit, onCancel, submitting }: FormProps) {
  const [title, setTitle] = useState((initial?.title as string) ?? "");
  const [category, setCategory] = useState((initial?.category as string) ?? "user");
  const [description, setDescription] = useState((initial?.description as string) ?? "");
  const [evidence, setEvidence] = useState((initial?.evidence as string) ?? "");
  const [implications, setImplications] = useState((initial?.implications as string) ?? "");

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title, category, description, evidence, implications,
          traceRefs: (initial?.traceRefs as string[]) ?? [],
        });
      }}
    >
      <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Select label="Categoria" options={DISCOVERY_CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value)} />
      <Textarea label="O que foi aprendido" required value={description} onChange={(e) => setDescription(e.target.value)} />
      <Textarea label="Evidência" rows={2} value={evidence} onChange={(e) => setEvidence(e.target.value)} />
      <Textarea label="Implicações" rows={2} value={implications} onChange={(e) => setImplications(e.target.value)} />
      <FormActions onCancel={onCancel} submitting={submitting} disabled={!title.trim() || !description.trim()} />
    </form>
  );
}

const DECISION_CATEGORIES = [
  { value: "product", label: "Produto" },
  { value: "technical", label: "Técnica" },
  { value: "architecture", label: "Arquitetura" },
  { value: "process", label: "Processo" },
  { value: "business", label: "Negócio" },
];

export function DecisionForm({ initial, onSubmit, onCancel, submitting }: FormProps) {
  const [title, setTitle] = useState((initial?.title as string) ?? "");
  const [category, setCategory] = useState((initial?.category as string) ?? "product");
  const [context, setContext] = useState((initial?.context as string) ?? "");
  const [decision, setDecision] = useState((initial?.decision as string) ?? "");
  const [rationale, setRationale] = useState((initial?.rationale as string) ?? "");
  const [alternatives, setAlternatives] = useState(arrayToLines(initial?.alternatives));
  const [tradeoffs, setTradeoffs] = useState((initial?.tradeoffs as string) ?? "");
  const [consequences, setConsequences] = useState((initial?.consequences as string) ?? "");

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title, category, context, decision, rationale,
          alternatives: linesToArray(alternatives), tradeoffs, consequences,
          traceRefs: (initial?.traceRefs as string[]) ?? [],
        });
      }}
    >
      <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Select label="Categoria" options={DECISION_CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value)} />
      <Textarea label="Contexto (que problema resolve?)" value={context} onChange={(e) => setContext(e.target.value)} />
      <Textarea label="Decisão (o que foi escolhido?)" required value={decision} onChange={(e) => setDecision(e.target.value)} />
      <Textarea label="Racional (por quê?)" required value={rationale} onChange={(e) => setRationale(e.target.value)} />
      <Textarea label="Alternativas (uma por linha)" rows={2} value={alternatives} onChange={(e) => setAlternatives(e.target.value)} />
      <Textarea label="Tradeoffs" rows={2} value={tradeoffs} onChange={(e) => setTradeoffs(e.target.value)} />
      <Textarea label="Consequências" rows={2} value={consequences} onChange={(e) => setConsequences(e.target.value)} />
      <FormActions onCancel={onCancel} submitting={submitting} disabled={!title.trim() || !decision.trim() || !rationale.trim()} />
    </form>
  );
}

export function ConstraintForm({ initial, onSubmit, onCancel, submitting }: FormProps) {
  const [title, setTitle] = useState((initial?.title as string) ?? "");
  const [statement, setStatement] = useState((initial?.statement as string) ?? "");
  const [rationale, setRationale] = useState((initial?.rationale as string) ?? "");

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title, statement, rationale,
          traceRefs: (initial?.traceRefs as string[]) ?? [],
        });
      }}
    >
      <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea label="Enunciado" required value={statement} onChange={(e) => setStatement(e.target.value)} />
      <Textarea label="Racional" rows={2} value={rationale} onChange={(e) => setRationale(e.target.value)} />
      <FormActions onCancel={onCancel} submitting={submitting} disabled={!title.trim() || !statement.trim()} />
    </form>
  );
}

export function ProductDnaForm({ initial, onSubmit, onCancel, submitting }: FormProps) {
  const [mission, setMission] = useState((initial?.mission as string) ?? "");
  const [vision, setVision] = useState((initial?.vision as string) ?? "");
  const [problemStatement, setProblemStatement] = useState((initial?.problemStatement as string) ?? "");
  const [audience, setAudience] = useState((initial?.audience as string) ?? "");
  const [principles, setPrinciples] = useState(arrayToLines(initial?.principles));
  const [constraints, setConstraints] = useState(arrayToLines(initial?.constraints));
  const [nonGoals, setNonGoals] = useState(arrayToLines(initial?.nonGoals));

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          mission, vision, problemStatement, audience,
          principles: linesToArray(principles),
          constraints: linesToArray(constraints),
          nonGoals: linesToArray(nonGoals),
          traceRefs: (initial?.traceRefs as string[]) ?? [],
        });
      }}
    >
      <Textarea label="Missão" rows={2} required value={mission} onChange={(e) => setMission(e.target.value)} />
      <Textarea label="Visão" rows={2} value={vision} onChange={(e) => setVision(e.target.value)} />
      <Textarea label="Problema" rows={2} value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} />
      <Input label="Público-alvo" value={audience} onChange={(e) => setAudience(e.target.value)} />
      <Textarea label="Princípios (um por linha)" rows={3} value={principles} onChange={(e) => setPrinciples(e.target.value)} />
      <Textarea label="Constraints (uma por linha)" rows={3} value={constraints} onChange={(e) => setConstraints(e.target.value)} />
      <Textarea label="Não-objetivos (um por linha)" rows={3} value={nonGoals} onChange={(e) => setNonGoals(e.target.value)} />
      <FormActions onCancel={onCancel} submitting={submitting} disabled={!mission.trim()} />
    </form>
  );
}
