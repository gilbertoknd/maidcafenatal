<!-- Parte da wiki do Mew Mew Café. Índice em: ../GEMINI.md -->
## 0. REGRAS GERAIS — LEIA ANTES DE QUALQUER COISA

- **Testes TDD:** Quero que você utilize o sistema TDD, testes antes de implementação, então sempre crie testes com a nova função em mente, e em seguida comece a implementação e utilize os testes para se nortear, além disso, sempre que ocorrer algum erro, busque saber o que ocasionou e solucionar.
- **Gerenciador de Pacotes:** Utilize EXCLUSIVAMENTE o `pnpm` (nunca use `npm` ou `yarn`).
- **Infraestrutura Local (Docker):** Utilizamos o `docker-compose.yml` na raiz do projeto para orquestrar todos os containers: `db` (PostgreSQL 15), `backend` (Node/Express), `frontend` (Vite/React) e `tunnel` (Cloudflare).
- **Controle de Versão:** O `.gitignore` raiz ignora `node_modules`, `.env` de todos os níveis, pastas de build (`dist/`, `build/`), coverage, dados do PostgreSQL (`pgdata/`, `postgres_data/`) e arquivos de OS/IDE.
- **Contexto:** Use SEMPRE o `GEMINI.md` como a fonte da verdade para as regras de negócio, arquitetura e contexto. Atualize este documento constantemente com novas regras, dependências e soluções de erros. O `CLAUDE.md` da raiz é um resumo operacional que **importa** este arquivo (`@GEMINI.md`) — ao mudar uma regra aqui, verifique se o resumo do `CLAUDE.md` continua verdadeiro.
- **Resolução de Erros:** Sempre que houver um erro, é mandatório ler integralmente o output do terminal para analisar de verdade qual é o problema ANTES de prosseguir.
- **Padronização CSS:** Sempre utilize as variáveis CSS definidas em `frontend/src/index.css` (`:root`). Se necessário criar um novo token (cor, tamanho, espaçamento), adicione-o lá. Nunca use valores hard-coded repetidos.
- **Idioma do Código:** Nomes de tabelas, colunas, variáveis de banco e endpoints da API estão em **português** (ex: `produtos`, `pedidos`, `eventos`). Comentários e mensagens de erro também em português.
- **Error Handling:** Para tratamentos de erro no backend, lembre-se de sempre utilizar o nosso intermediador de erros, que é o arquivo `src/middlewares/gerenciadorErros.ts`.
- **Atualizar documento** Sempre que houver alguma informação importante, atualize esse documento com ela em algum dos tópicos, ou crie um novo tópico se necessário.
- **Melhorias** Quando estiver trabalhando em um código que não siga as regras do documento, mesmo sendo um código mais antigo, feito anteriormente, quero que você faça o possível para que ele siga as regras do documento, alterando-o.
- **Responsividade** Quero que você foque bastante na responsividade e funcionalidades do site para dispositivos móveis, de forma que funcione bem em celulares, que é o foco principal.
- **Hurdle** Adicione common Hurdles que você encontrar durante o desenvolvimento, com as soluções para que você não cometa os mesmos erros novamente.
- **Ambiente de Trabalho**: Sempre que abrir o projeto, execute `pnpm install` nas pastas `frontend` e `backend` para garantir que todas as dependências e tipagens (`@types/*`) estejam sincronizadas com o código mais recente.
- **Identidade Visual:** O site deve seguir uma estética "fofa" (Kawaii/Maid Café), com a paleta **Parchment · Cardinal · Blush Mochi · Charcoal** (`#FAF7F2`, `#A91D22`, `#F0C4BA`, `#242121`). Tipografia cursiva decorativa **Sweet Apricot** exclusivamente em **títulos de páginas, nomes de categorias, títulos de itens e Navbar** (via `var(--font-title)`), e fonte **Inter** (via `var(--font-main)`) para corpo de texto, descrições, preços, botões e demais elementos de UI. Crucialmente, botões e elementos com cantos muito arredondados (`var(--radius-button)` para botões e `var(--radius-card)` para cards/modais). O background da página principal é o bege clarinho (`#FAF7F2`), mantendo o branco puro (`#FFFFFF`) apenas para elementos elevados em relevo, como os cards.
- **Paleta Unificada 2026 (Parchment · Cardinal · Blush Mochi · Charcoal):** A paleta do site foi **unificada** em Junho/2026. Os tokens `--color-primary` e `--color-wine` apontam para **Cardinal Red** (`#A91D22`), `--color-background`/`--color-cream` para o **Bege Clarinho** (`#FAF7F2`), `--color-rose` para **Rosa Pastel / Blush Mochi** (`#F0C4BA`) e `--color-text`/`--color-ink` para **Sacristy Charcoal** (`#242121`). Cards brancos com bordas cardinal e "sombra sticker" (offset duro, `--shadow-sticker`), pills verde-menta para status e a fonte display arredondada **Fredoka** (`var(--font-display)`) para os títulos chunky. Os testes em `design-tokens.test.ts` validam esta paleta — **ele é o árbitro**: ao mudar um hex no `:root`, atualize o teste e a seção 8 juntos.

