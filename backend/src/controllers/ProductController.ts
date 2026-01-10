import { Request, Response, NextFunction } from "express";
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
      next(error);
    }
  }

  //Products update
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      //Vamos assumir que se req.file existir, atualizamos a foto.

      const imagemUrl = req.file
        ? req.file.filename
        : req.body.imagemUrl || null;

      const { nome, descricao, categoria } = req.body;
      const preco = parseFloat(req.body.preco);
      const destaque = req.body.destaque === "true";

      const product = await updateProduct(id, {
        nome,
        descricao,
        preco,
        categoria,
        imagemUrl,
        destaque,
      });

      if (!product) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  //Products delete
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await deleteProduct(id);

      if (!product) {
        //Se o model retornar null, é 404
        res.status(404).json({ error: "Produto não encontrado" });
        return;
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
