import type { Pool } from "pg";

export async function up(pool: Pool) {
  // O conteúdo da seção de eventos da home é salvo como JSON na tabela
  // de configurações; VARCHAR(255) não comporta o payload.
  await pool.query(`
    ALTER TABLE configuracoes ALTER COLUMN valor TYPE TEXT;
  `);
}