---

## 1. Visão Geral da Arquitetura

Website para o **Mew Mew Café** (Maid Café) localizado em Natal/RN. O sistema é composto por:

- **Site Público:** Cardápio digital, loja online de produtos importados/artesanais, calendário de eventos, carrinho de compras e pedidos online.
- **Painel Administrativo:** Gerenciamento de produtos (cardápio + loja), pedidos, eventos, controle de visibilidade e promoções. Acesso protegido por autenticação JWT.

### 1.1. Arquitetura Geral

```
┌────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│   Frontend     │────▶│    Backend       │────▶│   PostgreSQL 15      │
│  (Vite+React)  │ API │  (Express 5)     │ pg  │  (Docker Container)  │
│  :5174         │     │  :3000           │     │  :5432               │
└────────────────┘     └──────────────────┘     └──────────────────────┘
                              │
                       ┌──────┴──────┐
                       │  Cloudflare │
                       │   Tunnel    │
                       └─────────────┘
```

### 1.2. Hospedagem e Deploy

- **Produção:** Todos os containers rodam via Docker Compose em uma máquina com acesso à internet. Utilizamos **Multi-stage builds** para otimização de performance e segurança.
- **Frontend em Produção:** Servido por um container **Nginx** (porta 80 interna), otimizado para Single Page Applications (SPA).
- **Backend em Produção:** Executa o código transpilado da pasta `/dist` via Node.js em modo produção.
- **Domínio:** `mewworld.space` (via Cloudflare Tunnel — container `maid_tunnel`).
- **Imagens:** Servidas localmente a partir de `backend/public/images/` via `express.static`. A rota `/images/*` no backend serve os arquivos estáticos.

---

## 2. Stack Tecnológico Completo

### Frontend

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 7
- **Roteamento:** `react-router-dom` v7
- **Ícones:** `lucide-react`
- **Datas:** `Intl.DateTimeFormat` (Nativo)
- **Mapas:** `leaflet` + `react-leaflet`
- **Estado Global/Cache:** `@tanstack/react-query` (TanStack Query v5)
- **Testes:** Vitest + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`
- **Linting:** ESLint 9 + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` + `typescript-eslint` + `globals`
- **Validação de Schemas:** `zod`
- **Tipografia:** **Sweet Apricot** (fonte local `.woff2` em `public/fonts/`) para títulos (`--font-title`) + **Inter** (Google Fonts) para corpo/UI (`--font-main`) + **Fredoka** (Google Fonts) para títulos display chunky (`--font-display`)

### Backend

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **Runner:** `tsx watch` (dev) com hot-reload
- **Banco de Dados:** PostgreSQL 15 (Alpine) via `pg` (driver nativo, sem ORM)
- **Autenticação:** `jsonwebtoken` (JWT) + `bcryptjs`
- **Upload de Arquivos:** `multer` (disco local em `public/images/`)
- **Testes:** Vitest + `supertest`
- **Build:** `tsc` + `rimraf`
- **Linting:** `eslint` (Flat Config) + `typescript-eslint` + `globals`
- **Utilitários:** `cors` (Segurança), `dotenv` (Variáveis de Ambiente)
- **Validação de Schemas:** `zod`

