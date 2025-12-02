import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./database/db";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(process.cwd(), "public", "images");

app.use(express.json()); //Middleware para processar JSON
app.use("/images", express.static(publicPath)); //Middleware para servir arquivos estáticos
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET, PUT, PATCH, POST, DELETE"],
    allowedHeaders: ["Content-Type, Authorization"],
    credentials: true,
  }) //Middleware para CORS que faz a conexão entre o frontend e o backend por rotas
);

//Rota para listar produtos
app.get("/api/produtos", async (req, res) => {
  try {
    console.log("Rota /api/produtos chamada");

    //Executa o SQL direto no banco
    const result = await pool.query("SELECT * FROM produtos ORDER BY id ASC");

    console.log(`Encontrados ${result.rows.length} produtos.`);

    //Retorna as linhas do banco como JSON
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

//Rota para produtos populares (Top 6 likes)
app.get("/api/produtos/populares", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM produtos ORDER BY curtidas DESC LIMIT 6"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar populares:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

//Rota para novidades (Top 3 mais recentes)
app.get("/api/produtos/novidades", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM produtos ORDER BY criado_em DESC LIMIT 3"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar novidades:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.patch("/api/produtos/:id/like", async (req, res) => {
  const id = req.params.id;

  try {
    //Comando SQL atômico: O próprio banco soma +1 (evita erros de concorrência)
    const result = await pool.query(
      "UPDATE produtos SET curtidas = curtidas + 1 WHERE id = $1 RETURNING curtidas",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    //Devolve o novo número atualizado para o Frontend
    res.json({ novas_curtidas: result.rows[0].curtidas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao dar like" });
  }
});

//Rota para REMOVER LIKE (Decrementar)
app.patch("/api/produtos/:id/unlike", async (req, res) => {
  const id = req.params.id;

  try {
    //Usamos GREATEST(..., 0) para garantir que o número nunca fique negativo
    const result = await pool.query(
      "UPDATE produtos SET curtidas = GREATEST(curtidas - 1, 0) WHERE id = $1 RETURNING curtidas",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ novas_curtidas: result.rows[0].curtidas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao remover like" });
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
