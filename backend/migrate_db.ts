import { pool } from "./src/config/db.js";

async function run() {
  try {
    await pool.query("ALTER TABLE produtos ADD COLUMN IF NOT EXISTS visivel BOOLEAN DEFAULT true;");
    console.log("Migration (visivel column) ran successfully on existing database!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

run();
