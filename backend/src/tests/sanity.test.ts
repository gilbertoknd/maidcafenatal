import { describe, it, expect } from "vitest";

describe("Backend Sanity Check", () => {
  it("deve somar 1 + 1 corretamente", () => {
    const soma = 1 + 1;
    expect(soma).toBe(2);
  });

  it("deve reconhecer variáveis de ambiente básicas", () => {
    // Verifica se o Node consegue ler o process.env
    expect(process.env).toBeDefined();
  });
});
