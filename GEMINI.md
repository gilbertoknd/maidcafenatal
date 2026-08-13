# Contexto e Diretrizes do Projeto: Maid Café Natal (Mew Mew Café)

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

## 3. Variáveis de Ambiente (Template)

### Raiz (`/.env`) — Usada pelo Docker Compose

```env
# Database
POSTGRES_USER=admin_maid
POSTGRES_PASSWORD=sua_senha_segura
POSTGRES_DB=maid_cafe_db
DB_HOST=db
DB_PORT=5432
DB_PORT_LOCAL=5433
DB_USER=admin_maid
DB_PASSWORD=sua_senha_segura
DB_NAME=maid_cafe_db

# Backend
PORT=3000
FRONTEND_URL=http://localhost:5174
JWT_SECRET=seu_segredo_jwt

# Cloudflare Tunnel
TUNNEL_TOKEN=seu_token_cloudflare
```

### Frontend (`/frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:3000
```

### Backend (`/backend/.env`)

```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=admin_maid
DB_PASSWORD=sua_senha_segura
DB_NAME=maid_cafe_db
PORT=3000
JWT_SECRET=segredo
FRONTEND_URL=http://localhost:5174
```

> **Nota:** Dentro do Docker, o `DB_HOST` é `db` (nome do serviço). Fora do Docker (dev local), use `localhost` com a porta `DB_PORT_LOCAL` (5433).

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
│   ├── migrate_db.ts             # Runner das migrations (`pnpm db:migrate`)
│   ├── migrations/               # Migrations incrementais (.ts, prefixadas 01_, 02_, ...)
│   ├── scripts/reset_db.ts       # Reset do banco em dev (`pnpm db:reset`)
│   ├── public/images/            # Imagens dos produtos/eventos (serving estático)
│   ├── public/fonts/             # Fontes customizadas .woff2 (serving estático)
│   └── src/
│       ├── server.ts             # Entry point (listen)
│       ├── app.ts                # Express app (middlewares + rotas)
│       ├── config/
│       │   ├── db.ts             # Pool de conexão PostgreSQL (pg)
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

## 5. Modelos de Domínio (Banco de Dados)

O esquema é definido em `database/init.sql` via SQL puro (sem ORM).

### `configuracoes`

| Coluna          | Tipo              | Descrição                         |
| --------------- | ----------------- | --------------------------------- |
| `chave`         | `VARCHAR(100) PK` | Chave da configuração (ex: fonte) |
| `valor`         | `VARCHAR(255)`    | Valor associado à chave           |
| `atualizado_em` | `TIMESTAMP`       | Data da última atualização        |

> **Chaves de Configuração conhecidas** (fonte canônica: `frontend/src/types/Configuracao.ts`):
> - Fontes customizadas (7 categorias parametrizáveis — ver seção 23).
> - **Seções da Home** (`SECOES_HOME_ORDEM`, na ordem de exibição): `secao_home_banner`, `secao_home_hero`, `secao_home_como_funciona`, `secao_home_maids`, `secao_home_eventos`, `secao_home_sobre`, `secao_home_instagram`, `secao_home_parceiros`, `secao_home_clube_mew`.
> - **Navbar** (`NAV_PAGINAS_ORDEM`): `nav_loja`, `nav_mangas`, `nav_eventos`, `nav_cupons`, `nav_parceiros`, `nav_agendar`.
> - **Agenda da Home:** conteúdo editável do `EventsSection` (`HomeEventosConfig` — título, subtítulo, cards e CTAs).
>
> Valores booleanos são strings (`'true'` / `'false'`). **Default: chave ausente = visível** (`useSecoesHome` só oculta quando o valor é literalmente `"false"`).

> ⚠️ **Ao criar uma chave de configuração nova, são DOIS lugares — esqueceu um, quebra em produção sem teste nenhum acusar.**
> 1. `frontend/src/types/Configuracao.ts` — união de tipo + array de ordem + mapa de labels.
> 2. `backend/src/controllers/ConfiguracaoController.ts` → array **`CHAVES_VALIDAS`**. O `PUT /api/configuracoes` filtra por esse whitelist e, se sobrar zero chave válida, responde **400**. Como `AdminNavbar` e `AdminSecoesHome` enviam **uma chave por vez**, a chave nova sozinha vira `400` → o admin clica no toggle e recebe "Erro ao salvar".
>
> A suíte de frontend inteira passa verde nesse cenário, porque nenhum teste de frontend chega no backend. A rede que pega isso é um teste em `backend/src/tests/configuracao.test.ts` enviando **a chave nova isoladamente** (payload misto passaria mesmo com o whitelist quebrado, mascarando o bug).
>
> `CHAVES_VALIDAS` duplica manualmente o que já está em `Configuracao.ts` — backend e frontend são pacotes separados, sem código compartilhado, então a duplicação não some sem tooling novo.
>
> **O que some é o silêncio:** `frontend/src/tests/contrato-configuracoes.test.ts` lê os **dois** arquivos via `fs` (mesmo padrão do `design-tokens.test.ts`) e falha apontando a chave exata que ficou de fora, nos dois sentidos — chave só no frontend (quebra o admin) e chave órfã no backend (sobra de seção removida). O teste tem guardas contra passar vacuamente: se o regex deixar de casar e devolver lista vazia, ele acusa.
>
> Validar por padrão (`/^secao_home_.+$/`) foi descartado de propósito: aceitaria `secao_home_typo` em silêncio, e existe teste em `configuracao.test.ts` exigindo que chave desconhecida seja rejeitada.

### `fontes_customizadas`

| Coluna        | Tipo                  | Descrição                          |
| ------------- | --------------------- | ---------------------------------- |
| `id`          | `SERIAL PK`           | ID auto-incremento                 |
| `nome`        | `VARCHAR(100) UNIQUE` | Nome da fonte                      |
| `arquivo_url` | `VARCHAR(255)`        | Caminho físico do arquivo (.woff2) |
| `criado_em`   | `TIMESTAMP`           | Data de criação                    |

### `produtos`

| Coluna           | Tipo            | Descrição                                      |
| ---------------- | --------------- | ---------------------------------------------- |
| `id`             | `SERIAL PK`     | ID auto-incremento                             |
| `nome`           | `VARCHAR(100)`  | Nome do produto                                |
| `descricao`      | `TEXT`          | Descrição                                      |
| `preco`          | `DECIMAL(10,2)` | Preço atual                                    |
| `imagem_url`     | `VARCHAR(255)`  | Caminho da imagem                              |
| `categoria`      | `VARCHAR(50)`   | Categoria (Happy Hour, Refeições, Cafés, etc.) |
| `promocao`       | `BOOLEAN`       | Em promoção?                                   |
| `curtidas`       | `INTEGER`       | Contador de curtidas                           |
| `tags`           | `VARCHAR(255)`  | Tags opcionais                                 |
| `is_loja`        | `BOOLEAN`       | Produto da loja online (vs. cardápio)          |
| `is_manga`       | `BOOLEAN`       | Produto da seção de mangás                     |
| `preco_original` | `DECIMAL(10,2)` | Preço antes da promoção                        |
| `visivel`        | `BOOLEAN`       | Visível para usuários? (ocultar sem deletar)   |
| `criado_em`      | `TIMESTAMP`     | Data de criação                                |

### `eventos`

| Coluna       | Tipo           | Descrição                         |
| ------------ | -------------- | --------------------------------- |
| `id`         | `SERIAL PK`    | ID auto-incremento                |
| `titulo`     | `VARCHAR(100)` | Título do evento                  |
| `descricao`  | `TEXT`         | Descrição                         |
| `data`       | `TIMESTAMP`    | Data e hora de início do evento   |
| `data_fim`   | `TIMESTAMP`    | Data e hora de término do evento  |
| `local`      | `VARCHAR(255)` | Local do evento                   |
| `imagem_url` | `VARCHAR(255)` | Imagem do evento                  |
| `visivel`    | `BOOLEAN`      | Visível para usuários?            |
| `criado_em`  | `TIMESTAMP`    | Data de criação                   |

### `banners`

| Coluna                      | Tipo                 | Descrição                           |
| --------------------------- | -------------------- | ----------------------------------- |
| `id`                        | `SERIAL PK`          | ID auto-incremento                  |
| `pagina`                    | `VARCHAR(50) UNIQUE` | Ex: 'home', 'cardapio', ou 'padrao' |
| `tipo`                      | `VARCHAR(20)`        | `video` ou `image`                  |
| `url`                       | `VARCHAR(255)`       | URL da mídia (no disco)             |
| `titulo`, `subtitulo`       | `VARCHAR`            | Opcional: Textos sobrepostos        |
| `texto_botao`, `link_botao` | `VARCHAR`            | Opcional: Call to Action            |

### `users`

| Coluna      | Tipo                 | Descrição            |
| ----------- | -------------------- | -------------------- |
| `id`        | `SERIAL PK`          | ID auto-incremento   |
| `nickname`  | `VARCHAR(50) UNIQUE` | Login do admin       |
| `senha`     | `VARCHAR(255)`       | Hash bcrypt da senha |
| `criado_em` | `TIMESTAMP`          | Data de criação      |

> **Credenciais do admin (Agosto/2026):** o seed legado `admin`/`admin` foi
> substituído. O `database/init.sql` traz o usuário novo com hash bcrypt custo 10,
> e `backend/migrations/10_credenciais_admin.ts` atualiza bancos **já existentes**
> — o `init.sql` só roda em volume novo, então **sem rodar a migration a produção
> continua com a credencial antiga**. A senha em claro não é versionada em lugar
> nenhum: para trocar, gere o hash com `bcryptjs` (custo 10), atualize o `init.sql`
> e crie uma migration nova.

### `pedidos`

| Coluna             | Tipo            | Descrição                                           |
| ------------------ | --------------- | --------------------------------------------------- |
| `id`               | `SERIAL PK`     | ID auto-incremento                                  |
| `cliente_nome`     | `VARCHAR(100)`  | Nome do cliente                                     |
| `cliente_endereco` | `TEXT`          | Endereço de entrega                                 |
| `total`            | `DECIMAL(10,2)` | Valor total                                         |
| `status`           | `VARCHAR(50)`   | Status (`Pendente`, `Preparando`, `Entregue`, etc.) |
| `criado_em`        | `TIMESTAMP`     | Data de criação                                     |

### `itens_pedido`

| Coluna           | Tipo                | Descrição                      |
| ---------------- | ------------------- | ------------------------------ |
| `id`             | `SERIAL PK`         | ID auto-incremento             |
| `pedido_id`      | `FK → pedidos(id)`  | Pedido pai (CASCADE on DELETE) |
| `produto_id`     | `FK → produtos(id)` | Produto (RESTRICT on DELETE)   |
| `quantidade`     | `INTEGER`           | Quantidade                     |
| `preco_unitario` | `DECIMAL(10,2)`     | Preço no momento do pedido     |

### `instagram_posts`

| Coluna       | Tipo           | Descrição                         |
| ------------ | -------------- | --------------------------------- |
| `id`         | `SERIAL PK`    | ID auto-incremento                |
| `imagem_url` | `VARCHAR(255)` | Caminho da imagem no disco        |
| `link_url`   | `VARCHAR(255)` | Link para o post no Instagram     |
| `visivel`    | `BOOLEAN`      | Visível na homepage? (Default: T) |
| `ordem`      | `INTEGER`      | Ordem de exibição (Default: 0)    |
| `criado_em`  | `TIMESTAMP`    | Data de criação                   |

---

## 6. Rotas da API

### Autenticação (`/api/autenticacao`)

| Método | Rota     | Auth? | Descrição                              |
| ------ | -------- | ----- | -------------------------------------- |
| `POST` | `/login` | ❌    | Login (nickname + senha) → retorna JWT |

### Configurações (`/api/configuracoes`)

| Método   | Rota          | Auth? | Descrição                                     |
| -------- | ------------- | ----- | --------------------------------------------- |
| `GET`    | `/`           | ❌    | Retorna configurações globais e fontes ativas |
| `PUT`    | `/`           | ✅    | Atualiza chaves de configuração em lote       |
| `POST`   | `/fontes`     | ✅    | Upload de nova fonte customizada (.woff2)     |
| `DELETE` | `/fontes/:id` | ✅    | Exclui uma fonte e deleta o arquivo físico    |

### Banners (`/api/banners`)

| Método | Rota       | Auth? | Descrição                                                   |
| ------ | ---------- | ----- | ----------------------------------------------------------- |
| `GET`  | `/`        | ❌    | Lista todos os banners parametrizados                       |
| `PUT`  | `/:pagina` | ✅    | Cria/Atualiza o banner atrelado a uma página (upload midia) |

### Produtos (`/api/produtos`)

| Método   | Rota                | Auth? | Descrição                                |
| -------- | ------------------- | ----- | ---------------------------------------- |
| `GET`    | `/`                 | ❌    | Lista produtos visíveis                  |
| `GET`    | `/admin`            | ✅    | Lista todos os produtos (inclui ocultos) |
| `GET`    | `/populares`        | ❌    | Produtos mais curtidos                   |
| `GET`    | `/novidades`        | ❌    | Produtos novos                           |
| `POST`   | `/`                 | ✅    | Cria produto (com upload de imagem)      |
| `PUT`    | `/:id`              | ✅    | Atualiza produto                         |
| `DELETE` | `/:id`              | ✅    | Deleta produto                           |
| `PATCH`  | `/:id/like`         | ❌    | Incrementa curtida                       |
| `PATCH`  | `/:id/unlike`       | ❌    | Decrementa curtida                       |
| `PATCH`  | `/:id/visibilidade` | ✅    | Alterna visibilidade                     |

### Pedidos (`/api/pedidos`)

| Método | Rota          | Auth? | Descrição                 |
| ------ | ------------- | ----- | ------------------------- |
| `GET`  | `/`           | ✅    | Lista todos os pedidos    |
| `POST` | `/`           | ❌    | Cria novo pedido          |
| `PUT`  | `/:id/status` | ✅    | Atualiza status do pedido |

### Eventos (`/api/eventos`)

| Método   | Rota                | Auth? | Descrição                          |
| -------- | ------------------- | ----- | ---------------------------------- |
| `GET`    | `/`                 | ❌    | Lista eventos visíveis             |
| `GET`    | `/admin`            | ✅    | Lista todos os eventos             |
| `POST`   | `/`                 | ✅    | Cria evento (com upload de imagem) |
| `PUT`    | `/:id`              | ✅    | Atualiza evento                    |
| `DELETE` | `/:id`              | ✅    | Deleta evento                      |
| `PATCH`  | `/:id/visibilidade` | ✅    | Alterna visibilidade               |

### Instagram (`/api/instagram`)

| Método   | Rota     | Auth? | Descrição                        |
| -------- | -------- | ----- | -------------------------------- |
| `GET`    | `/`      | ❌    | Lista posts visíveis             |
| `GET`    | `/admin` | ✅    | Lista todos os posts (admin)     |
| `POST`   | `/`      | ✅    | Cria post (com upload de imagem) |
| `PUT`    | `/:id`   | ✅    | Atualiza post                    |
| `DELETE` | `/:id`   | ✅    | Deleta post e remove imagem      |

### Cupons (`/api/cupons`)

| Método | Rota                 | Auth? | Descrição                                    |
| ------ | -------------------- | ----- | -------------------------------------------- |
| `GET`  | `/campanhas-ativas`  | ❌    | Lista campanhas de cupom ativas              |
| `POST` | `/resgatar`          | ❌    | Resgata um cupom de uma campanha             |
| `POST` | `/validar`           | ❌    | Valida um código de cupom                    |
| `GET`  | `/admin/campanhas`   | ✅    | Lista todas as campanhas (admin)             |
| `POST` | `/admin/campanhas`   | ✅    | Cria campanha de cupom                       |
| `GET`  | `/admin/cupons`      | ✅    | Lista todos os cupons resgatados (admin)     |

### Regras de Exibição (Homepage)

- A seção do Instagram na Home exibe um grid de 6 cards.
- Os 5 primeiros cards são posts dinâmicos vindos da API (ordenados por `ordem`).
- O 6º card é estático e redireciona para o perfil oficial `@mewmewnatal`.

## 7. Rotas do Frontend (React Router)

| Path                | Componente            | Descrição                                          |
| ------------------- | --------------------- | -------------------------------------------------- |
| `/`                 | `Home`                | Landing page redesenhada (Header → Banner → Hero → Como funciona → Maids → Eventos → Sobre → Instagram → Clube Mew → Footer). Cada seção do `main` é condicionada por `useSecoesHome()`. Ver seção 30 |
| `/home`             | redirect → `/`        | Redirect para Home                                 |
| `/cardapio`         | `MenuPage`            | Cardápio completo com filtros e busca              |
| `/loja`             | `LojaOnline`          | Loja de produtos importados/artesanais             |
| `/mangas`           | `Mangas`              | Venda de mangás (is_manga=TRUE)                    |
| `/loja/produto/:id` | `ProdutoDetalhesLoja` | Detalhes de produto da loja                        |
| `/eventos`          | `EventosPage`         | Calendário de eventos                              |
| `/eventos/:id`      | `EventoDetalhes`      | Detalhes de evento individual                      |
| `/maids/:id`        | `MaidDetalhes`        | Perfil detalhado das maids (dados estáticos em `src/data/`) |
| `/cupons`           | `CuponsPage`          | Página de cupons de desconto                       |
| `/parceiros`        | `ParceirosPage`       | Parceiros do café (dados estáticos em `src/data/parceirosData.ts`). Link na Navbar via `nav_parceiros`. Ver seção 33 |
| `/agendar`          | `AgendarPage`         | Formulário de agendamento de eventos/encomendas → redireciona para o WhatsApp com mensagem pré-preenchida. Ver seção 31 |
| `/admin`            | `Admin`               | Painel administrativo (protegido por login JWT)    |

### Components & UI Adicionais (Admin Dashboard)

- A página `/admin` renderiza o `AdminDashboard`, cujas abas vivem no array `gruposDeTabs` ([AdminDashboard/index.tsx](frontend/src/components/AdminDashboard/index.tsx)) — **é lá que novas abas devem ser adicionadas** (id + label + ícone lucide). Grupos e ids atuais:
  - **Operação:** `pedidos` (Pedidos), `cupons` (Cupons)
  - **Catálogo:** `produtos` (Cardápio), `loja` (Loja), `mangas` (Mangás)
  - **Conteúdo:** `eventos` (Eventos), `agenda_home` (Agenda da Home), `banners` (Banners), `instagram` (Instagram)
  - **Aparência:** `secoes_home` (Seções da Home), `navbar` (Navbar), `fontes` (Fontes)
- **Admin Seções da Home:** Permite ocultar/exibir seções da homepage via checkboxes. Usa chaves `secao_home_*` na tabela `configuracoes`. Default: todas visíveis.
- **Admin Banners:** Adicionado suporte para mídias `.mp4` e `.webm` com limite estendido para 50MB e textos opcionais. A API de Banners reflete globalmente qual componente deve ser exibido por página.
- **Formulários Dinâmicos:** O `ProdutoForm` e outros painéis contam com inputs fluídos que extraem "Categorias" e "Tags" já salvas em cache local (via TanStack Query) para preenchimento de Autocomplete Inteligente ilimitado, criando padronização nas listagens públicas.
- Padrão **FormGrid**: Para manutenção da unidade visual, novos componentes adotam `.formContainer` em CSS grid respeitando padding e limitações `--container-max-width`.

---

## 8. Design System (CSS Custom Properties)

Todos os tokens de design estão centralizados em `frontend/src/index.css`:

### Paleta de Cores — Unificada 2026 (Parchment · Cardinal · Blush Mochi · Charcoal)

> Os valores abaixo espelham o `:root` real do `index.css`. Os hexes marcados são validados por `design-tokens.test.ts` — mudou aqui, muda lá.

| Estilo    | Nome da Cor           | Hexadecimal | Variável CSS                                 | Uso Recomendado                        |
| --------- | --------------------- | ----------- | -------------------------------------------- | -------------------------------------- |
| Principal | Cardinal Red          | `#A91D22`   | `--color-primary`, `--color-wine`            | Logo, botões principais e títulos      |
| Principal | Cardinal Red Escuro   | `#8A171C`   | `--color-primary-dark`, `--color-wine-dark`  | Hover de botões principais             |
| Principal | Cardinal Profundo     | `#6B1115`   | `--color-wine-deep`                          | Contornos e sombras projetadas         |
| Base      | Bege Clarinho         | `#FAF7F2`   | `--color-background`, `--color-cream`        | Fundo principal / wallpaper            |
| Base      | Branco Neve           | `#FFFFFF`   | `--color-white`                              | Cards e áreas de relevo                |
| Base      | Bege Pastel Médio     | `#F3EBE0`   | `--color-secondary-background`               | Fundos de seção e modais               |
| Base      | Bege Ultra Claro      | `#FDFBF8`   | `--color-tertiary-background`, `--color-parchment` | Cards e relevos claros           |
| Base      | Marfim Quente         | `#FDF8F3`   | `--color-ivory`                              | Texto sobre cardinal                   |
| Softener  | Rosa Pastel           | `#F0C4BA`   | `--color-rose`                               | Marcadores de texto e detalhes suaves  |
| Destaque  | Verde Menta           | `#A8E6CF`   | `--color-accent-mint`, `--color-success`     | Botões de "Comprar" ou ícones, sucesso |
| Destaque  | Verde Menta (pill)    | `#B8E6C8`   | `--color-mint-pill`                          | Pills de status                        |
| Destaque  | Amarelo Estelar       | `#FFF3B0`   | `--color-star-active`, `--color-accent-star` | Ofertas, estrelas e novidades          |
| Apoio     | Lilás Místico         | `#D1C4E9`   | `--color-accent-lilac`                       | Bordas e detalhes decorativos          |
| Contraste | Sacristy Charcoal     | `#242121`   | `--color-text`, `--color-ink`                | Textos longos e leitura principal      |

