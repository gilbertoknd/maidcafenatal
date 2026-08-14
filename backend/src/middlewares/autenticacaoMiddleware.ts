import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { obterSegredoJwt } from "../config/jwt.js";
import { TokenPayload } from "../types/AutenticacaoTypes.js";

export function autenticacaoMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError("Token não fornecido", 401);
  }

  // O header vem como "Bearer eyJhbGci..."
  const [, token] = authorization.split(" ");

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
