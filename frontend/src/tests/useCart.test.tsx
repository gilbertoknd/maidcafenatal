import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { CartProvider, useCart } from "../hooks/useCart";
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
};

describe("useCart hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with empty cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    expect(result.current.cart).toEqual([]);
    expect(result.current.cartTotal).toBe(0);
    expect(result.current.cartCount).toBe(0);
  });

  it("should add to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => {
      result.current.addToCart(mockProduto);
    });
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].produto).toEqual(mockProduto);
    expect(result.current.cart[0].quantidade).toBe(1);
    expect(result.current.cartTotal).toBe(10.5);
    expect(result.current.cartCount).toBe(1);
  });

  it("should increment quantity for same product", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => {
      result.current.addToCart(mockProduto);
      result.current.addToCart(mockProduto);
    });
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantidade).toBe(2);
    expect(result.current.cartTotal).toBe(21.0);
  });

  it("should remove from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => {
      result.current.addToCart(mockProduto);
      result.current.removeFromCart(mockProduto.id);
    });
    expect(result.current.cart).toHaveLength(0);
  });

  it("should update quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => {
      result.current.addToCart(mockProduto);
      result.current.updateQuantity(mockProduto.id, 5);
    });
    expect(result.current.cart[0].quantidade).toBe(5);
  });
});