```css
/* ═══ Paleta Principal ═══ */
--color-primary: #a91d22; /* Cardinal Red */
--color-primary-dark: #8a171c; /* Cardinal escuro (hover) */
--color-primary-light: #faf7f2; /* Bege clarinho */
--color-primary-border: #d4a59e; /* Borda blush derivada */
--color-secondary-border: #c49088; /* Borda blush secundária */

/* ═══ Cores Base ═══ */
--color-background: #faf7f2; /* Bege clarinho — Fundo da página */
--color-secondary-background: #f3ebe0; /* Bege pastel médio */
--color-tertiary-background: #fdfbf8; /* Bege ultra claro */
--color-white: #ffffff; /* Branco Neve — Cards e relevos */

/* ═══ Cardinal Red (tokens semânticos) ═══ */
--color-wine: #a91d22; /* Cardinal Red */
--color-wine-dark: #8a171c;
--color-wine-deep: #6b1115;
--color-wine-soft: rgba(169, 29, 34, 0.08); /* Véu cardinal */

/* ═══ Rosa Pastel / Blush Mochi (Kawaii Softener) ═══ */
--color-rose: #f0c4ba;
--color-rose-light: #f9eae6;
--color-rose-soft: #f2d5ce;

/* ═══ Superfícies claras ═══ */
--color-cream: #faf7f2;
--color-cream-dark: #efe4d7; /* Faixas alternadas */
--color-parchment: #fdfbf8;
--color-ivory: #fdf8f3;

/* ═══ Texto ═══ */
--color-text: #242121; /* Sacristy Charcoal */
--color-ink: #242121;

/* ═══ Brand Colors ═══ */
--color-star-active: #fff3b0; /* Amarelo Estelar */
--color-success: #a8e6cf; /* Verde Menta */
--color-warning: #fff3b0; /* Amarelo Estelar */
--color-error: #ef4444;
--color-info: #6366f1;
--color-whatsapp: #25d366;
--color-btn-edit: #007bff;
```

