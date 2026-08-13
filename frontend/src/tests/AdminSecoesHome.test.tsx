import "../setupTests";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { AdminSecoesHome } from "../components/AdminSecoesHome";

// Mock do módulo api
vi.mock("../services/api", () => ({
  buscarConfiguracoes: vi.fn(),
  atualizarConfiguracoes: vi.fn(),
}));

import { buscarConfiguracoes, atualizarConfiguracoes } from "../services/api";

const mockBuscarConfiguracoes = vi.mocked(buscarConfiguracoes);
const mockAtualizarConfiguracoes = vi.mocked(atualizarConfiguracoes);

function criarWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("AdminSecoesHome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("deve renderizar todas as checkboxes com labels corretas", async () => {
    mockBuscarConfiguracoes.mockResolvedValue({
      configuracoes: {},
      fontes_customizadas: [],
    });

    render(<AdminSecoesHome />, { wrapper: criarWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Banner (Vídeo/Imagem)")).toBeInTheDocument();
      expect(screen.getByText("Hero (Boas-vindas)")).toBeInTheDocument();
      expect(screen.getByText("Como Funciona")).toBeInTheDocument();
      expect(screen.getByText("Carrossel de Maids")).toBeInTheDocument();
      expect(screen.getByText("Eventos")).toBeInTheDocument();
      expect(screen.getByText("Sobre Nós")).toBeInTheDocument();
      expect(screen.getByText("Instagram")).toBeInTheDocument();
      expect(screen.getByText("Parceiros")).toBeInTheDocument();
      expect(screen.getByText("Clube Mew")).toBeInTheDocument();
    });
  });

  it("checkboxes devem iniciar marcadas quando não há config (default true)", async () => {
    mockBuscarConfiguracoes.mockResolvedValue({
      configuracoes: {},
      fontes_customizadas: [],
    });

    render(<AdminSecoesHome />, { wrapper: criarWrapper() });

    await waitFor(() => {
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(9);
      checkboxes.forEach((cb) => {
        expect(cb).toBeChecked();
      });
    });
  });

  it("checkboxes devem refletir valores do banco (false = desmarcada)", async () => {
    mockBuscarConfiguracoes.mockResolvedValue({
      configuracoes: {
        secao_home_hero: "false",
        secao_home_instagram: "false",
      },
      fontes_customizadas: [],
    });

    render(<AdminSecoesHome />, { wrapper: criarWrapper() });

    await waitFor(() => {
      const heroCheckbox = screen.getByLabelText("Hero (Boas-vindas)");
      const instagramCheckbox = screen.getByLabelText("Instagram");
      const bannerCheckbox = screen.getByLabelText("Banner (Vídeo/Imagem)");

      expect(heroCheckbox).not.toBeChecked();
      expect(instagramCheckbox).not.toBeChecked();
      expect(bannerCheckbox).toBeChecked();
    });
  });

  it("deve chamar atualizarConfiguracoes ao alternar checkbox", async () => {
    mockBuscarConfiguracoes.mockResolvedValue({
      configuracoes: {},
      fontes_customizadas: [],
    });
    mockAtualizarConfiguracoes.mockResolvedValue({
      message: "Configurações atualizadas com sucesso!",
      configuracoes: { secao_home_hero: "false" },
    });

    render(<AdminSecoesHome />, { wrapper: criarWrapper() });

    await waitFor(() => {
      expect(screen.getByLabelText("Hero (Boas-vindas)")).toBeChecked();
    });

    // Desmarcar a seção Hero
    fireEvent.click(screen.getByLabelText("Hero (Boas-vindas)"));

    await waitFor(() => {
      expect(atualizarConfiguracoes).toHaveBeenCalledWith({
        secao_home_hero: "false",
      });
    });
  });
});
