# Contexto e Diretrizes do Projeto: Maid Café Natal (Mew Mew Café)

## 0. REGRAS GERAIS — LEIA ANTES DE QUALQUER COISA

- **Testes TDD:** Quero que você utilize o sistema TDD, testes antes de implementação, então sempre crie testes com a nova função em mente, e em seguida comece a implementação e utilize os testes para se nortear, além disso, sempre que ocorrer algum erro, busque saber o que ocasionou e solucionar.
- **Gerenciador de Pacotes:** Utilize EXCLUSIVAMENTE o `pnpm` (nunca use `npm` ou `yarn`).
- **Infraestrutura Local (Docker):** Utilizamos o `docker-compose.yml` na raiz do projeto para orquestrar todos os containers: `db` (PostgreSQL 15), `backend` (Node/Express), `frontend` (Vite/React) e `tunnel` (Cloudflare).
- **Controle de Versão:** O `.gitignore` raiz ignora `node_modules`, `.env` de todos os níveis, pastas de build (`dist/`, `build/`), coverage, dados do PostgreSQL (`pgdata/`, `postgres_data/`) e arquivos de OS/IDE.
- **Contexto:** Use SEMPRE o `GEMINI.md` como a fonte da verdade para as regras de negócio, arquitetura e contexto. Atualize este documento constantemente com novas regras, dependências e soluções de erros.
- **Resolução de Erros:** Sempre que houver um erro, é mandatório ler integralmente o output do terminal para analisar de verdade qual é o problema ANTES de prosseguir.
- **Padronização CSS:** Sempre utilize as variáveis CSS definidas em `frontend/src/index.css` (`:root`). Se necessário criar um novo token (cor, tamanho, espaçamento), adicione-o lá. Nunca use valores hard-coded repetidos.
- **Idioma do Código:** Nomes de tabelas, colunas, variáveis de banco e endpoints da API estão em **português** (ex: `produtos`, `pedidos`, `eventos`). Comentários e mensagens de erro também em português.
- **Error Handling:** Para tratamentos de erro no backend, lembre-se de sempre utilizar o nosso intermediador de erros, que é o arquivo `src/middlewares/gerenciadorErros.ts`.
- **Atualizar documento** Sempre que houver alguma informação importante, atualize esse documento com ela em algum dos tópicos, ou crie um novo tópico se necessário.
- **Melhorias** Quando estiver trabalhando em um código que não siga as regras do documento, mesmo sendo um código mais antigo, feito anteriormente, quero que você faça o possível para que ele siga as regras do documento, alterando-o.
- **Responsividade** Quero que você foque bastante na responsividade e funcionalidades do site para dispositivos móveis, de forma que funcione bem em celulares, que é o foco principal.
- **Hurdle** Adicione common Hurdles que você encontrar durante o desenvolvimento, com as soluções para que você não cometa os mesmos erros novamente.
- **Identidade Visual:** O site deve seguir uma estética "fofa" (Kawaii/Maid Café), com cores pastéis (rosa, creme, branco), tipografia cursiva decorativa **Sweet Apricot** exclusivamente em **títulos de páginas, nomes de categorias, títulos de itens e Navbar** (via `var(--font-title)`), e fonte **Inter** (via `var(--font-main)`) para corpo de texto, descrições, preços, botões e demais elementos de UI. Crucialmente, botões e elementos com cantos muito arredondados (`var(--radius-button)` para botões e `var(--radius-card)` para cards/modais). O background da página principal é levemente rosado (`#FFF5F8`), mantendo o branco puro (`#FFFFFF`) apenas para elementos elevados em relevo, como os cards.

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
- **Tipografia:** **Sweet Apricot** (fonte local `.woff2` em `public/fonts/`) para títulos (`--font-title`) + **Inter** (Google Fonts) para corpo/UI (`--font-main`)

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
│
├── database/
│   └── init.sql                  # Schema DDL + seed data (roda no init do container)
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json / tsconfig.build.json
│   ├── vitest.config.ts
│   ├── migrate_db.ts             # Script de migrations manuais
│   ├── migrations/               # Migrations incrementais (.ts)
│   ├── public/images/            # Imagens dos produtos/eventos (serving estático)
│   └── src/
│       ├── server.ts             # Entry point (listen)
│       ├── app.ts                # Express app (middlewares + rotas)
│       ├── config/
│       │   ├── db.ts             # Pool de conexão PostgreSQL (pg)
│       │   ├── corsOptions.ts    # Configuração de CORS
│       │   └── upload.ts         # Configuração do Multer (disco)
│       ├── controllers/
│       │   ├── AutenticacaoController.ts
│       │   ├── ProdutoController.ts
│       │   ├── PedidoController.ts
│       │   └── EventoController.ts
│       ├── models/
│       │   ├── AutenticacaoModel.ts
│       │   ├── ProdutoModel.ts
│       │   ├── PedidoModel.ts
│       │   └── EventoModel.ts
│       ├── routes/
│       │   ├── AutenticacaoRoutes.ts
│       │   ├── ProdutoRoutes.ts
│       │   ├── PedidoRoutes.ts
│       │   ├── EventoRoutes.ts
│       ├── middlewares/
│       │   ├── autenticacaoMiddleware.ts  # Verificação JWT
│       │   └── gerenciadorErros.ts        # Gerenciador de erros centralizado (AppError)
│       ├── services/
│       ├── errors/               # Classe AppError customizada
│       ├── types/                # Tipos TypeScript
│       │   ├── AutenticacaoTypes.ts
│       │   ├── ProdutoTypes.ts
│       │   └── EventoTypes.ts
│       ├── utils/
│       └── tests/                # Testes do backend (Vitest + Supertest)
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
│       ├── types/
│       │   ├── Produto.ts        # Interface Produto
│       │   └── Evento.ts         # Interface Evento + DadosFormEvento
│       ├── services/
│       │   └── api.ts            # Todas as chamadas HTTP ao backend
│       ├── hooks/
│       │   ├── useAutenticacao.ts # Autenticação (login, verificar token)
│       │   ├── useCarrinho.tsx    # Carrinho de compras (Context API)
│       │   ├── useProdutos.ts     # Fetch de produtos (público)
│       │   ├── useAdminProdutos.ts # CRUD de produtos (admin)
│       │   └── useDebugScreen.ts  # Debug de dimensões de tela
│       ├── pages/
│       │   ├── Home/             # Landing page
│       │   ├── Menu/             # Cardápio com filtros por categoria
│       │   ├── OnlineStore/      # Loja online (produtos is_loja)
│       │   ├── StoreProductDetails/ # Detalhes de produto da loja
│       │   ├── Events/           # Calendário de eventos
│       │   └── Admin/            # Painel administrativo
│       ├── components/           # 22 componentes reutilizáveis
│       │   ├── Header/           # Navegação principal
│       │   ├── Footer/           # Rodapé
│       │   ├── Banner/           # Banner principal
│       │   ├── ProdutoCard/      # Card de produto
│       │   ├── ProdutoDetalhesModal/ # Modal de detalhes
│       │   ├── ProdutoForm/      # Formulário CRUD produto (admin)
│       │   ├── CategoryFilter/   # Filtro por categorias
│       │   ├── Search/           # Barra de busca
│       │   ├── CartButton/       # Botão flutuante do carrinho
│       │   ├── CartModal/        # Modal do carrinho
│       │   ├── MenuContent/      # Conteúdo do cardápio
│       │   ├── EventoCard/       # Card de evento
│       │   ├── CalendarioEventos/ # Calendário de eventos
│       │   ├── AdminDashboard/   # Dashboard admin principal
│       │   ├── AdminEventos/     # Gerenciamento de eventos
│       │   ├── AdminPedidos/     # Gerenciamento de pedidos
│       │   ├── LoginModal/       # Modal de login
│       │   ├── AboutSection/     # Sessão "Sobre" na Home
│       │   ├── NewArrivalsSection/ # Novidades
│       │   ├── PopularSection/   # Populares
│       │   ├── AddressMapModal/  # Modal com mapa (Leaflet)
│       │   └── ScrollToTop/      # Auto-scroll ao navegar
│       ├── utils/
│       └── tests/                # Testes do frontend (Vitest + RTL)
```

---

## 5. Modelos de Domínio (Banco de Dados)

O esquema é definido em `database/init.sql` via SQL puro (sem ORM).

### `configuracoes`

| Coluna          | Tipo                 | Descrição                           |
| --------------- | -------------------- | ----------------------------------- |
| `chave`         | `VARCHAR(100) PK`    | Chave da configuração (ex: fonte)   |
| `valor`         | `VARCHAR(255)`       | Valor associado à chave             |
| `atualizado_em` | `TIMESTAMP`          | Data da última atualização          |

### `fontes_customizadas`

| Coluna        | Tipo                 | Descrição                                 |
| ------------- | -------------------- | ----------------------------------------- |
| `id`          | `SERIAL PK`          | ID auto-incremento                        |
| `nome`        | `VARCHAR(100) UNIQUE`| Nome da fonte                             |
| `arquivo_url` | `VARCHAR(255)`       | Caminho físico do arquivo (.woff2)        |
| `criado_em`   | `TIMESTAMP`          | Data de criação                           |

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
| `preco_original` | `DECIMAL(10,2)` | Preço antes da promoção                        |
| `visivel`        | `BOOLEAN`       | Visível para usuários? (ocultar sem deletar)   |
| `criado_em`      | `TIMESTAMP`     | Data de criação                                |

### `eventos`

| Coluna       | Tipo           | Descrição              |
| ------------ | -------------- | ---------------------- |
| `id`         | `SERIAL PK`    | ID auto-incremento     |
| `titulo`     | `VARCHAR(100)` | Título do evento       |
| `descricao`  | `TEXT`         | Descrição              |
| `data`       | `TIMESTAMP`    | Data e hora do evento  |
| `local`      | `VARCHAR(255)` | Local do evento        |
| `imagem_url` | `VARCHAR(255)` | Imagem do evento       |
| `visivel`    | `BOOLEAN`      | Visível para usuários? |
| `criado_em`  | `TIMESTAMP`    | Data de criação        |

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

| Coluna       | Tipo            | Descrição                          |
| ------------ | --------------- | ---------------------------------- |
| `id`         | `SERIAL PK`     | ID auto-incremento                 |
| `imagem_url` | `VARCHAR(255)`  | Caminho da imagem no disco         |
| `link_url`   | `VARCHAR(255)`  | Link para o post no Instagram      |
| `visivel`    | `BOOLEAN`       | Visível na homepage? (Default: T)  |
| `ordem`      | `INTEGER`       | Ordem de exibição (Default: 0)     |
| `criado_em`  | `TIMESTAMP`     | Data de criação                    |

---

## 6. Rotas da API

### Autenticação (`/api/autenticacao`)

| Método | Rota     | Auth? | Descrição                              |
| ------ | -------- | ----- | -------------------------------------- |
| `POST` | `/login` | ❌    | Login (nickname + senha) → retorna JWT |

### Configurações (`/api/configuracoes`)

| Método   | Rota               | Auth? | Descrição                                    |
| -------- | ------------------ | ----- | -------------------------------------------- |
| `GET`    | `/`                | ❌    | Retorna configurações globais e fontes ativas|
| `PUT`    | `/`                | ✅    | Atualiza chaves de configuração em lote      |
| `POST`   | `/fontes`          | ✅    | Upload de nova fonte customizada (.woff2)    |
| `DELETE` | `/fontes/:id`      | ✅    | Exclui uma fonte e deleta o arquivo físico   |

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

| Método   | Rota                | Auth? | Descrição                          |
| -------- | ------------------- | ----- | ---------------------------------- |
| `GET`    | `/`                 | ❌    | Lista posts visíveis               |
| `GET`    | `/admin`            | ✅    | Lista todos os posts (admin)       |
| `POST`   | `/`                 | ✅    | Cria post (com upload de imagem)   |
| `PUT`    | `/:id`              | ✅    | Atualiza post                      |
| `DELETE` | `/:id`              | ✅    | Deleta post e remove imagem        |

### Regras de Exibição (Homepage)

- A seção do Instagram na Home exibe um grid de 6 cards.
- Os 5 primeiros cards são posts dinâmicos vindos da API (ordenados por `ordem`).
- O 6º card é estático e redireciona para o perfil oficial `@mewmewnatal`.

## 7. Rotas do Frontend (React Router)

| Path                | Página                | Descrição                                          |
| ------------------- | --------------------- | -------------------------------------------------- |
| `/`                 | `Home`                | Landing page (banner, populares, novidades, sobre) |
| `/cardapio`         | `MenuPage`            | Cardápio completo com filtros e busca              |
| `/loja`             | `OnlineStore`         | Loja de produtos importados/artesanais             |
| `/loja/produto/:id` | `StoreProductDetails` | Detalhes de produto da loja                        |
| `/eventos`          | `EventsPage`          | Calendário de eventos                              |
| `/maids/:id`        | `MaidDetalhes`        | Perfil detalhado das maids                         |
| `/admin`            | `Admin`               | Painel administrativo (protegido por login)        |

### Components & UI Adicionais (Admin Dashboard)

- A aba `/admin` inclui sub-rotas/tabs renderizando os paineis `AdminProdutos`, `AdminLoja`, `AdminPedidos`, `AdminEventos`, `AdminBanners`, `AdminFontes` e `AdminInstagram`.
- **Admin Banners:** Adicionado suporte para mídias `.mp4` e `.webm` com limite estendido para 50MB e textos opcionais. A API de Banners reflete globalmente qual componente deve ser exibido por página.
- **Formulários Dinâmicos:** O `ProdutoForm` e outros painéis contam com inputs fluídos que extraem "Categorias" e "Tags" já salvas em cache local (via TanStack Query) para preenchimento de Autocomplete Inteligente ilimitado, criando padronização nas listagens públicas.
- Padrão **FormGrid**: Para manutenção da unidade visual, novos componentes adotam `.formContainer` em CSS grid respeitando padding e limitações `--container-max-width`.

---

## 8. Design System (CSS Custom Properties)

Todos os tokens de design estão centralizados em `frontend/src/index.css`:

### Paleta de Cores

| Estilo    | Nome da Cor        | Hexadecimal | Variável CSS                                 | Uso Recomendado                        |
| --------- | ------------------ | ----------- | -------------------------------------------- | -------------------------------------- |
| Principal | Rosa Fúcsia        | `#E84D8A`   | `--color-primary`                            | Logo, botões principais e títulos      |
| Principal | Rosa Fúcsia Escuro | `#C73872`   | `--color-primary-dark`                       | Hover de botões principais             |
| Base      | Rosa Claro         | `#FFFDFF`   | `--color-background`                         | Fundo principal levemente rosado       |
| Base      | Branco Neve        | `#FFFFFF`   | `--color-white`                              | Cards e áreas de relevo                |
| Base      | Rosa Algodão Doce  | `#FCE4EC`   | `--color-secondary-background`               | Fundos de seção e modais               |
| Destaque  | Verde Menta        | `#A8E6CF`   | `--color-accent-mint`                        | Botões de "Comprar" ou ícones, sucesso |
| Destaque  | Amarelo Estelar    | `#FFF3B0`   | `--color-star-active`, `--color-accent-star` | Ofertas, estrelas e novidades          |
| Apoio     | Lilás Místico      | `#D1C4E9`   | `--color-accent-lilac`                       | Bordas e detalhes decorativos          |
| Contraste | Cinza Antracite    | `#37474F`   | `--color-text`                               | Textos longos e leitura principal      |