### Layout e sombras

```css
--container-max-width: 1200px;
--radius-card: 20px;
--radius-button: 50px;
--radius-circle: 50%;
--transition-default: all 0.3s ease;

--color-shadow: rgba(169, 29, 34, 0.2); /* Derivada do Cardinal Red */
--shadow-card: 0 4px 6px var(--color-shadow);
--shadow-card-hover: 0 6px 12px var(--color-shadow);

/* Sombra "sticker" — offset duro, estética kawaii */
--shadow-sticker: 4px 4px 0 var(--color-wine);
--shadow-sticker-sm: 3px 3px 0 var(--color-wine);
--shadow-sticker-dark: 5px 5px 0 var(--color-wine-deep);
```

### Tipografia

```css
/* Fonte do corpo/UI (navbar, botões, inputs, textos gerais) */
--font-main:
  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
/* Fonte decorativa (títulos de páginas, nomes de categorias, títulos de itens) */
--font-title: "Sweet Apricot", cursive, sans-serif;
/* Fonte display arredondada (títulos chunky do redesign) */
--font-display: "Fredoka", "Inter", sans-serif;

/* Fontes dinâmicas — sobrescritas em runtime pelo admin (useConfiguracoesGlobais) */
--font-title-site / --font-navbar / --font-category / --font-title-item
  / --font-description / --font-button / --font-general

--font-size-xs: 0.75rem;
--font-size-sm: 0.9rem;
--font-size-md: 1rem;
--font-size-lg: 1.1rem;
--font-size-xl: 1.2rem;
--font-size-2xl: 1.4rem;
--font-size-2xl-plus: 1.6rem;
--font-size-3xl: 1.8rem;
--font-size-4xl: 2rem;
--font-size-5xl: 2.5rem;
--font-weight-regular: 400;
--font-weight-medium: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

> **REGRA:** Jamais use cores, fontes ou tamanhos fixos repetidos fora do `:root`. Sempre referencie via `var(--token)`.

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

## 10. Feature: Visibilidade de Produtos e Eventos

Produtos e eventos possuem o campo `visivel` (BOOLEAN, default TRUE). O sistema funciona assim:

- **Rotas públicas** (`GET /api/produtos`, `GET /api/eventos`): Retornam apenas itens com `visivel = TRUE`.
- **Rotas admin** (`GET /api/produtos/admin`, `GET /api/eventos/admin`): Retornam TODOS os itens.
- **Toggle** (`PATCH /:id/visibilidade`): Inverte o valor de `visivel`. Requer autenticação.
- **Uso:** Permite "esconder" itens temporariamente sem deletá-los (ex: sazonal, fora de estoque).

---

## 11. Categorias de Produtos

As categorias atuais do cardápio e loja são:

| Categoria          | Tipo                       |
| ------------------ | -------------------------- |
| Happy Hour         | Cardápio                   |
| Refeições          | Cardápio                   |
| 抹茶 - Matcha      | Cardápio                   |
| Doces Japoneses    | Cardápio                   |
| Croissants         | Cardápio                   |
| Sanduíches         | Cardápio                   |
| Doces e Sobremesas | Cardápio                   |
| Salgados           | Cardápio                   |
| Cafés              | Cardápio                   |
| Milkshakes         | Cardápio                   |
| Bebidas Mágicas    | Cardápio                   |
| Bebidas            | Cardápio                   |
| Bebidas Alcoólicas | Cardápio                   |
| Promoções          | Cardápio                   |
| Novidades          | Cardápio                   |
| Encomendas         | Cardápio                   |
| Black Friday       | Cardápio                   |
| Mangás             | Mangas (`is_manga = TRUE`) |
| Nossa Lojinha      | Loja (`is_loja = TRUE`)    |

---

## 12. Comandos de Desenvolvimento

### Docker (ambiente completo)

```bash
# Subir ambiente de DESENVOLVIMENTO (Docker usa docker-compose.override.yml automaticamente)
docker compose up -d

# Subir ambiente de PRODUÇÃO explicitamente
docker compose -f docker-compose.yml up -d

# Ver logs
docker compose logs -f backend
docker compose logs -f frontend

# Derrubar tudo
docker compose down

# Derrubar e limpar volumes (reset do banco)
docker compose down -v
```

### Backend (dev local, fora do Docker)

```bash
cd backend
pnpm install
pnpm dev         # tsx watch src/server.ts
pnpm db:migrate  # Executa as migrations pendentes
pnpm test        # vitest watch
pnpm test:ci     # vitest run (uma vez)
pnpm build       # tsc produção
pnpm lint        # eslint
pnpm db:reset    # Limpa e reseta o banco (TRUNCATE)
```

### Frontend (dev local, fora do Docker)

```bash
cd frontend
pnpm install
pnpm dev         # vite dev server :5174
pnpm test        # vitest watch
pnpm test:ci     # vitest run (uma vez)
pnpm build       # tsc + vite build
pnpm lint        # eslint
```

---

## 13. "Common Hurdles" e Soluções Documentadas

---

**Hurdle:** `docker compose build` do frontend falha em `pnpm install --frozen-lockfile` com `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` (Junho/2026).
**Causa:** O Dockerfile usa `corepack enable pnpm` e, sem o campo `packageManager` no `package.json`, o corepack baixa **a última versão do pnpm** — o pnpm 11.x não roda no Node 20 das imagens `node:20-alpine`. O backend nunca quebrou porque já tinha `"packageManager": "pnpm@10.20.0"` pinado.
**Solução:** Sempre pinar `"packageManager": "pnpm@10.x.x"` no `package.json` de **frontend e backend** (idealmente a mesma versão usada localmente, que gerou o lockfile). Se atualizar o pnpm local, atualize o pin junto.

---

**Hurdle:** Vite dev dentro do Docker falha com `Failed to resolve import "<pacote>"` logo após instalar uma dependência nova localmente (ex: `zod`).
**Causa:** O `docker-compose.override.yml` (modo dev) monta `./frontend` em `/app` e protege o `node_modules` com **volume anônimo** (`- /app/node_modules`). Esse volume congela o `node_modules` de quando o container foi criado e **sobrevive a `docker compose up --build`** — a imagem nova tem o pacote, mas o volume antigo a sobrepõe.
**Solução:** Após adicionar dependências, recrie o container renovando os volumes anônimos: `docker compose up -d --build --no-deps --force-recreate --renew-anon-volumes frontend` (vale igual para o `backend`, que usa o mesmo padrão).

---

**Hurdle:** Perda massiva de tokens de design (`--font-*`, `--radius-*`) no `index.css`.
**Causa:** Uso incorreto de ferramentas de edição (`replace_file_content`) em blocos grandes, resultando no apagamento acidental de definições localizadas no meio ou fim do bloco `:root`.
**Solução:** Sempre validar a integridade total do `index.css` após edições. Os tokens de tipografia e layout são a espinha dorsal da estética "fofa" (Fredoka + Arredondamento) e não podem ser removidos sob hipótese alguma. Se o site aparecer quadrado ou com fonte padrão, a primeira verificação deve ser os tokens do `:root`.

---

**Hurdle:** O antigo `HomeBanner` (banner de vídeo fullscreen da Home, com auto-hide ao scrollar) fazia a página "pular para baixo" ao rolar de volta para o topo (Junho/2026).
**Causa:** O `HomeBanner` reagia ao scroll alternando seu estado e mudando a **altura** (`max-height` de `100vh` → `0`). Como o banner é um elemento em fluxo no topo do `<main>`, qualquer mudança de altura adiciona/remove ~100vh de conteúdo acima do viewport; combinado com o scroll anchoring do navegador, a posição de scroll é empurrada para baixo ao retornar ao topo. Mesmo trocando o colapso por `opacity`, manter um listener de scroll alterando estado no topo continuou instável.
**Solução:** O `HomeBanner` foi **removido**. A Home reaproveita o componente genérico `Banner` (`<Banner pagina="home" />`), que é 100% estático em fluxo — sem listener de scroll, sem animação de altura. O usuário simplesmente rola por ele, sem reflow nem salto. **Regra geral:** nunca anime a altura nem alterne layout de elementos em fluxo no topo da página em resposta ao scroll; para "esconder ao scrollar", o elemento precisa estar fora do fluxo (`position: fixed`/`absolute`) ou simplesmente ser rolado para fora naturalmente, como o `Banner` faz.

---

**Hurdle:** Menu mobile com itens apertados e difícil de tocar.
**Solução:** O menu hambúrguer deve abrir um overlay espaçoso (80%+ de largura), com `flex-direction: column` e `justify-content: flex-start` para alinhar os itens ao topo. Use `gap` generoso.

---

**Densidade Mobile (Cardápio/Loja):** O padrão para exibição de produtos em dispositivos móveis é de **3 colunas** sem descrição, para maximizar a visibilidade de itens por tela. A descrição deve ser ocultada com `display: none` em media queries mobile.

---

**Solução:** Certifique-se de que `VITE_BACKEND_URL` no `frontend/.env` aponta para `http://localhost:3000` (ou a porta correta). Dentro do Docker, o CORS está configurado para aceitar `FRONTEND_URL` definido no `.env` raiz.

