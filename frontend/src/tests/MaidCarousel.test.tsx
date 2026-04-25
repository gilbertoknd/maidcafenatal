import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { MaidCarousel } from "../components/MaidCarousel";
import { maids } from "../data/maidsData";

describe("MaidCarousel Component", () => {
  const renderCarousel = () =>
    render(
      <BrowserRouter>
        <MaidCarousel />
      </BrowserRouter>
    );

  it("deve renderizar o título da seção", () => {
    renderCarousel();
    expect(
      screen.getByRole("heading", { name: /nossas maids/i })
    ).toBeInTheDocument();
  });

  it("deve renderizar todas as 6 maids com suas imagens", () => {
    renderCarousel();
    maids.forEach((maid) => {
      expect(screen.getByAltText(maid.nome)).toBeInTheDocument();
    });
  });

  it("deve exibir os nomes de todas as maids", () => {
    renderCarousel();
    maids.forEach((maid) => {
      expect(screen.getByText(maid.nome)).toBeInTheDocument();
    });
  });

  it("deve conter links para as páginas de detalhes das maids", () => {
    renderCarousel();
    const links = screen.getAllByRole("link");
    const maidLinks = links.filter((link) =>
      link.getAttribute("href")?.startsWith("/maids/")
    );
    expect(maidLinks.length).toBe(maids.length);
  });

  it("deve exibir as descrições breves das maids", () => {
    renderCarousel();
    maids.forEach((maid) => {
      expect(screen.getByText(maid.descricaoBreve)).toBeInTheDocument();
    });
  });
});
