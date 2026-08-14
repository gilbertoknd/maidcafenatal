import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { autenticacaoMiddleware } from "../middlewares/autenticacaoMiddleware.js";
import { AppError } from "../errors/AppError.js";
import jwt from "jsonwebtoken";

describe("autenticacaoMiddleware", () => {
  const segredoOriginal = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = "segredo";
  });

  afterEach(() => {
    process.env.JWT_SECRET = segredoOriginal;
  });

  it("deve lançar erro se o token não for fornecido", () => {
    const req = { headers: {} } as any;
    const res = {} as any;
    const next = vi.fn();

    expect(() => autenticacaoMiddleware(req, res, next)).toThrow(AppError);
    expect(() => autenticacaoMiddleware(req, res, next)).toThrow("Token não fornecido");
  });

  it("deve lançar erro se o token for inválido", () => {
    const req = { headers: { authorization: "Bearer invalid_token" } } as any;
    const res = {} as any;
    const next = vi.fn();

    vi.spyOn(jwt, "verify").mockImplementationOnce(() => {
      throw new Error("Invalid token");
    });

    expect(() => autenticacaoMiddleware(req, res, next)).toThrow(AppError);
    expect(() => autenticacaoMiddleware(req, res, next)).toThrow("Token inválido ou expirado");
  });

  it("deve chamar next e anexar userId ao req se o token for válido", () => {
    const req = { headers: { authorization: "Bearer valid_token" } } as any;
    const res = {} as any;
    const next = vi.fn();

    vi.spyOn(jwt, "verify").mockReturnValueOnce({ id: 1 } as any);

    autenticacaoMiddleware(req, res, next);

    expect(req.userId).toBe(1);
    expect(next).toHaveBeenCalledOnce();
  });

  it("deve lançar erro 500 se JWT_SECRET não estiver configurado (sem fallback inseguro)", () => {
    delete process.env.JWT_SECRET;
    const req = { headers: { authorization: "Bearer qualquer_token" } } as any;
    const res = {} as any;
    const next = vi.fn();

    let erroCapturado: unknown;
    try {
      autenticacaoMiddleware(req, res, next);
    } catch (erro) {
      erroCapturado = erro;
    }

    expect(erroCapturado).toBeInstanceOf(AppError);
    expect((erroCapturado as AppError).statusCode).toBe(500);
    expect(next).not.toHaveBeenCalled();
  });
});
