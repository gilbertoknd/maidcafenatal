import { Router } from "express";
import { BannerController } from "../controllers/BannerController.js";
import { autenticacaoMiddleware } from "../middlewares/autenticacaoMiddleware.js";
import { uploadConfig } from "../config/upload.js";

const router = Router();

// Rota pública para consumir no frontend global
router.get("/", BannerController.listarTodas);

// Rota privada de admin para realizar upload ou atualização
router.put("/:pagina", autenticacaoMiddleware, uploadConfig.single("midia"), BannerController.atualizarBanner);

export default router;
