import { Router } from "express";
import { CupomController } from "../controllers/CupomController.js";
import { autenticacaoMiddleware } from "../middlewares/autenticacaoMiddleware.js";

const router = Router();

// Public Routes
router.get("/campanhas-ativas", CupomController.listarCampanhasAtivas);
router.post("/resgatar", CupomController.resgatarCupom);
router.post("/validar", CupomController.validarCupom);

// Admin Routes (require authentication)
router.get("/admin/campanhas", autenticacaoMiddleware, CupomController.listarCampanhasAdmin);
router.post("/admin/campanhas", autenticacaoMiddleware, CupomController.criarCampanhaAdmin);
router.get("/admin/cupons", autenticacaoMiddleware, CupomController.listarCuponsAdmin);

export default router;
