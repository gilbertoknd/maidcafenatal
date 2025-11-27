import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./database/db";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public/images");

app.use(express.json()); //Middleware para processar JSON
app.use("/images", express.static(publicPath)); //Middleware para servir arquivos estáticos
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET, PUT, PATCH, POST, DELETE"],
    allowedHeaders: ["Content-Type, Authorization"],
    credentials: true,
  }) //Middleware para CORS
);

//Rota de Teste do Banco
app.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as hora_atual");

    res.json({
      status: "Sucesso",
      mensagem: "Backend conectado ao PostgreSQL",
      horario_banco: result.rows[0].hora_atual,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Falha ao conectar no banco" });
  }
});

//Testando inserção de produtos no banco
app.get("/teste-banco", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM produtos");
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao conectar no banco");
  }
});

app.get("/", (req: Request, res: Response) => {
  res.json({
    mensagem: "Backend do Maid Café Mew Mew!",
    status: "Positivo e operante",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