```css
/* ═══ Paleta Principal ═══ */
--color-primary: #e84d8a; /* Rosa Fúcsia */
--color-primary-dark: #c73872; /* Rosa Fúcsia escuro (hover) */
--color-primary-light: #fce4ec; /* Rosa Algodão Doce (claro) */
--color-primary-border: #f8bbd0; /* Borda rosa derivada */
--color-secondary-border: #f0a4c0; /* Borda rosa secundária */

/* ═══ Cores Base ═══ */
--color-background: #fff5f8; /* Rosa Claro — Fundo da página */
--color-secondary-background: #fce4ec; /* Rosa Algodão Doce */
--color-tertiary-background: #fff0f5; /* Lavanda rosada */
--color-white: #ffffff; /* Branco Neve — Cards e relevos */

/* ═══ Cores de Destaque ═══ */
--color-accent-mint: #a8e6cf; /* Verde Menta */
--color-accent-mint-dark: #7dd3b0;
--color-accent-star: #fff3b0; /* Amarelo Estelar */
--color-accent-star-dark: #ffe57f;

/* ═══ Cor de Apoio ═══ */
--color-accent-lilac: #d1c4e9; /* Lilás Místico */
--color-accent-lilac-dark: #b39ddb;

/* ═══ Cor de Contraste ═══ */
--color-text: #37474f; /* Cinza Antracite */

/* ═══ Brand Colors ═══ */
--color-star-active: #fff3b0; /* Amarelo Estelar */
--color-success: #a8e6cf; /* Verde Menta */
--color-warning: #fff3b0; /* Amarelo Estelar */
--color-error: #ef4444;
--color-info: #6366f1;
```

