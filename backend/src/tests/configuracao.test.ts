import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

// Mock do banco de dados
vi.mock("../config/db", () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn(),
  },
}));

// Mock do JWT
vi.mock("jsonwebtoken");

// Mock do fs para deletar arquivos de fontes
vi.mock("fs", async () => {
  const actual = await vi.importActual("fs");
  return {
    ...actual,
    existsSync: vi.fn().mockReturnValue(true),
    unlinkSync: vi.fn(),
    mkdirSync: vi.fn(),
  };
});

describe("Configuracao Routes", () => {
  const validToken = "Bearer valid-token";

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "segredo";
  });

  // ═══ GET /api/configuracoes (Público) ═══
  describe("GET /api/configuracoes", () => {
    it("deve retornar as configurações e fontes customizadas sem autenticação", async () => {
      const mockConfigs = [
        { chave: "fonte_titulo_site", valor: "Sweet Apricot" },
        { chave: "fonte_navbar", valor: "Sweet Apricot" },
        { chave: "fonte_categorias", valor: "Sweet Apricot" },
        { chave: "fonte_titulos_itens", valor: "Inter" },
        { chave: "fonte_descricoes", valor: "Inter" },
        { chave: "fonte_botoes", valor: "Inter" },
        { chave: "fonte_geral", valor: "Inter" },
      ];
      const mockFontes = [
        { id: 1, nome: "Another Shabby", arquivo_url: "/fonts/another-shabby.woff2" },
      ];

      // Primeira chamada: configurações, Segunda: fontes
      (pool.query as any)
        .mockResolvedValueOnce({ rows: mockConfigs })
        .mockResolvedValueOnce({ rows: mockFontes });

      const response = await request(app).get("/api/configuracoes");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("configuracoes");
      expect(response.body).toHaveProperty("fontes_customizadas");
      expect(response.body.configuracoes).toHaveProperty("fonte_titulo_site", "Sweet Apricot");
      expect(response.body.fontes_customizadas).toHaveLength(1);
    });
  });

  // ═══ PUT /api/configuracoes (Protegido) ═══
  describe("PUT /api/configuracoes", () => {
    it("deve retornar 401 se token não fornecido", async () => {
      const response = await request(app)
        .put("/api/configuracoes")
        .send({ fonte_titulo_site: "Pacifico" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Token não fornecido");
    });

    it("deve retornar 401 se token for inválido", async () => {
      (jwt.verify as any).mockImplementation(() => {
        throw new Error("Invalid");
      });

      const response = await request(app)
        .put("/api/configuracoes")
        .set("Authorization", "Bearer invalid-token")
        .send({ fonte_titulo_site: "Pacifico" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Token inválido ou expirado");
    });

    it("deve atualizar configurações com token válido", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });

      // Mock para transação: connect retorna client
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      };
      (pool.connect as any).mockResolvedValue(mockClient);

      const response = await request(app)
        .put("/api/configuracoes")
        .set("Authorization", validToken)
        .send({
          fonte_titulo_site: "Pacifico",
          fonte_navbar: "Gochi Hand",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(mockClient.query).toHaveBeenCalled();
      expect(mockClient.release).toHaveBeenCalled();
    });

    it("deve retornar 400 se body estiver vazio", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });

      const response = await request(app)
        .put("/api/configuracoes")
        .set("Authorization", validToken)
        .send({});

      expect(response.status).toBe(400);
    });

    it("deve aceitar chaves secao_home_* para visibilidade de seções", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });

      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      };
      (pool.connect as any).mockResolvedValue(mockClient);

      const response = await request(app)
        .put("/api/configuracoes")
        .set("Authorization", validToken)
        .send({
          secao_home_hero: "false",
          secao_home_instagram: "false",
          secao_home_banner: "true",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.configuracoes).toHaveProperty("secao_home_hero", "false");
      expect(response.body.configuracoes).toHaveProperty("secao_home_instagram", "false");
      expect(response.body.configuracoes).toHaveProperty("secao_home_banner", "true");
      expect(mockClient.query).toHaveBeenCalled();
    });

    it("deve filtrar chaves secao_home inválidas", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });

      const response = await request(app)
        .put("/api/configuracoes")
        .set("Authorization", validToken)
        .send({
          secao_home_inexistente: "false",
          chave_invalida: "true",
        });

      // Todas as chaves são inválidas, deve retornar 400
      expect(response.status).toBe(400);
    });

    it("deve aceitar chaves nav_* para visibilidade da navbar", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });

      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      };
      (pool.connect as any).mockResolvedValue(mockClient);

      const response = await request(app)
        .put("/api/configuracoes")
        .set("Authorization", validToken)
        .send({
          nav_loja: "false",
          nav_mangas: "true",
          nav_eventos: "false",
          nav_cupons: "true",
          nav_agendar: "false",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.configuracoes).toHaveProperty("nav_loja", "false");
      expect(response.body.configuracoes).toHaveProperty("nav_mangas", "true");
      expect(response.body.configuracoes).toHaveProperty("nav_eventos", "false");
      expect(response.body.configuracoes).toHaveProperty("nav_cupons", "true");
      expect(response.body.configuracoes).toHaveProperty("nav_agendar", "false");
      expect(mockClient.query).toHaveBeenCalled();
    });

    it("deve filtrar chaves nav_ inválidas", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });

      const response = await request(app)
        .put("/api/configuracoes")
        .set("Authorization", validToken)
        .send({
          nav_inexistente: "false",
          nav_outra_invalida: "true",
        });

      // Todas as chaves são inválidas, deve retornar 400
      expect(response.status).toBe(400);
    });
  });

  // ═══ POST /api/configuracoes/fontes (Upload - Protegido) ═══
  describe("POST /api/configuracoes/fontes", () => {
    it("deve retornar 401 se token não fornecido", async () => {
      const response = await request(app)
        .post("/api/configuracoes/fontes")
        .field("nome", "Minha Fonte")
        .attach("fonte", Buffer.from("fake-woff2"), "minha-fonte.woff2");

      expect(response.status).toBe(401);
    });

    it("deve fazer upload de fonte com token válido", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      (pool.query as any).mockResolvedValue({
        rows: [{ id: 1, nome: "Minha Fonte", arquivo_url: "/fonts/minha-fonte.woff2" }],
      });

      const response = await request(app)
        .post("/api/configuracoes/fontes")
        .set("Authorization", validToken)
        .field("nome", "Minha Fonte")
        .attach("fonte", Buffer.from("fake-woff2"), "minha-fonte.woff2");

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("nome", "Minha Fonte");
    });

    it("deve retornar 400 se nome da fonte não fornecido", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });

      const response = await request(app)
        .post("/api/configuracoes/fontes")
        .set("Authorization", validToken)
        .attach("fonte", Buffer.from("fake-woff2"), "minha-fonte.woff2");

      expect(response.status).toBe(400);
    });
  });

  // ═══ DELETE /api/configuracoes/fontes/:id (Protegido) ═══
  describe("DELETE /api/configuracoes/fontes/:id", () => {
    it("deve retornar 401 se token não fornecido", async () => {
      const response = await request(app).delete("/api/configuracoes/fontes/1");
      expect(response.status).toBe(401);
    });

    it("deve deletar fonte com token válido", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      (pool.query as any).mockResolvedValue({
        rows: [{ id: 1, nome: "Another Shabby", arquivo_url: "/fonts/another-shabby.woff2" }],
      });

      const response = await request(app)
        .delete("/api/configuracoes/fontes/1")
        .set("Authorization", validToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
    });

    it("deve retornar 404 se fonte não encontrada", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      (pool.query as any).mockResolvedValue({ rows: [] });

      const response = await request(app)
        .delete("/api/configuracoes/fontes/999")
        .set("Authorization", validToken);

      expect(response.status).toBe(404);
    });
  });
});
