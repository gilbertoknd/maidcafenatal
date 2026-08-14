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

vi.mock("../config/db", () => ({
  pool: {
    query: mQuery,
    connect: mConnect,
  },
}));

vi.mock("jsonwebtoken");

describe("Pedido Routes", () => {
  const validToken = "Bearer valid-token";

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "segredo";
  });

  describe("Security", () => {
    it("should return 401 if token is missing on get all orders", async () => {
      const response = await request(app).get("/api/pedidos");
      expect(response.status).toBe(401);
    });

    it("should return 401 if token is invalid on update status", async () => {
      (jwt.verify as any).mockImplementation(() => { throw new Error("Oops"); });
      const response = await request(app)
        .put("/api/pedidos/1/status")
        .set("Authorization", "Bearer invalid")
        .send({ status: "Concluído" });
      expect(response.status).toBe(401);
    });
  });

  describe("Validação de status", () => {
    it("PUT /api/pedidos/:id/status - deve rejeitar status fora do conjunto válido (400)", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });

      const response = await request(app)
        .put("/api/pedidos/1/status")
        .set("Authorization", validToken)
        .send({ status: "Status Inventado" });

      expect(response.status).toBe(400);
      // Não deve ter chamado o banco para atualizar
      expect(mQuery).not.toHaveBeenCalled();
    });

    it("PUT /api/pedidos/:id/status - deve aceitar um status válido (200)", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      mQuery.mockResolvedValueOnce({ rows: [{ id: 1, status: "Entregue" }] });

      const response = await request(app)
        .put("/api/pedidos/1/status")
        .set("Authorization", validToken)
        .send({ status: "Entregue" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("Entregue");
    });
  });

  describe("Operations", () => {
    it("GET /api/pedidos - should get all orders with valid token", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      const mockOrders = [
        { id: 1, cliente_nome: "Maria", total: "50.00" }
      ];
      mQuery.mockResolvedValueOnce({ rows: mockOrders });
      mQuery.mockResolvedValueOnce({ rows: [] }); // O controller faz um map e chama buscarItens

      const response = await request(app)
        .get("/api/pedidos")
        .set("Authorization", validToken);

      expect(response.status).toBe(200);
      expect(response.body[0].cliente_nome).toBe("Maria");
    });

    it("POST /api/pedidos - should create order successfully (Public Route)", async () => {
      // Mock da transação no PedidoModel.criar
      mQuery.mockResolvedValueOnce({}); // BEGIN
      mQuery.mockResolvedValueOnce({ rows: [{ preco: "10.00" }] }); // SELECT preco (item 1)
      mQuery.mockResolvedValueOnce({ rows: [{ id: 1, total: "20.00" }] }); // INSERT pedido
      mQuery.mockResolvedValueOnce({}); // INSERT itens
      mQuery.mockResolvedValueOnce({}); // COMMIT

      const response = await request(app)
        .post("/api/pedidos")
        .send({
          cliente_nome: "Joao",
          cliente_endereco: "Rua X",
          itens: [{ produto_id: 1, quantidade: 2 }]
        });

      expect(response.status).toBe(201);
      expect(response.body.pedido_id).toBe(1);
    });

    it("POST /api/pedidos - should create order with coupon successfully", async () => {
      // Mock db returns
      mQuery.mockResolvedValueOnce({}); // BEGIN
      mQuery.mockResolvedValueOnce({ rows: [{ preco: "10.00" }] }); // SELECT preco (item 1)
      // Check coupon
      mQuery.mockResolvedValueOnce({ rows: [{ 
        cupom_id: 1, codigo: "MEW-123", usado: false, ativa: true, 
        validade: null, tipo_desconto: "percentual", valor_desconto: "10.00" 
      }]}); 
      mQuery.mockResolvedValueOnce({ rows: [{ id: 1, total: "18.00" }] }); // INSERT pedido (20 - 10%)
      mQuery.mockResolvedValueOnce({}); // INSERT itens
      mQuery.mockResolvedValueOnce({}); // UPDATE cupom usado
      mQuery.mockResolvedValueOnce({}); // COMMIT

      const response = await request(app)
        .post("/api/pedidos")
        .send({
          cliente_nome: "Joao",
          cliente_endereco: "Rua X",
          itens: [{ produto_id: 1, quantidade: 2 }],
          codigo_cupom: "MEW-123"
        });

      expect(response.status).toBe(201);
    });

    it("POST /api/pedidos - should fail with invalid coupon", async () => {
      mQuery.mockResolvedValueOnce({}); // BEGIN
      mQuery.mockResolvedValueOnce({ rows: [{ preco: "10.00" }] }); // SELECT preco (item 1)
      // Check coupon (not found)
      mQuery.mockResolvedValueOnce({ rows: [] }); 
      mQuery.mockResolvedValueOnce({}); // ROLLBACK

      const response = await request(app)
        .post("/api/pedidos")
        .send({
          cliente_nome: "Joao",
          cliente_endereco: "Rua X",
          itens: [{ produto_id: 1, quantidade: 2 }],
          codigo_cupom: "INVALIDO"
        });

      expect(response.status).toBe(400); // 400 or 404 depending on how we handle it
    });
  });
});