### Layout

```css
--container-max-width: 1200px;
--radius-card: 20px;
--radius-button: 50px;
--shadow-card: 0 4px 6px rgba(232, 77, 138, 0.25);
--transition-default: all 0.3s ease;
```

### Tipografia

```css
/* Fonte do corpo/UI (navbar, botões, inputs, textos gerais) */
--font-main:
  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
/* Fonte decorativa (títulos de páginas, nomes de categorias, títulos de itens) */
--font-title: "Sweet Apricot", cursive, sans-serif;
--font-size-sm: 0.9rem;
--font-size-md: 1rem;
--font-size-lg: 1.1rem;
--font-size-xl: 1.2rem;
--font-size-2xl: 1.4rem;
--font-size-3xl: 1.8rem;
--font-size-4xl: 2rem;
--font-size-5xl: 2.5rem;
--font-weight-regular: 400;
--font-weight-medium: 600;
--font-weight-bold: 700;
```

> **REGRA:** Jamais use cores, fontes ou tamanhos fixos repetidos fora do `:root`. Sempre referencie via `var(--token)`.

---

## 9. Design Patterns do Projeto

### Backend — MVC (Model-View-Controller)

- **Models** (`models/`): Queries SQL puras usando `pool.query()` do `pg`. Retornam dados brutos.
- **Controllers** (`controllers/`): Recebem `req/res`, chamam Models, tratam validações e formatam a resposta HTTP. Exportados como objetos `const`.
- **Routes** (`routes/`): Mapeiam endpoints para Controllers, aplicam middlewares (`autenticacaoMiddleware`, `uploadConfig`). A config de Upload (`Multer`) hoje **permite Imagens e Vídeos até 50MB**.
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
- **Frontend:** Token armazenado no `localStorage`. Hook `useAuth` gerencia login/logout e verificação.
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

