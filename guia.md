# Contexto e Diretrizes do Projeto: Maid Café Natal (Mew Mew Café)

## 0. REGRAS GERAIS — LEIA ANTES DE QUALQUER COISA

- **Testes TDD:** Quero que você utilize o sistema TDD, testes antes de implementação, então sempre crie testes com a nova função em mente, e em seguida comece a implementação e utilize os testes para se nortear, além disso, sempre que ocorrer algum erro, busque saber o que ocasionou e solucionar.
- **Gerenciador de Pacotes:** Utilize EXCLUSIVAMENTE o `pnpm` (nunca use `npm` ou `yarn`).
- **Infraestrutura Local (Docker):** Utilizamos o `docker-compose.yml` na raiz do projeto para orquestrar todos os containers: `db` (PostgreSQL 15), `backend` (Node/Express), `frontend` (Vite/React) e `tunnel` (Cloudflare).
- **Controle de Versão:** O `.gitignore` raiz ignora `node_modules`, `.env` de todos os níveis, pastas de build (`dist/`, `build/`), coverage, dados do PostgreSQL (`pgdata/`, `postgres_data/`) e arquivos de OS/IDE.
- **Contexto:** Use SEMPRE o `guia.md` como a fonte da verdade para as regras de negócio, arquitetura e contexto. Atualize este documento constantemente com novas regras, dependências e soluções de erros.
- **Resolução de Erros:** Sempre que houver um erro, é mandatório ler integralmente o output do terminal para analisar de verdade qual é o problema ANTES de prosseguir.
- **Padronização CSS:** Sempre utilize as variáveis CSS definidas em `frontend/src/index.css` (`:root`). Se necessário criar um novo token (cor, tamanho, espaçamento), adicione-o lá. Nunca use valores hard-coded repetidos.
- **Idioma do Código:** Nomes de tabelas, colunas, variáveis de banco e endpoints da API estão em **português** (ex: `produtos`, `pedidos`, `eventos`). Comentários e mensagens de erro também em português.
- **Error Handling:** Para tratamentos de erro no backend, lembre-se de sempre utilizar o nosso intermediador de erros, que é o arquivo `src/middlewares/gerenciadorErros.ts`.
- **Atualizar documento** Sempre que houver alguma informação importante, atualize esse documento com ela em algum dos tópicos, ou crie um novo tópico se necessário.
- **Melhorias** Quando estiver trabalhando em um código que não siga as regras do documento, mesmo sendo um código mais antigo, feito anteriormente, quero que você faça o possível para que ele siga as regras do documento, alterando-o.
- **Responsividade** Quero que você foque bastante na responsividade e funcionalidades do site para dispositivos móveis, de forma que funcione bem em celulares, que é o foco principal.
- **Hurdle** Adicione common Hurdles que você encontrar durante o desenvolvimento, com as soluções para que você não cometa os mesmos erros novamente.
- **Identidade Visual:** O site deve seguir uma estética "fofa" (Kawaii/Maid Café), com cores pastéis (rosa, creme, branco), tipografia arredondada (Fredoka) e, crucialmente, botões e elementos com cantos muito arredondados (`var(--radius-button)` para botões e `var(--radius-card)` para cards/modais).

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
│  :5173         │     │  :3000           │     │  :5432               │
└────────────────┘     └──────────────────┘     └──────────────────────┘
                              │
                       ┌──────┴──────┐
                       │  Cloudflare │
                       │   Tunnel    │
                       └─────────────┘
```

### 1.2. Hospedagem e Deploy

- **Produção:** Todos os containers rodam via Docker Compose em uma máquina com acesso à internet.
- **Domínio:** `jcafenatal.store` (via Cloudflare Tunnel — container `maid_tunnel`).
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
- **Testes:** Vitest + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`
- **Linting:** ESLint 9 + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` + `typescript-eslint`
- **Tipografia:** Google Fonts — **Fredoka** (300..700)

### Backend

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **Runner:** `tsx watch` (dev) com hot-reload
- **Banco de Dados:** PostgreSQL 15 (Alpine) via `pg` (driver nativo, sem ORM)
- **Autenticação:** `jsonwebtoken` (JWT) + `bcryptjs`
- **Upload de Arquivos:** `multer` (disco local em `public/images/`)
- **Testes:** Vitest + `supertest`
- **Build:** `tsc` + `rimraf`

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
FRONTEND_URL=http://localhost:5173
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
FRONTEND_URL=http://localhost:5173
```

