import { Router } from "express";
import { ProdutoController } from "../controllers/ProdutoController.js";
import { uploadConfig } from "../config/upload.js";
import { autenticacaoMiddleware } from "../middlewares/autenticacaoMiddleware.js";

const router = Router();

// Públicos
router.get("/", ProdutoController.listarTodos);
router.get("/populares", ProdutoController.listarPopulares);
router.get("/novidades", ProdutoController.listarNovidades);
router.patch("/:id/like", ProdutoController.adicionarCurtida);
router.patch("/:id/unlike", ProdutoController.removerCurtida);

// Admin / Privados
router.get("/admin", autenticacaoMiddleware, ProdutoController.listarTodosAdmin);

router.post(
  "/",
  autenticacaoMiddleware,
  uploadConfig.single("imagem"),
  ProdutoController.criar
);

router.put(
  "/:id",
  autenticacaoMiddleware,
  uploadConfig.single("imagem"),
  ProdutoController.atualizar
);

router.patch("/:id/visibilidade", autenticacaoMiddleware, ProdutoController.alternarVisibilidade);
router.delete("/:id", autenticacaoMiddleware, ProdutoController.deletar);

export default router;