| Categoria          | Tipo                    |
| ------------------ | ----------------------- |
| Happy Hour         | Cardápio                |
| Refeições          | Cardápio                |
| 抹茶 - Matcha      | Cardápio                |
| Doces Japoneses    | Cardápio                |
| Croissants         | Cardápio                |
| Sanduíches         | Cardápio                |
| Doces e Sobremesas | Cardápio                |
| Salgados           | Cardápio                |
| Cafés              | Cardápio                |
| Milkshakes         | Cardápio                |
| Bebidas Mágicas    | Cardápio                |
| Bebidas            | Cardápio                |
| Bebidas Alcoólicas | Cardápio                |
| Promoções          | Cardápio                |
| Novidades          | Cardápio                |
| Encomendas         | Cardápio                |
| Black Friday       | Cardápio                |
| Nossa Lojinha      | Loja (`is_loja = TRUE`) |

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

**Hurdle:** Perda massiva de tokens de design (`--font-*`, `--radius-*`) no `index.css`.
**Causa:** Uso incorreto de ferramentas de edição (`replace_file_content`) em blocos grandes, resultando no apagamento acidental de definições localizadas no meio ou fim do bloco `:root`.
**Solução:** Sempre validar a integridade total do `index.css` após edições. Os tokens de tipografia e layout são a espinha dorsal da estética "fofa" (Fredoka + Arredondamento) e não podem ser removidos sob hipótese alguma. Se o site aparecer quadrado ou com fonte padrão, a primeira verificação deve ser os tokens do `:root`.

