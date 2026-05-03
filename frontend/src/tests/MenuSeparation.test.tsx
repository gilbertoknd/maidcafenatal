import "../setupTests";
import { render, screen, waitFor } from "@testing-library/react";
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
  {
    id: 3,
    nome: "Coxinha de Frango",
    descricao: "Coxinha quentinha",
    preco: "7.00",
    imagem_url: "/img3.jpg",
    categoria: "Salgados",
    promocao: false,
    curtidas: 8,
    is_loja: false,
    is_manga: false,
    visivel: true,
  },
];

vi.mock("../services/api", () => ({
  buscarProdutos: vi.fn(() => Promise.resolve(mockProducts)),
  alternarCurtidaProduto: vi.fn(),
}));

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

describe("MenuSeparation - Separação por Categorias", () => {
  it("deve exibir subtítulos para cada categoria quando 'Todos' está selecionado", async () => {
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

    // Esperar carregar produtos
    await waitFor(() => {
      expect(screen.getByText("Bolo de Chocolate")).toBeInTheDocument();
    });

    // Verificar se os subtítulos das categorias estão presentes (usando H2 conforme planejado)
    // Usamos getByRole para evitar ambiguidade com os botões do CategoryFilter
    expect(
      screen.getByRole("heading", { name: "Doces", level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Bebidas", level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Salgados", level: 2 }),
    ).toBeInTheDocument();

    // Eles devem ser renderizados como subtítulos (heading level 2)
    const subtitles = screen.getAllByRole("heading", { level: 2 });
    const subtitleTexts = subtitles.map((s) => s.textContent);

    expect(subtitleTexts).toContain("Doces");
    expect(subtitleTexts).toContain("Bebidas");
    expect(subtitleTexts).toContain("Salgados");
  });
});