---

**Hurdle:** Imagens de produtos não aparecem no frontend.

**Solução:** As imagens são servidas pelo Express via `express.static` na rota `/images`. O `imagem_url` no banco deve ser o caminho relativo (ex: `/images/Mochi.webp`). No frontend, a URL completa é montada como `${VITE_BACKEND_URL}${produto.imagem_url}`. Verifique se o volume `./backend/public/images/` está mapeado corretamente no `docker-compose.yml`.

---

**Hurdle:** `init.sql` reseta o banco a cada restart do container.

**Solução:** O arquivo `init.sql` anteriormente continha `TRUNCATE TABLE ... CASCADE`. Para evitar perda de dados em produção e persistir dados em dev, essas linhas foram comentadas. Se precisar resetar o banco manualmente em desenvolvimento, utilize o comando `pnpm db:reset` na pasta /backend. Em produção, use sempre migrations (`backend/migrations/`).

---

**Hurdle:** CORS bloqueando requests do frontend em produção.

**Solução:** A variável `FRONTEND_URL` no `.env` raiz deve conter a URL exata do frontend em produção (ex: `https://mewworld.space`). O backend usa `cors(corsOptions)` que apenas aceita a origin configurada.

---

**Hurdle:** Porta do PostgreSQL em conflito (5432 já em uso).

**Solução:** O Docker Compose mapeia `DB_PORT_LOCAL` (padrão: 5433) para a porta local. Para conexão local fora do Docker, use a porta 5433. Dentro do Docker, os containers usam a rede interna na porta 5432 padrão.

---

**Hurdle:** Remoção acidental de imports críticos (ex: `styles`) durante edições parciais.
**Causa:** Uso de `multi_replace_file_content` ou `replace_file_content` onde o bloco `TargetContent` inadvertidamente exclui linhas no topo do arquivo ao tentar "limpar" ou "organizar" imports.
**Solução:** Sempre verificar se todos os imports necessários (especialmente `styles.module.css`) permanecem no arquivo após a edição. Se o componente falhar ao renderizar com erro de "styles is not defined", verifique o topo do arquivo.

**Hurdle:** `useDebugTela()` esquecido em produção.
**Causa:** O hook `useDebugTela` (em `hooks/useDebugTela.ts`) exibe informações de debug de dimensões de tela no ambiente de desenvolvimento. Ele foi importado e chamado em `MenuPage` e pode ser deixado acidentalmente em produção.
**Solução:** Garantir que `useDebugTela()` seja removido (ou comentado) de qualquer página antes de commitar para produção. Ele deve existir apenas como utilitário de desenvolvimento local.

---

**Hurdle:** Ambiguidade na busca de textos de categorias em testes (`TestingLibraryElementError: Found multiple elements with the text: X`).

**Causa:** O componente `CategoryFilter` cria botões com o nome da categoria, e o agrupamento no cardápio cria subtítulos (`h2`) com o mesmo nome. O `getByText` falha por encontrar ambos no DOM.

**Solução:** Sempre utilizar seletores mais específicos como `getByRole('heading', { name: 'Categoria', level: 2 })` para capturar especificamente o subtítulo do agrupamento, ou `getByRole('button', { name: 'Categoria' })` para interagir com os filtros.

---

**Hurdle:** Erro de Linter `Error: Calling setState synchronously within an effect can trigger cascading renders`
**Causa:** A nova versão do React/linter (`react-hooks/set-state-in-effect`) não permite chamadas síncronas de `setState` diretamente dentro do corpo do `useEffect`. Isso se aplica mesmo para funções de refresh encapsuladas em hooks e chamadas lá dentro.
**Solução:** 1. Utilize derivação de estado (_derived state_) síncrono durante o próprio `render` para evitar `useState` extra. 2. Inicializadores locais podem usar a sintaxe callback/lazy no `useState(() => getLocalItem)`. 3. Utilize um `setTimeout(..., 0)` para jogar o setState fora da _stack_ síncrona do useEffect. 4. Em último caso, use a flag `// eslint-disable-next-line react-hooks/set-state-in-effect` se for assíncrono garantido.

**Receita para o caso mais comum do projeto — "semear formulário com dado do servidor" (Agosto/2026).**
Painéis admin faziam `useEffect(() => { if (data) setForm(data) }, [data])`. Isso é o padrão oficial do React de **ajuste durante o render**: guarde a origem já aplicada num state e compare por referência.

```tsx
const [form, setForm] = useState(PADRAO);
const [origem, setOrigem] = useState<typeof data>(undefined);

if (data && data !== origem) {   // no corpo do componente, NÃO em useEffect
  setOrigem(data);
  setForm(mapear(data));
}
```

O React descarta o render em andamento e refaz imediatamente com o estado novo — não há flash nem render extra visível, ao contrário do `useEffect`, que pinta o formulário vazio por um frame antes de corrigir. Aplicado em `AdminBanners` (compara `pagina` **e** `banners`), `AdminFontes`, `AdminHomeEventos` e `ProdutoCard` (sincroniza `curtidas` da prop).

> Não confunda com `setState` no render **incondicional** — isso é loop infinito. A comparação com a origem é o que torna o ajuste convergente.

---

## 14. Testes

O projeto mantém testes unitários e de integração em ambos os lados:

> **Nomenclatura:** os testes do frontend usam **nomes em português** (`Cabecalho`, `Rodape`, `Inicio`, `Busca`, `PaginaCardapio`…), mesmo quando o componente testado tem nome em inglês. Não crie `Header.test.tsx` — confira a lista antes de adicionar arquivo novo.

### Backend (`backend/src/tests/`)

- `sanity.test.ts` — Teste de sanidade
- `autenticacao.test.ts` — Autenticação
- `autenticacaoMiddleware.test.ts` — Guard JWT
- `produtos.test.ts` — CRUD de produtos
- `pedidos.test.ts` — CRUD de pedidos
- `EventoRoutes.test.ts` — CRUD de eventos
- `instagram.test.ts` — CRUD de posts do Instagram
- `configuracao.test.ts` — Configurações e fontes customizadas
- `cupons.test.ts` — Campanhas e cupons
- `formatadores.test.ts` — Funções utilitárias

### Frontend (`frontend/src/tests/`)

**Sanidade e utilitários:** `sanity.test.ts`, `formatadores.test.ts`, `ordenarProdutos.test.ts`, `design-tokens.test.ts` (valida a paleta do `:root`).

**Páginas:** `Inicio.test.tsx` (Home), `PaginaCardapio.test.tsx`, `PaginaEventos.test.tsx`, `EventoDetalhes.test.tsx`, `MaidDetalhes.test.tsx`, `Agendar.test.tsx`, `Parceiros.test.tsx`.

**Componentes públicos:** `Cabecalho.test.tsx` (Header), `Rodape.test.tsx` (Footer), `HeroSection.test.tsx`, `HowItWorksSection.test.tsx`, `AboutSection.test.tsx`, `MaidCarousel.test.tsx`, `InstagramSection.test.tsx`, `ParceirosSection.test.tsx`, `ProdutoCard.test.tsx`, `EventoCard.test.tsx`, `CalendarioEventos.test.tsx`, `Busca.test.tsx` (Search), `CartModal.test.tsx`, `AddressMapModal.test.tsx`, `MenuContentEmptyState.test.tsx`, `MenuSeparation.test.tsx`.

**Admin:** `AdminRestrito.test.tsx` (LoginModal na ausência de token), `AdminEventos.test.tsx`, `AdminCupons.test.tsx`, `AdminFontes.test.tsx`, `AdminInstagram.test.tsx`, `AdminNavbar.test.tsx`, `AdminSecoesHome.test.tsx`.

**Hooks e visibilidade:** `useCarrinho.test.tsx`, `useConfiguracoes.test.tsx`, `useSecoesHome.test.tsx`, `useNavVisibilidade.test.tsx`, `NavVisibilidade.test.tsx`.

> **Regra:** Após qualquer alteração, rode `pnpm test:ci` no módulo afetado para garantir que nada quebrou.

---

## 15. Checklist Pós-Implementação (Por Feature)

- [ ] Os testes unitários foram escritos e estão passando?
- [ ] O código passou pelo linter (`pnpm lint`)?
- [ ] Os tokens CSS estão no `:root` do `index.css`?
- [ ] A feature funciona tanto localmente quanto via Docker?
- [ ] Se criou nova tabela/coluna, o `init.sql` foi atualizado?
- [ ] Se criou nova rota, ela segue o padrão existente (Model → Controller → Route)?
- [ ] Se é rota admin, o `autenticacaoMiddleware` foi aplicado?
- [ ] Loading e Error states estão sendo tratados na UI?
- [ ] Se criou nova aba no admin, ela foi adicionada ao array `gruposDeTabs`?
- [ ] O `GEMINI.md` foi atualizado com as novas informações?

---

## 16. Boas Práticas e Protocolos de Qualidade Recentes

Ao longo das otimizações dos testes e padronização contínua do Maid Café, estas convenções de código tornaram-se vitais:

1. **Cobertura Mínima de Testes (TDD):**
   Ao estruturar as APIs do servidor (como Middlewares guardiões), **não deixe código vital de segurança com linhas não-cobertas**. Assegure que as rotinas de verificação do `AppError` dentro de blocos `catch` ou retornos de transação bloqueiam e recebem mocks apropriados (`vi.spyOn(jwt, 'verify')`). Todas as rotas administrativas (`/admin`, POSTs, PUTs, DELETEs) devem ter simulação de status válidos (200, 201) e inválidos (404, 500) usando `supertest` no Backend.
   **Catálogo Backend TDD (`vitest --coverage > 85%`)**: `EventoRoutes.test.ts` (cleanup de imagens falho via `fs.unlink`), `produtos.test.ts` (painel admin de produtos e delete), `pedidos.test.ts` (update de status) e `autenticacaoMiddleware.test.ts` (guard JWT).

   Isso se repete para o Frontend. Rotas privadas do React devem ter suas amarras cobertas por `AdminRestrito.test.tsx`, provando que o `LoginModal` acende na ausência de token (`localStorage.getItem("token")`). Use `vi.mock` extensivamente para desviar componentes-filhos indesejados nas baterias curtas. Componentes que dependem de `useNavigate` precisam sempre ser renderizados dentro do wrapper `<BrowserRouter>`.

