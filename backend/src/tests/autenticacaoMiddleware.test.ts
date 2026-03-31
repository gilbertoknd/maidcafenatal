import { describe, it, expect, vi } from "vitest";
import { autenticacaoMiddleware } from "../middlewares/autenticacaoMiddleware.js";
import { AppError } from "../errors/AppError.js";
import jwt from "jsonwebtoken";

describe("autenticacaoMiddleware", () => {
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
});