---

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

**Hurdle:** Ambiguidade na busca de textos de categorias em testes (`TestingLibraryElementError: Found multiple elements with the text: X`).

**Causa:** O componente `CategoryFilter` cria botões com o nome da categoria, e o agrupamento no cardápio cria subtítulos (`h2`) com o mesmo nome. O `getByText` falha por encontrar ambos no DOM.

**Solução:** Sempre utilizar seletores mais específicos como `getByRole('heading', { name: 'Categoria', level: 2 })` para capturar especificamente o subtítulo do agrupamento, ou `getByRole('button', { name: 'Categoria' })` para interagir com os filtros.

---

**Hurdle:** Erro de Linter `Error: Calling setState synchronously within an effect can trigger cascading renders`
**Causa:** A nova versão do React/linter (`react-hooks/set-state-in-effect`) não permite chamadas síncronas de `setState` diretamente dentro do corpo do `useEffect`. Isso se aplica mesmo para funções de refresh encapsuladas em hooks e chamadas lá dentro.
**Solução:** 1. Utilize derivação de estado (_derived state_) síncrono durante o próprio `render` para evitar `useState` extra. 2. Inicializadores locais podem usar a sintaxe callback/lazy no `useState(() => getLocalItem)`. 3. Utilize um `setTimeout(..., 0)` para jogar o setState fora da _stack_ síncrona do useEffect. 4. Em último caso, use a flag `// eslint-disable-next-line react-hooks/set-state-in-effect` se for assíncrono garantido.

