import { Router } from "express";
import { AutenticacaoController } from "../controllers/AutenticacaoController.js";
import { autenticacaoMiddleware } from "../middlewares/autenticacaoMiddleware.js";
import { AppError } from "../errors/AppError.js";

const router = Router();

router.post("/login", AutenticacaoController.login);

// Rota para validar se o token ainda é válido
router.get("/verify", autenticacaoMiddleware, (req, res) => {
  res.json({ valid: true }); // Se passou pelo middleware, é válido
});

export default router;
