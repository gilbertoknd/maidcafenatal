import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";

const { mQuery, mRelease, mConnect } = vi.hoisted(() => {
  const mQuery = vi.fn();
  const mRelease = vi.fn();
  const mConnect = vi.fn().mockResolvedValue({ query: mQuery, release: mRelease });
  return { mQuery, mRelease, mConnect };
});

vi.mock("../middlewares/authMiddleware.js", () => ({
  authMiddleware: vi.fn((req, res, next) => next())
}));

vi.mock("../config/db", () => ({
  pool: {
    query: mQuery,
    connect: mConnect,
  },
}));

describe("Order Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get all orders", async () => {
    const mockOrders = [
      { id: 1, cliente_nome: "Maria", total: "50.00" }
    ];
    mQuery.mockResolvedValueOnce({ rows: mockOrders });

    const response = await request(app).get("/api/orders");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrders);
  });

  it("should return 400 on missing create order data", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({ cliente_nome: "Joao" }); 

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should create order successfully", async () => {
    // Mocks for transaction:
    mQuery.mockResolvedValueOnce({}); // BEGIN
    mQuery.mockResolvedValueOnce({ rows: [{ preco: "10.00" }] }); // SELECT preco
    mQuery.mockResolvedValueOnce({ rows: [{ id: 1, cliente_nome: "Joao", total: "20.00" }] }); // INSERT pedido
    mQuery.mockResolvedValueOnce({}); // INSERT itens
    mQuery.mockResolvedValueOnce({}); // COMMIT

    const response = await request(app)
      .post("/api/orders")
      .send({
        cliente_nome: "Joao",
        cliente_endereco: "Rua X",
        itens: [{ produto_id: 1, quantidade: 2 }]
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Pedido criado com sucesso",
      orderId: 1,
      total: "20.00"
    });
  });

  it("should return 404 on update non-existent order", async () => {
    mQuery.mockResolvedValueOnce({ rows: [] }); // Update returning nothing

    const response = await request(app)
      .put("/api/orders/999/status")
      .send({ status: "Concluído" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Pedido não encontrado" });
  });
});