---

## 14. Testes

O projeto mantém testes unitários e de integração em ambos os lados:

### Backend (`backend/src/tests/`)

- `sanity.test.ts` — Test de sanidade
- `autenticacao.test.ts` — Autenticação
- `produtos.test.ts` — CRUD de produtos
- `pedidos.test.ts` — CRUD de pedidos
- `EventoRoutes.test.ts` — CRUD de eventos
- `instagram.test.ts` — CRUD de posts do Instagram
- `formatters.test.ts` — Funções utilitárias

### Frontend (`frontend/src/tests/`)

- `sanity.test.ts` — Test de sanidade
- `Home.test.tsx` — Página Home
- `Header.test.tsx` — Componente Header
- `Footer.test.tsx` — Componente Footer
- `MenuPage.test.tsx` — Página do Cardápio
- `ProdutoCard.test.tsx` — Card de produto
- `CartModal.test.tsx` — Modal do carrinho
- `useCarrinho.test.tsx` — Hook de carrinho
- `Search.test.tsx` — Componente de busca
- `EventoCard.test.tsx` — Card de evento
- `CalendarioEventos.test.tsx` — Calendário de eventos
- `AdminEventos.test.tsx` — CRUD admin de eventos
- `MaidCarousel.test.tsx` — Carrossel de Maids (Home)
- `MaidDetalhes.test.tsx` — Página de perfil da Maid
- `formatters.test.ts` — Funções utilitárias

> **Regra:** Após qualquer alteração, rode `pnpm test:ci` no módulo afetado para garantir que nada quebrou.

---

## 15. Checklist Pós-Implementação (Por Feature)

