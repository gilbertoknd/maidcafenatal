import "../setupTests";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Header } from "../components/Header";

describe("Header Component", () => {
  it("should render the brand name", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText("Mew Mew Café")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText("Cardápio")).toBeInTheDocument();
  });

  it("should highlight the active link", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const menuLinks = screen.getAllByText("Cardápio");
    expect(menuLinks[0]).toBeInTheDocument();
  });
});
