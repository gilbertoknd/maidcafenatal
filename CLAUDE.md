# CLAUDE.md — Maid Café Natal (Mew Mew Café)

> Guia operacional para o Claude Code neste repositório.
> A **fonte da verdade** completa (arquitetura, schema, rotas, redesign, hurdles) é o `GEMINI.md`, importado ao final deste arquivo.

---

## 1. Regras inegociáveis

- **TDD sempre.** Escreva o teste com a nova função em mente **antes** da implementação, e use os testes para se nortear. Nada de implementar primeiro e testar depois.
- **`pnpm` exclusivamente.** Nunca `npm`, nunca `yarn`.
- **Erros:** leia o output **inteiro** do terminal antes de propor qualquer correção. Diagnosticar a causa vem antes de tentar consertar.
- **Idioma:** tabelas, colunas, variáveis de banco, endpoints, comentários e mensagens de erro em **português** (`produtos`, `pedidos`, `eventos`).
- **Tokens CSS:** nada de valor hard-coded. Toda cor/tamanho/espaçamento vem de `var(--token)` definido no `:root` de [frontend/src/index.css](frontend/src/index.css). Precisa de um token novo? Adicione lá.
- **Erros no backend:** sempre pelo middleware central [backend/src/middlewares/gerenciadorErros.ts](backend/src/middlewares/gerenciadorErros.ts), lançando `AppError`.
- **Mobile-first.** Celular é o foco principal — responsividade e funcionalidade mobile são requisito, não polimento.
- **Documentar.** Ao aprender algo relevante (regra nova, dependência, solução de erro), atualize o `GEMINI.md` na seção adequada — ou crie uma nova. Hurdles novos vão para a seção 13.
- **Melhorar o legado.** Ao tocar em código antigo que não segue estas regras, adeque-o.

---

## 2. Comandos

Ao abrir o projeto, rode `pnpm install` em `frontend/` **e** `backend/` para sincronizar dependências e `@types/*`.

### Backend (`cd backend`)

```bash
pnpm dev         # tsx watch src/server.ts
pnpm test        # vitest watch
pnpm test:ci     # vitest run (uma vez)
pnpm lint        # eslint src/ && tsc --noEmit
pnpm build       # rimraf dist && tsc -p tsconfig.build.json
pnpm db:migrate  # tsx src/migrate_db.ts (prod: node dist/migrate_db.js; auto no boot)
pnpm db:reset    # tsx scripts/reset_db.ts (reseta o banco — só em dev)
```

### Frontend (`cd frontend`)

```bash
pnpm dev         # vite dev server :5174
pnpm test        # vitest watch
pnpm test:ci     # vitest run (uma vez)
pnpm lint        # eslint .
pnpm build       # tsc -b && vite build
```

### Docker

```bash
docker compose up -d                      # dev (usa docker-compose.override.yml automaticamente)
docker compose -f docker-compose.yml up -d # produção explícita
docker compose logs -f backend            # logs
docker compose down                        # derrubar
docker compose down -v                     # derrubar + limpar volumes (reset do banco)
```

> **Após instalar dependência nova**, o volume anônimo do `node_modules` sobrevive ao rebuild e mascara o pacote. Recrie:
> `docker compose up -d --build --no-deps --force-recreate --renew-anon-volumes frontend`

---

## 3. Arquitetura em uma tela

```
Frontend (Vite+React 19+TS) :5174  ──API──▶  Backend (Express 5+TS) :3000  ──pg──▶  PostgreSQL 15 :5432
                                                    │
                                              Cloudflare Tunnel → mewworld.space
```

- **Site público:** cardápio, loja online, mangás, eventos, cupons, agendamento, carrinho.
- **Admin (`/admin`):** CRUD de produtos/pedidos/eventos/banners/fontes/cupons/Instagram + visibilidade. Protegido por JWT.
- **Imagens:** servidas por `express.static` em `/images` a partir de `backend/public/images/`. No banco grava-se o caminho relativo (`/images/Mochi.webp`); no front monta-se `${VITE_BACKEND_URL}${produto.imagem_url}`.

