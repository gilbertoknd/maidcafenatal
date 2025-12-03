import "../setupTests";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MenuPage } from "../pages/Menu";
import { BrowserRouter } from "react-router-dom";
import type { Produto } from "../types";

// Mock API
const mockProducts: Produto[] = [
  {
    id: 1,
    nome: "Bolo de Chocolate",
    descricao: "Bolo delicioso",
    preco: "10.00",
    imagem_url: "/img1.jpg",
    categoria: "Doces",
    destaque: true,
    curtidas: 5,
  },
  {
    id: 2,
    nome: "Café Expresso",
    descricao: "Café forte",
    preco: "5.00",
    imagem_url: "/img2.jpg",
    categoria: "Bebidas",
    destaque: false,
    curtidas: 10,
  },
];

vi.mock("../services/api", () => ({
  getProducts: vi.fn(() => Promise.resolve(mockProducts)),
  toggleProductLike: vi.fn(),
}));

// Mock child components that are not focus of this test to simplify
vi.mock("../components/Banner", () => ({
  ImageBanner: () => <div data-testid="image-banner">Banner</div>,
}));

describe("MenuPage", () => {
  it("should render loading state initially", () => {
    render(
      <BrowserRouter>
        <MenuPage />
      </BrowserRouter>
    );
    expect(screen.getByText("Carregando refeições...")).toBeInTheDocument();
  });

  it("should render products after loading", async () => {
    render(
      <BrowserRouter>
        <MenuPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Bolo de Chocolate")).toBeInTheDocument();
      expect(screen.getByText("Café Expresso")).toBeInTheDocument();
    });
  });

  it("should filter products by search", async () => {
    render(
      <BrowserRouter>
        <MenuPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Bolo de Chocolate")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Buscar delícias...");
    fireEvent.change(searchInput, { target: { value: "Café" } });

    expect(screen.queryByText("Bolo de Chocolate")).not.toBeInTheDocument();
    expect(screen.getByText("Café Expresso")).toBeInTheDocument();
  });

  it("should filter products by category", async () => {
    render(
      <BrowserRouter>
        <MenuPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Bolo de Chocolate")).toBeInTheDocument();
    });

    const categoryButton = screen.getByText("Bebidas");
    fireEvent.click(categoryButton);

    expect(screen.queryByText("Bolo de Chocolate")).not.toBeInTheDocument();
    expect(screen.getByText("Café Expresso")).toBeInTheDocument();
  });
});
