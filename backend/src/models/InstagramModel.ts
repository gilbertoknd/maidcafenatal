import { pool } from "../config/db.js";
import { InstagramPost, CreateInstagramPostData, UpdateInstagramPostData } from "../types/InstagramTypes.js";
import { StorageProvider } from "../utils/StorageProvider.js";

export const InstagramModel = {
  getAllPosts: async (apenasVisiveis = true): Promise<InstagramPost[]> => {
    let query = "SELECT * FROM instagram_posts";
    if (apenasVisiveis) {
      query += " WHERE visivel = true";
    }
    query += " ORDER BY ordem ASC, criado_em DESC";
    
    const result = await pool.query(query);
    return result.rows;
  },

  getPostById: async (id: number): Promise<InstagramPost | null> => {
    const result = await pool.query("SELECT * FROM instagram_posts WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  createPost: async (dados: CreateInstagramPostData): Promise<InstagramPost> => {
    const query = `
      INSERT INTO instagram_posts (imagem_url, link_url, ordem)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [dados.imagem_url, dados.link_url, dados.ordem || 0];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  updatePost: async (id: number, dados: UpdateInstagramPostData): Promise<InstagramPost | null> => {
    const postAtual = await InstagramModel.getPostById(id);
    if (!postAtual) return null;

    // Se a imagem mudou, deletar a antiga
    if (dados.imagem_url && postAtual.imagem_url !== dados.imagem_url) {
        const pathApagar = postAtual.imagem_url.replace("/images/", "");
        await StorageProvider.deleteFile(pathApagar);
    }

    const query = `
      UPDATE instagram_posts
      SET imagem_url = COALESCE($1, imagem_url),
          link_url = COALESCE($2, link_url),
          visivel = COALESCE($3, visivel),
          ordem = COALESCE($4, ordem)
      WHERE id = $5
      RETURNING *;
    `;
    const values = [
      dados.imagem_url || null,
      dados.link_url || null,
      dados.visivel !== undefined ? dados.visivel : null,
      dados.ordem !== undefined ? dados.ordem : null,
      id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  deletePost: async (id: number): Promise<boolean> => {
    const post = await InstagramModel.getPostById(id);
    if (!post) return false;

    // Deletar arquivo físico
    const pathApagar = post.imagem_url.replace("/images/", "");
    await StorageProvider.deleteFile(pathApagar);

    const result = await pool.query("DELETE FROM instagram_posts WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }
};
