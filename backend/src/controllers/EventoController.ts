import { Request, Response, NextFunction } from "express";
import * as EventoModel from "../models/EventoModel.js";
import { Evento } from "../types/EventoTypes.js";
import { AppError } from "../errors/AppError.js";
import fs from "fs";
import path from "path";

export class EventoController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const eventos = await EventoModel.listarTodosEventos();
      res.status(200).json(eventos);
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const eventos = await EventoModel.listarTodosEventosAdmin();
      res.status(200).json(eventos);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const imagem_url = req.file ? `/images/${req.file.filename}` : null;
      
      const { titulo, descricao, data, local } = req.body;
      const visivel = req.body.visivel === "false" ? false : true;

      const eventData: Partial<Evento> = {
        titulo,
        descricao,
        data,
        local,
        visivel,
        imagem_url
      };

      const novoEvento = await EventoModel.criarEvento(eventData);
      res.status(201).json(novoEvento);
    } catch (error) {
      if (req.file) {
        fs.unlink(req.file.path, (err: NodeJS.ErrnoException | null) => {
          if (err) console.error("Erro ao apagar imagem órfã do evento:", err);
        });
      }
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const imagem_url = req.file ? `/images/${req.file.filename}` : undefined;

      const { titulo, descricao, data, local } = req.body;
      const visivel = req.body.visivel !== undefined ? req.body.visivel === "true" : undefined;

      const eventData: Partial<Evento> = {
        titulo,
        descricao,
        data,
        local,
        visivel,
        imagem_url
      };

      const eventoAtualizado = await EventoModel.atualizarEvento(id, eventData);

      if (!eventoAtualizado) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        throw new AppError("Evento não encontrado", 404);
      }

      res.status(200).json(eventoAtualizado);
    } catch (error) {
      if (req.file) {
        fs.unlink(req.file.path, (err: NodeJS.ErrnoException | null) => {
          if (err) console.error("Erro deletando imagem falha de update", err);
        });
      }
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const eventoDeletado = await EventoModel.deletarEvento(id);

      if (!eventoDeletado) {
        throw new AppError("Evento não encontrado", 404);
      }

      if (eventoDeletado.imagem_url) {
        const nomeArquivo = eventoDeletado.imagem_url.split("/").pop();
        if (nomeArquivo) {
          const imagePath = path.resolve(process.cwd(), "public", "images", nomeArquivo);
          fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (!err) {
              fs.unlink(imagePath, () => console.log("Imagem de evento deletada do disco:", eventoDeletado.imagem_url));
            }
          });
        }
      }

      res
        .status(200)
        .json({
          message: "Evento deletado com sucesso",
          evento: eventoDeletado,
        });
    } catch (error) {
      next(error);
    }
  }

  static async toggleVisibility(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const eventoAtualizado = await EventoModel.alternarVisibilidadeEvento(id);

      if (!eventoAtualizado) {
        throw new AppError("Evento não encontrado", 404);
      }

      res.status(200).json(eventoAtualizado);
    } catch (error) {
      next(error);
    }
  }
}
