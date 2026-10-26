<!-- Parte da wiki do Mew Mew Café. Índice em: ../GEMINI.md -->
## 26. SEO e Indexação (Google Search)

O site possui configurações completas de SEO para ser encontrado em buscas como "mew mew", "mew mew cafe natal", "maid cafe natal", etc.

#### Arquivos de SEO (`frontend/public/`)

| Arquivo                | Descrição                                                       |
| ---------------------- | --------------------------------------------------------------- |
| `robots.txt`           | Permite indexação geral, bloqueia `/admin` e `/cupons`          |
| `sitemap.xml`          | Mapa do site com todas as páginas públicas, prioridades e datas |
| `favicon.svg`          | Ícone circular otimizado para a aba do navegador e PWA          |
| `manifest.webmanifest` | Web App Manifest para PWA/browser integration                   |

#### Meta Tags no `index.html`

- **Título SEO:** "Mew Mew Maid Café Natal | Maid Café em Natal/RN"
- **Meta Description:** Descrição rica com keywords naturais
- **Meta Keywords:** Variações de busca ("mew mew", "maid cafe natal", "cafe tematico natal", etc.)
- **Canonical URL:** `https://mewworld.space/`
- **Open Graph:** Título, descrição, imagem e locale para compartilhamento social (Facebook, WhatsApp)
- **Twitter Card:** Summary large image com título e descrição
- **Geo Tags:** Coordenadas geográficas de Natal/RN para buscas locais
- **Lang:** `pt-BR` no `<html>` para sinalizar idioma ao Google

#### Structured Data (JSON-LD)

- **Schema `CafeOrCoffeeShop`:** Nome, endereço, horários de funcionamento, telefone, redes sociais, cardápio e tipo de culinária
- **Schema `WebSite`:** Nome e URL do site para Sitelinks no Google
- **`alternateName`:** Variações do nome ("Mew Mew Café", "Maid Café Natal", "MewMew Natal", "Mew World") para ampliar a descoberta

#### Nginx (`nginx.conf`)

- Location blocks explícitos para `robots.txt` e `sitemap.xml` com Content-Types corretos
- Cache de 6 meses para estáticos, incluindo `.webmanifest` e `.xml`

#### Próximos Passos de SEO (Manual)

TODO - **Imagem OG dedicada:** Substituir o `Logo.svg` por uma imagem PNG/JPG de 1200x630px específica para preview em redes sociais

---
