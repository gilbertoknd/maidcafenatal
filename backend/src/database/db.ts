import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

//Cria a piscina de conexões
export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "5432"),
});

//Evento para avisar no console quando conectar
pool.on("connect", () => {
  console.log("Conexão com banco de dados estabelecida.");
});

pool.on("error", (err) => {
  console.error("Erro inesperado no banco de dados", err);
  process.exit(-1);
});