### Infraestrutura

- **Containerização:** Docker + Docker Compose
- **DB:** PostgreSQL 15 Alpine
- **Tunnel:** Cloudflare Tunnel (`cloudflared`)
- **Rede:** Bridge network interna (`maid_network`)

---

## 4. Estrutura do Diretório

```
/
├── .env                          # Variáveis do Docker Compose
├── .gitignore
├── docker-compose.yml            # Orquestração de containers
├── GEMINI.md                     # ESTE ARQUIVO — fonte da verdade
├── CLAUDE.md                     # Resumo operacional p/ Claude Code (importa @GEMINI.md)
├── scripts/backup.ps1            # Backup diário → Cloudflare R2 (ver seção 25)
│
├── database/
│   └── init.sql                  # Schema DDL + seed data (roda no init do container)
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json / tsconfig.build.json
│   ├── vitest.config.ts
│   ├── scripts/reset_db.ts       # Reset do banco em dev (`pnpm db:reset`)
│   ├── public/images/            # Imagens dos produtos/eventos (serving estático)
│   ├── public/fonts/             # Fontes customizadas .woff2 (serving estático)
│   └── src/
│       ├── server.ts             # Entry point (listen + auto-migração no boot)
│       ├── app.ts                # Express app (middlewares + rotas)
│       ├── migrate_db.ts         # CLI de migrations (`pnpm db:migrate` / `node dist/migrate_db.js`)
│       ├── migrations/           # Migrations incrementais (.ts, prefixadas 01_, 02_, ...)
│       ├── database/
│       │   └── migrator.ts       # `executarMigrations(pool)` — usado pela CLI e pelo boot
│       ├── config/
│       │   ├── db.ts             # Pool de conexão PostgreSQL (pg)
│       │   ├── cookie.ts         # Opções do cookie HttpOnly de sessão
│       │   ├── jwt.ts            # obterSegredoJwt() — segredo sem fallback
│       │   ├── corsOptions.ts    # Configuração de CORS
│       │   ├── upload.ts         # Multer para imagens/vídeos (disco, 50MB)
│       │   └── uploadFonte.ts    # Multer para fontes .woff2
│       ├── controllers/
│       │   ├── AutenticacaoController.ts
│       │   ├── ProdutoController.ts
│       │   ├── PedidoController.ts
│       │   ├── EventoController.ts
│       │   ├── BannerController.ts
│       │   ├── ConfiguracaoController.ts
│       │   ├── CupomController.ts
│       │   └── InstagramController.ts
│       ├── models/               # Um Model por Controller (mesmos nomes)
│       ├── routes/               # Uma Route por Controller (mesmos nomes)
│       ├── middlewares/
│       │   ├── autenticacaoMiddleware.ts  # Verificação JWT
│       │   └── gerenciadorErros.ts        # Gerenciador de erros centralizado (AppError)
│       ├── services/
│       │   └── ProdutoService.ts
│       ├── errors/
│       │   └── AppError.ts       # Classe de erro customizada (statusCode)
│       ├── types/                # AutenticacaoTypes.d.ts, ProdutoTypes.ts,
│       │                         # EventoTypes.ts, InstagramTypes.ts
│       ├── utils/
│       │   ├── StorageProvider.ts # Abstração de deleção de arquivo físico
│       │   └── formatadores.ts
│       └── tests/                # Testes do backend (Vitest + Supertest) — ver seção 14
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── index.html
│   ├── eslint.config.js
│   └── src/
│       ├── main.tsx              # Entry point (React root + StrictMode)
│       ├── App.tsx               # BrowserRouter + Rotas
│       ├── index.css             # Design tokens (variáveis CSS globais)
│       ├── App.css               # Estilos globais do App
│       ├── setupTests.ts         # Config dos testes (@testing-library)
│       ├── types/                # Produto.ts, Evento.ts, Banner.ts, Cupom.ts,
│       │                         # Instagram.ts, Configuracao.ts, global.d.ts
│       ├── data/
│       │   ├── maidsData.ts      # Perfis das maids (estático, alimenta /maids/:id)
│       │   └── parceirosData.ts  # Parceiros (estático, alimenta a Home e /parceiros)
│       ├── services/
│       │   └── api.ts            # Todas as chamadas HTTP ao backend
│       ├── hooks/
│       │   ├── useAutenticacao.ts      # Autenticação (login, verificar token)
│       │   ├── useCarrinho.tsx         # Carrinho de compras (Context API)
│       │   ├── useProdutos.ts          # Fetch de produtos (público, TanStack Query)
│       │   ├── useAdminProdutos.ts     # CRUD de produtos (admin)
│       │   ├── useAdminInstagram.ts    # CRUD de posts do Instagram (admin)
│       │   ├── useProductLike.ts       # Gerencia curtidas otimistas por produto
│       │   ├── useBanners.ts           # Fetch de banners (TanStack Query)
│       │   ├── useCupons.ts            # Campanhas e resgate de cupons
│       │   ├── useConfiguracoes.ts     # Exporta useConfiguracoesGlobais(): carrega config ativa,
│       │   │                           # injeta @font-face e tokens CSS (chamado no App.tsx)
│       │   ├── useSecoesHome.ts        # Visibilidade das seções da homepage (chaves secao_home_*)
│       │   ├── useNavVisibilidade.ts   # Visibilidade dos links da Navbar (chaves nav_*)
│       │   └── useDebugTela.ts         # Debug de dimensões de tela (NÃO usar em produção)
│       ├── utils/                # analytics.ts, contato.ts, formatadores.ts,
│       │                         # homeEventos.ts, ordenarProdutos.ts, scroll.ts
│       ├── pages/
│       │   ├── Home/             # Landing page
│       │   ├── Menu/             # Cardápio com filtros por categoria
│       │   ├── LojaOnline/       # Loja online (produtos is_loja)
│       │   ├── ProdutoDetalhesLoja/ # Detalhes de produto da loja
│       │   ├── Eventos/          # Calendário de eventos
│       │   ├── EventoDetalhes/   # Detalhes de evento individual
│       │   ├── Mangas/           # Seção de mangás (is_manga=TRUE)
│       │   ├── MaidDetalhes/     # Perfil detalhado de maid (dados em src/data/)
│       │   ├── Cupons/           # Página de cupons de desconto
│       │   ├── Parceiros/        # Página pública de parceiros (dados estáticos)
│       │   ├── Agendar/          # Formulário de agendamento → WhatsApp (ver seção 31.2)
│       │   └── Admin/            # Painel administrativo (protegido por JWT)
│       ├── components/           # Componentes reutilizáveis
│       │   ├── Header/           # Navegação principal (sticky, mobile slide-in)
│       │   ├── Footer/           # Rodapé
│       │   ├── Banner/           # Banner dinâmico por página (imagem ou vídeo)
│       │   ├── ProdutoCard/      # Card de produto (sub-componentes: CardImage, CardAdminActions, CardPublicActions)
│       │   ├── ProdutoDetalhesModal/ # Modal de detalhes
│       │   ├── ProdutoForm/      # Formulário CRUD produto (admin)
│       │   ├── CategoryFilter/   # Filtro por categorias
│       │   ├── Search/           # Barra de busca
│       │   ├── CartButton/       # Botão flutuante do carrinho
│       │   ├── CartModal/        # Modal do carrinho
│       │   ├── MenuContent/      # Conteúdo do cardápio
│       │   ├── EventoCard/       # Card de evento
│       │   ├── CalendarioEventos/ # Calendário de eventos
│       │   ├── SortDropdown/     # Ordenação de produtos (usa utils/ordenarProdutos)
│       │   ├── HeroSection/      # [Home] Boas-vindas (Hero) — mascote + CTAs
│       │   ├── HowItWorksSection/ # [Home] "Como funciona" (4 passos, âncora #como-funciona)
│       │   ├── MaidCarousel/     # [Home] Faixa de maids em fatias diagonais (Links p/ /maids/:id)
│       │   ├── EventsSection/    # [Home] "Tem sempre algo fofo rolando" (agenda editável via admin)
│       │   ├── AboutSection/     # [Home] "Magia japonesa na sua festa" / Sobre nós
│       │   ├── InstagramSection/ # [Home] Mosaico do feed (5 posts + card do perfil)
│       │   ├── ParceirosSection/ # [Home] Parceiros (grid 2 col + CTA "Ver todos")
│       │   ├── ParceiroCard/     # Card de parceiro (logo com fallback de monograma)
│       │   ├── ClubeMewSection/  # [Home] Clube Mew — cupom via WhatsApp
│       │   ├── HighlightsSection/ # ÓRFÃO — removido da Home no redesign de Jun/2026
│       │   ├── NewArrivalsSection/ # ÓRFÃO — não usado na Home pós-redesign
│       │   ├── PopularSection/   # ÓRFÃO — não usado na Home pós-redesign
│       │   ├── AddressMapModal/  # Modal com mapa (Leaflet) — busca de endereço no checkout
│       │   ├── ScrollToTop/      # Auto-scroll ao navegar
│       │   ├── LoginModal/       # Modal de login
│       │   ├── AdminDashboard/   # Shell do admin (sidebar + abas, array `gruposDeTabs`)
│       │   ├── AdminBanners/     # Gerenciamento de banners por página
│       │   ├── AdminEventos/     # Gerenciamento de eventos
│       │   ├── AdminHomeEventos/ # Edição da agenda fixa exibida no EventsSection
│       │   ├── AdminPedidos/     # Gerenciamento de pedidos
│       │   ├── AdminFontes/      # Gerenciamento de fontes customizadas
│       │   ├── AdminCupons/      # Gerenciamento de cupons
│       │   ├── AdminSecoesHome/  # Controle de visibilidade das seções da homepage
│       │   ├── AdminNavbar/      # Controle de visibilidade dos links da Navbar
│       │   └── AdminInstagram/   # Gerenciamento de posts do Instagram
│       └── tests/                # Testes do frontend (Vitest + RTL) — ver seção 14
```

