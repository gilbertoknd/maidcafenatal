import "../setupTests";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { Header } from "../components/Header";
import { CarrinhoProvider } from "../hooks/useCarrinho";

function renderHeader() {
  return render(
    <BrowserRouter>
      <CarrinhoProvider>
        <Header />
      </CarrinhoProvider>
    </BrowserRouter>
  );
}

function definirScrollY(valor: number) {
  Object.defineProperty(window, "scrollY", {
    value: valor,
    writable: true,
    configurable: true,
  });
}

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
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Cardápio")).toBeInTheDocument();
    expect(screen.getByText("Loja Online")).toBeInTheDocument();
    expect(screen.getByText("Mangás")).toBeInTheDocument();
    expect(screen.getByText("Eventos")).toBeInTheDocument();
    expect(screen.getByText("Cupons")).toBeInTheDocument();
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

  it("deve ter o link de Cupons apontando para /cupons", () => {
    render(
      <BrowserRouter>
        <CarrinhoProvider>
          <Header />
        </CarrinhoProvider>
      </BrowserRouter>
    );
    const cuponsLink = screen.getByText("Cupons");
    expect(cuponsLink.closest("a")).toHaveAttribute("href", "/cupons");
  });

  it("deve ter o CTA 'Agendar evento' apontando para /agendar", () => {
    renderHeader();
    const cta = screen.getByText("Agendar evento");
    expect(cta.closest("a")).toHaveAttribute("href", "/agendar");
  });

  it("não deve exibir o CTA de reserva de mesa", () => {
    renderHeader();
    expect(screen.queryByText("Reservar mesa")).not.toBeInTheDocument();
  });
});

describe("Rolling banner do Header", () => {
  beforeEach(() => {
    definirScrollY(0);
  });

  it("deve renderizar os itens do banner duplicados para o loop infinito", () => {
    renderHeader();
    const itens = [
      "✦ A experiência mais mágica do Nordeste",
      "♡ Doces & comidas temáticas",
      "✦ Eventos personalizados",
      "♡ Delivery & encomendas",
      "✦ Kit Festa & aniversários",
    ];
    for (const item of itens) {
      // duas cópias do conteúdo são necessárias para o marquee ser contínuo
      expect(screen.getAllByText(item)).toHaveLength(2);
    }
  });

  it("não deve exibir referências a local físico", () => {
    renderHeader();
    expect(screen.queryByText(/Natal \/ RN/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/maid & mangá café/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mangateca/i)).not.toBeInTheDocument();
  });

  it("deve esconder o banner ao rolar para baixo e reexibir ao voltar ao topo", () => {
    renderHeader();
    const banner = screen.getByTestId("rolling-banner");
    expect(banner).toHaveAttribute("data-visible", "true");

    definirScrollY(120);
    act(() => {
      fireEvent.scroll(window);
    });
    expect(banner).toHaveAttribute("data-visible", "false");

    definirScrollY(0);
    act(() => {
      fireEvent.scroll(window);
    });
    expect(banner).toHaveAttribute("data-visible", "true");
  });
});
