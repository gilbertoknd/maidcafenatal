import { Router } from "express";
import { EventoController } from "../controllers/EventoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadConfig } from "../config/upload.js";

const router = Router();

// Rotas públicas
router.get("/", EventoController.getAll);

// Rotas privadas
router.get("/admin", authMiddleware, EventoController.getAllAdmin);
router.post("/", authMiddleware, uploadConfig.single("imagem"), EventoController.create);
router.put("/:id", authMiddleware, uploadConfig.single("imagem"), EventoController.update);
router.patch(
  "/:id/visibility",
  authMiddleware,
  EventoController.toggleVisibility,
);
router.delete("/:id", authMiddleware, EventoController.delete);

export default router;
