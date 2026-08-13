import { Request, Response } from "express";
import { BannerModel, Banner } from "../models/BannerModel.js";
import { AppError } from "../errors/AppError.js";

export const BannerController = {
  listarTodas: async (req: Request, res: Response) => {
    const banners = await BannerModel.getBanners();
    res.json(banners);
  },

  atualizarBanner: async (req: Request, res: Response) => {
    const { pagina } = req.params;
    const { tipo, titulo, subtitulo, texto_botao, link_botao } = req.body;
    
    // Validar tipo
    if (!tipo || (tipo !== "video" && tipo !== "image")) {
      throw new AppError("Tipo de banner inválido. Deve ser 'video' ou 'image'.", 400);
    }

    let url: string;

    // Se houve envio de arquivo
    if (req.file) {
      url = `/images/${req.file.filename}`;
    } else {
      // Se o usuário está atualizando apenas os textos e não selecionou uma nova midia
      if (!req.body.url) {
        throw new AppError("É necessário enviar um arquivo de mídia ou informar uma url existente.", 400);
      }
      url = req.body.url;
    }

    const bannerData: Banner = {
      pagina,
      tipo,
      url,
      titulo: titulo && titulo !== "null" ? titulo : null,
      subtitulo: subtitulo && subtitulo !== "null" ? subtitulo : null,
      texto_botao: texto_botao && texto_botao !== "null" ? texto_botao : null,
      link_botao: link_botao && link_botao !== "null" ? link_botao : null,
    };

    const atualizado = await BannerModel.upsertBanner(bannerData);
    res.json(atualizado);
  }
};
