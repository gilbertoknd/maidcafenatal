import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { obterSegredoJwt } from "../config/jwt.js";
import { COOKIE_TOKEN } from "../config/cookie.js";
import { TokenPayload } from "../types/AutenticacaoTypes.js";

export function autenticacaoMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Preferimos o cookie HttpOnly; o header Bearer segue aceito como fallback
  // (compatibilidade durante a transição e para clientes não-navegador).
  const tokenCookie = req.cookies?.[COOKIE_TOKEN] as string | undefined;
  const { authorization } = req.headers;

  let token = tokenCookie;
  if (!token && authorization) {
    // O header vem como "Bearer eyJhbGci..."
    const [esquema, tokenHeader] = authorization.split(" ");
    if (esquema === "Bearer") token = tokenHeader;
  }

  if (!token) {
    throw new AppError("Token não fornecido", 401);
  }

  // Obtido FORA do try: se o segredo não estiver configurado, o 500 deve
  // propagar como erro de servidor — não ser mascarado como "Token inválido".
  const secret = obterSegredoJwt();

  try {
    const decoded = jwt.verify(token, secret);

    // Anexa o ID do usuário na requisição para usar nos controllers se precisar
    (req as any).userId = (decoded as TokenPayload).id;

    return next();
  } catch (error) {
    throw new AppError("Token inválido ou expirado", 401);
  }
}
