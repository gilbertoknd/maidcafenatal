import { Router } from "express";
import { EventController } from "../controllers/EventController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadConfig } from "../config/upload.js";

const router = Router();

// Rotas públicas
router.get("/", EventController.getAll);

// Rotas privadas
router.get("/admin", authMiddleware, EventController.getAllAdmin);
router.post("/", authMiddleware, uploadConfig.single("imagem"), EventController.create);
router.put("/:id", authMiddleware, uploadConfig.single("imagem"), EventController.update);
router.patch(
  "/:id/visibility",
  authMiddleware,
  EventController.toggleVisibility,
);
router.delete("/:id", authMiddleware, EventController.delete);

export default router;
