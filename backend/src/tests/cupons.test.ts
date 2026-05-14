import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";

const { mQuery, mRelease, mConnect } = vi.hoisted(() => {
  const mQuery = vi.fn();
  const mRelease = vi.fn();
  const mConnect = vi.fn().mockResolvedValue({ query: mQuery, release: mRelease });
  return { mQuery, mRelease, mConnect };
});

vi.mock("../config/db.js", () => ({
  pool: {
    query: mQuery,
    connect: mConnect,
  },
}));

vi.mock("jsonwebtoken");

describe("Cupons Routes", () => {
  const validToken = "Bearer valid-token";

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "segredo";
  });

  describe("Public Routes", () => {
    it("GET /api/cupons/campanhas-ativas - should return active campaigns", async () => {
      const mockCampanhas = [
        { id: 1, nome: "Bem-vindo", prefixo: "MEW", tipo_desconto: "percentual", valor_desconto: "10.00" }
      ];
      mQuery.mockResolvedValueOnce({ rows: mockCampanhas });

      const response = await request(app).get("/api/cupons/campanhas-ativas");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].nome).toBe("Bem-vindo");
    });

    it("POST /api/cupons/resgatar - should fail if whatsapp is invalid", async () => {
      const response = await request(app).post("/api/cupons/resgatar").send({
        campanha_id: 1,
        cliente_nome: "Joao",
        cliente_whatsapp: "12345", // Inválido
        fingerprint_token: "token-12345"
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("O WhatsApp deve estar no formato");
    });

    it("POST /api/cupons/resgatar - should generate unique coupon", async () => {
      // Mock db returns
      // BEGIN
      mQuery.mockResolvedValueOnce({});
      // 1. check campaign
      mQuery.mockResolvedValueOnce({ rowCount: 1, rows: [{ limite_total: null, qtd_cupons: 0, prefixo: "MEW", ativa: true }] });
      // 2. check whatsapp (no rows -> unique)
      mQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
      // 3. check fingerprint (no rows -> unique)
      mQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
      // 4. insert cupom
      mQuery.mockResolvedValueOnce({ rows: [{ codigo: "MEW-ABC123" }] });
      // COMMIT
      mQuery.mockResolvedValueOnce({});

      const response = await request(app).post("/api/cupons/resgatar").send({
        campanha_id: 1,
        cliente_nome: "Joao",
        cliente_whatsapp: "(11) 99999-9999",
        fingerprint_token: "token-12345"
      });

      expect(response.status).toBe(201);
      expect(response.body.codigo).toBe("MEW-ABC123");
    });

    it("POST /api/cupons/validar - should return discount for valid coupon", async () => {
      mQuery.mockResolvedValueOnce({
        rows: [{ 
          codigo: "MEW-ABC123", 
          usado: false, 
          ativa: true, 
          validade: null,
          tipo_desconto: "percentual",
          valor_desconto: "10.00"
        }]
      });

      const response = await request(app).post("/api/cupons/validar").send({
        codigo: "MEW-ABC123"
      });
      expect(response.status).toBe(200);
      console.log("Validar cupom response body:", response.body);
      expect(response.body.tipo_desconto).toBe("percentual");
      expect(response.body.valor_desconto).toBe("10.00");
    });
  });

  describe("Admin Routes", () => {
    it("should return 401 if token is missing", async () => {
      const response = await request(app).get("/api/cupons/admin/campanhas");
      expect(response.status).toBe(401);
    });

    it("GET /api/cupons/admin/campanhas - should return all campaigns", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      mQuery.mockResolvedValueOnce({ rows: [{ id: 1, nome: "Campanha Teste" }] });

      const response = await request(app)
        .get("/api/cupons/admin/campanhas")
        .set("Authorization", validToken);
      expect(response.status).toBe(200);
      console.log("Admin campanhas response body:", response.body);
      expect(response.body).toHaveLength(1);
    });
  });
});
