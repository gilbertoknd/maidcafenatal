import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Home } from "../pages/Home";
import { BrowserRouter } from "react-router-dom";

// Mock child components to avoid complex rendering and API calls
vi.mock("../components/Banner", () => ({
  VideoBanner: () => <div data-testid="video-banner">Video Banner</div>,
}));
vi.mock("../components/PopularSection/PopularSection", () => ({
  PopularSection: () => <div>Popular Section</div>,
}));
vi.mock("../components/NewArrivalsSection/NewArrivalsSection", () => ({
  NewArrivalsSection: () => <div>New Arrivals Section</div>,
}));
vi.mock("../components/AboutSection/AboutSection", () => ({
  AboutSection: () => <div>About Section</div>,
}));

describe("Home Page", () => {
  it("should render all sections", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByTestId("video-banner")).toBeInTheDocument();
    expect(screen.getByText("Bem-vindo ao Mew Mew Café")).toBeInTheDocument();
    expect(screen.getByText("Popular Section")).toBeInTheDocument();
    expect(screen.getByText("New Arrivals Section")).toBeInTheDocument();
    expect(screen.getByText("About Section")).toBeInTheDocument();
  });
});