- [ ] Os testes unitários foram escritos e estão passando?
- [ ] O código passou pelo linter (`pnpm lint`)?
- [ ] Os tokens CSS estão no `:root` do `index.css`?
- [ ] A feature funciona tanto localmente quanto via Docker?
- [ ] Se criou nova tabela/coluna, o `init.sql` foi atualizado?
- [ ] Se criou nova rota, ela segue o padrão existente (Model → Controller → Route)?
- [ ] Se é rota admin, o `authMiddleware` foi aplicado?
- [ ] Loading e Error states estão sendo tratados na UI?
- [ ] O `GEMINI.md` foi atualizado com as novas informações?

---

## 16. Boas Práticas e Protocolos de Qualidade Recentes

Ao longo das otimizações dos testes e padronização contínua do Maid Café, estas convenções de código tornaram-se vitais:

15. **Cobertura Mínima de Testes (TDD):**
    Ao estruturar as APIs do servidor (como Middlewares guardiões), **não deixe código vital de segurança com linhas não-cobertas**. Assegure que as rotinas de verificação do `AppError` dentro de chaves (`catch`) ou retornos de transação bloqueiam e recebem mockups apropriados (`vi.spyOn(jwt, 'verify')`). Todas as rotas administrativas (`/admin`, POSTs, PUTs, DELETEs) devem ter simulação de status válidos (200, 201) e inválidos (404, 500) usando `supertest` no framework Backend.
    **Catálogo Backend TDD (`vitest --coverage > 85%`)**: `EventoRoutes.test.ts` (Teste de Cleanup de Imagens falho via `fs.unlink`), `produtos.test.ts` (Painel Amin de Produtos e Delete), `pedidos.test.ts` (Update de Status) e `autenticacaoMiddleware.test.ts` (Guard JWT).

Isso se repete para o Frontend. Rotas Privadas React devem ter suas amarras cobertas por `AdminRestrito.test.tsx` provando que o LoginModal acende na ausência de Token (`localStorage.getItem("token")`). Use `vi.mock` extensivamente para desviar componentes-filhos indesejados nas baterias curtas. Componentes dependentes de `useNavigate` precisam sempre ser renderizados dentor do Wrapper `<BrowserRouter>`.

2. **Laços de Mockamento Assíncronos (Vitest + pg):**
   Quando mockamos o método `pool.query` ou assemelhados e o controlador testado faz buscas em cadeia (como um `.map` executando `buscarItens` em cada pedido listado), deve-se enfileirar chamadas com `mQuery.mockResolvedValueOnce()` adequadas para suprir tanto a listagem primária _quanto_ os iteradores secundários, ou o teste sofrerá colapso por array vazia acidental.

3. **Qualidade Estrita do ESLint 9+ (Full Stack):**
   A nova infraestrutura abraça a checagem sintática dupla (Frontend e Backend) usando Flat Configuration (`eslint.config.js`). Qualquer código novo submetido no backend deverá passar obrigatoriamente pelas amarras do `pnpm lint` via `eslint src/ && tsc --noEmit` garantindo unificação de boas práticas.

4. **Tratamento de Ciclos Síncronos do React 19:**
   O React Linter agora ataca a inserção prematura de `setState` correndo abertamente na função `useEffect`. Requererá sempre o uso de atrasos inofensivos (`setTimeout`), derivação direta do `.map` no render, ou lazy initializer callback ao extrair storage na montagem (`useState(() => localStorage.getItem("X"))`).

---

### 17. Gerenciamento de Estado Assíncrono (TanStack Query)

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

### 18. Passos Exatos de Deploy e Atualização (Docker)

Quando for realizar o deploy ou atualizar a aplicação em produção com novos códigos, utilize a seguinte sequência:

1. Faça pull das alterações do repositório no servidor.
2. Certifique-se de que o arquivo `.env` da raiz está configurado (especialmente o `TUNNEL_TOKEN` e as senhas de banco).
3. Execute o build limpo forçado das imagens multi-stage:
   `docker compose build --no-cache`
