import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { useSecoesHome } from "../hooks/useSecoesHome";

// Mock do módulo api
vi.mock("../services/api", () => ({
  buscarConfiguracoes: vi.fn(),
}));

import { buscarConfiguracoes } from "../services/api";

function criarWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useSecoesHome", () => {
  it("deve retornar true para todas as seções quando nenhuma configuração existe", async () => {
    (buscarConfiguracoes as any).mockResolvedValue({
      configuracoes: {},
      fontes_customizadas: [],
    });

    const { result } = renderHook(() => useSecoesHome(), {
      wrapper: criarWrapper(),
    });

    // Enquanto carrega, todos devem ser true (default)
    expect(result.current.secoes.secao_home_banner).toBe(true);
    expect(result.current.secoes.secao_home_hero).toBe(true);
    expect(result.current.secoes.secao_home_como_funciona).toBe(true);
    expect(result.current.secoes.secao_home_maids).toBe(true);
    expect(result.current.secoes.secao_home_eventos).toBe(true);
    expect(result.current.secoes.secao_home_sobre).toBe(true);
    expect(result.current.secoes.secao_home_instagram).toBe(true);
    expect(result.current.secoes.secao_home_clube_mew).toBe(true);
  });

  it("deve retornar false para seções com valor 'false' no banco", async () => {
    (buscarConfiguracoes as any).mockResolvedValue({
      configuracoes: {
        secao_home_hero: "false",
        secao_home_instagram: "false",
        secao_home_banner: "true",
      },
      fontes_customizadas: [],
    });

    const { result, rerender } = renderHook(() => useSecoesHome(), {
      wrapper: criarWrapper(),
    });

    // Aguarda o query resolver
    await vi.waitFor(() => {
      rerender();
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.secoes.secao_home_hero).toBe(false);
    expect(result.current.secoes.secao_home_instagram).toBe(false);
    expect(result.current.secoes.secao_home_banner).toBe(true);
    // Seções não definidas devem ser true (default)
    expect(result.current.secoes.secao_home_como_funciona).toBe(true);
    expect(result.current.secoes.secao_home_maids).toBe(true);
  });
});
