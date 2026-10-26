<!-- Parte da wiki do Mew Mew Café. Índice em: ../GEMINI.md -->
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
> e `backend/src/migrations/10_credenciais_admin.ts` atualiza bancos **já existentes**
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