2. **Laços de Mockamento Assíncronos (Vitest + pg):**
   Quando mockamos o método `pool.query` ou assemelhados e o controlador testado faz buscas em cadeia (como um `.map` executando `buscarItens` em cada pedido listado), deve-se enfileirar chamadas com `mQuery.mockResolvedValueOnce()` adequadas para suprir tanto a listagem primária _quanto_ os iteradores secundários, ou o teste sofrerá colapso por array vazia acidental.

3. **Qualidade Estrita do ESLint 9+ (Full Stack):**
   A nova infraestrutura abraça a checagem sintática dupla (Frontend e Backend) usando Flat Configuration (`eslint.config.js`). Qualquer código novo submetido no backend deverá passar obrigatoriamente pelas amarras do `pnpm lint` via `eslint src/ && tsc --noEmit` garantindo unificação de boas práticas.

4. **Tratamento de Ciclos Síncronos do React 19:**
   O React Linter agora ataca a inserção prematura de `setState` correndo abertamente na função `useEffect`. Requererá sempre o uso de atrasos inofensivos (`setTimeout`), derivação direta do `.map` no render, ou lazy initializer callback ao extrair storage na montagem (`useState(() => localStorage.getItem("X"))`).

---

## 17. Gerenciamento de Estado Assíncrono (TanStack Query)

- **Regra de Requisições:** Todas as requisições GET para consumo de dados públicos do projeto (Produtos, Eventos) devem ser encapsuladas por hooks do `@tanstack/react-query` (ex: `useQuery`).
- **Testes com TanStack Query:** Todo e qualquer teste de componente React que renderize indiretamente um hook como `useProdutos` **obrigatoriamente** precisa ter seu Wrapper englobado por um `<QueryClientProvider client={queryClient}>`. Caso contrário, os testes do Vitest falharão com o erro `No QueryClient set`.
- **Exemplo de Wrapper para testes:**
  ```tsx
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Componente />
      </BrowserRouter>
    </QueryClientProvider>,
  );
  ```

## 18. Passos Exatos de Deploy e Atualização (Docker)

Quando for realizar o deploy ou atualizar a aplicação em produção com novos códigos, utilize a seguinte sequência:

1. Faça pull das alterações do repositório no servidor.
2. Certifique-se de que o arquivo `.env` da raiz está configurado (especialmente o `TUNNEL_TOKEN` e as senhas de banco).
3. Execute o build limpo forçado das imagens multi-stage:
   `docker compose build --no-cache`
4. Recrie e suba os containers sem afetar os volumes persistentes:
   `docker compose up -d`
5. (Apenas em primeira execução ou grandes mudanças no schema) Rode as migrations dentro do container do backend:
   `docker exec -it maid_backend pnpm db:migrate`
   > O script real é `backend/migrate_db.ts` (raiz do backend, **não** em `scripts/`). Já `backend/scripts/reset_db.ts` é o `pnpm db:reset` — nunca rode em produção.

## 19. Padrões de Variáveis em Build de Frontend

- O Nginx serve arquivos estáticos já construídos (build phase). Diferente do backend, o container do frontend não lê o `.env` em tempo de execução (runtime). Todas as variáveis de ambiente necessárias (ex: `VITE_BACKEND_URL`) devem estar presentes no momento do `docker compose build`.

---

## 20. 🛡️ Vulnerabilidades Corrigidas

1. **Upload de Arquivos Sem Restrição (Crítico):**
   - **Brecha:** O servidor aceitava qualquer tipo de arquivo, permitindo que atacantes subissem scripts maliciosos (RCE).
   - **Correção:** `fileFilter` no Multer restringindo a **imagens e vídeos** (`jpeg|jpg|png|gif|webp|mp4|webm|mov`), validando **mimetype e extensão** juntos, com limite de 50MB. O nome do arquivo salvo é randomizado (`crypto.randomBytes(16)`) para evitar path traversal e colisão. Uploads de fonte usam um filtro separado em `config/uploadFonte.ts` (.woff2).

2. **Segredo JWT Inseguro (Médio):**
   - **Brecha:** Havia um valor padrão ("segredo") caso a variável de ambiente não fosse carregada, o que facilitaria ataques de força bruta.
   - **Correção:** Removi o fallback. Agora, se `JWT_SECRET` não estiver no `.env`, o servidor lança um erro interno, garantindo que nunca rode em modo inseguro.

3. **Validação de Header Fraca (Baixo):**
   - **Brecha:** O código não verificava se o header de autorização seguia o padrão `Bearer <token>`, podendo causar erros inesperados.
   - **Correção:** Adicionei uma validação estrita do formato do header antes do processamento.

## 21. Gerenciamento Dinâmico de Banners

> ⚠️ **Status pós-redesign 2026:** o `Banner` foi removido de **Cardápio, Loja, Mangás e Eventos**. A **Home ainda o renderiza** como primeira seção do `main` (`<Banner pagina="home" />`), condicionado à chave `secao_home_banner`. A API, a tabela `banners` e a aba Admin → Banners seguem plenamente em uso.

- **Chave de Página:** Os banners são atrelados a uma `pagina` (ex: 'home', 'cardapio', 'eventos', 'loja').
- **Fallback Automático:** Caso uma página não tenha banner definido, o sistema busca obrigatoriamente a entrada com `pagina = 'padrao'`.
- **Mídia Suportada:** Imagens (JPEG, PNG, WEBP) e Vídeos (MP4, WEBM) até 50MB.

## 22. Autocomplete Inteligente (Admin)

- **Categorias e Tags:** O `ProdutoForm` realiza extração automática de todas as categorias e tags já existentes no banco de dados para sugerir ao administrador durante o cadastro.

## 23. Gerenciamento Dinâmico de Fontes

- **7 Categorias Parametrizáveis:** Permite configurar independentemente a tipografia de: Títulos do Site, Navbar, Categorias, Títulos de Itens, Descrições, Botões e Texto Geral.
- **Hook Global:** O hook `useConfiguracoesGlobais()` chamado no `App.tsx` busca as configurações ativas, injeta `@font-face` dinâmico caso seja fonte customizada, e solicita Google Fonts automaticamente para fontes padrão built-in, além de injetar os tokens CSS globais.
- **Segurança de Deleção:** Impede exclusão de arquivos de fontes em uso via Backend, varrendo todas as chaves da tabela de configurações para confirmar inexistência de dependência antes de deletar fisicamente da pasta `public/fonts/`.
- **Scroll Infinito:** Dropdowns de sugestão não possuem limite de exibição e utilizam `max-height` com scroll interno para manter a usabilidade.

## 24. Padronização de Layout Admin (UI/UX)

- **Estrutura (redesign 2026):** O `AdminDashboard` usa layout de **sidebar + conteúdo**: header sticky parchment com wordmark + selo "Painel Admin" + botão Sair (cardinal), e à esquerda uma sidebar card (sticker) com as abas **agrupadas por área**: _Operação_ (Pedidos, Cupons), _Catálogo_ (Cardápio, Loja, Mangás), _Conteúdo_ (Eventos, Banners, Instagram) e _Aparência_ (Fontes). Os grupos são definidos no array `gruposDeTabs` em `AdminDashboard/index.tsx` — novas abas devem ser adicionadas lá (id + label + ícone lucide). Em mobile (≤900px) a sidebar vira blocos empilhados acima do conteúdo.
- **Troca de aba:** usar `handleTabChange()` (limpa o form de edição de forma event-driven). NÃO reintroduzir `useEffect` com `setState` síncrono para isso (regra do linter React 19).
- **Conteúdo:** O painel ativo renderiza dentro de `.adminMain` (card branco com borda cardinal). Abas internas devem respeitar o `max-width: var(--container-max-width)` e padding superior de `1rem`.
- **Identidade Visual:** Botões de ação seguem `--color-success` (verde/salvar) e `--color-warning` (amarelo/editar) para rápida identificação funcional; ações primárias do shell admin (Sair, login) seguem o padrão cardinal/sticker do redesign.
- **LoginModal:** convertido de inline styles para CSS Module (`LoginModal/styles.module.css`) no padrão sticker.

## 25. Backup e Manutenção (Mini PC)

Para garantir a integridade dos dados do Mew Mew Café, existe um sistema de backup automatizado configurado para o ambiente de produção rodando nativamente no host Windows.

- **Localização do Script:** `scripts/backup.ps1` (na raiz do projeto).
- **Conteúdo do Backup:**
  - Dump completo do banco de dados PostgreSQL (`maid_postgres`).
  - Pasta de imagens de produtos e eventos (`backend/public/images`).
  - Pasta de fontes customizadas (`backend/public/fonts`).
  - Arquivos `.env` (Raiz, Backend e Frontend) para referência de configurações.
- **Destino:** Cloudflare R2 via `rclone`.
- **Requisitos:**
  - `rclone` instalado no Windows (`winget install Rclone.Rclone`).
  - Remoto configurado (`rclone config`) com o nome exato de `cloudflare_r2` apontando para o bucket `mewmew-backups`.
- **Agendamento (Agendador de Tarefas do Windows):**
  Para rodar de forma invisível e com privilégios elevados todos os dias às 03:00 AM, o agendamento deve ser criado no PowerShell (executar como administrador):
  ```powershell
  schtasks /create /tn "MewMew_Daily_Backup" /tr "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File C:\Users\pdvme\Documents\GitHub\maidcafenatal\scripts\backup.ps1" /sc daily /st 03:00 /ru COZINHA\pdvme /rl highest
  ```

---

## 26. SEO e Indexação (Google Search)

O site possui configurações completas de SEO para ser encontrado em buscas como "mew mew", "mew mew cafe natal", "maid cafe natal", etc.

#### Arquivos de SEO (`frontend/public/`)

| Arquivo                | Descrição                                                       |
| ---------------------- | --------------------------------------------------------------- |
| `robots.txt`           | Permite indexação geral, bloqueia `/admin` e `/cupons`          |
| `sitemap.xml`          | Mapa do site com todas as páginas públicas, prioridades e datas |
| `favicon.svg`          | Ícone circular otimizado para a aba do navegador e PWA          |
| `manifest.webmanifest` | Web App Manifest para PWA/browser integration                   |

#### Meta Tags no `index.html`

- **Título SEO:** "Mew Mew Maid Café Natal | Maid Café em Natal/RN"
- **Meta Description:** Descrição rica com keywords naturais
- **Meta Keywords:** Variações de busca ("mew mew", "maid cafe natal", "cafe tematico natal", etc.)
- **Canonical URL:** `https://mewworld.space/`
- **Open Graph:** Título, descrição, imagem e locale para compartilhamento social (Facebook, WhatsApp)
- **Twitter Card:** Summary large image com título e descrição
- **Geo Tags:** Coordenadas geográficas de Natal/RN para buscas locais
- **Lang:** `pt-BR` no `<html>` para sinalizar idioma ao Google

#### Structured Data (JSON-LD)

- **Schema `CafeOrCoffeeShop`:** Nome, endereço, horários de funcionamento, telefone, redes sociais, cardápio e tipo de culinária
- **Schema `WebSite`:** Nome e URL do site para Sitelinks no Google
- **`alternateName`:** Variações do nome ("Mew Mew Café", "Maid Café Natal", "MewMew Natal", "Mew World") para ampliar a descoberta

