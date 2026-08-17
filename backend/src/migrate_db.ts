import "dotenv/config";
import { pool } from "./config/db.js";
import { executarMigrations } from "./database/migrator.js";

/**
 * Runner de migrations por linha de comando.
 * - Dev:       pnpm db:migrate   (tsx src/migrate_db.ts)
 * - Produção:  node dist/migrate_db.js
 *
 * Também roda automaticamente no boot do servidor (ver server.ts); esta CLI
 * serve para execução manual/controlada e retorna código de saída ≠ 0 em falha.
 */
executarMigrations(pool)
  .then(() => {
    console.log("Todas as migrations rodaram com sucesso!");
    return pool.end();
  })
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error("Migration falhou:", error);
    try {
      await pool.end();
    } catch {
      /* pool já pode estar encerrado */
    }
    process.exit(1);
  });