> **Nota:** Dentro do Docker, o `DB_HOST` é `db` (nome do serviço). Fora do Docker (dev local), use `localhost` com a porta `DB_PORT_LOCAL` (5433).

---

## 4. Estrutura do Diretório

```
/
├── .env                          # Variáveis do Docker Compose
├── .gitignore
├── docker-compose.yml            # Orquestração de containers
├── guia.md                       # ESTE ARQUIVO — fonte da verdade
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

---

## 6. Rotas da API

### Autenticação (`/api/autenticacao`)

| Método | Rota     | Auth? | Descrição                              |
| ------ | -------- | ----- | -------------------------------------- |
| `POST` | `/login` | ❌    | Login (nickname + senha) → retorna JWT |

### Produtos (`/api/produtos`)

| Método   | Rota              | Auth? | Descrição                                |
| -------- | ----------------- | ----- | ---------------------------------------- |
| `GET`    | `/`               | ❌    | Lista produtos visíveis                  |
| `GET`    | `/admin`          | ✅    | Lista todos os produtos (inclui ocultos) |
| `GET`    | `/populares`      | ❌    | Produtos mais curtidos                   |
| `GET`    | `/novidades`      | ❌    | Produtos novos                           |
| `POST`   | `/`               | ✅    | Cria produto (com upload de imagem)      |
| `PUT`    | `/:id`            | ✅    | Atualiza produto                         |
| `DELETE` | `/:id`            | ✅    | Deleta produto                           |
| `PATCH`  | `/:id/like`       | ❌    | Incrementa curtida                       |
| `PATCH`  | `/:id/unlike`     | ❌    | Decrementa curtida                       |
| `PATCH`  | `/:id/visibilidade` | ✅    | Alterna visibilidade                     |

### Pedidos (`/api/pedidos`)

| Método | Rota          | Auth? | Descrição                 |
| ------ | ------------- | ----- | ------------------------- |
| `GET`  | `/`           | ✅    | Lista todos os pedidos    |
| `POST` | `/`           | ❌    | Cria novo pedido          |
| `PUT`  | `/:id/status` | ✅    | Atualiza status do pedido |

### Eventos (`/api/eventos`)

| Método   | Rota              | Auth? | Descrição                          |
| -------- | ----------------- | ----- | ---------------------------------- |
| `GET`    | `/`               | ❌    | Lista eventos visíveis             |
| `GET`    | `/admin`          | ✅    | Lista todos os eventos             |
| `POST`   | `/`               | ✅    | Cria evento (com upload de imagem) |
| `PUT`    | `/:id`            | ✅    | Atualiza evento                    |
| `DELETE` | `/:id`            | ✅    | Deleta evento                      |
| `PATCH`  | `/:id/visibilidade` | ✅    | Alterna visibilidade               |

---

## 7. Rotas do Frontend (React Router)

| Path                | Página                | Descrição                                          |
| ------------------- | --------------------- | -------------------------------------------------- |
| `/`                 | `Home`                | Landing page (banner, populares, novidades, sobre) |
| `/cardapio`         | `MenuPage`            | Cardápio completo com filtros e busca              |
| `/loja`             | `OnlineStore`         | Loja de produtos importados/artesanais             |
| `/loja/produto/:id` | `StoreProductDetails` | Detalhes de produto da loja                        |
| `/eventos`          | `EventsPage`          | Calendário de eventos                              |
| `/admin`            | `Admin`               | Painel administrativo (protegido por login)        |

---

## 8. Design System (CSS Custom Properties)

Todos os tokens de design estão centralizados em `frontend/src/index.css`:

### Cores

```css
--color-primary: #f1648c; /* Rosa principal */
--color-primary-dark: #d8456b; /* Rosa escuro (hover) */
--color-primary-border: #fbd1dd; /* Borda rosa claro */
--color-background: #fce0e8; /* Fundo geral */
--color-secondary-background: #fbd1dd; /* Fundo secundário */
--color-tertiary-background: #fff0f5; /* Fundo terciário */
--color-text: #555555; /* Texto padrão */
--color-white: #ffffff;
--color-star-active: #ffd700; /* Estrela ativa (likes) */
```

### Layout

```css
--container-max-width: 1200px;
--radius-card: 20px;
--radius-button: 50px;
--shadow-card: 0 4px 6px rgba(241, 100, 140, 0.3);
--transition-default: all 0.3s ease;
```

### Tipografia

```css
--font-main: "Fredoka", sans-serif;
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
- **Routes** (`routes/`): Mapeiam endpoints para Controllers, aplicam middlewares (`autenticacaoMiddleware`, `uploadConfig`).
- **Erros:** Classe customizada `AppError` com `statusCode`, capturada pelo `gerenciadorErros` centralizado.

