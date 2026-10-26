<!-- Parte da wiki do Mew Mew Café. Índice em: ../GEMINI.md -->
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

**Solução:** O arquivo `init.sql` anteriormente continha `TRUNCATE TABLE ... CASCADE`. Para evitar perda de dados em produção e persistir dados em dev, essas linhas foram comentadas. Se precisar resetar o banco manualmente em desenvolvimento, utilize o comando `pnpm db:reset` na pasta /backend. Em produção, use sempre migrations (`backend/src/migrations/`, aplicadas no boot — ver seção 18.1).

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
- `autenticacao.test.ts` — Autenticação (inclui login sem `JWT_SECRET` → 500)
- `autenticacaoMiddleware.test.ts` — Guard JWT (inclui 500 sem segredo configurado)
- `limitadorTaxa.test.ts` — Rate limiting por IP (anti-força-bruta do login)
- `seguranca.test.ts` — Cabeçalhos de segurança (helmet)
- `produtos.test.ts` — CRUD de produtos
- `pedidos.test.ts` — CRUD de pedidos (inclui validação de status por enum)
- `EventoRoutes.test.ts` — CRUD de eventos
- `instagram.test.ts` — CRUD de posts do Instagram
- `configuracao.test.ts` — Configurações e fontes customizadas
- `cupons.test.ts` — Campanhas e cupons (inclui validação zod da criação de campanha)
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
