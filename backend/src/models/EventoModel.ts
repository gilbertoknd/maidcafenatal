import { pool } from "../config/db.js";
import { Evento } from "../types/EventoTypes.js";

export const EventoModel = {
  listarTodos: async () => {
    const result = await pool.query("SELECT * FROM eventos WHERE visivel = true ORDER BY data ASC");
    return result.rows;
  },

  listarTodosAdmin: async () => {
    const result = await pool.query("SELECT * FROM eventos ORDER BY data DESC");
    return result.rows;
  },

  buscarPorId: async (id: string | number) => {
    const result = await pool.query("SELECT * FROM eventos WHERE id = $1", [id]);
    return result.rows[0];
  },

  criar: async (data: Partial<Evento>) => {
    const query = `
      INSERT INTO eventos (titulo, descricao, data, data_fim, local, imagem_url, visivel)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      data.titulo,
      data.descricao || null,
      data.data,
      data.data_fim || null,
      data.local,
      data.imagem_url || null,
      data.visivel ?? true,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  atualizar: async (id: string | number, data: Partial<Evento>) => {
    let dataFimValor = data.data_fim;
    if (dataFimValor === undefined) {
      const atual = await pool.query("SELECT data_fim FROM eventos WHERE id = $1", [id]);
      dataFimValor = atual.rows[0]?.data_fim || null;
    }

    const query = `
      UPDATE eventos
      SET titulo = $1,
          descricao = $2,
          data = $3,
          data_fim = $4,
          local = $5,
          imagem_url = COALESCE($6, imagem_url),
          visivel = $7
      WHERE id = $8
      RETURNING *;
    `;
    const values = [
      data.titulo,
      data.descricao || null,
      data.data,
      dataFimValor || null,
      data.local,
      data.imagem_url === undefined ? null : data.imagem_url,
      data.visivel ?? true,
      id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  deletar: async (id: string | number) => {
    const result = await pool.query("DELETE FROM eventos WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  },

  alternarVisibilidade: async (id: string | number) => {
    const query = `
      UPDATE eventos
      SET visivel = NOT visivel
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};
