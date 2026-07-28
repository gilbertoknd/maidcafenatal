import "../setupTests";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Header } from "../components/Header";
import { CarrinhoProvider } from "../hooks/useCarrinho";

// Mock do hook de visibilidade da nav
vi.mock("../hooks/useNavVisibilidade", () => ({
  useNavVisibilidade: vi.fn(),
}));

import { useNavVisibilidade } from "../hooks/useNavVisibilidade";
const mockUseNavVisibilidade = vi.mocked(useNavVisibilidade);

/** Retorno padrão: todas as páginas visíveis. */
const MOCK_TUDO_VISIVEL = {
  loja: true,
  mangas: true,
  eventos: true,
  cupons: true,
  agendar: true,
  isLoading: false,
};

function criarQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function renderHeader() {
  const queryClient = criarQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CarrinhoProvider>
          <Header />
        </CarrinhoProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe("Visibilidade de abas na NavBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve exibir 'Loja Online' e 'Mangás' quando ambos estão habilitados", () => {
    mockUseNavVisibilidade.mockReturnValue(MOCK_TUDO_VISIVEL);

    renderHeader();

    expect(screen.getByText("Loja Online")).toBeInTheDocument();
    expect(screen.getByText("Mangás")).toBeInTheDocument();
  });

  it("deve ocultar 'Loja Online' quando desabilitada", () => {
    mockUseNavVisibilidade.mockReturnValue({
      ...MOCK_TUDO_VISIVEL,
      loja: false,
    });

    renderHeader();

    expect(screen.queryByText("Loja Online")).not.toBeInTheDocument();
    expect(screen.getByText("Mangás")).toBeInTheDocument();
  });

  it("deve ocultar 'Mangás' quando desabilitado", () => {
    mockUseNavVisibilidade.mockReturnValue({
      ...MOCK_TUDO_VISIVEL,
      mangas: false,
    });

    renderHeader();

    expect(screen.getByText("Loja Online")).toBeInTheDocument();
    expect(screen.queryByText("Mangás")).not.toBeInTheDocument();
  });

  it("deve ocultar ambos quando desabilitados", () => {
    mockUseNavVisibilidade.mockReturnValue({
      ...MOCK_TUDO_VISIVEL,
      loja: false,
      mangas: false,
    });

    renderHeader();

    expect(screen.queryByText("Loja Online")).not.toBeInTheDocument();
    expect(screen.queryByText("Mangás")).not.toBeInTheDocument();
  });

  it("deve ocultar links enquanto os dados estão carregando", () => {
    mockUseNavVisibilidade.mockReturnValue({
      loja: false,
      mangas: false,
      eventos: false,
      cupons: false,
      agendar: false,
      isLoading: true,
    });

    renderHeader();

    expect(screen.queryByText("Loja Online")).not.toBeInTheDocument();
    expect(screen.queryByText("Mangás")).not.toBeInTheDocument();
  });

  it("deve sempre exibir os links permanentes (Início, Cardápio)", () => {
    mockUseNavVisibilidade.mockReturnValue({
      loja: false,
      mangas: false,
      eventos: false,
      cupons: false,
      agendar: false,
      isLoading: false,
    });

    renderHeader();

    // Início e Cardápio são sempre visíveis, independentemente das configurações
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Cardápio")).toBeInTheDocument();
  });

  it("deve ocultar Eventos, Cupons e Agendar quando admin desabilita", () => {
    mockUseNavVisibilidade.mockReturnValue({
      ...MOCK_TUDO_VISIVEL,
      eventos: false,
      cupons: false,
      agendar: false,
    });

    renderHeader();

    expect(screen.queryByText("Eventos")).not.toBeInTheDocument();
    expect(screen.queryByText("Cupons")).not.toBeInTheDocument();
    expect(screen.queryByText("Agendar evento")).not.toBeInTheDocument();
  });

  it("deve exibir todas as páginas quando tudo habilitado", () => {
    mockUseNavVisibilidade.mockReturnValue(MOCK_TUDO_VISIVEL);

    renderHeader();

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Cardápio")).toBeInTheDocument();
    expect(screen.getByText("Loja Online")).toBeInTheDocument();
    expect(screen.getByText("Mangás")).toBeInTheDocument();
    expect(screen.getByText("Eventos")).toBeInTheDocument();
    expect(screen.getByText("Cupons")).toBeInTheDocument();
    expect(screen.getByText("Agendar evento")).toBeInTheDocument();
  });
});
