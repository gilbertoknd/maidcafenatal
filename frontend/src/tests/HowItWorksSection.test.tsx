import "../setupTests";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { HowItWorksSection } from "../components/HowItWorksSection";

function renderSection() {
  return render(
    <BrowserRouter>
      <HowItWorksSection />
    </BrowserRouter>
  );
}

describe("Componente HowItWorksSection", () => {
  it("deve exibir o cabeçalho focado na experiência de eventos", () => {
    renderSection();
    expect(
      screen.getByRole("heading", { name: "Como funciona" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Conheça a experiência/i)).toBeInTheDocument();
    expect(
      screen.getByText("A magia do Mew Mew agora vai até você!")
    ).toBeInTheDocument();
  });

  it("deve exibir os 4 novos passos", () => {
    renderSection();
    expect(
      screen.getByText("A experiência mais mágica...")
    ).toBeInTheDocument();
    expect(screen.getByText("Doces e comidas temáticas")).toBeInTheDocument();
    expect(
      screen.getByText("Organize seu evento conosco")
    ).toBeInTheDocument();
    expect(screen.getByText("Faça sua encomenda")).toBeInTheDocument();
  });

  it("não deve exibir os passos da experiência presencial", () => {
    renderSection();
    expect(screen.queryByText("Okaeri!")).not.toBeInTheDocument();
    expect(screen.queryByText("Peça à la carte")).not.toBeInTheDocument();
    expect(screen.queryByText("Moe moe kyun")).not.toBeInTheDocument();
    expect(screen.queryByText("Foto & lembrança")).not.toBeInTheDocument();
  });

  it("o 4º passo deve ser um link CTA para /agendar", () => {
    renderSection();
    const cta = screen.getByText("Faça sua encomenda").closest("a");
    expect(cta).toHaveAttribute("href", "/agendar");
  });

  it("os demais passos não devem ser links", () => {
    renderSection();
    for (const titulo of [
      "A experiência mais mágica...",
      "Doces e comidas temáticas",
      "Organize seu evento conosco",
    ]) {
      expect(screen.getByText(titulo).closest("a")).toBeNull();
    }
  });
});
