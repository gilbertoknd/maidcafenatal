import "../setupTests";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProdutoCard } from "../components/ProdutoCard";
import type { Produto } from "../types/Produto";
import { CarrinhoProvider } from "../hooks/useCarrinho";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { alternarCurtidaProduto } from "../services/api";

// Mock the API and formatters
vi.mock("../services/api", () => ({
  alternarCurtidaProduto: vi.fn(),
}));

vi.mock("../utils/formatadores", () => ({
  formatCurrency: (value: string) => `R$ ${value}`,
}));

const mockProduct: Produto = {
  id: 1,
  nome: "Bolo de Morango",
  descricao: "Delicioso bolo",
  preco: "15.00",
  imagem_url: "/images/bolo.jpg",
  categoria: "Doces",
  promocao: false,
  curtidas: 10,
  is_loja: false,
  is_manga: false,
  visivel: true,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CarrinhoProvider>
          {children}
        </CarrinhoProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe("Componente ProdutoCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("deve alternar a curtida e realizar rollback se a API falhar", async () => {
    // Mock falha na API
    (alternarCurtidaProduto as any).mockRejectedValueOnce(new Error("API Fail"));

    render(<ProdutoCard produto={mockProduct} />, { wrapper: createWrapper() });

    const likeButton = screen.getByTitle("Curtir");

    // Clique inicial (Otimista)
    fireEvent.click(likeButton);
    
    // Verificamos se subiu para 11 (update otimista no cache do Query)
    expect(screen.getByText("11")).toBeInTheDocument();

    // Aguarda o rollback
    await waitFor(() => {
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  it("deve recuperar estado de curtida do localStorage ao carregar", () => {
    // Simula que o produto já foi curtido anteriormente
    localStorage.setItem("mewmew_liked_products", JSON.stringify([mockProduct.id]));

    render(<ProdutoCard produto={mockProduct} />, { wrapper: createWrapper() });

    // O botão deve ter o título "Descurtir" agora
    expect(screen.getByTitle("Descurtir")).toBeInTheDocument();
  });
});
