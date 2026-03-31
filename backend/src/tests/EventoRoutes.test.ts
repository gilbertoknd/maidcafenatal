import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { StorageProvider } from "../utils/StorageProvider.js";

// Mock do banco de dados
vi.mock("../config/db", () => ({
  pool: {
    query: vi.fn(),
  },
}));

// Mock do StorageProvider
vi.mock("../utils/StorageProvider.js", () => ({
  StorageProvider: {
    deleteFile: vi.fn(),
  },
}));

// NÃO mockar o middleware, apenas o jwt.verify
vi.mock("jsonwebtoken");

describe("Event Routes", () => {
  const validToken = "Bearer valid-token";
  
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "segredo";
  });

  const mockEvento = {
    id: 1,
    titulo: "Festa Gatinho",
    descricao: "Miau Miau",
    data: "2026-04-10T20:00:00.000Z",
    local: "Maid Cafe",
    visivel: true,
  };

  describe("Security", () => {
    it("should return 401 if token is missing on admin list", async () => {
      const response = await request(app).get("/api/eventos/admin");
      expect(response.status).toBe(401);
    });

    it("should return 401 if token is invalid", async () => {
      (jwt.verify as any).mockImplementation(() => { throw new Error("Ops"); });
      const response = await request(app)
        .post("/api/eventos")
        .set("Authorization", "Bearer invalid");
      expect(response.status).toBe(401);
    });
  });

  describe("Operations", () => {
    it("POST /api/eventos - should create an event with valid token", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      (pool.query as any).mockResolvedValue({ rows: [mockEvento] });

      const response = await request(app)
        .post("/api/eventos")
        .set("Authorization", validToken)
        .send({
          titulo: "Festa Gatinho",
          data: "2026-04-10T20:00:00.000Z",
          local: "Maid Cafe",
        });

      expect(response.status).toBe(201);
      expect(response.body.titulo).toBe("Festa Gatinho");
    });

    it("POST /api/eventos - should cleanup image if creation fails (Error 500)", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      (pool.query as any).mockRejectedValueOnce(new Error("Database boom"));

      const response = await request(app)
        .post("/api/eventos")
        .set("Authorization", validToken)
        .attach("imagem", Buffer.from("fake"), "event.jpg")
        .field("titulo", "Boom");

      expect(response.status).toBe(500);
      expect(StorageProvider.deleteFile).toHaveBeenCalled();
    });

    it("DELETE /api/eventos/:id - should delete an event and its image", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      const eventWithImg = { ...mockEvento, imagem_url: "/images/event.jpg" };
      (pool.query as any).mockResolvedValue({ rows: [eventWithImg] });

      const response = await request(app)
        .delete("/api/eventos/1")
        .set("Authorization", validToken);

      expect(response.status).toBe(200);
      expect(StorageProvider.deleteFile).toHaveBeenCalledWith("/images/event.jpg");
    });
  });
});
