import { Router } from "express";
import { EventoController } from "../controllers/EventoController.js";
import { autenticacaoMiddleware } from "../middlewares/autenticacaoMiddleware.js";
import { uploadConfig } from "../config/upload.js";

const router = Router();

// Públicas
router.get("/", EventoController.listarTodos);
router.get("/:id", EventoController.buscarPorId);

// Admin
router.get("/admin", autenticacaoMiddleware, EventoController.listarTodosAdmin);
router.post("/", autenticacaoMiddleware, uploadConfig.single("imagem"), EventoController.criar);
router.put("/:id", autenticacaoMiddleware, uploadConfig.single("imagem"), EventoController.atualizar);

router.patch(
  "/:id/visibilidade",
  autenticacaoMiddleware,
  EventoController.alternarVisibilidade,
);
router.delete("/:id", autenticacaoMiddleware, EventoController.deletar);

export default router;
