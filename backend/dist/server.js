"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./database/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET, PUT, PATCH, POST, DELETE"],
    allowedHeaders: ["Content-Type, Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
// Rota de Teste do Banco
app.get("/db", async (req, res) => {
    try {
        const result = await db_1.pool.query("SELECT NOW() as hora_atual");
        res.json({
            status: "Sucesso",
            mensagem: "Backend conectado ao PostgreSQL!",
            horario_banco: result.rows[0].hora_atual,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Falha ao conectar no banco" });
    }
});
app.get("/", (req, res) => {
    res.json({
        mensagem: "Backend do Maid Café Mew Mew!",
        status: "Positivo e operante 🚀",
    });
});
app.listen(PORT, () => {
    console.log(`☕ Servidor rodando na porta ${PORT}`);
});
