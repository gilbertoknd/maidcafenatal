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

  it("deve exibir 'Loja Online' e 'Mangás' quando ambos têm produtos visíveis", () => {
    mockUseNavVisibilidade.mockReturnValue({
      temLoja: true,
      temMangas: true,
      isLoading: false,
    });

    renderHeader();

    expect(screen.getByText("Loja Online")).toBeInTheDocument();
    expect(screen.getByText("Mangás")).toBeInTheDocument();
  });

  it("deve ocultar 'Loja Online' quando não há produtos de loja visíveis", () => {
    mockUseNavVisibilidade.mockReturnValue({
      temLoja: false,
      temMangas: true,
      isLoading: false,
    });

    renderHeader();

    expect(screen.queryByText("Loja Online")).not.toBeInTheDocument();
    expect(screen.getByText("Mangás")).toBeInTheDocument();
  });

  it("deve ocultar 'Mangás' quando não há produtos de manga visíveis", () => {
    mockUseNavVisibilidade.mockReturnValue({
      temLoja: true,
      temMangas: false,
      isLoading: false,
    });

    renderHeader();

    expect(screen.getByText("Loja Online")).toBeInTheDocument();
    expect(screen.queryByText("Mangás")).not.toBeInTheDocument();
  });

  it("deve ocultar ambos quando nenhum tem produtos visíveis", () => {
    mockUseNavVisibilidade.mockReturnValue({
      temLoja: false,
      temMangas: false,
      isLoading: false,
    });

    renderHeader();

    expect(screen.queryByText("Loja Online")).not.toBeInTheDocument();
    expect(screen.queryByText("Mangás")).not.toBeInTheDocument();
  });

  it("deve ocultar ambos enquanto os dados estão carregando", () => {
    mockUseNavVisibilidade.mockReturnValue({
      temLoja: false,
      temMangas: false,
      isLoading: true,
    });

    renderHeader();

    // Enquanto carrega, os links não aparecem para evitar flash
    expect(screen.queryByText("Loja Online")).not.toBeInTheDocument();
    expect(screen.queryByText("Mangás")).not.toBeInTheDocument();
  });

  it("deve sempre exibir os links permanentes (Início, Cardápio, Eventos, Cupons)", () => {
    mockUseNavVisibilidade.mockReturnValue({
      temLoja: false,
      temMangas: false,
      isLoading: false,
    });

    renderHeader();

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Cardápio")).toBeInTheDocument();
    expect(screen.getByText("Eventos")).toBeInTheDocument();
    expect(screen.getByText("Cupons")).toBeInTheDocument();
    expect(screen.getByText("Agendar evento")).toBeInTheDocument();
  });
});