---

## 9. Design Patterns do Projeto

### Backend — MVC (Model-View-Controller)

- **Models** (`models/`): Queries SQL puras usando `pool.query()` do `pg`. Retornam dados brutos.
- **Controllers** (`controllers/`): Recebem `req/res`, chamam Models, tratam validações e formatam a resposta HTTP. Exportados como objetos `const`.
- **Routes** (`routes/`): Mapeiam endpoints para Controllers, aplicam middlewares (`autenticacaoMiddleware`, `uploadConfig`). A config de Upload (`config/upload.ts`) permite **imagens e vídeos até 50MB** (`jpeg|jpg|png|gif|webp|mp4|webm|mov`, validando mimetype **e** extensão). Fontes têm um Multer próprio (`config/uploadFonte.ts`).
- **Erros:** Classe customizada `AppError` com `statusCode`, capturada pelo `gerenciadorErros` centralizado.
- **Storage:** Utilitário `StorageProvider` (`utils/StorageProvider.ts`) abstrai a deleção de arquivos físicos, permitindo trocar o storage local por nuvem (S3/GCS) facilmente.

### Frontend — Hooks Pattern

- **Hooks Customizados** (`hooks/`): Encapsulam lógica de estado e chamadas à API (`useProdutos` agora usa TanStack Query, `useProductLike` gerencia curtidas globais).
- **Pages** (`pages/`): Componentes de página que orquestram hooks e componentes.
- **Components** (`components/`): Componentes de UI reutilizáveis. Componentes complexos (ex: `ProdutoCard`) seguem o padrão de sub-componentes internos no mesmo arquivo para manter a coesão.
- **Acessibilidade:** Todos os elementos interativos devem possuir `aria-label` descritivo.
- **Carrinho:** Implementado via React Context API (`useCarrinho`), armazenamento no estado local.

### Autenticação

- **Backend:** JWT assinado com `JWT_SECRET`. Token enviado no header `Authorization: Bearer <token>`.
- **Frontend:** Token armazenado no `localStorage`. Hook `useAutenticacao` (`hooks/useAutenticacao.ts`) gerencia login/logout e verificação.
- **Admin único:** Apenas um usuário `admin` existe no banco (seed no `init.sql`).

---
