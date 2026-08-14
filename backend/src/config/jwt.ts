import { AppError } from "../errors/AppError.js";

/**
 * Retorna o segredo usado para assinar/verificar os JWTs.
 *
 * NUNCA usar um segredo padrão/previsível: com um fallback conhecido
 * (ex.: "segredo") qualquer pessoa forjaria um token de admin válido.
 * Se `JWT_SECRET` não estiver no ambiente, o servidor falha de forma
 * explícita (500) em vez de operar em modo inseguro.
 *
 * Achado crítico da auditoria de segurança (Agosto/2026) — ver GEMINI.md
 * seção 20/34.
 */
export function obterSegredoJwt(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET não configurado no ambiente", 500);
  }

  return secret;
}
