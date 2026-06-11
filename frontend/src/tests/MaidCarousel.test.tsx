import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { MaidCarousel } from "../components/MaidCarousel";
import { maids } from "../data/maidsData";

describe("MaidCarousel Component (painéis diagonais)", () => {
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

  it("cada painel deve ser um link para a página de detalhes da maid", () => {
    renderCarousel();
    maids.forEach((maid) => {
      const painel = screen.getByText(maid.nome).closest("a");
      expect(painel).toHaveAttribute("href", `/maids/${maid.id}`);
    });
  });

  it("não deve renderizar o seletor de avatares nem as setas", () => {
    renderCarousel();
    expect(screen.queryByLabelText("Maid anterior")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Próxima maid")).not.toBeInTheDocument();
    maids.forEach((maid) => {
      expect(
        screen.queryByLabelText(`Selecionar ${maid.nome}`)
      ).not.toBeInTheDocument();
    });
  });

  it("não deve renderizar o card de destaque com bio e 'Conheça-me'", () => {
    renderCarousel();
    expect(screen.queryByText(/Conheça-me/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Maid em destaque/i)).not.toBeInTheDocument();
    maids.forEach((maid) => {
      expect(screen.queryByText(maid.descricaoBreve)).not.toBeInTheDocument();
    });
  });
});
