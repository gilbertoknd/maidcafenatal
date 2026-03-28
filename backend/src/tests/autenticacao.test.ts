import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import bcrypt from "bcryptjs";

// Mock the database pool
vi.mock("../config/db", () => ({
  pool: {
    query: vi.fn(),
  },
}));

import { pool } from "../config/db.js";

describe("Rotas de Autenticação", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return token on valid login", async () => {
    const hashedPassword = await bcrypt.hash("senha123", 10);
    const mockUser = { id: 1, nickname: "admin", senha: hashedPassword };

    (pool.query as any).mockResolvedValue({ rows: [mockUser] });

    const response = await request(app)
      .post("/api/autenticacao/login")
      .send({ nickname: "admin", senha: "senha123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toEqual({ id: 1, nickname: "admin" });
  });

  it("should return 401 on invalid nickname", async () => {
    (pool.query as any).mockResolvedValue({ rows: [] });

    const response = await request(app)
      .post("/api/autenticacao/login")
      .send({ nickname: "wrong", senha: "123" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Usuário não encontrado" });
  });

  it("should return 401 on invalid password", async () => {
    const hashedPassword = await bcrypt.hash("senha123", 10);
    const mockUser = { id: 1, nickname: "admin", senha: hashedPassword };

    (pool.query as any).mockResolvedValue({ rows: [mockUser] });

    const response = await request(app)
      .post("/api/autenticacao/login")
      .send({ nickname: "admin", senha: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Senha incorreta" });
  });
});
