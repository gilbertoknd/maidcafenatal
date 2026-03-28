import "../setupTests";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Header } from "../components/Header";
import { CarrinhoProvider } from "../hooks/useCarrinho";

describe("Componente Header", () => {
  it("deve renderizar o nome da marca", () => {
    render(
      <BrowserRouter>
        <CarrinhoProvider>
          <Header />
        </CarrinhoProvider>
      </BrowserRouter>
    );
    expect(screen.getByText("Mew Mew Café")).toBeInTheDocument();
  });

  it("deve renderizar links de navegação", () => {
    render(
      <BrowserRouter>
        <CarrinhoProvider>
          <Header />
        </CarrinhoProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText("Cardápio")).toBeInTheDocument();
  });

  it("deve destacar o link ativo", () => {
    render(
      <BrowserRouter>
        <CarrinhoProvider>
          <Header />
        </CarrinhoProvider>
      </BrowserRouter>
    );
    const menuLinks = screen.getAllByText("Cardápio");
    expect(menuLinks[0]).toBeInTheDocument();
  });
});
