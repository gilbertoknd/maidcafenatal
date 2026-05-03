import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { CarrinhoProvider, useCarrinho } from "../hooks/useCarrinho";
import type { Produto } from "../types/Produto";

const mockProduto: Produto = {
  id: 1,
  nome: "Produto Teste",
  preco: "10.5",
  descricao: "",
  categoria: "",
  imagem_url: "",
  promocao: false,
  curtidas: 0,
  is_loja: false,
  is_manga: false,
};

describe("hook useCarrinho", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("deve iniciar com o carrinho vazio", () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });
    expect(result.current.itens).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.contagemItens).toBe(0);
  });

  it("deve adicionar ao carrinho", () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });
    act(() => {
      result.current.adicionarProduto(mockProduto);
    });
    expect(result.current.itens).toHaveLength(1);
    expect(result.current.itens[0]).toEqual({ ...mockProduto, quantidade: 1 });
    expect(result.current.total).toBe(10.5);
    expect(result.current.contagemItens).toBe(1);
  });

  it("deve incrementar a quantidade para o mesmo produto", () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });
    act(() => {
      result.current.adicionarProduto(mockProduto);
      result.current.adicionarProduto(mockProduto);
    });
    expect(result.current.itens).toHaveLength(1);
    expect(result.current.itens[0].quantidade).toBe(2);
    expect(result.current.total).toBe(21.0);
  });

  it("deve remover do carrinho", () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });
    act(() => {
      result.current.adicionarProduto(mockProduto);
      result.current.removerProduto(mockProduto.id);
    });
    expect(result.current.itens).toHaveLength(0);
  });

  it("deve atualizar a quantidade", () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });
    act(() => {
      result.current.adicionarProduto(mockProduto);
      result.current.atualizarQuantidade(mockProduto.id, 5);
    });
    expect(result.current.itens[0].quantidade).toBe(5);
  });
});
