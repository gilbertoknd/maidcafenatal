import "../setupTests";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { ParceirosPage } from "../pages/Parceiros";

// O Header consome useNavVisibilidade (TanStack Query) — a API é mockada
// para o teste não depender de rede.
vi.mock("../services/api", () => ({
  buscarProdutos: vi.fn().mockResolvedValue([]),
  buscarConfiguracoes: vi.fn().mockResolvedValue({
    configuracoes: {},
    fontes_customizadas: [],
  }),
}));

const COPY_PROIBIDA = /endereço|rua|visite|mesa|presencial|nossa loja física/i;

function criarWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

function renderPagina() {
  return render(<ParceirosPage />, { wrapper: criarWrapper() });
}

describe("Página de Parceiros", () => {
  it("deve renderizar o título da página", () => {
    renderPagina();

    expect(
      screen.getByRole("heading", { name: /Nossos Parceiros/i, level: 1 })
    ).toBeInTheDocument();
  });

  it("deve listar os dois parceiros com nome e sinopse", () => {
    renderPagina();

    expect(screen.getByText("ArtePsi")).toBeInTheDocument();
    expect(screen.getByText(/Psicoterapia para mulheres/i)).toBeInTheDocument();

    expect(screen.getByText("Jjang")).toBeInTheDocument();
    expect(screen.getByText(/mercado coreano em Natal\/RN/i)).toBeInTheDocument();
  });

  it("deve manter os links oficiais dos parceiros", () => {
    renderPagina();

    expect(
      screen.getByRole("link", { name: "Abrir o site da ArtePsi em nova aba" })
    ).toHaveAttribute("href", "https://artepsimonica.com");

    expect(
      screen.getByRole("link", {
        name: "Falar com a Jjang no WhatsApp em nova aba",
      })
    ).toHaveAttribute("href", "https://api.whatsapp.com/send/?phone=5584992088194");
  });

  it("não deve conter copy de atendimento presencial", () => {
    renderPagina();

    expect(screen.getByRole("main").textContent).not.toMatch(COPY_PROIBIDA);
  });
});
