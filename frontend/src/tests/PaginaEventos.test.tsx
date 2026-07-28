import "../setupTests";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EventosPage } from "../pages/Eventos";
import { BrowserRouter } from "react-router-dom";
import * as api from "../services/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CarrinhoProvider } from "../hooks/useCarrinho";

vi.mock("../services/api", () => ({
  buscarEventos: vi.fn(),
  buscarProdutos: vi.fn().mockResolvedValue([]),
}));

// Mock do hook de visibilidade da nav (Header depende dele)
vi.mock("../hooks/useNavVisibilidade", () => ({
  useNavVisibilidade: () => ({ loja: true, mangas: true, eventos: true, cupons: true, agendar: true, isLoading: false }),
}));

vi.mock("../components/Banner", () => ({
  Banner: () => <div data-testid="banner">Banner</div>,
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe("PaginaEventos", () => {
  it("deve renderizar a página principal de eventos e seus componentes", async () => {
    vi.mocked(api.buscarEventos).mockResolvedValue([
      { id: 1, titulo: "Mew Party", descricao: "Festa Gato", data: "2026-10-10T10:00:00Z", local: "Central", visivel: true, criado_em: "2026-05-01T10:00:00.000Z" }
    ]);
    
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CarrinhoProvider>
            <EventosPage />
          </CarrinhoProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    expect(screen.getByText("Carregando eventos...")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("Mew Party")).toBeInTheDocument();
    });
  });
});
