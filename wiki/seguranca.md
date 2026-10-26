<!-- Parte da wiki do Mew Mew Café. Índice em: ../GEMINI.md -->
## 20. 🛡️ Vulnerabilidades Corrigidas

1. **Upload de Arquivos Sem Restrição (Crítico):**
   - **Brecha:** O servidor aceitava qualquer tipo de arquivo, permitindo que atacantes subissem scripts maliciosos (RCE).
   - **Correção:** `fileFilter` no Multer restringindo a **imagens e vídeos** (`jpeg|jpg|png|gif|webp|mp4|webm|mov`), validando **mimetype e extensão** juntos, com limite de 50MB. O nome do arquivo salvo é randomizado (`crypto.randomBytes(16)`) para evitar path traversal e colisão. Uploads de fonte usam um filtro separado em `config/uploadFonte.ts` (.woff2).

2. **Segredo JWT Inseguro (Médio):**
   - **Brecha:** Havia um valor padrão ("segredo") caso a variável de ambiente não fosse carregada, o que facilitaria ataques de força bruta.
   - **Correção:** Removi o fallback. Agora, se `JWT_SECRET` não estiver no `.env`, o servidor lança um erro interno, garantindo que nunca rode em modo inseguro.
   - ⚠️ **Regressão detectada e recorrigida (Agosto/2026):** a auditoria (seção 34) encontrou o fallback `|| "segredo"` **de volta** em `autenticacaoMiddleware.ts` e `AutenticacaoController.ts` — a doc estava à frente do código. Ver item 4 abaixo para a correção definitiva e centralizada.

3. **Validação de Header Fraca (Baixo):**
   - **Brecha:** O código não verificava se o header de autorização seguia o padrão `Bearer <token>`, podendo causar erros inesperados.
   - **Correção:** Adicionei uma validação estrita do formato do header antes do processamento.