4. Recrie e suba os containers sem afetar os volumes persistentes:
   `docker compose up -d`
5. (Apenas em primeira execução ou grandes mudanças no schema) Entre no bash do backend e rode as migrations:
   `docker exec -it maid_backend pnpm tsx scripts/migrate_db.ts`

### 19. Padrões de Variáveis em Build de Frontend

- O Nginx serve arquivos estáticos já construídos (build phase). Diferente do backend, o container do frontend não lê o `.env` em tempo de execução (runtime). Todas as variáveis de ambiente necessárias (ex: `VITE_BACKEND_URL`) devem estar presentes no momento do `docker compose build`.

---

### 20. 🛡️ Vulnerabilidades Corrigidas

1. **Upload de Arquivos Sem Restrição (Crítico):**
   - **Brecha:** O servidor aceitava qualquer tipo de arquivo, permitindo que atacantes subissem scripts maliciosos (RCE).
   - **Correção:** Implementei um `fileFilter` no Multer para aceitar apenas imagens (JPEG, PNG, GIF, WEBP) e adicionei um limite de tamanho de 50MB (para imagens de alta qualidade).

2. **Segredo JWT Inseguro (Médio):**
   - **Brecha:** Havia um valor padrão ("segredo") caso a variável de ambiente não fosse carregada, o que facilitaria ataques de força bruta.
   - **Correção:** Removi o fallback. Agora, se `JWT_SECRET` não estiver no `.env`, o servidor lança um erro interno, garantindo que nunca rode em modo inseguro.

3. **Validação de Header Fraca (Baixo):**
   - **Brecha:** O código não verificava se o header de autorização seguia o padrão `Bearer <token>`, podendo causar erros inesperados.
   - **Correção:** Adicionei uma validação estrita do formato do header antes do processamento.

### 21. Gerenciamento Dinâmico de Banners

- **Chave de Página:** Os banners são atrelados a uma `pagina` (ex: 'home', 'cardapio', 'eventos', 'loja').
- **Fallback Automático:** Caso uma página não tenha banner definido, o sistema busca obrigatoriamente a entrada com `pagina = 'padrao'`.
- **Mídia Suportada:** Imagens (JPEG, PNG, WEBP) e Vídeos (MP4, WEBM) até 50MB.

### 22. Autocomplete Inteligente (Admin)

- **Categorias e Tags:** O `ProdutoForm` realiza extração automática de todas as categorias e tags já existentes no banco de dados para sugerir ao administrador durante o cadastro.

### 23. Gerenciamento Dinâmico de Fontes

- **7 Categorias Parametrizáveis:** Permite configurar independentemente a tipografia de: Títulos do Site, Navbar, Categorias, Títulos de Itens, Descrições, Botões e Texto Geral.
- **Hook Global:** O hook `useConfiguracoesGlobais()` chamado no `App.tsx` busca as configurações ativas, injeta `@font-face` dinâmico caso seja fonte customizada, e solicita Google Fonts automaticamente para fontes padrão built-in, além de injetar os tokens CSS globais.
- **Segurança de Deleção:** Impede exclusão de arquivos de fontes em uso via Backend, varrendo todas as chaves da tabela de configurações para confirmar inexistência de dependência antes de deletar fisicamente da pasta `public/fonts/`.
- **Scroll Infinito:** Dropdowns de sugestão não possuem limite de exibição e utilizam `max-height` com scroll interno para manter a usabilidade.

### 23. Padronização de Layout Admin (UI/UX)

- **Max-Width:** Todas as abas administrativas (`/admin/*`) devem respeitar o `max-width: var(--container-max-width)` e estarem centralizadas (`margin: 0 auto`).
- **Padding Superior:** O distanciamento padrão do topo para o primeiro elemento das abas (geralmente o formulário de cadastro) é de `1rem`.
- **Identidade Visual:** Botões de ação seguem `--color-success` (verde/salvar) e `--color-warning` (amarelo/editar) para rápida identificação funcional.

---
