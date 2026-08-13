import "../setupTests";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { AdminNavbar } from "../components/AdminNavbar";
import { NAV_PAGINAS_LABELS } from "../types/Configuracao";

// Mock dos módulos de API
vi.mock("../services/api", () => ({
  buscarConfiguracoes: vi.fn(),
  atualizarConfiguracoes: vi.fn(),
}));

import { buscarConfiguracoes, atualizarConfiguracoes } from "../services/api";

function criarWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("AdminNavbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar todos os toggles de páginas da navbar", async () => {
    vi.mocked(buscarConfiguracoes).mockResolvedValue({
      configuracoes: {},
      fontes_customizadas: [],
    });

    render(<AdminNavbar />, { wrapper: criarWrapper() });

    await waitFor(() => {
      // Deve renderizar todas as labels das páginas
      Object.values(NAV_PAGINAS_LABELS).forEach((label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });

  it("deve exibir todos os toggles como marcados quando não há configuração", async () => {
    vi.mocked(buscarConfiguracoes).mockResolvedValue({
      configuracoes: {},
      fontes_customizadas: [],
    });

    render(<AdminNavbar />, { wrapper: criarWrapper() });

    await waitFor(() => {
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  it("deve exibir toggle desmarcado quando configuração é 'false'", async () => {
    vi.mocked(buscarConfiguracoes).mockResolvedValue({
      configuracoes: {
        nav_loja: "false",
        nav_mangas: "false",
      },
      fontes_customizadas: [],
    });

    render(<AdminNavbar />, { wrapper: criarWrapper() });

    await waitFor(() => {
      const lojaCheckbox = screen.getByLabelText(NAV_PAGINAS_LABELS.nav_loja);
      const mangasCheckbox = screen.getByLabelText(NAV_PAGINAS_LABELS.nav_mangas);
      expect(lojaCheckbox).not.toBeChecked();
      expect(mangasCheckbox).not.toBeChecked();
    });
  });

  it("deve chamar API ao clicar em um toggle", async () => {
    vi.mocked(buscarConfiguracoes).mockResolvedValue({
      configuracoes: {},
      fontes_customizadas: [],
    });
    vi.mocked(atualizarConfiguracoes).mockResolvedValue({
      message: "ok",
      configuracoes: { nav_loja: "false" },
    });

    render(<AdminNavbar />, { wrapper: criarWrapper() });

    await waitFor(() => {
      expect(screen.getByLabelText(NAV_PAGINAS_LABELS.nav_loja)).toBeInTheDocument();
    });

    const lojaCheckbox = screen.getByLabelText(NAV_PAGINAS_LABELS.nav_loja);
    fireEvent.click(lojaCheckbox);

    await waitFor(() => {
      expect(atualizarConfiguracoes).toHaveBeenCalledWith({ nav_loja: "false" });
    });
  });
});
