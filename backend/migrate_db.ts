import fs from "fs";
import path from "path";
import { pool } from "./src/config/db.js";

async function run() {
  try {
    // Tabela para rastrear migrações
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const migrationsDir = path.join(process.cwd(), "migrations");
    
    if (!fs.existsSync(migrationsDir)) {
      console.log("Pasta de migrations não encontrada.");
      return;
    }

    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".ts") || f.endsWith(".js")).sort();

    for (const file of files) {
      const { rowCount } = await pool.query("SELECT id FROM migrations WHERE name = $1", [file]);
      
      if (rowCount === 0) {
        console.log(`Running migration: ${file}`);
        // Use transformado ou dinâmico
        const migrationPath = path.join(migrationsDir, file);
        // importando dinamicamente
        let migration;
        if (process.platform === 'win32') {
           migration = await import(`file:///${migrationPath.replace(/\\/g, '/')}`);
        } else {
           migration = await import(migrationPath);
        }
        
        if (migration.up) {
          await migration.up(pool);
          await pool.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
          console.log(`Migration ${file} executed successfully.`);
        }
      }
    }

    // Para compatibilidade, rodamos também as migrações antigas ou isoladas:
    await pool.query("ALTER TABLE produtos ADD COLUMN IF NOT EXISTS visivel BOOLEAN DEFAULT true;");
    
    console.log("All migrations ran successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

run();
