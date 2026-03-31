import express from "express";
import cors from "cors";
import produtoRoutes from "./routes/ProdutoRoutes.js";
import pedidoRoutes from "./routes/PedidoRoutes.js";
import { gerenciadorErros } from "./middlewares/gerenciadorErros.js";
import path from "path";
import autenticacaoRoutes from "./routes/AutenticacaoRoutes.js";
import eventoRoutes from "./routes/EventoRoutes.js";
import bannerRoutes from "./routes/BannerRoutes.js";
import corsOptions from "./config/corsOptions.js";

const app = express();
const publicPath = path.join(process.cwd(), "public", "images");

//Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use("/images", express.static(publicPath));

//Rotas
app.use("/api/autenticacao", autenticacaoRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/eventos", eventoRoutes);
app.use("/api/banners", bannerRoutes);

// Error Handler deve SEMPRE vir DEPOIS das rotas
app.use(gerenciadorErros);

export default app;