4. **Fallback de `JWT_SECRET` — correção definitiva (Crítico, Agosto/2026):**
   - **Brecha:** `process.env.JWT_SECRET || "segredo"` duplicado no middleware e no controller. Com o segredo previsível, qualquer um forjaria um JWT de admin. (Achado #1 da seção 34.)
   - **Correção:** Leitura do segredo **centralizada** em `backend/src/config/jwt.ts` → `obterSegredoJwt()`, que lança `AppError(500)` se a env estiver ausente. Sem fallback. O middleware chama a função **fora** do bloco `try` para que o 500 de configuração **não** seja mascarado como 401 "Token inválido". Nunca reintroduzir a leitura direta de `process.env.JWT_SECRET` fora desse módulo.
   - **Testes (TDD):** `autenticacaoMiddleware.test.ts` (lança 500 sem segredo) e `autenticacao.test.ts` (login sem `JWT_SECRET` → 500, sem token no corpo). Os testes que precisam de token setam `process.env.JWT_SECRET = "segredo"` no `beforeEach`.

5. **Rate limiting no login (Alto, Agosto/2026):**
   - **Brecha:** `POST /api/autenticacao/login` aceitava tentativas ilimitadas → força bruta / password spraying. (Achado #2 da seção 34.)
   - **Correção:** Middleware `criarLimitadorTaxa` em `backend/src/middlewares/limitadorTaxa.ts` — limitador in-memory por IP (`Map` no escopo do closure, com varredura oportunista de entradas expiradas). Aplicado ao `/login` com **10 tentativas / 15 min**; ao estourar, lança `AppError(429)`. É uma **factory** (`criarLimitadorTaxa({ janelaMs, maxTentativas, mensagem })`) reutilizável em outras rotas sensíveis.
   - **Nota de escopo:** o estado é local ao processo — suficiente para o deploy single-container atual. Se um dia escalar para múltiplas instâncias, migrar a contagem para um store compartilhado (ex.: Redis).
   - **Testes (TDD):** `limitadorTaxa.test.ts` — dentro do limite chama `next`; ao exceder lança 429; libera após a janela (via `vi.useFakeTimers`); isola por IP; usa chave de fallback quando `req.ip` é indefinido.

6. **Dependências de produção com CVEs de DoS (Alto, Agosto/2026):**
   - **Brecha:** `multer@2.0.2` (múltiplos DoS: cleanup incompleto, exaustão de recursos, recursão descontrolada, campos aninhados) e a cadeia do Express 5 (`path-to-regexp`, `qs`, `body-parser`) com DoS. Todas em dependências de **produção** (rotas de upload + runtime HTTP). (Achados #3 e #4 da seção 34.)
   - **Correção:** bump de `multer` para `^2.2.0` e `express` para `^5.2.1` no `backend/package.json`. As transitivas do Express **não sobem sozinhas** (o pnpm mantém a resolução dentro do range mesmo após o bump), então foi adicionado um bloco `pnpm.overrides` forçando `path-to-regexp>=8.4.2`, `qs>=6.15.3` e `body-parser>=2.3.0`. Resultado: `pnpm audit --prod` **limpo**.
   - **Validação:** `pnpm test:ci` (62 testes verdes, incluindo os de upload em `EventoRoutes`/`produtos`, provando compatibilidade da API do multer 2.2), `pnpm lint` (0 erros) e `pnpm build` OK.
   - **Manutenção futura:** ao atualizar o Express, revalidar se os overrides ainda são necessários (removê-los quando as versões corrigidas virarem o default das transitivas). As ~27 vulnerabilidades restantes no `pnpm audit` completo são **só devDependencies** (não entram na imagem `install --prod`).

7. **Cabeçalhos de segurança HTTP — `helmet` (Médio, Agosto/2026):**
   - **Brecha:** a API não enviava cabeçalhos de segurança (o Nginx só cobre o front estático) e expunha `X-Powered-By: Express`. (Achado #6 da seção 34.)
   - **Correção:** `app.use(helmet())` em `backend/src/app.ts`, **antes** das rotas. Config com `crossOriginResourcePolicy: { policy: "cross-origin" }` — necessário porque o SPA (outra origem em dev, `:5174` × `:3000`) carrega imagens/fontes de `/images` e `/fonts`; o default `same-origin` do CORP **bloquearia** essas mídias no navegador.
   - **Testes (TDD):** `seguranca.test.ts` — `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` e ausência de `X-Powered-By`.

8. **Hardening de validação de entrada (Baixo, Agosto/2026):** (Achados #9, #10 e #11 da seção 34.)
   - **`SELECT *` no login → colunas explícitas.** `AutenticacaoModel.buscarPorNickname` agora seleciona `id, nickname, senha` — não trafega colunas a mais.
   - **Status de pedido validado por enum.** `PedidoController.atualizarStatus` valida `status` contra `STATUS_PEDIDO_VALIDOS` (zod `enum`: `Pendente`, `Pendente Whatsapp`, `Em Preparo`, `Saiu para entrega`, `Entregue`, `Cancelado`) e responde **400** para valor fora do conjunto, antes de tocar o banco. O conjunto espelha as opções do `AdminPedidos` + o default do `init.sql`.
   - **Criação de campanha de cupom validada por zod.** `CupomController.criarCampanhaAdmin` deixou de passar `req.body` cru ao model — agora usa `campanhaSchema` (mesmo padrão do `resgatarCupom`). `CupomModel.criarCampanha` recebe `CriarCampanhaInput` e coalesce nulláveis (`?? null` / `?? true`).
   - **Testes (TDD):** `pedidos.test.ts` (status inválido → 400 sem chamar o banco; status válido → 200) e `cupons.test.ts` (payload inválido → 400 sem tocar o banco; campanha válida → 201).

9. **`react-router` com CVEs HIGH (Alto, Agosto/2026):**
   - **Brecha:** `react-router-dom@7.9.6` na cadeia de **produção** do frontend, com múltiplos CVEs (XSS via open redirect / ScrollRestoration / RSC, DoS por path ilimitado, CSRF em actions). (Achado #8 da seção 34, parte de produção.)
   - **Correção:** bump para `react-router-dom@^7.18.2` (patched ≥7.18.0). `pnpm audit --prod` do frontend **limpo**. Validação: `pnpm test:ci` (169 testes) e `pnpm build` verdes.
   - **Pendente:** os CVEs restantes do frontend são **devDependencies** (vite/vitest/rollup/esbuild/eslint) — mitigar mantendo o dev server restrito a `localhost`.

10. **Porta do Postgres publicada no host (Info, Agosto/2026):**
    - **Brecha:** `docker-compose.yml` publicava `5432` no host, e ele é a **base de produção** (o override só soma em dev) — expunha o banco em produção. (Achado #12 da seção 34.)
    - **Correção:** removida a publicação da base; movida **só para `docker-compose.override.yml`** (dev), amarrada a `127.0.0.1:${DB_PORT_LOCAL:-5433}`. Em produção (`docker compose -f docker-compose.yml`) o Postgres fica acessível **apenas** pela `maid_network`. Validado com `docker compose config` (dev publica 5433/localhost; prod só expõe 3000 e 5174).

11. **DevDependencies vulneráveis — bump + overrides (Agosto/2026):** (Restante do achado #8 da seção 34.)
    - **Brecha:** dezenas de CVEs (incl. 1 CRÍTICO) na cadeia de ferramentas de dev de ambos os módulos (vite, vitest, rollup, esbuild, postcss, minimatch, brace-expansion, ajv, @babel/core etc.). Não entram na imagem de produção, mas atingem a máquina de dev/CI.
    - **Correção — frontend:** bump direto de `vite@^7.3.6` (CVE do **dev server**, o que mais importa aqui), `vitest@^4.1.10`, `@vitejs/plugin-react@^5.2.0`, `@vitest/coverage-v8@^4.1.10` + `pnpm.overrides` (mesmo major) de `postcss`, `rollup`, `ws`, `js-yaml`, `flatted`, `picomatch`, `nanoid`, `minimatch`, `ajv`, `@babel/core`. Resultado: `pnpm audit` **totalmente limpo** (prod **e** dev).
    - **Correção — backend:** bump cirúrgico de `vitest@^4.1.10` (CVE real) + overrides de `minimatch`, `picomatch`, `form-data`, `brace-expansion`. `pnpm audit --prod` **limpo**.
    - **Resíduo aceito (backend):** restam ~5 achados de `vite` no audit completo — `vite` é **peer do vitest** travado em 7.2.4 (o override não o move) e o backend **nunca executa o dev server do vite** (usado só como engine de transform dos testes), então os CVEs (leitura arbitrária via dev server) são **inalcançáveis**. Mitigação: rodar testes só localmente.
    - **Armadilha documentada:** um `pnpm update` amplo no backend sobe `@types/express-serve-static-core`, que retipa `req.params` para `string | string[]` e **quebra o `tsc`** em ~13 controllers — bump de tipo, zero valor de segurança. Por isso o backend usa bump **cirúrgico** (só vitest), não `pnpm update` geral. Ao atualizar devDeps no futuro, evite o update amplo do backend ou esteja pronto para reverter os `@types`.
    - **Validação:** frontend 169 testes + build; backend 69 testes + tsc + build + lint, todos verdes.

12. **JWT em `localStorage` → cookie `HttpOnly` (Alto, Agosto/2026):** (Achado #7 da seção 34 — o último em aberto.)
    - **Brecha:** o token de admin ficava no `localStorage`, legível por qualquer script → exfiltração via XSS.
    - **Correção (cross-stack):**
      - **Backend:** `cookie-parser` no `app.ts`; `config/cookie.ts` centraliza as opções (`httpOnly`, `sameSite: "lax"`, `secure` só em produção, `path`, `domain` opcional via `COOKIE_DOMAIN`). O `login` seta o cookie (`res.cookie`), há nova rota `POST /api/autenticacao/logout` (`res.clearCookie`), e o `autenticacaoMiddleware` lê o token do **cookie**, com o header `Bearer` mantido como **fallback** (transição sem quebra / clientes não-navegador). O login ainda devolve o token no corpo por compat, mas o front não o guarda.
      - **Frontend:** `services/api.ts` trocou `localStorage`+`Authorization` por `credentials: "include"` em todas as rotas autenticadas (+ `logout()`; `verificarToken()` sem argumento). `LoginModal` não salva mais token; `useAutenticacao` verifica a sessão via `/verify` (assíncrono, o JS não lê o cookie) e faz logout no backend; `pages/Admin` virou verificação assíncrona com estado de loading ("Verificando acesso… 🔐"); `useAdminProdutos` usa `credentials: "include"`.
    - **Por que `SameSite=Lax` basta:** front e API são **same-site** em produção (`mewworld.space` × `api.mewworld.space`, mesmo domínio registrável) **e** em dev (`localhost:5174` × `:3000`, porta não conta). Lax é enviado em requisições same-site e barra CSRF cross-site; somado ao CORS (só libera a origem do front) + preflight das mutações, o CSRF fica coberto sem token dedicado.
    - **Testes (TDD):** backend `autenticacao.test.ts` (login seta cookie `HttpOnly`+`SameSite=Lax`; logout limpa) e `autenticacaoMiddleware.test.ts` (aceita token via cookie); frontend `AdminRestrito.test.tsx` (mock do `/verify`: 401 → LoginModal, 200 → Dashboard). Backend 72 testes, frontend 169, tsc/build/lint verdes.
    - **⚠️ Validar em produção:** o comportamento do cookie não pôde ser testado contra o domínio real (só em dev). Como o middleware ainda aceita o header, a transição não quebra; ainda assim, confira o login do admin em produção após o deploy. Requisito: `NODE_ENV=production` no backend (liga o `Secure`) — já no `docker-compose.yml`.
## 34. Auditoria de Segurança (Agosto/2026)

Varredura defensiva completa (frontend + backend + infra), autorizada pelo dono do projeto. Estende a seção 20 ("Vulnerabilidades Corrigidas"). Ao corrigir um item, marque-o como ✅ resolvido aqui e registre a correção na seção 20.

> **Status (Agosto/2026):** ✅ **12 dos 12 achados resolvidos.** Ver seção 20, itens 4 a 12. `pnpm audit` do **frontend** está **totalmente limpo** (prod + dev); o **backend** tem `pnpm audit --prod` limpo e só um resíduo dev-only inalcançável de `vite` (peer do vitest). O item 7 (JWT em `localStorage` → cookie `HttpOnly`) foi implementado cross-stack — **validar o login do admin em produção após o deploy** (o comportamento do cookie só foi testável em dev; o header segue aceito como fallback, então a transição não quebra).

### 34.1. O que está SÓLIDO (não regredir)

- **SQL 100% parametrizado.** Todos os models (`ProdutoModel`, `EventoModel`, `PedidoModel`, `CupomModel`, `InstagramModel`, `ConfiguracaoModel`, `BannerModel`, `AutenticacaoModel`) usam placeholders `$1..$n` do `pg`. Nenhuma concatenação de input em SQL, nem em nomes de coluna. **Regra:** manter assim — nunca interpolar `req.body`/`req.params` em string de query.
- **Rotas admin protegidas.** Toda mutação (`POST`/`PUT`/`PATCH`/`DELETE`) e listagem `admin` tem `autenticacaoMiddleware` aplicado (conferido em Produto/Evento/Pedido/Cupom/Banner/Instagram/Configuracao Routes). Só permanecem públicas as rotas de leitura pública, `like/unlike`, criação de pedido, resgate/validação de cupom.
- **Preço vem do banco, não do cliente.** `PedidoModel.criar` (linha ~36) recalcula o total buscando `preco` no banco por `produto_id` — o cliente não consegue forjar preço. Desconto de cupom também é resolvido server-side. **Não** aceitar `preco`/`total` do `req.body` no checkout.
- **Upload com filtro duplo.** `config/upload.ts` valida mimetype **e** extensão, randomiza nome (`crypto.randomBytes(16)`), limite 50MB. `config/uploadFonte.ts` restringe a `.woff2`, 2MB. Sem path traversal (nome gerado, destino fixo).
- **Segredos fora do git.** Nenhum `.env` versionado (`git ls-files` limpo); `.gitignore` cobre raiz, `backend/.env` e `frontend/.env`. Credencial do admin no `init.sql` é hash bcrypt custo 10, senha em claro não versionada (seção 20 / migration 10).
- **Erros não vazam stack.** `gerenciadorErros` responde `AppError` com mensagem controlada e faz `500` genérico ("Erro interno do servidor") para o resto — stack só no `console.error` do servidor.
- **Nginx com headers básicos.** `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`.
- **Backend Docker roda como `USER node`** (não-root) e produção usa `install --prod` (sem devDependencies vulneráveis na imagem final).

### 34.2. Achados priorizados

| # | Sev | Achado | Localização | Recomendação |
| - | --- | ------ | ----------- | ------------ |
| 1 | ✅ **RESOLVIDO** | ~~**Fallback inseguro de `JWT_SECRET`.**~~ Corrigido em Agosto/2026: fallback `\|\| "segredo"` removido, leitura centralizada em `config/jwt.ts` (`obterSegredoJwt()`) que lança `AppError` 500 se a env faltar. Ver seção 20, item 4. | `config/jwt.ts`; `middlewares/autenticacaoMiddleware.ts`; `controllers/AutenticacaoController.ts` | — |
| 2 | ✅ **RESOLVIDO** | ~~**Sem rate limiting no login.**~~ Corrigido em Agosto/2026: middleware `criarLimitadorTaxa` (in-memory, por IP) aplicado ao `POST /login` — 10 tentativas / 15 min → `AppError` 429. Ver seção 20, item 5. | `middlewares/limitadorTaxa.ts`; `routes/AutenticacaoRoutes.ts` | — |
| 3 | ✅ **RESOLVIDO** | ~~**`multer@2.0.2` com CVEs de DoS.**~~ Corrigido em Agosto/2026: bump para `multer@^2.2.0`. Ver seção 20, item 6. | `backend` deps | — |
| 4 | ✅ **RESOLVIDO** | ~~**Runtime Express com CVEs de DoS.**~~ Corrigido em Agosto/2026: `express@^5.2.1` + `pnpm.overrides` forçando `path-to-regexp>=8.4.2`, `qs>=6.15.3`, `body-parser>=2.3.0`. `pnpm audit --prod` limpo. Ver seção 20, item 6. | `backend` deps | — |
| 5 | **MÉDIO** | **Credencial do admin parcialmente exposta no repo.** `init.sql:130` versiona `nickname 'KrasnowAdm'` + hash bcrypt. O hash resiste, mas o nickname vazado + custo 10 + ausência de rate limit (item 2) viabilizam dicionário offline/online. | `database/init.sql:130` | Tratar o hash como sensível (mover para seed via env/secret na primeira subida) ou, no mínimo, garantir senha longa e aleatória + item 2. |
| 6 | ✅ **RESOLVIDO** | ~~**Sem `helmet` no backend.**~~ Corrigido em Agosto/2026: `helmet()` em `app.ts` (CORP `cross-origin` p/ não bloquear `/images` e `/fonts`). Ver seção 20, item 7. | `app.ts` | — |
| 7 | ✅ **RESOLVIDO** | ~~**Token JWT em `localStorage`.**~~ Corrigido em Agosto/2026: migrado para cookie **`HttpOnly`+`SameSite=Lax`** (front e API são same-site em prod e dev, então Lax basta e cobre CSRF junto com o CORS). Backend seta/limpa o cookie e lê do cookie (header como fallback); frontend usa `credentials: "include"`. Ver seção 20, item 12. **Validar login do admin em produção pós-deploy.** | `config/cookie.ts`; `AutenticacaoController`; `autenticacaoMiddleware`; `frontend/src/services/api.ts`, `useAutenticacao`, `LoginModal`, `pages/Admin` | — |
| 8 | ✅ **RESOLVIDO** | ~~**Dependências vulneráveis.**~~ Produção: `react-router-dom@^7.18.2` (item 9 abaixo). DevDeps: bump de `vite`/`vitest` + overrides (Agosto/2026) — frontend `pnpm audit` **totalmente limpo**; backend `--prod` limpo, só resíduo dev-only inalcançável de `vite` (peer do vitest). Ver seção 20, item 11. | `frontend`/`backend` deps | — |
| 9 | ✅ **RESOLVIDO** | ~~**`SELECT *` no login.**~~ Corrigido em Agosto/2026: `SELECT id, nickname, senha`. Ver seção 20, item 8. | `models/AutenticacaoModel.ts` | — |
| 10 | ✅ **RESOLVIDO** | ~~**`atualizarStatus` aceita status arbitrário.**~~ Corrigido em Agosto/2026: validação por enum zod (`STATUS_PEDIDO_VALIDOS`) → 400. Ver seção 20, item 8. | `controllers/PedidoController.ts` | — |
| 11 | ✅ **RESOLVIDO** | ~~**`criarCampanhaAdmin` sem validação.**~~ Corrigido em Agosto/2026: `campanhaSchema` (zod). Ver seção 20, item 8. | `controllers/CupomController.ts` | — |
| 12 | ✅ **RESOLVIDO** | ~~**Porta do Postgres publicada no host.**~~ Corrigido em Agosto/2026: publicação movida p/ `docker-compose.override.yml` (dev, `127.0.0.1`); produção não expõe. Ver seção 20, item 10. | `docker-compose.yml` / `.override.yml` | — |

### 34.3. Resumo do `pnpm audit` (Agosto/2026)

- **Backend:** ✅ **`pnpm audit --prod` limpo** (multer + cadeia Express via overrides). O audit **completo** caiu para **5 achados**, todos de `vite` — peer do vitest travado em 7.2.4 que **nunca roda dev server** no backend (transform de teste apenas), CVEs inalcançáveis. Demais devDeps corrigidas via bump cirúrgico do vitest + overrides (`minimatch`, `picomatch`, `form-data`, `brace-expansion`). Bump **amplo** do backend é proibido: sobe `@types/express-serve-static-core` e quebra o `tsc` (ver seção 20, item 11).
- **Frontend:** ✅ **`pnpm audit` TOTALMENTE limpo** (produção **e** dev). Produção: `react-router-dom@^7.18.2`. DevDeps: bump de `vite@^7.3.6`/`vitest@^4.1.10`/`@vitejs/plugin-react`/`@vitest/coverage-v8` + overrides same-major (`postcss`, `rollup`, `ws`, `js-yaml`, `flatted`, `picomatch`, `nanoid`, `minimatch`, `ajv`, `@babel/core`).

> **Reexecução:** `cd frontend && pnpm audit` (deve ficar **totalmente limpo**) e `cd backend && pnpm audit --prod` (limpo; o audit completo mantém só o resíduo de `vite` dev-only). Ainda assim, manter dev server e Vitest UI restritos a `localhost`.
>
> **Nota sobre overrides:** transitivas não sobem sozinhas ao dar bump no pai (o pnpm mantém a resolução dentro do range) — daí os `pnpm.overrides` nos dois `package.json`. Backend: `path-to-regexp`, `qs`, `body-parser` (cadeia Express) + `minimatch`, `picomatch`, `form-data`, `brace-expansion` (dev). Frontend: `postcss`, `rollup`, `ws`, `js-yaml`, `flatted`, `picomatch`, `nanoid`, `minimatch`, `ajv`, `@babel/core` (dev). Ao atualizar os pais no futuro, revalidar/remover overrides quando as versões corrigidas já forem o default.

### 34.4. Ordem de correção recomendada (quando o dono autorizar)

1. ~~Item 1 (JWT fallback)~~ — ✅ feito (Agosto/2026).
2. ~~Item 2 (rate limit no login)~~ — ✅ feito (Agosto/2026).
3. ~~Itens 3 e 4 (bump multer + express-chain)~~ — ✅ feito (Agosto/2026); `pnpm audit --prod` limpo, suíte backend verde.
4. ~~Item 6 (helmet)~~ — ✅ feito (Agosto/2026).
5. ~~Itens 9–11 (validações pontuais com zod)~~ — ✅ feito (Agosto/2026).
6. ~~Item 12 (porta do Postgres)~~ — ✅ feito (Agosto/2026). ~~Item 8 (react-router prod + devDeps)~~ — ✅ feito.
7. ~~Item 7 (JWT `localStorage` → cookie `HttpOnly`)~~ — ✅ feito (Agosto/2026). Topologia confirmada (`mewworld.space` × `api.mewworld.space` = same-site → `SameSite=Lax`). Cross-stack, header mantido como fallback. **Pendência operacional:** validar o login do admin em produção pós-deploy.

**Auditoria concluída: 12/12 achados resolvidos.** Manutenção contínua: bump periódico de devDeps (`pnpm audit`), dev server em `localhost`, e revisar overrides quando as versões corrigidas virarem default.

> Cada correção segue o fluxo TDD do projeto: teste primeiro (`seguranca.test.ts` p/ helmet; status inválido em `pedidos.test.ts`; payload inválido em `cupons.test.ts`; login sem `JWT_SECRET` em `autenticacao.test.ts`), depois implementação, `pnpm test:ci` + `pnpm lint` verdes.