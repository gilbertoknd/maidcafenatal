import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { Pool } from "pg";

// A pasta de migrations fica ao lado deste módulo (../migrations). Resolvida a
// partir do próprio arquivo — funciona tanto em dev (tsx → src/migrations/*.ts)
// quanto em produção (node → dist/migrations/*.js). Nada de process.cwd().
const migrationsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "migrations",
);

/** Remove a extensão (.ts/.js) para comparar migrations de forma consistente
 *  entre dev e produção e reconhecer registros legados. */
function normalizar(nome: string): string {
  return nome.replace(/\.(ts|js)$/, "");
}

/**
 * Aplica as migrations pendentes. Idempotente: registra cada migration aplicada
 * na tabela `migrations` e nunca reexecuta uma já registrada (reconhece nomes
 * legados gravados com extensão). NÃO fecha o pool — quem chama decide.
 *
 * Usada pela CLI (`migrate_db.ts`) e pela auto-migração no boot (`server.ts`).
 */
export async function executarMigrations(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  if (!fs.existsSync(migrationsDir)) {
    console.warn(`[migrations] pasta não encontrada: ${migrationsDir}`);
    return;
  }

  const { rows } = await pool.query("SELECT name FROM migrations");
  const aplicadas = new Set(rows.map((r: { name: string }) => normalizar(r.name)));

  const arquivos = fs
    .readdirSync(migrationsDir)
    .filter((f) => (f.endsWith(".js") || f.endsWith(".ts")) && !f.endsWith(".d.ts"))
    .sort();

  for (const arquivo of arquivos) {
    const nome = normalizar(arquivo);
    if (aplicadas.has(nome)) continue;

    console.log(`[migrations] aplicando: ${nome}`);
    const url = pathToFileURL(path.join(migrationsDir, arquivo)).href;
    const migration = await import(url);

    if (typeof migration.up === "function") {
      await migration.up(pool);
      await pool.query("INSERT INTO migrations (name) VALUES ($1)", [nome]);
      console.log(`[migrations] ${nome} aplicada.`);
    }
  }

  // Compat histórica: garante a coluna `visivel` em produtos.
  await pool.query(
    "ALTER TABLE produtos ADD COLUMN IF NOT EXISTS visivel BOOLEAN DEFAULT true;",
  );
}