### Frontend — Hooks Pattern

- **Custom Hooks** (`hooks/`): Encapsulam lógica de estado e chamadas à API (`useProdutos`, `useAdminProdutos`, `useAutenticacao`, `useCarrinho`).
- **Pages** (`pages/`): Componentes de página que orquestram hooks e componentes.
- **Components** (`components/`): Componentes de UI reutilizáveis, cada um em sua própria pasta com arquivo `.tsx` + `.css`.
- **Services** (`services/api.ts`): Centraliza todas as chamadas `fetch()` ao backend. Funções retornam Promises tipadas.
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
# Subir todos os containers (db + backend + frontend + tunnel)
docker compose up -d

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
```

### Frontend (dev local, fora do Docker)

```bash
cd frontend
pnpm install
pnpm dev         # vite dev server :5173
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

**Solução:** O arquivo `init.sql` contém `TRUNCATE TABLE ... CASCADE` que apaga todos os dados ao reiniciar. Isso é intencional para desenvolvimento. Em produção, remova essas linhas e use migrations (`backend/migrations/`) para alterações incrementais no schema.

---

**Hurdle:** CORS bloqueando requests do frontend em produção.

**Solução:** A variável `FRONTEND_URL` no `.env` raiz deve conter a URL exata do frontend em produção (ex: `https://jcafenatal.store`). O backend usa `cors(corsOptions)` que apenas aceita a origin configurada.

---

**Hurdle:** Porta do PostgreSQL em conflito (5432 já em uso).

**Solução:** O Docker Compose mapeia `DB_PORT_LOCAL` (padrão: 5433) para a porta local. Para conexão local fora do Docker, use a porta 5433. Dentro do Docker, os containers usam a rede interna na porta 5432 padrão.

---

**Hurdle:** Remoção acidental de imports críticos (ex: `styles`) durante edições parciais.
**Causa:** Uso de `multi_replace_file_content` ou `replace_file_content` onde o bloco `TargetContent` inadvertidamente exclui linhas no topo do arquivo ao tentar "limpar" ou "organizar" imports.
**Solução:** Sempre verificar se todos os imports necessários (especialmente `styles.module.css`) permanecem no arquivo após a edição. Se o componente falhar ao renderizar com erro de "styles is not defined", verifique o topo do arquivo.

---

## 14. Testes

O projeto mantém testes unitários e de integração em ambos os lados:

### Backend (`backend/src/tests/`)

- `sanity.test.ts` — Test de sanidade
- `autenticacao.test.ts` — Autenticação
- `produtos.test.ts` — CRUD de produtos
- `pedidos.test.ts` — CRUD de pedidos
- `EventoRoutes.test.ts` — CRUD de eventos
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
- [ ] O `guia.md` foi atualizado com as novas informações?
