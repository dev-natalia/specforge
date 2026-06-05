# CLAUDE.md — SpecForge

Este arquivo é o guia principal (harness) para agentes de IA trabalhando neste
projeto. Leia completamente antes de escrever qualquer código.

> **Tagline:** Especifique. Forje. Gere.

---

## O que é este projeto

**SpecForge** é uma aplicação web Next.js que guia o usuário num wizard para
gerar **specs** (Spec-Driven Development) e **harness** (Harness Engineering).
O output é um `.zip` com os arquivos prontos para uso com agentes de IA.

Arquitetura-chave:
- **100% estático** (`output: "export"` → pasta `out/`). Sem backend, sem
  funções serverless, sem banco, sem variáveis de ambiente.
- **BYOK** (Bring Your Own Key): a geração roda **no navegador** — o browser
  chama a API da Anthropic direto, com a chave do próprio usuário. Não há
  servidor nosso no meio (logo, sem timeout de função).
- **Stateless**: nada é persistido; sem login.

---

## Stack Obrigatória

- **Framework:** Next.js 14+ com App Router, **export estático** (`output: "export"`)
- **Linguagem:** TypeScript estrito (`strict: true`)
- **Estilo:** Tailwind CSS (sem CSS modules / styled-components)
- **IA:** `@anthropic-ai/sdk` chamado **no cliente** (`dangerouslyAllowBrowser`),
  modelo `claude-opus-4-8`
- **Zip:** JSZip (no navegador)
- **Syntax Highlighting:** Shiki (import **lazy** — ver abaixo)
- **Estado do Wizard:** Zustand

**Sem:** backend/API routes, autenticação, banco, billing. Não reintroduza
nenhum desses sem alinhar — a simplicidade estática/BYOK é intencional.

---

## Estrutura de Pastas

```
app/
  (public)/         # landing (/) e docs (/docs)
  (dashboard)/      # /new (wizard) e /settings (nome do grupo é histórico)
components/
  layout/  ui/  wizard/  preview/  settings/
lib/
  ai/               # prompts/ + generate.ts (roda no cliente) + sanitize.ts
  zip/              # geração do zip (no cliente)
  wizard/           # store Zustand + steps
  docs/             # dados do guia campo-a-campo
  utils/            # cn.ts
  byok.ts  types.ts  errors.ts  api-client.ts  shiki.ts
specs/              # specs ORIGINAIS do projeto (não apagar) — ver nota
```

> **Não há `app/api/`** — o app é estático e a geração é client-side.
>
> **Nota sobre `specs/`:** descrevem a visão original (com Clerk/Prisma/billing,
> depois removidos). O código + este CLAUDE.md são a fonte da verdade atual.

---

## Regras Obrigatórias

### TypeScript
- Sem `any` — use `unknown` e faça type narrowing
- Tipos explícitos em todas as funções
- Interfaces para objetos de domínio, types para unions/utilitários

### Componentes
- Server Components por padrão; `"use client"` quando necessário
- Nenhuma lógica de negócio em componentes — mova para `lib/`
- Props tipadas com interface, nunca inline
- O app é exportado estaticamente: não use recursos que exijam servidor
  (API routes, `cookies()`, `headers()`, `dynamic = "force-dynamic"`, etc)

### Geração de IA (no cliente)
- A geração roda no navegador via `lib/ai/generate.ts` → `lib/api-client.ts`
- `getClient(apiKey)` cria o `Anthropic` com `dangerouslyAllowBrowser: true` e o
  header `anthropic-dangerous-direct-browser-access` (habilita o CORS da Anthropic
  para apps BYOK). A chave vem do `localStorage` (`lib/byok.ts`)
- O modelo `claude-opus-4-8` **rejeita `temperature`** — não envie esse parâmetro
- A IA responde JSON; `parseFilesResponse`/`parseJsonObject` extraem de forma
  robusta (removem cerca ``` só quando envolve tudo; recortam de `{` a `}`)
- Erros usam `AppError` (`lib/errors.ts`), com `code` e mensagem segura

### Chave BYOK
- Fica **só no navegador** (`localStorage`, `lib/byok.ts`)
- Como a chamada é browser → Anthropic, a chave **nunca passa por servidor
  nosso** e nunca é logada/persistida
- `/new` exige a chave configurada antes de liberar o wizard (`RequireApiKey`)

### Geração de ZIP
- Montado **no navegador** com JSZip (`lib/zip/generate-zip.ts`) e baixado via
  `URL.createObjectURL`
- Remova segmentos de path traversal (`..`, `.`) ao montar (anti zip-slip)

### Shiki
- **DEVE** ser carregado via `await import("shiki")` dentro da função em
  `lib/shiki.ts` — nunca import de topo. É ESM-only e só roda no cliente; import
  de topo quebra o build (export estático SSR-renderiza as páginas)

---

## Segurança

- **Prompt injection:** sanitize todo campo livre com `lib/ai/sanitize.ts` (trim,
  limite 2000 chars, remoção de controle e `<>`, neutralização de sequências
  suspeitas). O system prompt deixa claro que o conteúdo do usuário é dado, não
  instrução
- **Erros:** use `AppError`; não vaze stack traces na UI; nunca logue a chave
  (erros de auth viram `INVALID_API_KEY`)
- **Prompts no cliente:** como tudo roda no navegador, os prompts e a sanitização
  ficam visíveis no bundle. Não são segredo — não coloque nada sensível neles
- **HTTPS:** em produção, hospede com HTTPS para a chave do usuário trafegar com
  segurança até a Anthropic

---

## Fluxo de Geração

- Prompts em `lib/ai/prompts/`: `spec`, `harness`, `clarify`, `analyze`
- `lib/ai/generate.ts` (cliente) chama o `@anthropic-ai/sdk`. Funções:
  `generateSpecFiles`, `generateHarnessFiles`, `generateClarifications`,
  `analyzeConsistency`, `validateApiKey`
- `lib/api-client.ts` (cliente) obtém a chave do `localStorage` e chama essas
  funções; também monta o zip e dispara o download
- Specs/harness retornam `File[]` = `{ name, path, content, language }`;
  `clarify` → `{ questions }`; `analyze` → `{ findings }`

---

## Convenções de Nomenclatura

- Componentes: PascalCase; Hooks: `useX`; Utils: camelCase;
  Constantes: SCREAMING_SNAKE_CASE; Tipos/Interfaces: PascalCase
- Arquivos de rota: `page.tsx`, `layout.tsx`

---

## O que NÃO fazer

- Não use Pages Router (`pages/`)
- **Não reintroduza backend** (API routes, banco, auth, billing) sem alinhamento
  — o app é estático/BYOK e a geração é no cliente
- Não use recursos server-only (incompatíveis com `output: "export"`)
- Não salve/persista nada — não há banco
- Não logue a chave BYOK do usuário
- Não importe `shiki` no topo de módulo (use dynamic import)
- Não adicione dependências sem necessidade clara

---

## Variáveis de Ambiente

Nenhuma. A chave da Anthropic é do usuário (BYOK), informada em Configurações e
mantida só no navegador. Ver `.env.example`.

---

## Testes & Qualidade

Antes de qualquer commit, deixe verdes:
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build` (deve gerar `out/`)