#### Nginx (`nginx.conf`)

- Location blocks explícitos para `robots.txt` e `sitemap.xml` com Content-Types corretos
- Cache de 6 meses para estáticos, incluindo `.webmanifest` e `.xml`

#### Próximos Passos de SEO (Manual)

TODO - **Imagem OG dedicada:** Substituir o `Logo.svg` por uma imagem PNG/JPG de 1200x630px específica para preview em redes sociais

---

## 27. Padrões de Estrutura do Frontend

#### Ordenação de Seções nas Páginas Públicas

A estrutura padrão é: `Header` (sticky, no topo) → `main` → `Footer`.

Na **Home**, o `main` contém, nesta ordem, cada seção condicionada por `useSecoesHome()`:

`Banner` (`pagina="home"`) → `HeroSection` → `HowItWorksSection` → `MaidCarousel` → `EventsSection` → `AboutSection` → `InstagramSection` → `ParceirosSection` → `ClubeMewSection`

Nas **demais páginas públicas** o conteúdo abre direto abaixo do Header, sem `Banner`. Ver seção 30.

> **Nota:** `HighlightsSection`, `NewArrivalsSection` e `PopularSection` continuam no código mas **não são renderizados em lugar nenhum** (órfãos do redesign de Jun/2026). Avaliar remoção numa limpeza futura.

#### Padrão CSS Module

Cada componente tem obrigatoriamente uma pasta com `index.tsx` + `styles.module.css` (plural). Use sempre `styles.module.css` — a variante `style.module.css` (singular) está sendo depreciada e padronizada para o plural.

#### Dados Estáticos de Maids

Os dados dos perfis das maids (nome, foto, bio, etc.) são armazenados em `frontend/src/data/` como arquivos TypeScript estáticos, não vindos da API. A rota `/maids/:id` usa esse `data/` para renderizar `MaidDetalhes`.

#### Nomenclatura de Arquivos de Testes

Testes do frontend ficam em `frontend/src/tests/`. O padrão é `NomeComponente.test.tsx` para componentes e `nomeFuncao.test.ts` para utilitários.

---

## 28. Problemas de CSS Identificados (Backlog de Refatoração)

#### ✅ Corrigidos

| Problema | Localização | Correção Aplicada |
| --- | --- | --- |
| `var(--font-size-xs)` usada mas não definida | `ProdutoCard/styles.module.css` | Adicionado `--font-size-xs: 0.75rem;` ao `:root` do `index.css` |
| Variáveis CSS duplicadas no `:root` | `index.css` | Removida segunda declaração de `--container-max-width`, `--radius-*`, `--shadow-card`, `--shadow-card-hover`, `--transition-default`. `--shadow-sm/md/lg` consolidadas no bloco único de layout |
| `background: #007bff` hard-coded no `.btnEdit` | `ProdutoCard/styles.module.css` | Criada variável `--color-btn-edit: #007bff` no `index.css`; `.btnEdit` agora usa `var(--color-btn-edit)` |
| Nomenclatura inconsistente `style.module.css` | `AdminDashboard/`, `ProdutoForm/` | Renomeados para `styles.module.css`; imports atualizados; arquivos órfãos de `LoginModal/` e `Admin/` deletados |
| `font-weight: bold` hard-coded no `.addToCartBtn` | `ProdutoCard/styles.module.css` | Substituído por `var(--font-weight-bold)` |

#### ✅ Débito Adicional — Resolvido

`font-weight: bold` eliminado de todos os arquivos CSS do projeto. Todos os 10 arquivos afetados agora usam `var(--font-weight-bold)`.

---

## 29. Esteira de CI/CD (GitHub Actions)

Para deploy automático e testes contínuos antes de ir para produção, foi criada uma pipeline no GitHub Actions (`.github/workflows/ci-cd.yml`).

#### Funcionamento da Pipeline

1. **Continuous Integration (CI):** Roda em Pull Requests e Pushes para as branches `main` e `master`.
   - Faz checkout do código, configura o Node.js e faz cache com o `pnpm`.
   - Roda linter, executa a suíte de testes unitários/integração (`test:ci`) e valida o build de produção tanto no **Frontend** quanto no **Backend**.
2. **Continuous Deployment (CD):** Roda apenas se a etapa de CI passar com sucesso e o evento for um `push` direto nas branches principais.
   - Conecta ao servidor VPS via SSH.
   - Executa o `git pull` para trazer a versão mais recente do código.
   - Executa `docker compose up -d --build --no-deps backend frontend` para reconstruir e atualizar as aplicações sem afetar ou derrubar o banco de dados.
   - Limpa imagens antigas não utilizadas (`docker image prune -f`) para liberar espaço em disco.

#### Configuração dos Secrets no GitHub (Mandatório)

Antes do deploy de amanhã, adicione as seguintes chaves em **Settings > Secrets and variables > Actions > Repository secrets** no seu repositório do GitHub:

| Nome do Secret | Descrição | Exemplo / Valor |
| :--- | :--- | :--- |
| `SSH_HOST` | Endereço IP público ou DDNS do Mini-PC de produção | `mewmew-vps.ddns.net` ou IP externo |
| `SSH_USER` | Nome do usuário Windows no Mini-PC | `pdvme` |
| `SSH_PRIVATE_KEY` | Conteúdo da chave privada SSH associada ao OpenSSH Server do Windows | Inicia com `-----BEGIN OPENSSH PRIVATE KEY-----` |
| `SSH_PORT` | Porta SSH (padrão: 22 ou a porta redirecionada no roteador do amigo) | `22` ou `2222` |
| `WORK_DIR` | Caminho absoluto do repositório no Windows | `C:\Users\pdvme\Documents\GitHub\maidcafenatal` |

---

## 30. Redesign do Frontend 2026 ("Parchment · Cardinal · Blush Mochi")

Remodelagem do frontend iniciada pela **Home** e **estendida a todas as páginas públicas**, seguindo a referência visual `frontend/public/claude.jpg`. A estética é a de um maid & mangá café aconchegante: **cardinal red**, **parchment/bege** e **blush mochi (rosa)**, com cards brancos de borda cardinal e "sombra sticker" (offset duro), pills verde-menta e títulos chunky na fonte **Fredoka**.

### 30.1. Tokens no `index.css` (paleta unificada)

A paleta legada rosa pastel foi **unificada** com a do redesign: os tokens legados (`--color-primary`, `--color-background`, etc.) agora apontam para os valores Cardinal/Parchment, e os tokens semânticos do redesign (`--color-wine`, `--color-cream`, etc.) usam os mesmos valores. `design-tokens.test.ts` valida a paleta vigente — mantenha o teste e o `:root` sempre em sincronia.

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-wine` (= `--color-primary`) | `#a91d22` | Cardinal Red — heros, footer, bordas de card, CTAs |
| `--color-wine-dark` / `--color-wine-deep` | `#8a171c` / `#6b1115` | Hover, contornos e sombras projetadas |
| `--color-cream` (= `--color-background`) | `#FAF7F2` | Bege Clarinho — fundo de seções claras e wallpaper |
| `--color-parchment` / `--color-ivory` | `#FDFBF8` / `#fdf8f3` | Cards/relevos claros e texto sobre cardinal |
| `--color-rose` / `--color-rose-light` / `--color-rose-soft` | `#F0C4BA` / `#F9EAE6` / `#F2D5CE` | Rosa Pastel — marcador de texto, chips e fundos suaves |
| `--color-mint-pill` (+`-border`) | `#b8e6c8` / `#7fcf9c` | Pills de status (estilo da referência) |
| `--color-ink` (= `--color-text`) | `#242121` | Sacristy Charcoal — títulos display sobre parchment |
| `--shadow-sticker` (+`-sm`, `-dark`) | offset duro cardinal | Sombra "adesivo" dos cards/botões |
| `--font-display` | `"Fredoka", "Inter", sans-serif` | Títulos chunky arredondados (import do Google Fonts no topo do `index.css`) |

### 30.1b. Aplicação nas demais páginas públicas

O padrão visual foi propagado para **Cardápio, Loja Online, Mangás, Eventos, EventoDetalhes, MaidDetalhes, Cupons e ProdutoDetalhesLoja** via:

- **Componentes compartilhados restilizados:** `ProdutoCard`, `CategoryFilter`, `Search`, `EventoCard`, `CalendarioEventos`, `CartButton`, `CartModal`, `ProdutoDetalhesModal`, `MenuContent` e `Banner` — todos com borda `var(--color-wine)` (2–3px), `var(--shadow-sticker*)` e hover com `translate(-2px, -2px)` + sombra mais profunda.
- **Receita do card sticker:** `background: var(--color-white); border: 2px solid var(--color-wine); border-radius: var(--radius-card); box-shadow: var(--shadow-sticker-sm);` + hover `transform: translate(-2px,-2px); box-shadow: var(--shadow-sticker);`.
- **Receita do botão primário:** `background: var(--color-wine); color: var(--color-ivory); border: 2px solid var(--color-wine-deep); border-radius: var(--radius-button); box-shadow: var(--shadow-sticker-sm);`.
- **`ProdutoDetalhesLoja`** foi convertida de inline styles hard-coded (`#ff69b4`) para CSS Module (`styles.module.css`) usando exclusivamente tokens — siga sempre esse padrão.

### 30.2. Estrutura da Home

> ⚠️ Atualizada pelo pivô de Junho/2026 — ver seção 31.

`Header` (sticky, com rolling banner marquee no topo + wordmark + CTA "Agendar evento" → `/agendar`) → `main` → `Footer` (vinho, colunas Cardápio / O café + sociais).

**Cada seção do `main` é condicionada por `useSecoesHome()`** — se a chave estiver `"false"` na tabela `configuracoes`, ela não renderiza. Ordem real ([pages/Home/index.tsx](frontend/src/pages/Home/index.tsx)):

| # | Componente | Chave | Observações |
| - | ---------- | ----- | ----------- |
| 1 | `Banner pagina="home"` | `secao_home_banner` | Vídeo/imagem gerenciado pelo Admin → Banners |
| 2 | `HeroSection` | `secao_home_hero` | Mascote, highlight rosa em "invocadx", CTAs e tags de serviços |
| 3 | `HowItWorksSection` | `secao_home_como_funciona` | 4 passos; âncora `#como-funciona`; 4º card é CTA para `/agendar` |
| 4 | `MaidCarousel` | `secao_home_maids` | Fundo vinho; painéis diagonais clicáveis |
| 5 | `EventsSection` | `secao_home_eventos` | Agenda fixa editável em Admin → Agenda da Home |
| 6 | `AboutSection` | `secao_home_sobre` | "Magia japonesa na sua festa", âncora `#sobre` |
| 7 | `InstagramSection` | `secao_home_instagram` | Mosaico padronizado: 5 posts + card do perfil; some se a API não retornar posts |
| 8 | `ParceirosSection` | `secao_home_parceiros` | Grid 2 col de `ParceiroCard` + CTA "Ver todos" → `/parceiros`. Ver seção 33 |
| 9 | `ClubeMewSection` | `secao_home_clube_mew` | Clube Mew — cupom via WhatsApp |

