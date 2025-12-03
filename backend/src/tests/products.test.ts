import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";

// Mock the database pool
vi.mock("../config/db", () => ({
  pool: {
    query: vi.fn(),
  },
}));

import { pool } from "../config/db";

describe("Product Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all products", async () => {
    const mockProducts = [
      { id: 1, name: "Product 1", price: 10 },
      { id: 2, name: "Product 2", price: 20 },
    ];

    (pool.query as any).mockResolvedValue({ rows: mockProducts });

    const response = await request(app).get("/api/produtos");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducts);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM produtos ORDER BY id ASC"
    );
  });

  it("should return popular products", async () => {
    const mockProducts = [{ id: 1, name: "Popular Product", curtidas: 100 }];

    (pool.query as any).mockResolvedValue({ rows: mockProducts });

    const response = await request(app).get("/api/produtos/populares");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducts);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM produtos ORDER BY curtidas DESC LIMIT 6"
    );
  });
  it("should return new products", async () => {
    const mockProducts = [
      { id: 1, name: "New Product", criado_em: "2023-01-01" },
    ];

    (pool.query as any).mockResolvedValue({ rows: mockProducts });

    const response = await request(app).get("/api/produtos/novidades");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducts);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM produtos ORDER BY criado_em DESC LIMIT 3"
    );
  });

  it("should increment likes", async () => {
    const mockResult = { curtidas: 11 };
    (pool.query as any).mockResolvedValue({ rows: [mockResult] });

    const response = await request(app).patch("/api/produtos/1/like");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ novas_curtidas: 11 });
    expect(pool.query).toHaveBeenCalledWith(
      "UPDATE produtos SET curtidas = curtidas + 1 WHERE id = $1 RETURNING curtidas",
      ["1"]
    );
  });

  it("should decrement likes", async () => {
    const mockResult = { curtidas: 9 };
    (pool.query as any).mockResolvedValue({ rows: [mockResult] });

    const response = await request(app).patch("/api/produtos/1/unlike");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ novas_curtidas: 9 });
    expect(pool.query).toHaveBeenCalledWith(
      "UPDATE produtos SET curtidas = GREATEST(curtidas - 1, 0) WHERE id = $1 RETURNING curtidas",
      ["1"]
    );
  });

  it("should return 404 when liking non-existent product", async () => {
    (pool.query as any).mockResolvedValue({ rows: [] });

    const response = await request(app).patch("/api/produtos/999/like");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Produto não encontrado" });
  });

  it("should handle database errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (pool.query as any).mockRejectedValue(new Error("DB Error"));

    const response = await request(app).get("/api/produtos");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Erro interno do servidor" });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
