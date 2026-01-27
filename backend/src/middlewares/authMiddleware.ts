import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { TokenPayload } from "../types/AuthTypes.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError("Token não fornecido", 401);
  }

  //O header vem como "Bearer eyJhbGci..."
  const [, token] = authorization.split(" ");

  try {
    const secret = process.env.JWT_SECRET || "segredo"; //Use o mesmo do AuthController
    const decoded = jwt.verify(token, secret);

    //Anexa o ID do usuário na requisição para usar nos controllers se precisar
    (req as any).userId = (decoded as TokenPayload).id;

    return next();
  } catch (error) {
    throw new AppError("Token inválido ou expirado", 401);
  }
}
