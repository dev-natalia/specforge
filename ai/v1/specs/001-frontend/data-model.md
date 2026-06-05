# Data Model — SpecForge

O SpecForge **não tem banco de dados** — é stateless. Não há entidades
persistidas. O "modelo de dados" é o conjunto de tipos em memória (no navegador,
via Zustand) e os contratos de request/response. Tipos em `lib/types.ts`.

---

## Tipos de Domínio

### WizardFormData
Dados coletados no wizard (etapas 1–4 + tópicos + clarificações).

```ts
type ProjectType =
  | "API_REST" | "FRONTEND" | "FULLSTACK" | "LIBRARY" | "CLI" | "OTHER";

interface WizardFormData {
  // Etapa 1
  projectName: string;
  description: string;
  projectType: ProjectType;
  // Etapa 2
  language: string;
  frameworks?: string;
  runtime?: string;
  database?: string;
  // Etapa 3
  architectureConventions?: string;
  constraints?: string;
  folderStructure?: string;
  // Etapa 4
  behaviorExamples?: string;
  businessRules?: string;
  edgeCases?: string;
  // Review
  customTopics?: CustomTopic[];
  clarifications?: Clarification[];
}
```

### CustomTopic
Tópico livre criado pelo usuário na etapa de review.

```ts
interface CustomTopic { id: string; title: string; content: string }
```

### Clarification
Pergunta de ambiguidade levantada pela IA + resposta do usuário.

```ts
interface Clarification { question: string; answer: string }
```

### GeneratedFile
Arquivo gerado (spec ou harness), usado no preview e no zip.

```ts
interface GeneratedFile { name: string; path: string; content: string; language: string }
```

### AnalysisFinding
Achado da análise de consistência entre specs e harness.

```ts
type AnalysisSeverity = "info" | "warning" | "error";
interface AnalysisFinding { severity: AnalysisSeverity; message: string }
```

---

## Estado do Wizard (Zustand)

```ts
interface WizardState {
  step: number;                       // 1..7
  formData: WizardFormData;
  generatedSpecs: GeneratedFile[] | null;
  generatedHarness: GeneratedFile[] | null;
  // ações: setStep, next/prev, updateForm, add/update/removeCustomTopic,
  // set/updateClarification, setSpecs, setHarness, hydrate, reset
}
```

Tudo vive em memória durante a sessão. Recarregar a página zera o estado.

---

## Dado sensível: chave BYOK

A chave da Anthropic do usuário **não** é um dado de domínio persistido. Ela fica
no `localStorage` do navegador (`lib/byok.ts`, chave `sddh_anthropic_key`) e é
usada direto no navegador (browser → Anthropic) — **nunca passa por servidor
nosso**, nem é gravada ou logada.
