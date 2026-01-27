import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthModel } from "../models/AuthModel.js";
import { AppError } from "../errors/AppError.js";
import { Request, Response, NextFunction } from "express";

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    const { nickname, senha } = req.body;

    try {
      //busca o user
      const user = await AuthModel.findByNickname(nickname);

      if (!user) {
        throw new AppError("Usuário não encontrado", 401);
      }

      //Compara a senha com o hash no banco
      const isValidPassword = await bcrypt.compare(senha, user.senha);

      if (!isValidPassword) {
        throw new AppError("Senha incorreta", 401);
      }

      //Se passar gera o token
      const secret = process.env.JWT_SECRET || "segredo";
      const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1d" });

      return res.json({
        user: { id: user.id, nickname: user.nickname },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}
