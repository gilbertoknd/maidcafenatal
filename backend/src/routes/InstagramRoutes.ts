import { Router } from "express";
import { InstagramController } from "../controllers/InstagramController.js";
import { autenticacaoMiddleware } from "../middlewares/autenticacaoMiddleware.js";
import { uploadConfig } from "../config/upload.js";

const router = Router();

// Rotas públicas
router.get("/", InstagramController.listar);

// Rotas privadas (Admin)
router.get("/admin", autenticacaoMiddleware, InstagramController.listarAdmin);
router.post("/", autenticacaoMiddleware, uploadConfig.single("imagem"), InstagramController.criar);
router.put("/:id", autenticacaoMiddleware, uploadConfig.single("imagem"), InstagramController.atualizar);
router.delete("/:id", autenticacaoMiddleware, InstagramController.deletar);

export default router;
