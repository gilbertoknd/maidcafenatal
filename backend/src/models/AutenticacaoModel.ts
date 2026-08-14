import { pool } from "../config/db.js";

export const AutenticacaoModel = {
  buscarPorNickname: async (nickname: string) => {
    // Colunas explícitas (nunca SELECT *): não trafega mais do que o necessário.
    const result = await pool.query(
      "SELECT id, nickname, senha FROM users WHERE nickname = $1",
      [nickname],
    );
    return result.rows[0];
  },
};
