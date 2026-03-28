import { Router } from "express";
import { PedidoController } from "../controllers/PedidoController.js";
import { autenticacaoMiddleware } from "../middlewares/autenticacaoMiddleware.js";

const router = Router();

router.post("/", PedidoController.criar);

// Admin
router.get("/", autenticacaoMiddleware, PedidoController.listarTodos);
router.get("/:id", autenticacaoMiddleware, PedidoController.buscarItens);
router.put("/:id/status", autenticacaoMiddleware, PedidoController.atualizarStatus);

export default router;
