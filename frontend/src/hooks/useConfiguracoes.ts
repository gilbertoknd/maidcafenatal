import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { buscarConfiguracoes } from "../services/api";

const GOOGLE_FONTS_BUILTIN = ["Inter", "Gochi Hand", "Pacifico"];

export function useConfiguracoesGlobais() {
  const { data, isLoading } = useQuery({
    queryKey: ["configuracoes"],
    queryFn: buscarConfiguracoes,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  useEffect(() => {
    if (!data) return;

    const { configuracoes, fontes_customizadas } = data;

    // 1. Injetar Google Fonts dinamicamente (se necessário)
    const googleFontsParaCarregar = new Set<string>();
    
    // Coleta as fontes necessárias das configurações ativas
    Object.values(configuracoes).forEach((nomeDaFonte) => {
      if (GOOGLE_FONTS_BUILTIN.includes(nomeDaFonte)) {
        googleFontsParaCarregar.add(nomeDaFonte);
      }
    });

    if (googleFontsParaCarregar.size > 0) {
      const familyQuery = Array.from(googleFontsParaCarregar)
        .map((f) => `family=${f.replace(/ /g, "+")}`)
        .join("&");
      const url = `https://fonts.googleapis.com/css2?${familyQuery}&display=swap`;

      // Evita injetar duplicado
      let linkGoogle = document.getElementById("google-fonts-dinamico") as HTMLLinkElement;
      if (!linkGoogle) {
        linkGoogle = document.createElement("link");
        linkGoogle.id = "google-fonts-dinamico";
        linkGoogle.rel = "stylesheet";
        document.head.appendChild(linkGoogle);
      }
      if (linkGoogle.href !== url) {
        linkGoogle.href = url;
      }
    }

    // 2. Injetar @font-face para fontes customizadas (.woff2)
    const fontesAtivasCustomizadas = fontes_customizadas.filter((f) =>
      Object.values(configuracoes).includes(f.nome)
    );

    let styleTag = document.getElementById("fontes-customizadas-style") as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "fontes-customizadas-style";
      document.head.appendChild(styleTag);
    }

    let cssText = "";
    fontesAtivasCustomizadas.forEach((fonte) => {
      cssText += `
        @font-face {
          font-family: '${fonte.nome}';
          src: url('${fonte.arquivo_url}') format('woff2');
          font-display: swap;
        }
      `;
    });
    styleTag.textContent = cssText;

    // 3. Atualizar as variáveis CSS no :root
    const root = document.documentElement;
    // Map de chave no banco -> variável CSS
    const cssVars: Record<string, string> = {
      fonte_titulo_site: "--font-title-site",
      fonte_navbar: "--font-navbar",
      fonte_categorias: "--font-category",
      fonte_titulos_itens: "--font-title-item",
      fonte_descricoes: "--font-description",
      fonte_botoes: "--font-button",
      fonte_geral: "--font-general",
    };

    Object.entries(configuracoes).forEach(([chave, valor]) => {
      const cssVar = cssVars[chave];
      if (cssVar) {
        // Formata o valor se tiver espaços, colocando aspas simples se não for fallbacks
        const familyValue = valor.includes(" ") ? `'${valor}', sans-serif` : `${valor}, sans-serif`;
        root.style.setProperty(cssVar, familyValue);
      }
    });
    
  }, [data]);

  return { isLoading };
}
