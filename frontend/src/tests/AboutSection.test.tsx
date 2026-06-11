import "../setupTests";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { AboutSection } from "../components/AboutSection";

function renderAbout() {
  return render(
    <BrowserRouter>
      <AboutSection />
    </BrowserRouter>
  );
}

describe("Componente AboutSection", () => {
  it("deve exibir o título focado em festas", () => {
    renderAbout();
    expect(screen.getByText("Magia japonesa na sua festa")).toBeInTheDocument();
    expect(
      screen.queryByText(/no coração de Natal/i)
    ).not.toBeInTheDocument();
  });

  it("deve exibir o texto sobre a experiência de eventos", () => {
    renderAbout();
    expect(
      screen.getByText(/para seus eventos e festas/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/primeiro maid café do Nordeste/i)
    ).not.toBeInTheDocument();
  });

  it("deve exibir os benefícios de serviços no lugar dos de local físico", () => {
    renderAbout();
    expect(screen.getByText("🎉 Eventos personalizados")).toBeInTheDocument();
    expect(screen.getByText("🍰 Doces temáticos")).toBeInTheDocument();
    expect(screen.getByText("🚚 Delivery em Natal")).toBeInTheDocument();
    expect(screen.getByText("👥 Pra todas as idades")).toBeInTheDocument();
    expect(screen.queryByText(/Pet friendly/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Climatizado/i)).not.toBeInTheDocument();
  });

  it("deve ter o CTA 'Agende seu evento' apontando para /agendar", () => {
    renderAbout();
    const cta = screen.getByText(/Agende seu evento/i);
    expect(cta.closest("a")).toHaveAttribute("href", "/agendar");
    expect(
      screen.queryByText(/Conheça o nosso mundo/i)
    ).not.toBeInTheDocument();
  });
});
