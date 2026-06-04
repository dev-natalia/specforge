# Deploy do SpecForge

O SpecForge é um app Next.js **100% estático**: `next build` (com
`output: "export"`) gera a pasta `out/` com HTML/JS/CSS puro. **Não há
servidor, funções, banco nem variáveis de ambiente.**

A geração roda inteiramente no **navegador** (browser → API da Anthropic, com a
chave BYOK do usuário). Por isso **não existe timeout de função** — a geração
pode levar o tempo que precisar.

---

## Onde hospedar (grátis, sem timeout)

Qualquer host de site estático serve. Recomendados:

- **Cloudflare Pages** — grátis, sem restrição de uso comercial, build
  integrado. (Build: `npm run build`, output dir: `out`)
- **GitHub Pages** — grátis; publique a pasta `out/`
- **Netlify** — grátis (Build: `next build`, publish: `out`)
- **Vercel** — grátis; detecta Next e serve estático. Como não há funções, o
  limite de timeout não se aplica

> Nenhum desses precisa de plano pago para o SpecForge funcionar, porque não há
> backend.

---

## Passo a passo (genérico)

1. **Versionar com Git**:
   ```bash
   git init && git add . && git commit -m "SpecForge"
   ```
   Crie um repositório (GitHub/GitLab) e dê push. O `.gitignore` já protege
   `node_modules`, `.next`, `out` e `.env*`.

2. **Conectar ao host** (ex: Cloudflare Pages):
   - Framework preset: **Next.js (Static HTML Export)** ou similar
   - Build command: `npm run build`
   - Output directory: `out`
   - Variáveis de ambiente: **nenhuma**

3. **Deploy.**

Para publicar manualmente, basta servir o conteúdo de `out/` em qualquer
hospedagem estática.

---

## Checklist antes de subir

- [ ] `npm run typecheck` verde
- [ ] `npm run lint` verde
- [ ] `npm run test` verde
- [ ] `npm run build` gera `out/` sem erros
- [ ] Nenhum segredo commitado (`.env*` ignorados; não há env de produção)
- [ ] Node 22.x (em `engines` no `package.json` e `.nvmrc`) para o build

---

## Notas

- **BYOK no cliente:** a chave da Anthropic fica no `localStorage` do navegador
  e a chamada é direta do browser para a Anthropic (header
  `anthropic-dangerous-direct-browser-access`). Os prompts e a sanitização rodam
  no cliente — não são segredo.
- **Sem rate limit de servidor:** não há servidor. Cada usuário usa e paga a
  própria conta da Anthropic.
- **HTTPS:** use um host com HTTPS (todos os recomendados têm) para a chave do
  usuário trafegar com segurança até a Anthropic.
