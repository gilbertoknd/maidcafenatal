import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { PedidoModel } from "../models/PedidoModel.js";
import { AppError } from "../errors/AppError.js";

// Conjunto canônico de status (espelha as opções do AdminPedidos + o default
// 'Pendente' do init.sql). Evita gravar status arbitrário vindo do req.body.
export const STATUS_PEDIDO_VALIDOS = [
  "Pendente",
  "Pendente Whatsapp",
  "Em Preparo",
  "Saiu para entrega",
  "Entregue",
  "Cancelado",
] as const;

const statusPedidoSchema = z.enum(STATUS_PEDIDO_VALIDOS);

export const PedidoController = {
  criar: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cliente_nome, cliente_endereco, itens, codigo_cupom } = req.body;

      if (!cliente_nome || !cliente_endereco || !itens || !itens.length) {
        throw new AppError("Dados inválidos: Nome, endereço e itens são obrigatórios.", 400);
      }

      const novoPedido = await PedidoModel.criar(
        cliente_nome,
        cliente_endereco,
        itens,
        codigo_cupom
      );

      res.status(201).json({
        message: "Pedido criado com sucesso",
        pedido_id: novoPedido.id,
        total: novoPedido.total,
      });
    } catch (error) {
      next(error);
    }
  },

  listarTodos: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pedidos = await PedidoModel.listarTodos();
      const itensComDetalhes = await Promise.all(
        pedidos.map(async (pedido) => {
          const itens = await PedidoModel.buscarItens(pedido.id);
          return { ...pedido, itens };
        }),
      );
      res.status(200).json(itensComDetalhes);
    } catch (error) {
      next(error);
    }
  },

  buscarItens: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const itens = await PedidoModel.buscarItens(Number(id));
      res.status(200).json(itens);
    } catch (error) {
      next(error);
    }
  },

  atualizarStatus: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const parse = statusPedidoSchema.safeParse(req.body?.status);
      if (!parse.success) {
        throw new AppError(
          `Status inválido. Valores aceitos: ${STATUS_PEDIDO_VALIDOS.join(", ")}`,
          400,
        );
      }

      const pedidoAtualizado = await PedidoModel.atualizarStatus(Number(id), parse.data);

      if (!pedidoAtualizado) {
        throw new AppError("Pedido não encontrado", 404);
      }

      res.status(200).json(pedidoAtualizado);
    } catch (error) {
      next(error);
    }
  },
};
