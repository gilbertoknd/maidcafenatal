import { Router } from "express";
import { AutenticacaoController } from "../controllers/AutenticacaoController.js";
import { autenticacaoMiddleware } from "../middlewares/autenticacaoMiddleware.js";
import { criarLimitadorTaxa } from "../middlewares/limitadorTaxa.js";

const router = Router();

// Rate limiting anti-força-bruta: até 10 tentativas de login por IP a cada
// 15 minutos. Ver GEMINI.md seção 20/34 (auditoria de segurança).
const limiteLogin = criarLimitadorTaxa({
  janelaMs: 15 * 60 * 1000,
  maxTentativas: 10,
  mensagem: "Muitas tentativas de login. Tente novamente em alguns minutos.",
});

router.post("/login", limiteLogin, AutenticacaoController.login);

// Rota para validar se o token ainda é válido
router.get("/verify", autenticacaoMiddleware, (req, res) => {
  res.json({ valid: true }); // Se passou pelo middleware, é válido
});

export default router;
