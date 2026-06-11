import "../setupTests";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { HeroSection } from "../components/HeroSection";

function renderHero() {
  return render(
    <BrowserRouter>
      <HeroSection />
    </BrowserRouter>
  );
}

describe("Componente HeroSection", () => {
  it("deve exibir o badge focado na experiência", () => {
    renderHero();
    expect(
      screen.getByText(/A experiência maid café mais mágica do Nordeste/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/primeiro maid & mangá café/i)
    ).not.toBeInTheDocument();
  });

  it("deve exibir o subtítulo focado em eventos, delivery e kit festa", () => {
    renderHero();
    expect(
      screen.getByText(/Eventos personalizados, delivery e kit festa/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Senta, relaxa/i)).not.toBeInTheDocument();
  });

  it("deve exibir as tags de serviços no lugar das de local físico", () => {
    renderHero();
    expect(screen.getByText(/Aniversários temáticos/i)).toBeInTheDocument();
    expect(screen.getByText(/Formaturas & eventos/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery & encomendas/i)).toBeInTheDocument();
    expect(screen.queryByText(/Pet friendly/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Climatizado/i)).not.toBeInTheDocument();
  });

  it("deve manter os botões 'Ver cardápio' e 'Como funciona'", () => {
    renderHero();
    expect(screen.getByText("Ver cardápio")).toBeInTheDocument();
    expect(screen.getByText("Como funciona")).toBeInTheDocument();
  });
});
