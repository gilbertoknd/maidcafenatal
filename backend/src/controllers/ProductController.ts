import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import {
  createProduct,
  listAllProducts,
  listNewProducts,
  listPopularProducts,
  updateProduct,
  deleteProduct,
  likeProduct,
  unlikeProduct,
} from "../models/ProductModel.js";

export class ProductController {
  //Products gets
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await listAllProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getPopular(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await listPopularProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getNew(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await listNewProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  //Products posts
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      //Pega o arquivo do Multer
      const imagemUrl = req.file ? req.file.filename : null;

      //Converte os dados (FormData envia tudo como string)
      const { nome, descricao, categoria } = req.body;
      const preco = parseFloat(req.body.preco);
      const destaque = req.body.destaque === "true";

      if (!nome || isNaN(preco) || !categoria) {
        //Se o Multer já salvou a imagem, apagar
        if (req.file) {
          fs.unlinkSync(req.file.path); //Deleta o arquivo físico
        }

        return res.status(400).json({
          error: "Dados inválidos. Verifique nome, preço e categoria.",
        });
      }

      const product = await createProduct({
        nome,
        descricao,
        preco,
        categoria,
        imagemUrl,
        destaque,
      });

      res.status(201).json(product);
    } catch (error) {
      //Se o Multer salvou imagem, apaga ela para não ficar lixo
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Erro ao apagar imagem órfã:", err);
        });
      }
      next(error);
    }
  }

  //Products update
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const imagemUrl = req.file ? req.file.filename : null; //null aqui significa "não mudou a foto"

      const { nome, descricao, categoria } = req.body;
      const preco = req.body.preco ? parseFloat(req.body.preco) : undefined;
      const destaque = req.body.destaque === "true";

      const product = await updateProduct(id, {
        nome,
        descricao,
        preco: preco as number, //model deve tratar undefined mantendo o antigo
        categoria,
        imagemUrl,
        destaque,
      });

      if (!product) {
        //Se o produto não existe, mas subiu uma foto nova para tentar atualizar, precisa apagar
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      res.json(product);
    } catch (error) {
      //Se der erro no update (banco), apaga a foto nova que subiu
      if (req.file) {
        fs.unlink(req.file.path, (err) => {});
      }
      next(error);
    }
  }

  //Products delete
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await deleteProduct(id);

      if (!product) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      //Apagar a imagem do disco quando deletar o produto do banco
      if (product.imagem_url) {
        //Caminho absoluto da imagem
        const imagePath = path.resolve(
          process.cwd(),
          "public",
          "images",
          product.imagem_url
        );

        // Verifica se arquivo existe antes de tentar apagar
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(imagePath, () =>
              console.log("Imagem deletada do disco:", product.imagem_url)
            );
          }
        });
      }

      res.json({ message: "Produto deletado com sucesso", produto: product });
    } catch (error) {
      next(error);
    }
  }

  //Likes
  static async addLike(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const newLikes = await likeProduct(id);

      if (!newLikes && newLikes !== 0) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      res.json({ novas_curtidas: newLikes });
    } catch (error) {
      next(error);
    }
  }

  static async removeLike(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const newLikes = await unlikeProduct(id);

      if (!newLikes && newLikes !== 0) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      res.json({ novas_curtidas: newLikes });
    } catch (error) {
      next(error);
    }
  }
}
