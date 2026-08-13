import { Request, Response, NextFunction } from "express";
import { ConfiguracaoModel } from "../models/ConfiguracaoModel.js";
import { AppError } from "../errors/AppError.js";
import fs from "fs";
import path from "path";

// Chaves válidas para as configurações
const CHAVES_VALIDAS = [
  "fonte_titulo_site",
  "fonte_navbar",
  "fonte_categorias",
  "fonte_titulos_itens",
  "fonte_descricoes",
  "fonte_botoes",
  "fonte_geral",
  // Conteúdo da seção de eventos da home (JSON serializado)
  "home_eventos",
  // Visibilidade das seções da homepage
  "secao_home_banner",
  "secao_home_hero",
  "secao_home_como_funciona",
  "secao_home_maids",
  "secao_home_eventos",
  "secao_home_sobre",
  "secao_home_instagram",
  "secao_home_clube_mew",
  "secao_home_parceiros",
  // Visibilidade das páginas na navbar
  "nav_loja",
  "nav_mangas",
  "nav_eventos",
  "nav_cupons",
  "nav_agendar",
  "nav_parceiros",
];

export class ConfiguracaoController {
  // GET /api/configuracoes — Público
  static async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const configuracoes = await ConfiguracaoModel.listarConfiguracoes();
      const fontes_customizadas =
        await ConfiguracaoModel.listarFontesCustomizadas();

      return res.json({ configuracoes, fontes_customizadas });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/configuracoes — Protegido
  static async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = req.body;

      // Validação: body não pode estar vazio
      if (!dados || Object.keys(dados).length === 0) {
        throw new AppError("Nenhuma configuração fornecida para atualizar.", 400);
      }

      // Filtra apenas chaves válidas
      const dadosFiltrados: Record<string, string> = {};
      for (const [chave, valor] of Object.entries(dados)) {
        if (CHAVES_VALIDAS.includes(chave) && typeof valor === "string") {
          dadosFiltrados[chave] = valor;
        }
      }

      if (Object.keys(dadosFiltrados).length === 0) {
        throw new AppError(
          "Nenhuma chave de configuração válida fornecida.",
          400,
        );
      }

      await ConfiguracaoModel.atualizarConfiguracoes(dadosFiltrados);

      return res.json({
        message: "Configurações atualizadas com sucesso!",
        configuracoes: dadosFiltrados,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/configuracoes/fontes — Protegido (upload .woff2)
  static async uploadFonte(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome } = req.body;
      const file = req.file;

      if (!nome || !nome.trim()) {
        // Limpa arquivo se foi enviado mas nome é inválido
        if (file) {
          fs.unlinkSync(file.path);
        }
        throw new AppError("Nome da fonte é obrigatório.", 400);
      }

      if (!file) {
        throw new AppError("Arquivo .woff2 é obrigatório.", 400);
      }

      const arquivo_url = `/fonts/${file.filename}`;
      const fonte = await ConfiguracaoModel.criarFonteCustomizada(
        nome.trim(),
        arquivo_url,
      );

      return res.status(201).json(fonte);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/configuracoes/fontes/:id — Protegido
  static async deletarFonte(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        throw new AppError("ID inválido.", 400);
      }

      const fonte = await ConfiguracaoModel.deletarFonteCustomizada(id);

      if (!fonte) {
        throw new AppError("Fonte não encontrada.", 404);
      }

      // Remove arquivo do disco
      const filePath = path.join(
        process.cwd(),
        "public",
        fonte.arquivo_url,
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.json({
        message: "Fonte removida com sucesso!",
        fonte,
      });
    } catch (error) {
      next(error);
    }
  }
}
