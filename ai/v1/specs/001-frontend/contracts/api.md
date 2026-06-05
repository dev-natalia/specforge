# Contratos — SpecForge (client-side)

O SpecForge **não tem backend**. Não existem API routes. A geração roda no
**navegador**: o browser chama a API da Anthropic direto, com a chave BYOK do
usuário. Os "contratos" abaixo são as funções client-side de `lib/api-client.ts`
(que delegam para `lib/ai/generate.ts`) e o tipo `File`.

```ts
type File = { name: string; path: string; content: string; language: string };
```

Todas exigem a chave da Anthropic no `localStorage` (senão lançam `AppError`
`INVALID_API_KEY`). A chamada é feita com `dangerouslyAllowBrowser` + o header
`anthropic-dangerous-direct-browser-access` (CORS da Anthropic para apps BYOK).

---

## generateClarifications(formData) → string[]
Levanta 3–5 perguntas de ambiguidade a partir dos dados do wizard.

## generateSpecs(formData) → File[]
Gera os arquivos de spec.

## generateHarness(formData, specs: File[]) → File[]
Gera o harness a partir dos specs aprovados.

## analyzeConsistency(specs: File[], harness: File[]) → AnalysisFinding[]
Cruza specs × harness. `AnalysisFinding = { severity: "info"|"warning"|"error", message }`.

## validateAnthropicKey(key) → void
Testa a chave (chamada mínima ao modelo). Lança `AppError` se inválida.

## downloadZip(files: {path, content}[], name?) → void
Monta o `.zip` no navegador (JSZip), removendo segmentos de path traversal, e
dispara o download via `URL.createObjectURL`.

---

## Modelo & configuração
- Modelo: `claude-opus-4-8` (todas as etapas)
- `max_tokens`: 16.000 (specs/harness), 1.500 (clarify), 2.000 (analyze)
- `temperature`: não enviado (o modelo rejeita)
- Saída: JSON → parseado em `File[]` por `parseFilesResponse`/`parseJsonObject`
  (robusto a cercas ``` internas no conteúdo dos arquivos)

## Tratamento de erros
- `AppError` (`lib/errors.ts`) com `code` (`INVALID_API_KEY` | `AI_ERROR` |
  `INVALID_INPUT`) e mensagem segura. A UI lê `err.message`.
- A chave do usuário nunca é logada.
