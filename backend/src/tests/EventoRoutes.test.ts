import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";

// Mock middleware de auth para passar direto em rotas protegidas
vi.mock("../middlewares/authMiddleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => next(),
}));

// Mock do banco de dados
vi.mock("../config/db", () => ({
  pool: {
    query: vi.fn(),
  },
}));

import { pool } from "../config/db.js";

describe("Event Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockEvento = {
    id: 1,
    titulo: "Festa Gatinho",
    descricao: "Miau Miau",
    data: "2026-04-10T20:00:00.000Z",
    local: "Maid Cafe",
    visivel: true,
  };

  it("GET /api/eventos - should return all visible events", async () => {
    (pool.query as any).mockResolvedValue({ rows: [mockEvento] });

    const response = await request(app).get("/api/eventos");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockEvento]);
  });

  it("GET /api/eventos/admin - should return all events for admin", async () => {
    const hiddenEvento = { ...mockEvento, id: 2, titulo: "Evento Oculto", visivel: false };
    (pool.query as any).mockResolvedValue({ rows: [mockEvento, hiddenEvento] });

    const response = await request(app).get("/api/eventos/admin");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[1].titulo).toBe("Evento Oculto");
  });

  it("POST /api/eventos - should create an event", async () => {
    (pool.query as any).mockResolvedValue({ rows: [mockEvento] });

    const response = await request(app)
      .post("/api/eventos")
      .send({
        titulo: "Festa Gatinho",
        descricao: "Miau Miau",
        data: "2026-04-10T20:00:00.000Z",
        local: "Maid Cafe",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockEvento);
  });

  it("PUT /api/eventos/:id - should update an event", async () => {
    (pool.query as any).mockResolvedValue({ rows: [{ ...mockEvento, titulo: "Festa Doguinho" }] });

    const response = await request(app)
      .put("/api/eventos/1")
      .send({
        titulo: "Festa Doguinho",
        data: "2026-04-10T20:00:00.000Z",
        local: "Maid Cafe",
      });

    expect(response.status).toBe(200);
    expect(response.body.titulo).toBe("Festa Doguinho");
  });

  it("PUT /api/eventos/:id - should return 404 if event not found", async () => {
    (pool.query as any).mockResolvedValue({ rows: [] });

    const response = await request(app)
      .put("/api/eventos/999")
      .send({ titulo: "Festa Doguinho", data: "2026-04-10", local: "Cafe" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Evento não encontrado");
  });

  it("DELETE /api/eventos/:id - should delete an event", async () => {
    (pool.query as any).mockResolvedValue({ rows: [mockEvento] });

    const response = await request(app).delete("/api/eventos/1");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Evento deletado com sucesso");
  });

  it("DELETE /api/eventos/:id - should return 404 if not found", async () => {
    (pool.query as any).mockResolvedValue({ rows: [] });

    const response = await request(app).delete("/api/eventos/999");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Evento não encontrado");
  });

  it("PATCH /api/eventos/:id/visibility - should toggle visibility", async () => {
    (pool.query as any).mockResolvedValue({ rows: [{ ...mockEvento, visivel: false }] });

    const response = await request(app).patch("/api/eventos/1/visibility");
    expect(response.status).toBe(200);
    expect(response.body.visivel).toBe(false);
  });

  it("PATCH /api/eventos/:id/visibility - should return 404 if not found", async () => {
    (pool.query as any).mockResolvedValue({ rows: [] });

    const response = await request(app).patch("/api/eventos/999/visibility");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Evento não encontrado");
  });
});
