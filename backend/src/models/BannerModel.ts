import { pool } from "../config/db.js";
import { StorageProvider } from "../utils/StorageProvider.js";

export interface Banner {
  id?: number;
  pagina: string;
  tipo: "video" | "image";
  url: string;
  titulo?: string | null;
  subtitulo?: string | null;
  texto_botao?: string | null;
  link_botao?: string | null;
}

export const BannerModel = {
  getBanners: async (): Promise<Banner[]> => {
    const result = await pool.query("SELECT * FROM banners");
    return result.rows;
  },

  getBannerPorPagina: async (pagina: string): Promise<Banner | null> => {
    const result = await pool.query("SELECT * FROM banners WHERE pagina = $1", [pagina]);
    return result.rows[0] || null;
  },

  upsertBanner: async (dados: Banner): Promise<Banner> => {
    // Busca se ja existe um anterior
    const anterior = await BannerModel.getBannerPorPagina(dados.pagina);

    // Se a API trouxe uma nova URL de arquivo, e o item anterior já possuía uma:
    if (anterior && anterior.url && anterior.url !== dados.url) {
      if (!anterior.url.startsWith("http")) { // Exemplo de safety check se n for URL hardcoded
         const pathApagar = anterior.url.replace("/images/", "");
         await StorageProvider.deleteFile(pathApagar);
      }
    }

    const query = `
      INSERT INTO banners (pagina, tipo, url, titulo, subtitulo, texto_botao, link_botao)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (pagina) DO UPDATE 
      SET tipo = EXCLUDED.tipo,
          url = EXCLUDED.url,
          titulo = EXCLUDED.titulo,
          subtitulo = EXCLUDED.subtitulo,
          texto_botao = EXCLUDED.texto_botao,
          link_botao = EXCLUDED.link_botao
      RETURNING *;
    `;
    const values = [
      dados.pagina, 
      dados.tipo, 
      dados.url, 
      dados.titulo || null, 
      dados.subtitulo || null, 
      dados.texto_botao || null, 
      dados.link_botao || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};
