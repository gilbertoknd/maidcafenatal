<!-- Parte da wiki do Mew Mew Café. Índice em: ../GEMINI.md -->
## 3. Variáveis de Ambiente (Template)

> ⚠️ **Tudo entre `<...>` é placeholder** — substitua pelos seus valores reais nos `.env` (que **não** são versionados). Nunca commite valores reais nesta doc nem use os literais de exemplo.

### Raiz (`/.env`) — Usada pelo Docker Compose

```env
# Database  (troque TODOS os valores <...> pelos seus — não use os literais abaixo)
POSTGRES_USER=<USUARIO_DB>
POSTGRES_PASSWORD=<SENHA_DB_FORTE>
POSTGRES_DB=<NOME_DO_BANCO>
DB_HOST=db
DB_PORT=5432
DB_PORT_LOCAL=5433
DB_USER=<USUARIO_DB>
DB_PASSWORD=<SENHA_DB_FORTE>
DB_NAME=<NOME_DO_BANCO>

# Backend
PORT=3000
FRONTEND_URL=http://localhost:5174
JWT_SECRET=troque_por_um_valor_aleatorio_forte
# COOKIE_DOMAIN=.mewworld.space   # opcional (ver nota do cookie HttpOnly abaixo)

# Cloudflare Tunnel
TUNNEL_TOKEN=seu_token_cloudflare
```

> 🍪 **Cookie de sessão do admin (HttpOnly, achado #7):** o login agora entrega o JWT num **cookie `HttpOnly`** em vez do `localStorage`. Ele funciona **sem configuração extra** porque o cookie é setado por e enviado para `api.mewworld.space` (host-only) e é *same-site* com o front. O único requisito de produção é **`NODE_ENV=production`** (já injetado no `docker-compose.yml`) — é o que liga o flag `Secure`. **`COOKIE_DOMAIN` é opcional**: só defina (`.mewworld.space`) se um dia precisar compartilhar o cookie com outros subdomínios; deixado em branco, o cookie fica host-only (mais restrito, e suficiente para a topologia atual).

> ⚠️ **`JWT_SECRET` — este é o `.env` que protege a PRODUÇÃO** (o Docker Compose injeta `JWT_SECRET: ${JWT_SECRET}` no container do backend). **Nunca** use os placeholders literais (`seu_segredo_jwt`, `segredo`) — são valores públicos e previsíveis, e com o segredo conhecido qualquer um forja um JWT de admin (achado #1 da seção 34). Gere um valor forte e aleatório:
> ```bash
> node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
> ```
> Desde a correção do fallback (seção 20, item 4), o backend **falha ao iniciar** se `JWT_SECRET` estiver ausente — de propósito. Trocar o segredo invalida os tokens já emitidos: o admin só precisa **logar de novo**.

### Frontend (`/frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:3000
```

### Backend (`/backend/.env`)

```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=<USUARIO_DB>
DB_PASSWORD=<SENHA_DB_FORTE>
DB_NAME=<NOME_DO_BANCO>
PORT=3000
JWT_SECRET=<valor_aleatorio_qualquer_para_dev>
FRONTEND_URL=http://localhost:5174
```

> **Nota (`backend/.env`):** este arquivo só é lido no **dev local fora do Docker** (`pnpm dev` na pasta `backend/`). Não protege produção, mas **precisa existir e não ficar vazio** (o servidor não inicia sem `JWT_SECRET`). Pode ser um valor qualquer não-secreto para dev.

> **Nota:** Dentro do Docker, o `DB_HOST` é `db` (nome do serviço). Fora do Docker (dev local), use `localhost` com a porta `DB_PORT_LOCAL` (5433).

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
## 18. Passos Exatos de Deploy e Atualização (Docker)

Quando for realizar o deploy ou atualizar a aplicação em produção com novos códigos, utilize a seguinte sequência:

1. Faça pull das alterações do repositório no servidor.
2. Certifique-se de que o arquivo `.env` da raiz está configurado (especialmente o `TUNNEL_TOKEN`, `JWT_SECRET` forte e as senhas de banco).
3. **Sempre com `-f docker-compose.yml`** (produção — nunca mesclar o `override.yml` de dev). Build limpo e subida:
   `docker compose -f docker-compose.yml up -d --build`
   > ⚠️ Rodar `docker compose up` **sem `-f`** mescla o `docker-compose.override.yml` e sobe a aplicação em **modo dev** (Vite dev server + `tsx watch`, `NODE_ENV=development`) — errado e inseguro em produção. O CI/CD (`.github/workflows/ci-cd.yml`) já usa o `-f`.
4. **Migrations rodam sozinhas.** Desde Agosto/2026 o backend aplica as migrations pendentes **no boot** (`server.ts` → `executarMigrations`), então todo deploy sincroniza o schema automaticamente. Uma falha de migration é logada mas **não derruba** o servidor.
   - Para rodar manualmente em produção (imagem `runner`, compilada): `docker exec maid_backend node dist/migrate_db.js` — **NÃO** use `pnpm db:migrate` em produção (o `tsx` é devDependency e não está na imagem `runner`).
   - Em dev local: `pnpm db:migrate` (= `tsx src/migrate_db.ts`).
   > Ver seção 18.1 para o mecanismo. `backend/scripts/reset_db.ts` é o `pnpm db:reset` — nunca rode em produção.

### 18.1. Mecanismo de migrations (Agosto/2026)

Reescrito para funcionar em produção (a versão antiga rodava `tsx migrate_db.ts` da raiz do backend, o que quebrava na imagem `runner`, sem `tsx` nem os `.ts`).

- **Migrations ficam em `backend/src/migrations/`** (movidas da raiz), então são compiladas para `dist/migrations/*.js` e existem na imagem de produção.
- **`backend/src/database/migrator.ts`** exporta `executarMigrations(pool)`: cria a tabela de controle `migrations`, resolve a pasta de migrations **relativa ao próprio módulo** (`import.meta.url`, nunca `process.cwd()`) — funciona em dev (`src/migrations/*.ts` via tsx) e em prod (`dist/migrations/*.js` via node) — e aplica só as pendentes.
- **Reconhecimento por nome normalizado:** o nome é gravado sem extensão (`10_credenciais_admin`), e a comparação normaliza registros legados (gravados com `.ts` pelo runner antigo) — então migrations já aplicadas **não** reexecutam ao trocar dev↔prod.
- **Reusado em dois pontos:** a CLI (`src/migrate_db.ts`, com `pool.end()` + exit code) e a **auto-migração no boot** (`server.ts`, envolta em try/catch que loga sem derrubar).
- **Idempotência:** todas as migrations são seguras de reexecutar (DDL com `IF NOT EXISTS`; seeds com `ON CONFLICT`/`COUNT==0`/`WHERE NOT EXISTS`; a #10 é guardada). Isso torna a auto-migração no boot segura mesmo se a tabela `migrations` estiver vazia.
- **Testes:** `backend/src/tests/migrator.test.ts` — cria a tabela, reconhece migrations legadas (não reaplica), aplica pendente registrando pelo nome normalizado.

## 19. Padrões de Variáveis em Build de Frontend

- O Nginx serve arquivos estáticos já construídos (build phase). Diferente do backend, o container do frontend não lê o `.env` em tempo de execução (runtime). Todas as variáveis de ambiente necessárias (ex: `VITE_BACKEND_URL`) devem estar presentes no momento do `docker compose build`.

---
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
