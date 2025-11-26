import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./database/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET, PUT, PATCH, POST, DELETE"],
    allowedHeaders: ["Content-Type, Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Rota de Teste do Banco
app.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as hora_atual");

    res.json({
      status: "Sucesso",
      mensagem: "Backend conectado ao PostgreSQL!",
      horario_banco: result.rows[0].hora_atual,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Falha ao conectar no banco" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.json({
    mensagem: "Backend do Maid Café Mew Mew!",
    status: "Positivo e operante 🚀",
  });
});

app.listen(PORT, () => {
  console.log(`☕ Servidor rodando na porta ${PORT}`);
});
