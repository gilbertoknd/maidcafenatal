# Contexto e Diretrizes do Projeto: Maid Café Natal (Mew Mew Café)

> **Este arquivo é o índice da wiki.** O conteúdo completo está distribuído em `wiki/` (pasta na raiz).
> O `CLAUDE.md` importa este arquivo via `@GEMINI.md`; cada `@wiki/…` abaixo é carregado transitivamente.
> **Ao adicionar informação nova, edite o arquivo temático correto em `wiki/`, não este índice.**

---

## 0. REGRAS GERAIS — LEIA ANTES DE QUALQUER COISA

- **Testes TDD:** Quero que você utilize o sistema TDD, testes antes de implementação, então sempre crie testes com a nova função em mente, e em seguida comece a implementação e utilize os testes para se nortear, além disso, sempre que ocorrer algum erro, busque saber o que ocasionou e solucionar.
- **Gerenciador de Pacotes:** Utilize EXCLUSIVAMENTE o `pnpm` (nunca use `npm` ou `yarn`).
- **Infraestrutura Local (Docker):** Utilizamos o `docker-compose.yml` na raiz do projeto para orquestrar todos os containers: `db` (PostgreSQL 15), `backend` (Node/Express), `frontend` (Vite/React) e `tunnel` (Cloudflare).
- **Controle de Versão:** O `.gitignore` raiz ignora `node_modules`, `.env` de todos os níveis, pastas de build (`dist/`, `build/`), coverage, dados do PostgreSQL (`pgdata/`, `postgres_data/`) e arquivos de OS/IDE.
- **Contexto:** Use SEMPRE o `GEMINI.md` como a fonte da verdade para as regras de negócio, arquitetura e contexto. Atualize os arquivos `wiki/` constantemente com novas regras, dependências e soluções de erros. O `CLAUDE.md` da raiz é um resumo operacional que **importa** este arquivo (`@GEMINI.md`) — ao mudar uma regra aqui, verifique se o resumo do `CLAUDE.md` continua verdadeiro.
- **Resolução de Erros:** Sempre que houver um erro, é mandatório ler integralmente o output do terminal para analisar de verdade qual é o problema ANTES de prosseguir.
- **Padronização CSS:** Sempre utilize as variáveis CSS definidas em `frontend/src/index.css` (`:root`). Se necessário criar um novo token (cor, tamanho, espaçamento), adicione-o lá. Nunca use valores hard-coded repetidos.
- **Idioma do Código:** Nomes de tabelas, colunas, variáveis de banco e endpoints da API estão em **português** (ex: `produtos`, `pedidos`, `eventos`). Comentários e mensagens de erro também em português.
- **Error Handling:** Para tratamentos de erro no backend, lembre-se de sempre utilizar o nosso intermediador de erros, que é o arquivo `src/middlewares/gerenciadorErros.ts`.
- **Atualizar documento:** Sempre que houver alguma informação importante, edite o arquivo `wiki/` adequado — ou crie uma nova seção lá.
- **Melhorias:** Quando estiver trabalhando em um código que não siga as regras do documento, mesmo sendo um código mais antigo, feito anteriormente, quero que você faça o possível para que ele siga as regras do documento, alterando-o.
- **Responsividade:** Quero que você foque bastante na responsividade e funcionalidades do site para dispositivos móveis, de forma que funcione bem em celulares, que é o foco principal.
- **Hurdle:** Adicione common Hurdles que você encontrar durante o desenvolvimento em `wiki/qualidade.md` (seção §13), com as soluções para que você não cometa os mesmos erros novamente.
- **Ambiente de Trabalho:** Sempre que abrir o projeto, execute `pnpm install` nas pastas `frontend` e `backend` para garantir que todas as dependências e tipagens (`@types/*`) estejam sincronizadas com o código mais recente.
- **Identidade Visual:** O site deve seguir uma estética "fofa" (Kawaii/Maid Café), com a paleta **Parchment · Cardinal · Blush Mochi · Charcoal** (`#FAF7F2`, `#A91D22`, `#F0C4BA`, `#242121`). Tipografia cursiva decorativa **Sweet Apricot** exclusivamente em **títulos de páginas, nomes de categorias, títulos de itens e Navbar** (via `var(--font-title)`), e fonte **Inter** (via `var(--font-main)`) para corpo de texto, descrições, preços, botões e demais elementos de UI. Crucialmente, botões e elementos com cantos muito arredondados (`var(--radius-button)` para botões e `var(--radius-card)` para cards/modais). O background da página principal é o bege clarinho (`#FAF7F2`), mantendo o branco puro (`#FFFFFF`) apenas para elementos elevados em relevo, como os cards.
- **Paleta Unificada 2026 (Parchment · Cardinal · Blush Mochi · Charcoal):** A paleta do site foi **unificada** em Junho/2026. Os tokens `--color-primary` e `--color-wine` apontam para **Cardinal Red** (`#A91D22`), `--color-background`/`--color-cream` para o **Bege Clarinho** (`#FAF7F2`), `--color-rose` para **Rosa Pastel / Blush Mochi** (`#F0C4BA`) e `--color-text`/`--color-ink` para **Sacristy Charcoal** (`#242121`). Cards brancos com bordas cardinal e "sombra sticker" (offset duro, `--shadow-sticker`), pills verde-menta para status e a fonte display arredondada **Fredoka** (`var(--font-display)`) para os títulos chunky. Os testes em `design-tokens.test.ts` validam esta paleta — **ele é o árbitro**: ao mudar um hex no `:root`, atualize o teste e a seção 8 juntos.

---

## Índice da Wiki (`wiki/`)

| Arquivo | Seções | Conteúdo |
| --- | --- | --- |
| [`wiki/arquitetura-e-stack.md`](wiki/arquitetura-e-stack.md) | §1 · §2 · §4 · §9 | Visão geral, stack tecnológico, estrutura de diretórios, design patterns MVC/Hooks |
| [`wiki/banco-de-dados.md`](wiki/banco-de-dados.md) | §5 · §10 · §11 | Modelos de domínio (schema SQL), visibilidade de itens, categorias de produtos |
| [`wiki/api.md`](wiki/api.md) | §6 | Rotas da API (todos os endpoints por controller) |
| [`wiki/frontend.md`](wiki/frontend.md) | §7 · §8 · §17 · §27 · §28 · §30 · §32 | Rotas React, design system CSS, TanStack Query, padrões de estrutura, redesign 2026, densidade mobile |
| [`wiki/features.md`](wiki/features.md) | §21 · §22 · §23 · §24 · §31 · §33 | Banners, autocomplete, fontes dinâmicas, admin layout, pivô de negócio, parceiros |
| [`wiki/infra-e-deploy.md`](wiki/infra-e-deploy.md) | §3 · §12 · §18 · §19 · §25 · §29 | Variáveis de ambiente, comandos, deploy Docker, CI/CD, backup |
| [`wiki/qualidade.md`](wiki/qualidade.md) | §13 · §14 · §15 · §16 | Common Hurdles, testes, checklist pós-feature, boas práticas |
| [`wiki/seguranca.md`](wiki/seguranca.md) | §20 · §34 | Vulnerabilidades corrigidas, auditoria de segurança completa |
| [`wiki/seo.md`](wiki/seo.md) | §26 | SEO e indexação (Google Search) |

---

@wiki/arquitetura-e-stack.md
@wiki/banco-de-dados.md
@wiki/api.md
@wiki/frontend.md
@wiki/features.md
@wiki/infra-e-deploy.md
@wiki/qualidade.md
@wiki/seguranca.md
@wiki/seo.md
