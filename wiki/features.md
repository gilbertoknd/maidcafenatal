<!-- Parte da wiki do Mew Mew Café. Índice em: ../GEMINI.md -->
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

---
