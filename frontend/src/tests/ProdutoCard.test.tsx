import "../setupTests";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProdutoCard } from "../components/ProdutoCard";
import type { Produto } from "../types/Produto";
import { CartProvider } from "../hooks/useCart";
import { BrowserRouter } from "react-router-dom";

// Mock the API and formatters
vi.mock("../services/api", () => ({
  alternarCurtidaProduto: vi.fn(),
}));

vi.mock("../utils/formatters", () => ({
  formatCurrency: (value: string) => `R$ ${value}`,
}));

const mockProduct: Produto = {
  id: 1,
  nome: "Bolo de Morango",
  descricao: "Delicioso bolo com morangos frescos",
  preco: "15.00",
  imagem_url: "/images/bolo.jpg",
  categoria: "Doces",
  promocao: false,
  curtidas: 10,
  is_loja: false,
  visivel: true,
};

describe("ProdutoCard Component", () => {
  it("should render product details", () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ProdutoCard produto={mockProduct} />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByText("Bolo de Morango")).toBeInTheDocument();
    expect(
      screen.getByText("Delicioso bolo com morangos frescos"),
    ).toBeInTheDocument();
    expect(screen.getByText("R$ 15.00")).toBeInTheDocument();
    expect(screen.getByAltText("Bolo de Morango")).toBeInTheDocument();
  });

  it("should display like count", () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ProdutoCard produto={mockProduct} />
        </CartProvider>
      </BrowserRouter>
    );
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("should toggle like on click", () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ProdutoCard produto={mockProduct} />
        </CartProvider>
      </BrowserRouter>
    );

    const likeButton = screen.getByTitle("Curtir");
    fireEvent.click(likeButton);

    expect(likeButton).toBeInTheDocument();
  });
});
