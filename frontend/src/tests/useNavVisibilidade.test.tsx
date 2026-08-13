import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { useNavVisibilidade } from "../hooks/useNavVisibilidade";

// Mock dos módulos de API
vi.mock("../services/api", () => ({
  buscarProdutos: vi.fn(),
  buscarConfiguracoes: vi.fn(),
}));

import { buscarProdutos, buscarConfiguracoes } from "../services/api";
import type { Produto } from "../types/Produto";

/**
 * Fixture mínima de Produto — este hook só lê `is_loja` e `is_manga`,
 * mas o tipo exige o registro completo. Preenche o resto com valores neutros.
 */
function criarProduto(parcial: Partial<Produto> & { id: number }): Produto {
  return {
    nome: `Produto ${parcial.id}`,
    descricao: null,
    preco: "10.00",
    imagem_url: "/images/teste.webp",
    categoria: "Cafés",
    promocao: false,
    curtidas: 0,
    is_loja: false,
    is_manga: false,
    ...parcial,
  };
}

function criarWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useNavVisibilidade", () => {
  it("deve retornar true para todos quando não há configurações e há produtos", async () => {
    vi.mocked(buscarProdutos).mockResolvedValue([
      criarProduto({ id: 1, is_loja: true, is_manga: false }),
      criarProduto({ id: 2, is_loja: false, is_manga: true }),
    ]);
    vi.mocked(buscarConfiguracoes).mockResolvedValue({
      configuracoes: {},
      fontes_customizadas: [],
    });

    const { result, rerender } = renderHook(() => useNavVisibilidade(), {
      wrapper: criarWrapper(),
    });

    await vi.waitFor(() => {
      rerender();
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.loja).toBe(true);
    expect(result.current.mangas).toBe(true);
    expect(result.current.eventos).toBe(true);
    expect(result.current.cupons).toBe(true);
    expect(result.current.agendar).toBe(true);
  });

  it("deve retornar false para loja/mangás quando admin desabilita via nav_*", async () => {
    vi.mocked(buscarProdutos).mockResolvedValue([
      criarProduto({ id: 1, is_loja: true, is_manga: false }),
      criarProduto({ id: 2, is_loja: false, is_manga: true }),
    ]);
    vi.mocked(buscarConfiguracoes).mockResolvedValue({
      configuracoes: {
        nav_loja: "false",
        nav_mangas: "false",
      },
      fontes_customizadas: [],
    });

    const { result, rerender } = renderHook(() => useNavVisibilidade(), {
      wrapper: criarWrapper(),
    });

    await vi.waitFor(() => {
      rerender();
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.loja).toBe(false);
    expect(result.current.mangas).toBe(false);
    // Eventos, cupons, agendar não foram desabilitados
    expect(result.current.eventos).toBe(true);
    expect(result.current.cupons).toBe(true);
    expect(result.current.agendar).toBe(true);
  });

  it("deve retornar false para loja quando não há produtos is_loja, mesmo com admin habilitado", async () => {
    vi.mocked(buscarProdutos).mockResolvedValue([
      criarProduto({ id: 1, is_loja: false, is_manga: true }),
    ]);
    vi.mocked(buscarConfiguracoes).mockResolvedValue({
      configuracoes: {
        nav_loja: "true",
        nav_mangas: "true",
      },
      fontes_customizadas: [],
    });

    const { result, rerender } = renderHook(() => useNavVisibilidade(), {
      wrapper: criarWrapper(),
    });

    await vi.waitFor(() => {
      rerender();
      expect(result.current.isLoading).toBe(false);
    });

    // Sem produtos is_loja, mesmo com admin habilitado, não deve mostrar
    expect(result.current.loja).toBe(false);
    // Tem produto is_manga e admin habilitou
    expect(result.current.mangas).toBe(true);
  });

  it("deve retornar false para eventos/cupons/agendar quando admin desabilita", async () => {
    vi.mocked(buscarProdutos).mockResolvedValue([]);
    vi.mocked(buscarConfiguracoes).mockResolvedValue({
      configuracoes: {
        nav_eventos: "false",
        nav_cupons: "false",
        nav_agendar: "false",
      },
      fontes_customizadas: [],
    });

    const { result, rerender } = renderHook(() => useNavVisibilidade(), {
      wrapper: criarWrapper(),
    });

    await vi.waitFor(() => {
      rerender();
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.eventos).toBe(false);
    expect(result.current.cupons).toBe(false);
    expect(result.current.agendar).toBe(false);
  });
});