> `HighlightsSection` **não faz mais parte da Home** (removida em Jun/2026); o componente segue no repositório como órfão.

### 30.3. Assets e fontes

- Imagens de referência ficam em `frontend/public/imgrefs/` (logos, wordmarks, `mascot.png`, maids). Para uso em produção, os arquivos necessários foram **copiados** para `frontend/public/`: `mascot.png`, `wordmark-cardinal.png` (Header, sobre bege), `wordmark-ivory.png` (Footer, sobre vinho), `logo-rose.png`.
- A fonte display **Fredoka** é carregada via `@import` do Google Fonts no topo do `index.css`.

### 30.4. Restrições de teste preservadas

- **`Cabecalho.test.tsx`:** o Header mantém o texto da marca `Mew Mew Café` (visualmente oculto via classe acessível), os 6 links (`Início`, `Cardápio`, `Loja Online`, `Mangás`, `Eventos`, `Cupons` → `/cupons`), o CTA "Agendar evento" → `/agendar` e o rolling banner (testes de marquee duplicado, ausência de local físico e esconder/reexibir no scroll).
- **`Rodape.test.tsx`:** o Footer mantém o copyright iniciando por `© 2025 Mew Mew Maid Café`, os links sociais com `aria-label` "Siga nosso Instagram" / "Fale conosco no WhatsApp", e testes negativos garantindo ausência da coluna "Visite"/endereço físico. Os links de navegação do footer usam `<a href>` (não `<Link>`), pois o teste renderiza o `Footer` sem `BrowserRouter`.
- **`MaidCarousel.test.tsx`:** todas as 5 maids de `data/maidsData.ts` (Sakura, Luna, Mint, Hana, Yuki) são renderizadas como painéis diagonais — cada painel é um `<Link>` para `/maids/:id` com `img alt={nome}` e nome em overlay. Testes negativos garantem ausência do seletor de avatares, das setas e do card de destaque (design antigo).
- **`Inicio.test.tsx`** foi atualizado para a nova composição (mocka Header, Hero, Highlights, MaidCarousel, HowItWorks, About e Footer).
- **`HeroSection.test.tsx` / `AboutSection.test.tsx` / `HowItWorksSection.test.tsx` / `Agendar.test.tsx`:** cobrem os textos do pivô para eventos (seção 31) e incluem testes negativos contra textos do modelo presencial — ao alterar copy dessas seções, atualize os testes junto.

> **Hurdle (screenshot local sem Playwright):** Para validar a Home visualmente sem dependências de browser automation, suba o dev server (`pnpm dev`, porta 5174) e use o Edge headless: `msedge --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=9000 --window-size=1440,3200 --screenshot=out.png http://localhost:5174/`. O `--virtual-time-budget` é necessário para dar tempo de render antes do print.

---

## 31. Pivô do Negócio — Eventos, Encomendas e Delivery (Junho/2026)

O café **não opera mais presencialmente**. O negócio agora é: **eventos personalizados** (aniversários, formaturas, confraternizações), **kit festa**, **encomendas de doces/comidas** e **delivery**. Regra editorial: **nenhuma página pública pode referenciar local físico, mesa, visita presencial ou endereço** — ao criar/editar copy, foque na experiência levada até o cliente.

### 31.1. Mudanças aplicadas no frontend

- **Header:** a `.topBar` estática virou um **rolling banner (marquee)** com animação CSS pura (`@keyframes marqueeScroll`, track com o conteúdo duplicado animado até `translateX(-50%)` para loop contínuo; a cópia leva `aria-hidden`). O banner **some ao rolar** a página (`useEffect` + listener de scroll passivo; threshold de 50px em `LIMITE_SCROLL_BANNER`) com `translateY(-100%)` + colapso de `max-height`. Expõe `data-testid="rolling-banner"` e `data-visible` para os testes. Itens do banner em `ITENS_BANNER`. Pausa no hover e respeita `prefers-reduced-motion`. CTA do Header: `<Link to="/agendar">Agendar evento</Link>` (não há mais link direto pro WhatsApp).
- **HeroSection:** badge "A experiência maid café mais mágica do Nordeste"; subtítulo focado em eventos/delivery/kit festa; tags com emoji (🎂 Aniversários temáticos / 🎓 Formaturas & eventos / 📦 Delivery & encomendas).
- **HowItWorksSection:** eyebrow "✨ Conheça a experiência", título "Como funciona", 4 passos novos (Sparkles, Cake, PartyPopper, ArrowRight). O 4º passo ("Faça sua encomenda") é um `<Link to="/agendar">` com classe `.stepCta` (fundo wine, texto ivory); o `<li>` dele usa `display: contents` para o Link assumir a célula do grid.
- **MaidCarousel:** redesign "team showcase" — 5 painéis (um por maid em `data/maidsData.ts`) com corte diagonal (`clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%)`) sobrepostos via `margin-left` negativo; cada painel é um `<Link>` para `/maids/:id` com nome em overlay de gradiente + barra de accent na cor da maid (`--maid-color`). Hover/focus-visible: `flex-grow: 1.7`, imagem mais vívida, nome destacado. Mobile (≤600px): **mantém as fatias diagonais**, apenas quebrando a faixa em linhas (3 fatias em cima + 2 embaixo p/ as 5 maids) via `flex-wrap` — ver seção 32. Tablets/desktop (>600px) seguem na faixa única. Sem avatares, setas ou card de destaque.
- **AboutSection:** título "Magia japonesa na sua festa", texto sobre a experiência de eventos, benefícios com emoji, CTA "Agende seu evento" → `/agendar`.
- **Footer:** coluna "Visite" (endereço/telefone) **removida**; descrição focada em eventos/delivery; copyright © 2025.

### 31.2. Página `/agendar` (`AgendarPage`)

Formulário de agendamento que redireciona para o WhatsApp com mensagem pré-preenchida (mesmo padrão do `CartModal`: `window.open("https://wa.me/<numero>?text=" + encodeURIComponent(msg))`).

- **Campos:** Tipo de serviço (5 cards-radio clicáveis com emoji: 🎂 Aniversário temático, 🎓 Formatura / Confraternização, 📦 Encomenda de doces/comidas, 🎉 Evento personalizado, 🚚 Delivery — input radio visualmente oculto mas acessível/focável), Nome completo*, Telefone* (máscara `(XX) XXXXX-XXXX`), Data desejada*, Horário preferido, Local do evento, Número de convidados, Detalhes adicionais. Botão: "Enviar pelo WhatsApp ♡".
- **Validação:** **zod** (dependência adicionada em Junho/2026, v4) via `esquemaAgendamento.safeParse`; erros por campo extraídos de `error.issues` (compatível v3/v4 — evite `error.flatten()`, deprecado na v4). Obrigatórios: tipoServico, nome, telefone, data.
- **Mensagem gerada:** começa com `🎀 Novo pedido — Mew Mew Café 🎀`, lista `Tipo/Nome/Telefone/Data (dd/mm/aaaa)` + opcionais preenchidos e termina com `Enviado pelo site mewworld.space`. Número de destino em `WHATSAPP_MEW_MEW` (`558486643897`).
- **Estilo:** hero cream com dots pattern (`radial-gradient` cardinal a 8%), form em card sticker, cards de serviço selecionados ficam com `var(--color-rose-light)` + borda mais grossa, inputs com `var(--radius-card)` e borda cardinal no focus. Mobile-first (grid colapsa para 1 coluna).
- **Testes:** `Agendar.test.tsx` — hero, radios, campos, mensagem decodificada do `window.open` mockado, e bloqueio de envio com erros zod visíveis.

### 31.2b. Checkout do carrinho — busca de endereço no mapa

O `AddressMapModal` (usado pelo `CartModal` no checkout de delivery) tem **busca de endereço por texto com autocomplete** (Nominatim `/search`, `countrycodes=br` + viewbox priorizando Natal, debounce de 450ms a partir de 3 caracteres). Ao escolher uma sugestão, o componente `FlyToController` (filho com `useMap()`) executa `map.flyTo(coords, 17)` — o `center` do `MapContainer` só vale na montagem, então **toda recentralização pós-mount deve usar esse padrão** (o GPS inicial também usa). Arrastar o mapa segue funcionando para ajuste fino do pino, com reverse geocode no `moveend`. Testes em `AddressMapModal.test.tsx` mockam `react-leaflet` (`vi.hoisted` para o spy de `flyTo`) e o `fetch` do Nominatim.

### 31.3. Hurdles desta fase

- **`getByLabelText` × `aria-label` do Footer:** em páginas que renderizam o `Footer`, `getByLabelText(/WhatsApp/i)` casa também com o ícone social ("Fale conosco no WhatsApp"). Use a string exata (`getByLabelText("WhatsApp")`) ou labels mais específicos.
- **`getByText` com copy repetida:** textos que aparecem no parágrafo e num chip/benefício (ex: "Doces temáticos" no AboutSection) quebram `getByText` por match múltiplo — teste pelo texto exato do chip (com emoji) ou use `getAllByText`.
- **Borda de accent + `clip-path`:** borda comum vaza do recorte diagonal; use um pseudo-elemento interno (`::after` com `background-color`) que é clipado junto com o painel.
- **SVG Favicon e recursos externos:** Navegadores bloqueiam requisições a recursos externos (como imagens aninhadas) em SVGs declarados como favicons. A solução é embutir qualquer imagem/SVG necessário diretamente no `favicon.svg` como Data URI em Base64.
- **Mosaico do Instagram Padronizado (Junho/2026):** A seção do Instagram foi simplificada para exibir posts com dimensões e proporções idênticas (cards do mesmo tamanho), eliminando o post principal maior (destaque 2x2). O layout agora usa 3 colunas (desktop/tablet) e 2 colunas (mobile), exibindo 5 posts dinâmicos + 1 card de redirecionamento para o perfil (totalizando 6 cards organizados de forma equilibrada sem sobras de grid).

---

## 32. Densidade Mobile — Grids Multi-coluna (Junho/2026)

**Princípio (foco mobile-first, ver seção 0):** dispositivos móveis devem se parecer com o desktop em **densidade** — as "caixas" (cards, maids, passos) ficam **lado a lado em grade**, nunca empilhadas em coluna única. Coluna única só é aceitável para conteúdo intrinsecamente linear (formulários do admin, listas verticais como a agenda de eventos, painéis 2-em-1 do `ClubeMewSection`/`HeroSection` que separam texto e visual).

### 32.1. Padrão de colapso de colunas (público)

Ao criar/editar uma grade de cards nas páginas públicas, siga esta escada de breakpoints (nunca caia para `1fr` num grid de cards homogêneos):

