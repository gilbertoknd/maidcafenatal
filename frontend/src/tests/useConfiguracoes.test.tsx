import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useConfiguracoesGlobais } from "../hooks/useConfiguracoes";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  buscarConfiguracoes: vi.fn(),
}));

describe("useConfiguracoesGlobais", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
    document.documentElement.style.cssText = ""; // limpa o css no jsdom
  });

  it("deve aplicar as variáveis CSS globais no :root quando os dados chegarem", async () => {
    vi.mocked(api.buscarConfiguracoes).mockResolvedValue({
      configuracoes: {
        fonte_titulo_site: "Times New Roman",
        fonte_navbar: "Pacifico",
        fonte_categorias: "Arial",
        fonte_titulos_itens: "Inter",
        fonte_descricoes: "Gochi Hand",
        fonte_botoes: "Sweet Apricot",
        fonte_geral: "Inter",
      },
      fontes_customizadas: [],
    });

    renderHook(() => useConfiguracoesGlobais(), { wrapper });

    await waitFor(() => {
      const rootStyles = document.documentElement.style;
      
      // Tem espaços, deve ter aspas simples + sans-serif
      expect(rootStyles.getPropertyValue("--font-title-site")).toBe("'Times New Roman', sans-serif");
      expect(rootStyles.getPropertyValue("--font-navbar")).toBe("Pacifico, sans-serif");
      expect(rootStyles.getPropertyValue("--font-category")).toBe("Arial, sans-serif");
      expect(rootStyles.getPropertyValue("--font-title-item")).toBe("Inter, sans-serif");
      expect(rootStyles.getPropertyValue("--font-description")).toBe("'Gochi Hand', sans-serif");
      expect(rootStyles.getPropertyValue("--font-button")).toBe("'Sweet Apricot', sans-serif");
      expect(rootStyles.getPropertyValue("--font-general")).toBe("Inter, sans-serif");
    });
  });
});
