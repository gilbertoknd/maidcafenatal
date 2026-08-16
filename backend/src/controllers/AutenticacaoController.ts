import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AutenticacaoModel } from "../models/AutenticacaoModel.js";
import { AppError } from "../errors/AppError.js";
import { obterSegredoJwt } from "../config/jwt.js";
import {
  COOKIE_TOKEN,
  COOKIE_MAX_AGE_MS,
  opcoesCookieToken,
} from "../config/cookie.js";
import { Request, Response, NextFunction } from "express";

export const AutenticacaoController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    const { nickname, senha } = req.body;

    try {
      //busca o user
      const user = await AutenticacaoModel.buscarPorNickname(nickname);

      if (!user) {
        throw new AppError("Usuário não encontrado", 401);
      }

      //Compara a senha com o hash no banco
      const isValidPassword = await bcrypt.compare(senha, user.senha);

      if (!isValidPassword) {
        throw new AppError("Senha incorreta", 401);
      }

      //Se passar gera o token
      const secret = obterSegredoJwt();
      const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1d" });

      // Token vai num cookie HttpOnly (não acessível a JS → imune a XSS).
      // Ainda devolvemos no corpo por compatibilidade durante a transição;
      // o frontend não o armazena mais.
      res.cookie(COOKIE_TOKEN, token, {
        ...opcoesCookieToken(),
        maxAge: COOKIE_MAX_AGE_MS,
      });

      return res.json({
        user: { id: user.id, nickname: user.nickname },
        token,
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // Mesmas opções do set (menos maxAge) para o navegador realmente limpar.
      res.clearCookie(COOKIE_TOKEN, opcoesCookieToken());
      return res.json({ message: "Logout efetuado com sucesso" });
    } catch (error) {
      next(error);
    }
  },
};
