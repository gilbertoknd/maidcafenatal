import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";

// Mock do banco para não depender de conexão real numa rota pública qualquer.
vi.mock("../config/db", () => ({
  pool: {
    query: vi.fn().mockResolvedValue({ rows: [] }),
  },
}));

describe("Cabeçalhos de segurança (helmet)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("define X-Content-Type-Options: nosniff", async () => {
    const response = await request(app).get("/api/produtos");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("remove o header X-Powered-By (não expõe o Express)", async () => {
    const response = await request(app).get("/api/produtos");
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });

  it("define proteção contra clickjacking (X-Frame-Options)", async () => {
    const response = await request(app).get("/api/produtos");
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
  });
});
