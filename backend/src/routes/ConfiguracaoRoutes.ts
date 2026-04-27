import { Router } from "express";
import { ConfiguracaoController } from "../controllers/ConfiguracaoController.js";
import { autenticacaoMiddleware } from "../middlewares/autenticacaoMiddleware.js";
import { uploadFonteConfig } from "../config/uploadFonte.js";

const router = Router();

// Rota pública — retorna configurações + fontes customizadas
router.get("/", ConfiguracaoController.listar);

// Rota protegida — atualiza configurações de fontes
router.put("/", autenticacaoMiddleware, ConfiguracaoController.atualizar);

// Rota protegida — upload de fonte customizada (.woff2)
router.post(
  "/fontes",
  autenticacaoMiddleware,
  uploadFonteConfig.single("fonte"),
  ConfiguracaoController.uploadFonte,
);

// Rota protegida — deleta fonte customizada
router.delete(
  "/fontes/:id",
  autenticacaoMiddleware,
  ConfiguracaoController.deletarFonte,
);

export default router;
