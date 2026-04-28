import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Home } from "../pages/Home";
import { BrowserRouter } from "react-router-dom";
import { CarrinhoProvider } from "../hooks/useCarrinho";

// Mock child components to avoid complex rendering and API calls
vi.mock("../components/Banner", () => ({
  Banner: ({ pagina }: { pagina: string }) => (
    <div data-testid="video-banner">
      {pagina === "home" && <h1>Bem-vindo ao Mew Mew Café</h1>}
      Banner
    </div>
  ),
}));
vi.mock("../components/PopularSection", () => ({
  PopularSection: () => <div>Popular Section</div>,
}));
vi.mock("../components/NewArrivalsSection", () => ({
  NewArrivalsSection: () => <div>New Arrivals Section</div>,
}));
vi.mock("../components/InstagramSection", () => ({
  InstagramSection: () => <div>Instagram Section</div>,
}));
vi.mock("../components/AboutSection", () => ({
  AboutSection: () => <div>About Section</div>,
}));

describe("Página Inicial", () => {
  it("deve renderizar todas as seções", () => {
    render(
      <BrowserRouter>
        <CarrinhoProvider>
          <Home />
        </CarrinhoProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("video-banner")).toBeInTheDocument();
    expect(screen.getByText("Bem-vindo ao Mew Mew Café")).toBeInTheDocument();
    expect(screen.getByText("Popular Section")).toBeInTheDocument();
    expect(screen.getByText("New Arrivals Section")).toBeInTheDocument();
    expect(screen.getByText("Instagram Section")).toBeInTheDocument();
    expect(screen.getByText("About Section")).toBeInTheDocument();
  });
});
