import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MenuContent } from "../components/MenuContent";
import { BrowserRouter } from "react-router-dom";

// Mock elements needed by CategoryFilter and Search
vi.mock("../components/CategoryFilter", () => ({
  CategoryFilter: () => <div data-testid="category-filter">CategoryFilter</div>,
}));

vi.mock("../components/Search", () => ({
  Search: () => <div data-testid="search">Search</div>,
}));

describe("MenuContent - Empty State Messages", () => {
  const defaultProps = {
    loading: false,
    categories: [],
    searchTerm: "",
    setSearchTerm: () => {},
    selectedCategory: "",
    setSelectedCategory: () => {},
    filteredProducts: [],
  };

  it("deve exibir a mensagem padrao 'Nenhuma delícia encontrada :(' para o cardapio quando nao ha produtos", () => {
    render(
      <BrowserRouter>
        <MenuContent {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText("Nenhuma delícia encontrada :(")).toBeInTheDocument();
  });

  it("deve exibir 'Nenhum mangá encontrado :(' na aba de mangas quando emptyMessage e fornecido", () => {
    render(
      <BrowserRouter>
        <MenuContent {...defaultProps} emptyMessage="Nenhum mangá encontrado :(" />
      </BrowserRouter>
    );
    expect(screen.getByText("Nenhum mangá encontrado :(")).toBeInTheDocument();
  });

  it("deve exibir 'nenhum item encontrado :(' na aba de loja quando emptyMessage e fornecido", () => {
    render(
      <BrowserRouter>
        <MenuContent {...defaultProps} emptyMessage="nenhum item encontrado :(" />
      </BrowserRouter>
    );
    expect(screen.getByText("nenhum item encontrado :(")).toBeInTheDocument();
  });
});