### Backend — MVC

`routes/` (endpoint + middlewares) → `controllers/` (req/res, validação, formato da resposta) → `models/` (SQL puro via `pool.query()`, sem ORM). Erros via `AppError` + `gerenciadorErros`. Deleção de arquivo físico pelo `utils/StorageProvider.ts`.

### Frontend — Hooks pattern

`pages/` orquestram `hooks/` + `components/`. Todo GET público (produtos, eventos) passa por `@tanstack/react-query`. Carrinho via Context API (`useCarrinho`). Cada componente é uma pasta com `index.tsx` + **`styles.module.css`** (plural — a variante singular está depreciada). Todo elemento interativo precisa de `aria-label` descritivo.

---

## 4. Padrões que quebram na prática

- **React 19 + linter:** `setState` síncrono dentro de `useEffect` é erro (`react-hooks/set-state-in-effect`). Prefira estado derivado no render, lazy initializer (`useState(() => localStorage.getItem("X"))`) ou `setTimeout(..., 0)`. Para "semear formulário com dado do servidor", use o ajuste durante o render comparando a origem já aplicada (receita na seção 13 do GEMINI.md) — é o que `AdminBanners`, `AdminFontes`, `AdminHomeEventos` e `ProdutoCard` fazem.
- **Mock de teste:** use `vi.mocked(fn)`, nunca `(fn as any)`. O `as any` desliga a checagem inclusive do nome do método, e `no-explicit-any` é erro no lint. Se o fixture for parcial, escreva uma factory tipada (ex.: `criarProduto()` em `useNavVisibilidade.test.tsx`) em vez de afrouxar o tipo.
- **Testes com TanStack Query:** qualquer componente que renderize indiretamente `useProdutos` e afins **precisa** de `<QueryClientProvider>` no wrapper, senão o Vitest falha com `No QueryClient set`. Componentes com `useNavigate` precisam de `<BrowserRouter>`.
- **Ambiguidade em `getByText`:** categorias aparecem como botão de filtro *e* como `h2` de agrupamento. Use `getByRole('heading', { name, level: 2 })` ou `getByRole('button', { name })`. O mesmo vale para `aria-label` do Footer — use a string exata.
- **jsdom não computa layout:** não dá para asseverar "N colunas no mobile" nos testes. Valide visualmente com Edge/Chrome headless (`--headless=new --virtual-time-budget=9000 --window-size=390,8000 --screenshot=out.png`). Ao mexer só em CSS, **não altere o JSX** de componentes com testes estruturais (`MaidCarousel`, `HeroSection`, `AboutSection`, `HowItWorksSection`).
- **Chave de configuração nova = DOIS lugares.** `frontend/src/types/Configuracao.ts` **e** o array `CHAVES_VALIDAS` em [backend/src/controllers/ConfiguracaoController.ts](backend/src/controllers/ConfiguracaoController.ts). O `PUT /api/configuracoes` filtra por esse whitelist e responde **400** se sobrar zero chave válida — e os painéis admin enviam **uma chave por vez**. Esquecer o backend = "Erro ao salvar" em produção com a suíte de frontend toda verde.
- **Mock de hook incompleto falha no `build`, não no `test:ci`.** Ao adicionar campo ao retorno de um hook que é mockado em teste, procure **todos** os mocks dele: os incompletos passam no `pnpm test:ci` e quebram no `pnpm build` (`tsc -b`). Pior caso, um mock sem a chave nova torna a condição falsy e o elemento simplesmente não renderiza — teste verde cobrindo nada.
- **`--window-size=390` mente no Windows.** O headless impõe largura mínima de ~500px; o PNG de 390px é um **recorte**, e o "overflow" que aparece é falso. Valide com `<iframe width="390">` dentro de uma janela maior (receita na seção 32.4 do GEMINI.md). Sintoma de que é artefato: uma página que você não tocou aparece cortada igual.
- **`packageManager` pinado:** manter `"packageManager": "pnpm@10.x"` no `package.json` dos dois módulos, senão o corepack baixa pnpm 11 e quebra o build Docker no Node 20.
- **Integridade do `index.css`:** após editar, confira que os tokens `--font-*` / `--radius-*` do `:root` sobreviveram. Site quadrado ou com fonte padrão = tokens apagados.

