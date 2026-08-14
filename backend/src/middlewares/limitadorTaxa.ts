import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

interface OpcoesLimitador {
  /** Duração da janela de contagem, em milissegundos. */
  janelaMs: number;
  /** Número máximo de requisições permitidas por IP dentro da janela. */
  maxTentativas: number;
  /** Mensagem retornada ao cliente ao estourar o limite. */
  mensagem?: string;
}

interface Registro {
  contagem: number;
  expiraEm: number;
}

/**
 * Cria um middleware de rate limiting simples, em memória, por endereço IP.
 *
 * Serve para conter força bruta em rotas sensíveis (ex.: login). Cada
 * instância mantém seu próprio contador; o estado é local ao processo
 * (suficiente para o deploy single-container atual). Quando o limite é
 * excedido, lança `AppError` 429, tratado pelo `gerenciadorErros`.
 *
 * Achado da auditoria de segurança (Agosto/2026) — ver GEMINI.md seção 20/34.
 */
export function criarLimitadorTaxa({
  janelaMs,
  maxTentativas,
  mensagem = "Muitas tentativas. Tente novamente em alguns minutos.",
}: OpcoesLimitador) {
  const registros = new Map<string, Registro>();
  let ultimaLimpeza = Date.now();

  function limparExpirados(agora: number) {
    // Varredura oportunista (no máximo uma vez por janela) para não
    // acumular IPs indefinidamente sob um ataque distribuído.
    if (agora - ultimaLimpeza < janelaMs) return;
    for (const [chave, registro] of registros) {
      if (registro.expiraEm <= agora) registros.delete(chave);
    }
    ultimaLimpeza = agora;
  }

  return function limitadorTaxa(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    const agora = Date.now();
    limparExpirados(agora);

    const chave = req.ip ?? "desconhecido";
    const registro = registros.get(chave);

    // Sem registro ou janela expirada → reinicia a contagem.
    if (!registro || registro.expiraEm <= agora) {
      registros.set(chave, { contagem: 1, expiraEm: agora + janelaMs });
      return next();
    }

    if (registro.contagem >= maxTentativas) {
      throw new AppError(mensagem, 429);
    }

    registro.contagem += 1;
    return next();
  };
}
