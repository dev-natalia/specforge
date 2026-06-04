# Design — SpecForge

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 14+ (App Router) |
| Linguagem | TypeScript estrito |
| Estilo | Tailwind CSS |
| IA | Anthropic Claude via `@anthropic-ai/sdk` (direto), modelo `claude-opus-4-8` |
| Validação | Zod |
| Zip | JSZip (server-side) |
| Syntax Highlighting | Shiki (dynamic import) |
| Estado do Wizard | Zustand |
| Deploy | Vercel (estático + funções) |

**Sem** autenticação, banco de dados ou billing — app stateless/BYOK.

---

## Estrutura de Páginas

```
app/
  (public)/
    page.tsx                  # Landing (estática)
    docs/page.tsx             # Documentação (estática)
  (dashboard)/                # nome do grupo é histórico (não há proteção)
    new/
      layout.tsx
      page.tsx                # Wizard (gated por RequireApiKey)
    settings/
      page.tsx                # Gerenciar a chave BYOK
```

Não há `app/api/` — o app é estático (`output: "export"`) e toda a geração roda
no cliente.

---

## Componentes (principais)

```
components/
  layout/   Navbar, Footer
  ui/       Button, Input, Textarea, Select, Badge, Card, Spinner, Progress
  wizard/   WizardStepper, WizardNav, RequireApiKey, CustomTopics,
            ClarifyQuestions, ConsistencyAnalysis, steps/Step1..Step7
  preview/  FileTree, FileViewer (Shiki), FileTabList, FilePreview
  settings/ ApiKeySettings
```

---

## Fluxo de Dados do Wizard (Zustand, em memória)

```
WizardState
  ├── step: 1..7
  ├── formData: WizardFormData   # ver data-model.md
  ├── generatedSpecs: File[] | null
  └── generatedHarness: File[] | null

type File = { name, path, content, language }
```

Não há persistência: ao recarregar a página, o estado se perde (by design).

---

## Fluxo de Geração (no cliente)

Não há API routes. `lib/api-client.ts` obtém a chave do `localStorage` e chama as
funções de `lib/ai/generate.ts`, que falam direto com a Anthropic do navegador.
Ver `contracts/api.md`.

```
Etapa 5:
  generateClarifications(formData)        -> string[]
  generateSpecs(formData)                 -> File[]

Etapa 6:
  generateHarness(formData, specs)        -> File[]
  analyzeConsistency(specs, harness)      -> AnalysisFinding[]

Etapa 7:
  downloadZip(files, name)                -> baixa o .zip (montado no cliente)

Configurações:
  validateAnthropicKey(key)               -> valida a chave
```

---

## Modelo de Acesso

- Sem login, sem backend, sem rate limit de servidor. Cada usuário usa/paga a
  própria conta da Anthropic.
- Gate de produto: `/new` só libera o wizard após a chave estar configurada
  (`RequireApiKey`).

---

## Decisões de Arquitetura

### Estático + geração no cliente
`output: "export"` gera um site 100% estático. A geração roda no navegador
(browser → Anthropic, `dangerouslyAllowBrowser` + header de acesso direto). Isso
**elimina o timeout** de funções serverless (a geração pode levar minutos) e
permite hospedar de graça em qualquer host estático. Ver `../../DEPLOY.md`.

### Stateless + BYOK
Sem login/banco/billing. A chave da Anthropic vive só no navegador e **nunca
passa por servidor nosso**. Tradeoff aceito: prompts e sanitização ficam no
cliente (não são segredo).

### IA via SDK oficial
`@anthropic-ai/sdk` no cliente; o modelo `claude-opus-4-8` rejeita `temperature`.
A resposta é JSON e o parsing é robusto a cercas de código internas.

### Geração de Zip
No navegador com JSZip; remove segmentos de path traversal (anti zip-slip).

### Shiki lazy
Carregado via `await import("shiki")` dentro da função. Import de topo quebraria
o build (export estático SSR-renderiza as páginas).
