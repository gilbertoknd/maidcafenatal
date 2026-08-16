import { CookieOptions } from "express";

/** Nome do cookie que carrega o JWT de autenticação. */
export const COOKIE_TOKEN = "token";

/** Validade do cookie/JWT, em milissegundos (1 dia — espelha `expiresIn` do JWT). */
export const COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * Opções do cookie de sessão do admin.
 *
 * - `httpOnly`: JavaScript não lê o cookie → imune a exfiltração por XSS
 *   (era o problema do token em `localStorage`, achado #7 da seção 34).
 * - `sameSite: "lax"`: enviado em requisições **same-site**. Front e API são o
 *   mesmo site tanto em produção (`mewworld.space` × `api.mewworld.space` — mesmo
 *   domínio registrável) quanto em dev (`localhost:5174` × `:3000` — porta não
 *   conta), então Lax basta e ainda barra CSRF cross-site.
 * - `secure`: só em produção (em dev roda sobre http://localhost).
 * - `domain`: `.mewworld.space` em produção (via `COOKIE_DOMAIN`) para o cookie
 *   valer entre os subdomínios; ausente em dev (cookie host-only no localhost).
 */
export function opcoesCookieToken(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
  };
}
