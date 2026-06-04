<div align="center">

<img src="public/specforge-logo.png" width="180" alt="SpecForge" />

# SpecForge

**Especifique. Forje. Gere.**

Gere _specs_ (Spec-Driven Development) e _harness_ (Harness Engineering) para
seus agentes de IA — direto no navegador, com a sua própria chave da Anthropic.

</div>

---

## O que é

O **SpecForge** guia você por um wizard e, a partir das informações do seu
projeto, gera:

- **Specs (SDD):** `spec.md`, `requirements.md`, `design.md`, `tasks.md`
- **Harness:** `CLAUDE.md`, `AGENTS.md` (com papéis implementador/validador),
  configs de lint, CI, testes estruturais, `PROGRESS.md` e script de bootstrap

O resultado é um `.zip` pronto para jogar no seu repositório e usar com qualquer
agente de IA (Claude Code, Cursor, Copilot, etc).

## Como funciona

- 🧊 **100% estático** — `next build` (`output: "export"`) gera arquivos
  estáticos. Sem backend, banco, login ou variáveis de ambiente.
- 🔑 **BYOK (Bring Your Own Key)** — a geração roda **no seu navegador**: o
  browser chama a API da Anthropic direto, com a sua chave. Sem servidor no meio
  (logo, **sem timeout** — a geração pode levar o tempo que precisar).
- 🔒 **Privado** — a chave fica só no `localStorage` do seu navegador. **Nunca**
  passa por um servidor nosso, nem é gravada ou logada.

> Modelo usado: **Claude Opus 4.8** (`claude-opus-4-8`).

## Recursos

- Wizard de 7 etapas com validação e barra de progresso
- **Clarificação:** a IA levanta as ambiguidades que ficaram em aberto
- **Tópicos adicionais** livres para o que não couber nos campos padrão
- Preview dos arquivos com syntax highlighting (Shiki)
- **Análise de consistência** entre specs e harness
- Download do `.zip` montado no navegador
- Documentação embutida (`/docs`): SDD, Harness Engineering e guia campo-a-campo

## Stack

Next.js 14 (App Router, export estático) · TypeScript · Tailwind CSS ·
`@anthropic-ai/sdk` (no cliente) · JSZip · Shiki · Zustand

## Rodando localmente

```bash
npm install
npm run dev
```

Abra <http://localhost:3000>, vá em **Configurações** e cole a sua chave da
Anthropic (`sk-ant-...`). Crie uma em
[console.anthropic.com](https://console.anthropic.com) → _API Keys_.

## Build & Deploy

```bash
npm run build   # gera a pasta out/ (site estático)
```

Hospede o conteúdo de `out/` em qualquer host estático (Vercel, Cloudflare
Pages, GitHub Pages, Netlify). Passo a passo em **[DEPLOY.md](DEPLOY.md)**.

## Scripts

| Comando             | O que faz                          |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento        |
| `npm run build`     | Build estático (gera `out/`)       |
| `npm run test`      | Testes (Vitest)                    |
| `npm run lint`      | ESLint                             |
| `npm run typecheck` | Checagem de tipos (TypeScript)     |

## Estrutura

```
app/          # páginas (landing, docs, /new, /settings)
components/   # layout, ui, wizard, preview, settings
lib/
  ai/         # prompts + geração (roda no cliente) + sanitização
  zip/        # geração do .zip
  wizard/     # store Zustand
  byok.ts     # chave do usuário (localStorage)
specs/        # specs SDD do próprio projeto
```

Para agentes de IA trabalhando neste repositório, o guia principal é o
[`CLAUDE.md`](CLAUDE.md).

## Privacidade & Segurança

- A chave da Anthropic é **sua** e fica **só no seu navegador**.
- A geração é uma chamada direta **navegador → Anthropic** — nada de chaves ou
  prompts passando por um servidor de terceiros.
- Inputs livres são sanitizados antes de montar os prompts (anti prompt
  injection); o `.zip` é montado removendo path traversal (anti zip-slip).
- Use sempre via **HTTPS** em produção.
