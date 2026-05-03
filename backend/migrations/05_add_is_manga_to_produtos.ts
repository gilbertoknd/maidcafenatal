import { pool } from "../src/config/db.js";

export async function up() {
  await pool.query(`
    ALTER TABLE produtos ADD COLUMN IF NOT EXISTS is_manga BOOLEAN DEFAULT false;
  `);
  console.log("Migration 05: Added is_manga to produtos");
}

export async function down() {
  await pool.query(`
    ALTER TABLE produtos DROP COLUMN IF EXISTS is_manga;
  `);
  console.log("Migration 05: Dropped is_manga from produtos");
}
