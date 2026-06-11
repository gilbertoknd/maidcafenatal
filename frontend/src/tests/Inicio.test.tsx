import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Home } from "../pages/Home";
import { BrowserRouter } from "react-router-dom";

/**
 * Mocks dos componentes filhos para isolar a composição da Home
 * (redesign 2026). Cada seção vira um marcador simples e verificável.
 */
vi.mock("../components/Header", () => ({
  Header: () => <header>Header</header>,
}));
vi.mock("../components/Footer", () => ({
  Footer: () => <footer>Footer</footer>,
}));
vi.mock("../components/HeroSection", () => ({
  HeroSection: () => <div>Hero Section</div>,
}));
vi.mock("../components/HighlightsSection", () => ({
  HighlightsSection: () => <div>Highlights Section</div>,
}));
vi.mock("../components/MaidCarousel", () => ({
  MaidCarousel: () => <div>Maid Carousel</div>,
}));
vi.mock("../components/HowItWorksSection", () => ({
  HowItWorksSection: () => <div>How It Works Section</div>,
}));
vi.mock("../components/AboutSection", () => ({
  AboutSection: () => <div>About Section</div>,
}));
vi.mock("../components/InstagramSection", () => ({
  InstagramSection: () => <div>Instagram Section</div>,
}));

describe("Página Inicial", () => {
  it("deve renderizar todas as seções do redesign", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Hero Section")).toBeInTheDocument();
    expect(screen.getByText("Highlights Section")).toBeInTheDocument();
    expect(screen.getByText("Maid Carousel")).toBeInTheDocument();
    expect(screen.getByText("How It Works Section")).toBeInTheDocument();
    expect(screen.getByText("About Section")).toBeInTheDocument();
    expect(screen.getByText("Instagram Section")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
