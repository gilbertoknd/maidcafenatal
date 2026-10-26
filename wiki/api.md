<!-- Parte da wiki do Mew Mew Café. Índice em: ../GEMINI.md -->
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
