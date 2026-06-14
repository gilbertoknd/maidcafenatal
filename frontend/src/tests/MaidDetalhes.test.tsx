import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { MaidDetalhes } from "../pages/MaidDetalhes";

// Mock do react-router-dom para simular o parâmetro :id
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "sakura" }),
    useNavigate: () => vi.fn(),
  };
});

// Mock do hook de visibilidade da nav (Header depende dele)
vi.mock("../hooks/useNavVisibilidade", () => ({
  useNavVisibilidade: () => ({ temLoja: true, temMangas: true, isLoading: false }),
}));

describe("MaidDetalhes Page", () => {
  const renderPage = () =>
    render(
      <BrowserRouter>
        <MaidDetalhes />
      </BrowserRouter>
    );

  it("deve renderizar o nome da maid", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: /sakura/i })
    ).toBeInTheDocument();
  });

  it("deve renderizar a descrição completa da maid", () => {
    renderPage();
    expect(
      screen.getByText(/Sakura é a maid mais doce do Mew Mew Café/i)
    ).toBeInTheDocument();
  });

  it("deve renderizar a imagem da maid", () => {
    renderPage();
    expect(screen.getByAltText("Sakura")).toBeInTheDocument();
  });

  it("deve ter um botão de voltar", () => {
    renderPage();
    expect(
      screen.getByRole("button", { name: /voltar/i })
    ).toBeInTheDocument();
  });
});