| Tipo de grade | Desktop | Tablet | Phone (~≤520-600px) |
| --- | --- | --- | --- |
| Cards de seção (Destaques, Como Funciona) | 4 col | 2 col | **2 col** (2x2) |
| Maids (`MaidCarousel`) | faixa única de 5 fatias diagonais | faixa única (até >600px) | **fatias diagonais quebradas em 3 em cima + 2 embaixo** |
| Produtos (`MenuContent`, Loja, Mangás) | auto-fill | **3 col** | 3 col |
| Instagram | 3 col | 3 col | 2 col |
| Parceiros (`ParceirosSection`, `/parceiros`) | 2 col | 2 col | **2 col** (nunca empilha) |

### 32.2. Ajustes aplicados nesta rodada

- **`HighlightsSection`** e **`HowItWorksSection`:** o breakpoint `≤520px` deixou de usar `grid-template-columns: 1fr` e agora mantém `repeat(2, 1fr)` (2x2), com `padding`/`font-size` levemente reduzidos para caber. O 4º passo CTA do `HowItWorks` (`.ctaItem { display: contents }`) participa normalmente do grid 2x2.
- **`MaidCarousel`:** o **corte diagonal (`clip-path`) entre as maids é mantido no mobile** — não vira caixa por maid. No celular (`≤600px`) o `.strip` usa `flex-wrap: wrap` e cada `.panel` recebe `flex: 1 1 34%` (≈3 fatias por linha) + `row-gap`; a última linha cresce via `flex-grow` e preenche a largura, resultando em **3 fatias em cima e 2 (maiores) embaixo** para as 5 maids. A sobreposição diagonal (`.panel + .panel { margin-left: -overlap }`) é preservada dentro de cada linha; só a 1ª fatia de cada linha zera a sobreposição via `.panel:nth-child(3n + 1) { margin-left: 0 }` (regra geral: funciona p/ 6+ maids também, sempre 3 por linha). **Tablets/desktop (>600px) seguem na faixa única diagonal** (mais parecido com o PC). A estrutura JSX (Links + img + nome) é intacta, então `MaidCarousel.test.tsx` segue válido.
- **Produtos:** já estavam corretos em 3 colunas no mobile (ver "Densidade Mobile" na seção 13) — não alterados.

### 32.3. Hurdle — limitação dos testes para layout CSS

**Hurdle:** jsdom (Vitest) **não computa layout** (grid/flex), então não dá para asseverar "N colunas no mobile" via `getComputedStyle` nos testes. Mudanças de responsividade que só tocam CSS Module **não quebram** os testes estruturais existentes, mas também **não são cobertas** por eles.
**Solução:** valide layout mobile visualmente com o Chrome/Edge headless. Ao mexer no CSS, **não altere a estrutura JSX** dos componentes com testes (especialmente `MaidCarousel`, `HeroSection`, `AboutSection`, `HowItWorksSection`) para preservar as asserções de conteúdo/links.
**Nota (Windows):** o Chrome headless costuma falhar na **primeira** execução com `--user-data-dir` novo (perfil ainda não inicializado); basta repetir o comando com o mesmo `--user-data-dir`.

---

### 32.4. Hurdle — `--window-size` MENTE abaixo de ~500px no Windows (Agosto/2026)

**Hurdle:** `msedge --headless=new --window-size=390,8000 --screenshot=out.png` produz um PNG de 390px de largura que **parece mostrar overflow horizontal**: cards cortados na direita, textos truncados, rodapé estourando. É fácil concluir que o CSS quebrou no mobile. **É falso.**

**Causa:** o Edge/Chrome headless no Windows aplica uma **largura mínima de janela** (~500px). Com `--window-size=390`, o viewport de layout continua ~500px e o screenshot captura apenas os 390px da **esquerda** — ou seja, um **recorte**, não um render de 390px. Todo conteúdo entre 390 e 500px aparece "cortado".

**Como reconhecer:** capture uma página que você **não** alterou (ex.: `/cardapio`). Se ela também aparecer cortada — inclusive o `Footer`, que está em produção há meses — o problema é o método de captura, não o seu CSS.

**Solução — iframe de largura exata.** Um `<iframe width="390">` tem viewport de layout real de 390px, independente do tamanho da janela. Crie um harness local e aponte o headless para ele com uma janela **maior** que 390:

```html
<!doctype html>
<style>
  html,body{margin:0;background:#222;}
  .viewport{width:390px;margin:0 auto;overflow:hidden;outline:3px solid lime;}
  iframe{width:390px;height:9000px;border:0;display:block;background:#fff;}
</style>
<div class="viewport"><iframe src="http://localhost:5174/"></iframe></div>
```

```bash
msedge --headless=new --disable-gpu --hide-scrollbars --no-first-run \
  --allow-file-access-from-files --user-data-dir=<perfil> \
  --virtual-time-budget=12000 --window-size=520,5200 \
  --screenshot=out.png "file:///C:/caminho/harness390.html"
```

A borda `lime` marca os 390px exatos — qualquer coisa que a ultrapasse é overflow **de verdade**. Para inspecionar um trecho específico de uma página longa (a Home passa de 7000px no mobile), envolva o iframe num contêiner com `overflow:hidden` e desloque com `position:absolute; top:-4600px`.


---

## 33. Parceiros (Agosto/2026)

Vitrine dos negócios parceiros do Mew Mew Café, em **dois pontos de exibição**: a página pública `/parceiros` e uma seção na Home. Parceiros atuais: **ArtePsi** e **Jjang**.

### 33.1. Dados — estáticos, sem banco

`frontend/src/data/parceirosData.ts`, no mesmo padrão de `maidsData.ts`. **Não há tabela, rota de API nem CRUD no admin** — adicionar parceiro é editar esse arquivo e fazer deploy.

```ts
type TipoLinkParceiro = "site" | "instagram" | "whatsapp";
interface LinkParceiro { tipo: TipoLinkParceiro; url: string; rotulo: string; }
interface Parceiro {
  id: string; nome: string; descricaoBreve: string;
  logo: string;      // "/parceiros/artepsi.png"
  iniciais: string;  // fallback do monograma
  cor: string;       // accent, injetado como var --parceiro-cor
  links: LinkParceiro[];
}
```

A `cor` é **dado, não token** (igual `maidsData.ts`) — mas, diferente da cor das maids, ela recebe **texto por cima** no monograma, então precisa ter contraste suficiente com `--color-ink`.

### 33.2. Componentes

| Arquivo | Papel |
| --- | --- |
| `components/ParceiroCard/` | Card sticker compartilhado pelos dois consumidores. Pasta própria (não sub-componente) justamente por ter dois pais |
| `components/ParceirosSection/` | Seção da Home — eyebrow + título + grid + CTA "Ver todos" → `/parceiros` |
| `pages/Parceiros/` | Página pública, hero cream com dots + grid |

**Logo com fallback de monograma.** `useState` + `onError` no `<img>` → iniciais sobre `--parceiro-cor`. O monograma tem acabamento próprio (borda sticker, `--font-display`) para parecer um estado deliberado, não imagem quebrada — ele aparece se o arquivo sumir ou ficar com o nome errado.

> ⚠️ **O caminho em `parceirosData.ts` precisa bater com a extensão real do arquivo.** As logos vivem em `frontend/public/parceiros/` (hoje `artepsi.jpg` e `jjang.jpg`). Se o campo `logo` apontar para uma extensão que não existe, o **Vite devolve o `index.html` com status 200** (fallback de SPA), o `<img>` recebe HTML, o `onError` dispara e o card cai no monograma — sem 404 no console para denunciar. Sintoma: logo some sem erro aparente. Confira com `curl -o /dev/null -w '%{content_type}' <url>`: tem que responder `image/*`, não `text/html`.

As logos usam `object-fit: contain` de propósito — `cover` preencheria o círculo, mas cortaria a marca do parceiro.

> `onError` é event handler, não efeito — **não** cai na regra `react-hooks/set-state-in-effect`. Não tente "pré-verificar" a existência do arquivo num `useEffect`; isso sim quebraria o linter.

### 33.3. Integração

- **Chaves novas:** `nav_parceiros` (Navbar) e `secao_home_parceiros` (Home) — **lembre dos dois lugares**, incluindo `CHAVES_VALIDAS` no backend (ver aviso na seção 5).
- `AdminNavbar` e `AdminSecoesHome` **se auto-estendem** a partir dos arrays de `Configuracao.ts` — nenhuma edição neles. Já `useNavVisibilidade` e `Header` têm o retorno/JSX escritos campo a campo e **exigem edição manual**.
- Posição na Home: entre `InstagramSection` e `ClubeMewSection` — mesmo movimento de prova social do Instagram, e o Clube Mew segue sendo o último bloco por ser o único CTA de conversão da página.
- `sitemap.xml` ganhou a entrada de `/parceiros`.

### 33.4. Regra editorial

A proibição de local físico do pivô de Junho/2026 (seção 31) vale para o **Mew Mew Café**, não para os parceiros. Descrever a Jjang como "mercado coreano em Natal/RN" é a identidade do parceiro e é permitido. O que **não** pode: linguagem de convite presencial ("visite", "passe lá", "venha conhecer") nem qualquer coisa que sugira atendimento presencial do café. `ParceirosSection.test.tsx` e `Parceiros.test.tsx` têm testes negativos travando isso.

**As sinopses vieram das fontes oficiais** (site e bio do Instagram de cada parceiro) — não invente credenciais, tempo de mercado ou serviços não divulgados por eles.

### 33.5. Testes e armadilhas

Novos: `ParceirosSection.test.tsx`, `Parceiros.test.tsx` (esta precisa de `QueryClientProvider` **e** `BrowserRouter` — a página renderiza o `Header`, que chama `useNavVisibilidade` → TanStack Query).

**O fallback do logo só é testável via `fireEvent.error(screen.getByAltText(...))`** — jsdom nunca carrega imagem de verdade, então `onError` jamais dispara sozinho.

Quatro testes existentes precisaram de ajuste, e **dois deles falhavam de forma silenciosa**:

| Teste | O que acontece |
| --- | --- |
| `AdminSecoesHome.test.tsx` | `toHaveLength(8)` → 9. Quebra barulhenta, fácil |
| `NavVisibilidade.test.tsx` | Mocks de `useNavVisibilidade` ficam incompletos. **`pnpm test:ci` passa, mas `pnpm build` falha** — o `tsc -b` é quem pega |
| `Cabecalho.test.tsx` | Mock sem a chave nova → `undefined` → falsy → **o link novo não renderiza e tudo passa verde escondendo isso** |
| `Inicio.test.tsx` | Sem mockar a seção nova, o componente real renderiza e o nome do teste ("todas as seções") passa a mentir |

> **Lição geral:** ao adicionar campo ao retorno de um hook mockado em teste, procure **todos** os mocks dele. Os que ficam incompletos não falham no `test:ci` — falham no `build`, ou pior, passam verde testando menos do que dizem.
