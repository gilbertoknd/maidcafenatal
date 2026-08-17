import { Pool } from 'pg';

export async function up(pool: Pool) {
  await pool.query(`
    ALTER TABLE eventos
    ADD COLUMN IF NOT EXISTS imagem_url VARCHAR(255);
  `);
}

export async function down(pool: Pool) {
  await pool.query(`
    ALTER TABLE eventos
    DROP COLUMN IF NOT EXISTS imagem_url;
  `);
}
