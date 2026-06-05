# Tasks — SpecForge

Derivadas de `design.md`, `requirements.md` e `contracts/api.md`.
Refletem a arquitetura atual (stateless / BYOK). `[P]` = paralelizável.

---

## Grupo 0 — Setup
- [x] Next.js 14 + TypeScript estrito + Tailwind
- [x] ESLint + Prettier; Vitest
- [x] Dependências: `@anthropic-ai/sdk`, `jszip`, `shiki`, `zod`, `zustand`

## Grupo 1 — Fundação
- [x] Estrutura de pastas (`app/`, `components/`, `lib/`)
- [x] Tipos de domínio (`lib/types.ts`)
- [x] Componentes UI base (Button, Input, Textarea, Select, Badge, Card, Spinner, Progress)
- [x] Navbar + Footer (marca SpecForge)

## Grupo 2 — Utilitários
- [x] `lib/errors.ts` — `AppError` (client-safe)
- [x] `lib/ai/sanitize.ts` — sanitização anti prompt-injection

## Grupo 3 — BYOK
- [x] `lib/byok.ts` — helpers de localStorage
- [x] `components/settings/ApiKeySettings.tsx` + página `/settings`
- [x] `RequireApiKey` — gate do wizard
- [x] `validateAnthropicKey` — testa a chave (chamada mínima)

## Grupo 4 — IA (prompts + geração no cliente)
- [x] Prompts: `spec`, `harness` (guias+sensores+memória), `clarify`, `analyze`
- [x] `lib/ai/generate.ts` — `@anthropic-ai/sdk` no cliente, parsing robusto
- [x] `getClient(apiKey)` — `dangerouslyAllowBrowser` + header de acesso direto

## Grupo 5 — Camada client-side (`lib/api-client.ts`)
- [x] `generateSpecs`, `generateHarness`, `generateClarifications`
- [x] `analyzeConsistency`
- [x] `downloadZip` — monta o `.zip` no navegador (anti zip-slip)

## Grupo 6 — Wizard
- [x] Store Zustand + `canAdvance`
- [x] WizardStepper, WizardNav
- [x] Steps 1–4 (formulários)
- [x] `ClarifyQuestions`, `CustomTopics`
- [x] Preview: FileTree, FileViewer (Shiki lazy), FileTabList, FilePreview
- [x] Step5 (review + clarify + specs), Step6 (harness + análise), Step7 (download)
- [x] Container `/new` com `RequireApiKey`

## Grupo 7 — Páginas públicas
- [x] Landing (`/`)
- [x] Docs (`/docs`) — SDD, Harness, guia campo-a-campo, exemplos

## Grupo 8 — Testes
- [x] Parsing da resposta da IA (cercas internas)
- [x] Sanitização, zip (incl. anti zip-slip), store, Step1
- [x] `npm run typecheck` / `lint` / `test` verdes

## Grupo 9 — Polish & Deploy
- [x] Loading/error states nas chamadas de IA
- [x] Responsividade
- [x] Export estático (`output: "export"`) + `DEPLOY.md`
- [ ] Publicar em host estático (Cloudflare/GitHub Pages/Netlify) + smoke test
