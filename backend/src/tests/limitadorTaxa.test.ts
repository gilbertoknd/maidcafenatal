import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { criarLimitadorTaxa } from "../middlewares/limitadorTaxa.js";
import { AppError } from "../errors/AppError.js";

function criarReq(ip = "1.2.3.4") {
  return { ip } as any;
}

describe("limitadorTaxa", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("permite requisições dentro do limite", () => {
    const limitador = criarLimitadorTaxa({ janelaMs: 1000, maxTentativas: 3 });
    const next = vi.fn();
    const res = {} as any;

    for (let i = 0; i < 3; i++) {
      limitador(criarReq(), res, next);
    }

    expect(next).toHaveBeenCalledTimes(3);
  });

  it("bloqueia com AppError 429 ao exceder o limite", () => {
    const limitador = criarLimitadorTaxa({ janelaMs: 1000, maxTentativas: 2 });
    const next = vi.fn();
    const res = {} as any;

    limitador(criarReq(), res, next);
    limitador(criarReq(), res, next);

    let erroCapturado: unknown;
    try {
      limitador(criarReq(), res, next);
    } catch (erro) {
      erroCapturado = erro;
    }

    expect(erroCapturado).toBeInstanceOf(AppError);
    expect((erroCapturado as AppError).statusCode).toBe(429);
    // Não chamou next na tentativa bloqueada
    expect(next).toHaveBeenCalledTimes(2);
  });

  it("libera novamente após a janela expirar", () => {
    const limitador = criarLimitadorTaxa({ janelaMs: 1000, maxTentativas: 1 });
    const next = vi.fn();
    const res = {} as any;

    limitador(criarReq(), res, next);
    expect(() => limitador(criarReq(), res, next)).toThrow(AppError);

    vi.advanceTimersByTime(1001);

    limitador(criarReq(), res, next);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it("isola a contagem por IP", () => {
    const limitador = criarLimitadorTaxa({ janelaMs: 1000, maxTentativas: 1 });
    const next = vi.fn();
    const res = {} as any;

    limitador(criarReq("1.1.1.1"), res, next);
    limitador(criarReq("2.2.2.2"), res, next);

    expect(next).toHaveBeenCalledTimes(2);
  });

  it("usa uma chave de fallback quando o IP é indefinido", () => {
    const limitador = criarLimitadorTaxa({ janelaMs: 1000, maxTentativas: 1 });
    const next = vi.fn();
    const res = {} as any;
    const reqSemIp = {} as any;

    limitador(reqSemIp, res, next);
    expect(() => limitador(reqSemIp, res, next)).toThrow(AppError);
  });
});
