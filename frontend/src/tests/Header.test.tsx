import "../setupTests";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Header } from "../components/Header";
import { CartProvider } from "../hooks/useCart";

describe("Header Component", () => {
  it("should render the brand name", () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Header />
        </CartProvider>
      </BrowserRouter>
    );
    expect(screen.getByText("Mew Mew Café")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Header />
        </CartProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText("Cardápio")).toBeInTheDocument();
  });

  it("should highlight the active link", () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Header />
        </CartProvider>
      </BrowserRouter>
    );
    const menuLinks = screen.getAllByText("Cardápio");
    expect(menuLinks[0]).toBeInTheDocument();
  });
});
