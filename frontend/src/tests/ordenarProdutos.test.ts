import { describe, it, expect } from "vitest";
import { ordenarProdutos } from "../utils/ordenarProdutos";
import type { Produto } from "../types/Produto";

function criarProduto(over: Partial<Produto>): Produto {
  return {
    id: 1,
    nome: "Produto",
    descricao: null,
    preco: "10.00",
    imagem_url: "/images/x.png",
    categoria: "Geral",
    promocao: false,
    curtidas: 0,
    is_loja: false,
    is_manga: true,
    ...over,
  };
}

const base: Produto[] = [
  criarProduto({ id: 1, nome: "Bleach", preco: "30.00", curtidas: 5 }),
  criarProduto({ id: 2, nome: "Akira", preco: "12.50", curtidas: 20 }),
  criarProduto({ id: 3, nome: "Chainsaw", preco: "25.00", curtidas: 1 }),
];

describe("ordenarProdutos", () => {
  it("mantém a ordem original em 'recommended' e não muta o array", () => {
    const resultado = ordenarProdutos(base, "recommended");
    expect(resultado.map((p) => p.id)).toEqual([1, 2, 3]);
    // mesma referência (recommended não cria cópia)
    expect(resultado).toBe(base);
  });

  it("não muta o array original ao ordenar", () => {
    const copiaOriginal = base.map((p) => p.id);
    ordenarProdutos(base, "name_asc");
    expect(base.map((p) => p.id)).toEqual(copiaOriginal);
  });

  it("ordena por preço crescente", () => {
    const r = ordenarProdutos(base, "price_asc");
    expect(r.map((p) => p.nome)).toEqual(["Akira", "Chainsaw", "Bleach"]);
  });

  it("ordena por preço decrescente", () => {
    const r = ordenarProdutos(base, "price_desc");
    expect(r.map((p) => p.nome)).toEqual(["Bleach", "Chainsaw", "Akira"]);
  });

  it("ordena por nome A-Z e Z-A", () => {
    expect(ordenarProdutos(base, "name_asc").map((p) => p.nome)).toEqual([
      "Akira",
      "Bleach",
      "Chainsaw",
    ]);
    expect(ordenarProdutos(base, "name_desc").map((p) => p.nome)).toEqual([
      "Chainsaw",
      "Bleach",
      "Akira",
    ]);
  });

  it("ordena por curtidas em 'bestsellers' e 'most_viewed'", () => {
    const esperado = ["Akira", "Bleach", "Chainsaw"];
    expect(ordenarProdutos(base, "bestsellers").map((p) => p.nome)).toEqual(esperado);
    expect(ordenarProdutos(base, "most_viewed").map((p) => p.nome)).toEqual(esperado);
  });

  it("ordena do mais recente para o mais antigo por id", () => {
    expect(ordenarProdutos(base, "newest").map((p) => p.id)).toEqual([3, 2, 1]);
  });
});