---

## 5. Identidade visual (paleta unificada 2026)

**Parchment · Cardinal · Blush Mochi · Charcoal** — validada por `design-tokens.test.ts`; mantenha o teste e o `:root` em sincronia.

| Papel | Cor | Hex | Token |
| --- | --- | --- | --- |
| Principal | Cardinal Red | `#A91D22` | `--color-primary`, `--color-wine` |
| Fundo | Bege Clarinho | `#FAF7F2` | `--color-background`, `--color-cream` |
| Relevo | Branco Neve | `#FFFFFF` | `--color-white` |
| Softener | Rosa Pastel | `#F0C4BA` | `--color-rose` |
| Texto | Sacristy Charcoal | `#242121` | `--color-text`, `--color-ink` |

- **Card sticker:** `background: var(--color-white); border: 2px solid var(--color-wine); border-radius: var(--radius-card); box-shadow: var(--shadow-sticker-sm);` + hover `transform: translate(-2px,-2px)`.
- **Botão primário:** `background: var(--color-wine); color: var(--color-ivory); border: 2px solid var(--color-wine-deep); border-radius: var(--radius-button);`.
- **Tipografia:** `--font-display` (Fredoka) para títulos chunky, `--font-title` (Sweet Apricot) para títulos de página/categoria/item e Navbar, `--font-main` (Inter) para corpo e UI.

### Densidade mobile — nunca colapse para 1 coluna

| Grade | Desktop | Tablet | Phone (≤520–600px) |
| --- | --- | --- | --- |
| Cards de seção (Destaques, Como Funciona) | 4 col | 2 col | **2 col (2x2)** |
| Produtos (Cardápio, Loja, Mangás) | auto-fill | 3 col | **3 col, sem descrição** |
| Instagram | 3 col | 3 col | 2 col |
| Parceiros | 2 col | 2 col | **2 col** |
| Maids (`MaidCarousel`) | faixa diagonal única | faixa única | fatias diagonais 3 + 2 |

Use `repeat(N, minmax(0, 1fr))` — `auto-fit`/`minmax(280px, …)` colapsa sozinho para 1 coluna abaixo de ~600px.

Coluna única só para conteúdo intrinsecamente linear (formulários do admin, listas verticais).

---

## 6. Regra editorial — pivô do negócio (Junho/2026)

O café **não opera mais presencialmente**. O negócio é: eventos personalizados, kit festa, encomendas e delivery.

> **Nenhuma página pública pode referenciar local físico, mesa, visita presencial ou endereço.** Ao escrever ou editar copy, foque na experiência levada até o cliente. Há testes negativos guardando isso (`Rodape.test.tsx`, `HeroSection.test.tsx`, `AboutSection.test.tsx`, `HowItWorksSection.test.tsx`, `Agendar.test.tsx`) — ao mudar copy dessas seções, atualize os testes junto.

---

## 7. Checklist antes de considerar uma feature pronta

- [ ] Testes escritos **antes** e passando (`pnpm test:ci` no módulo afetado).
- [ ] `pnpm lint` limpo.
- [ ] Tokens CSS no `:root`, sem hard-code.
- [ ] Funciona local **e** via Docker.
- [ ] Nova tabela/coluna → `database/init.sql` atualizado + migration em `backend/src/migrations/` (aplicada no boot).
- [ ] Nova rota → padrão Model → Controller → Route; se for admin, `autenticacaoMiddleware` aplicado.
- [ ] Loading e error states tratados na UI.
- [ ] Responsivo no celular, respeitando a tabela de densidade da seção 5.
- [ ] `useDebugTela()` removido de qualquer página.
- [ ] `GEMINI.md` atualizado com o que foi aprendido.

---

## 8. Contexto completo

Detalhes de schema do banco, todas as rotas da API e do React Router, variáveis de ambiente, deploy, CI/CD, SEO, backup e o catálogo completo de hurdles estão em:

@GEMINI.md
