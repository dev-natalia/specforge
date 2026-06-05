# Requirements — SpecForge

## Requisitos Funcionais

### RF01 — Páginas Públicas
| ID | Requisito |
|----|-----------|
| RF01.1 | Landing (`/`) com apresentação, "como funciona" e CTA |
| RF01.2 | Docs (`/docs`) com SDD, Harness Engineering, guia do wizard e exemplos |

### RF02 — Chave da Anthropic (BYOK)
| ID | Requisito |
|----|-----------|
| RF02.1 | Tela `/settings` para informar, testar e remover a chave |
| RF02.2 | A chave fica só no navegador (localStorage) e a chamada é browser → Anthropic |
| RF02.3 | Função de validação da chave (`validateAnthropicKey`, chamada mínima ao modelo) |
| RF02.4 | A chave nunca passa por servidor nosso nem é logada |
| RF02.5 | `/new` exige a chave configurada antes de liberar o wizard |

### RF03 — Wizard (7 etapas)
| ID | Etapa | Requisito |
|----|-------|-----------|
| RF03.1 | 1 — Projeto | Nome (obrigatório), descrição (obrigatório), tipo |
| RF03.2 | 2 — Stack & Tech | Linguagem (obrigatório), frameworks, runtime, banco |
| RF03.3 | 3 — Arquitetura | Convenções, constraints, estrutura de pastas (opcionais) |
| RF03.4 | 4 — Comportamento | Inputs/outputs, regras de negócio, edge cases (opcionais) |
| RF03.5 | 5 — Review & Specs | Resumo, clarificação, tópicos adicionais, gerar specs, preview |
| RF03.6 | 6 — Harness | Gerar harness dos specs aprovados, preview, análise de consistência |
| RF03.7 | 7 — Download | Preview final → baixar `.zip` |
| RF03.8 | — | Navegação livre entre etapas 1–4; validação por etapa |
| RF03.9 | — | Estado do wizard em memória durante a sessão |
| RF03.10 | — | Barra de progresso |
| RF03.11 | — | Tópicos adicionais livres (`{título, conteúdo}`) na etapa de review |

### RF04 — Clarificação
| ID | Requisito |
|----|-----------|
| RF04.1 | `generateClarifications(formData)` retorna 3–5 perguntas de ambiguidade |
| RF04.2 | As respostas do usuário entram no contexto da geração de specs |

### RF05 — Geração de Specs e Harness
| ID | Requisito |
|----|-----------|
| RF05.1 | `generateSpecs(formData)` retorna `File[]` (`{ name, path, content, language }`) |
| RF05.2 | `generateHarness(formData, specs)` recebe specs aprovados + dados e retorna `File[]` |
| RF05.3 | Preview com syntax highlighting (Shiki); botão Regenerar |
| RF05.4 | Harness inclui guias (CLAUDE.md, AGENTS.md com papéis), sensores (lint/CI/testes) e memória (PROGRESS.md, bootstrap) |

### RF06 — Análise de Consistência
| ID | Requisito |
|----|-----------|
| RF06.1 | `analyzeConsistency(specs, harness)` cruza specs × harness e retorna achados `{ severity, message }` |
| RF06.2 | Informativo (não bloqueia o download) |

### RF07 — Download
| ID | Requisito |
|----|-----------|
| RF07.1 | `downloadZip(files, name)` empacota e baixa o `.zip` (montado no navegador) |
| RF07.2 | Download disparado no browser |

---

## Requisitos Não-Funcionais

### RNF01 — Performance
- Páginas públicas (`/`, `/docs`) são estáticas e carregam rápido
- Loading states explícitos durante chamadas à IA (podem levar vários minutos)

### RNF02 — Usabilidade
- Interface responsiva (mobile e desktop)
- Wizard não perde dados ao navegar
- Mensagens de erro claras e acionáveis

### RNF03 — Segurança
| ID | Requisito |
|----|-----------|
| RNF03.1 | **BYOK**: a chave do usuário fica só no navegador e a chamada é browser → Anthropic; **nunca passa por servidor nosso** nem é logada (erros de auth viram `INVALID_API_KEY`) |
| RNF03.2 | **Prompt injection**: inputs sanitizados (`lib/ai/sanitize.ts`) — trim, limite 2000 chars, remoção de controle e `<>`, neutralização de sequências suspeitas |
| RNF03.3 | **Erros**: `AppError` com mensagem segura; nunca vazar stack na UI; nunca logar a chave |
| RNF03.4 | **Zip-slip**: remover segmentos `..`/`.` ao montar o zip (no cliente) |
| RNF03.5 | **HTTPS** em produção (a chave trafega do navegador até a Anthropic) |

### RNF04 — Acessibilidade
- Navegação por teclado no wizard; labels em todos os campos; contraste WCAG AA

### RNF05 — Stack
- Next.js 14+ (App Router), **export estático** (`output: "export"`), TypeScript, Tailwind
- IA: `@anthropic-ai/sdk` **no cliente** (`dangerouslyAllowBrowser`), modelo `claude-opus-4-8`
- Zip JSZip (no navegador); Shiki (lazy); estado Zustand
- **Sem** backend/API, auth, banco ou billing

---

## Dependências Externas
| Dependência | Uso |
|-------------|-----|
| Anthropic API | Geração (chamada direto do navegador, chave BYOK do usuário) |
| JSZip | Geração do `.zip` no navegador |
| Shiki | Syntax highlighting no preview |
