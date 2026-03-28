import { Router } from "express";
import { ProdutoController } from "../controllers/ProdutoController.js";
import { uploadConfig } from "../config/upload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Rotas públicas
router.get("/", ProdutoController.listarTodos);
router.get("/populares", ProdutoController.listarPopulares);
router.get("/novidades", ProdutoController.listarNovos);
router.patch("/:id/like", ProdutoController.adicionarCurtida);
router.patch("/:id/unlike", ProdutoController.removerCurtida);

// Rotas privadas
router.get("/admin", authMiddleware, ProdutoController.listarTodosAdmin);
router.post(
  "/",
  authMiddleware,
  uploadConfig.single("imagem"),
  ProdutoController.criar
);
router.put(
  "/:id",
  authMiddleware,
  uploadConfig.single("imagem"),
  ProdutoController.atualizar
);
router.delete("/:id", authMiddleware, ProdutoController.deletar);

export default router;
