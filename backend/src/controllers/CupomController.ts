import { Request, Response, NextFunction } from "express";
import { CupomModel } from "../models/CupomModel.js";
import { z } from "zod";
import { AppError } from "../errors/AppError.js";

// Validation schema for WhatsApp (BR format)
const resgateSchema = z.object({
  campanha_id: z.number().int().positive(),
  cliente_nome: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  cliente_whatsapp: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "O WhatsApp deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX"),
  fingerprint_token: z.string().min(10, "Token de dispositivo inválido")
});

// Validação da criação de campanha (admin). Antes o req.body ia cru ao model.
const campanhaSchema = z.object({
  nome: z.string().min(2, "Nome da campanha deve ter no mínimo 2 caracteres"),
  descricao: z.string().nullish(),
  prefixo: z.string().min(1, "Prefixo obrigatório").max(20, "Prefixo muito longo"),
  tipo_desconto: z.enum(["percentual", "fixo"]),
  valor_desconto: z.coerce.number().positive("Valor de desconto deve ser positivo"),
  limite_total: z.coerce.number().int().positive().nullish(),
  ativa: z.boolean().optional().default(true),
  validade: z.string().nullish(),
});

export class CupomController {
  // Public
  static async listarCampanhasAtivas(req: Request, res: Response, next: NextFunction) {
    try {
      const campanhas = await CupomModel.listarCampanhasAtivas();
      res.status(200).json(campanhas);
    } catch (error) {
      next(error);
    }
  }

  static async resgatarCupom(req: Request, res: Response, next: NextFunction) {
    try {
      const dadosValidados = resgateSchema.parse(req.body);
      const ip_cliente = req.ip || req.socket.remoteAddress;

      const cupomGerado = await CupomModel.resgatarCupom({
        ...dadosValidados,
        ip_cliente
      });

      res.status(201).json(cupomGerado);
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new AppError(error.issues.map((e: z.ZodIssue) => e.message).join(", "), 400));
      } else {
        next(error);
      }
    }
  }

  static async validarCupom(req: Request, res: Response, next: NextFunction) {
    try {
      const { codigo } = req.body;
      if (!codigo || typeof codigo !== 'string') {
        throw new AppError("Código do cupom é obrigatório", 400);
      }

      const cupomValido = await CupomModel.validarCupom(codigo);
      res.status(200).json(cupomValido);
    } catch (error) {
      next(error);
    }
  }

  // Admin
  static async listarCampanhasAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const campanhas = await CupomModel.listarCampanhasAdmin();
      res.status(200).json(campanhas);
    } catch (error) {
      next(error);
    }
  }

  static async criarCampanhaAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const dadosValidados = campanhaSchema.parse(req.body);
      const novaCampanha = await CupomModel.criarCampanha(dadosValidados);
      res.status(201).json(novaCampanha);
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new AppError(error.issues.map((e: z.ZodIssue) => e.message).join(", "), 400));
      } else {
        next(error);
      }
    }
  }

  static async listarCuponsAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { campanha_id } = req.query;
      const parsedId = campanha_id ? parseInt(campanha_id as string, 10) : undefined;
      const cupons = await CupomModel.listarCuponsAdmin(parsedId);
      res.status(200).json(cupons);
    } catch (error) {
      next(error);
    }
  }
}
