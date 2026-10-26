<!-- Parte da wiki do Mew Mew Café. Índice em: ../GEMINI.md -->
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
