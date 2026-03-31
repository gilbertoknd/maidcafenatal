import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { StorageProvider } from "../utils/StorageProvider.js";

// Mock the database pool
vi.mock("../config/db", () => ({
  pool: {
    query: vi.fn(),
  },
}));

// Mock do StorageProvider para verificar se arquivos são deletados
vi.mock("../utils/StorageProvider.js", () => ({
  StorageProvider: {
    deleteFile: vi.fn(),
  },
}));

// NÃO vamos mais mockar o autenticacaoMiddleware. Vamos mockar o jwt.verify
vi.mock("jsonwebtoken");

describe("Product Routes", () => {
  const validToken = "Bearer valid-token";
  const invalidToken = "Bearer invalid-token";

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "segredo";
  });

  describe("Security (Authentication)", () => {
    it("should return 401 if token is missing on protected route", async () => {
      const response = await request(app).get("/api/produtos/admin");
      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Token não fornecido");
    });

    it("should return 401 if token is invalid", async () => {
      (jwt.verify as any).mockImplementation(() => {
        throw new Error("Invalid");
      });

      const response = await request(app)
        .get("/api/produtos/admin")
        .set("Authorization", invalidToken);
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Token inválido ou expirado");
    });

    it("should allow access with valid token", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      (pool.query as any).mockResolvedValue({ rows: [] });

      const response = await request(app)
        .get("/api/produtos/admin")
        .set("Authorization", validToken);

      expect(response.status).toBe(200);
    });
  });

  describe("Public Routes", () => {
    it("should return all visible products", async () => {
      const mockProducts = [{ id: 1, nome: "Pocky", price: 10 }];
      (pool.query as any).mockResolvedValue({ rows: mockProducts });

      const response = await request(app).get("/api/produtos");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });
  });

  describe("Admin Routes (Side Effects)", () => {
    it("should delete image if validation fails (Error 400)", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });

      const response = await request(app)
        .post("/api/produtos")
        .set("Authorization", validToken)
        // Simulando envio de arquivo via supertest (o multer vai salvar o arquivo temporariamente)
        .attach("imagem", Buffer.from("fake-image"), "test.jpg")
        .field("nome", "Novo Produto")
        // Faltando PRECO (deve dar 400)
        .field("categoria", "Bebidas");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Dados inválidos. Verifique nome, preço e categoria.");
      
      // VERIFICA SE O CLEANUP FOI CHAMADO
      expect(StorageProvider.deleteFile).toHaveBeenCalled();
    });

    it("should delete product and its image from disk", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      const mockProduct = { id: 1, nome: "Gone", imagem_url: "/images/gone.jpg" };
      (pool.query as any).mockResolvedValue({ rows: [mockProduct] });

      const response = await request(app)
        .delete("/api/produtos/1")
        .set("Authorization", validToken);

      expect(response.status).toBe(200);
      expect(StorageProvider.deleteFile).toHaveBeenCalledWith("/images/gone.jpg");
    });
  });
});
