import "../setupTests";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MenuPage } from "../pages/Menu";
import { BrowserRouter } from "react-router-dom";
import type { Produto } from "../types/Produto";
import { CarrinhoProvider } from "../hooks/useCarrinho";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock API
const mockProducts: Produto[] = [
  {
    id: 1,
    nome: "Bolo de Chocolate",
    descricao: "Bolo delicioso",
    preco: "10.00",
    imagem_url: "/img1.jpg",
    categoria: "Doces",
    promocao: true,
    curtidas: 5,
    is_loja: false,
    is_manga: false,
    visivel: true,
  },
  {
    id: 2,
    nome: "Café Expresso",
    descricao: "Café forte",
    preco: "5.00",
    imagem_url: "/img2.jpg",
    categoria: "Bebidas",
    promocao: false,
    curtidas: 10,
    is_loja: false,
    is_manga: false,
    visivel: true,
  },
];

vi.mock("../services/api", () => ({
  buscarProdutos: vi.fn(() => Promise.resolve(mockProducts)),
  alternarCurtidaProduto: vi.fn(),
  buscarConfiguracoes: vi.fn(() => Promise.resolve({ configuracoes: {}, fontes_customizadas: [] })),
}));

// Mock child components that are not focus of this test to simplify
vi.mock("../components/Banner", () => ({
  Banner: () => <div data-testid="banner">Banner</div>,
  ImageBanner: () => <div data-testid="image-banner">Banner</div>,
  VideoBanner: () => <div data-testid="video-banner">Banner</div>,
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("Página de Cardápio", () => {
  it("deve renderizar o estado de carregamento inicialmente", () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CarrinhoProvider>
            <MenuPage />
          </CarrinhoProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("deve renderizar produtos após carregar", async () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CarrinhoProvider>
            <MenuPage />
          </CarrinhoProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Bolo de Chocolate")).toBeInTheDocument();
      expect(screen.getByText("Café Expresso")).toBeInTheDocument();
    });
  });

  it("deve filtrar produtos pela busca", async () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CarrinhoProvider>
            <MenuPage />
          </CarrinhoProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Bolo de Chocolate")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Buscar delícias...");
    fireEvent.change(searchInput, { target: { value: "Café" } });

    expect(screen.queryByText("Bolo de Chocolate")).not.toBeInTheDocument();
    expect(screen.getByText("Café Expresso")).toBeInTheDocument();
  });

  it("deve filtrar produtos por categoria", async () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CarrinhoProvider>
            <MenuPage />
          </CarrinhoProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Bolo de Chocolate")).toBeInTheDocument();
    });

    const categoryButton = screen.getByRole("button", { name: "Bebidas" });
    fireEvent.click(categoryButton);

    await waitFor(() => {
      expect(screen.queryByText("Bolo de Chocolate")).not.toBeInTheDocument();
      expect(screen.getByText("Café Expresso")).toBeInTheDocument();
    });
  });
});
