import express from "express";
import cors from "cors";
import produtoRoutes from "./routes/ProdutoRoutes.js";
import pedidoRoutes from "./routes/PedidoRoutes.js";
import { gerenciadorErros } from "./middlewares/gerenciadorErros.js";
import path from "path";
import autenticacaoRoutes from "./routes/AutenticacaoRoutes.js";
import eventoRoutes from "./routes/EventoRoutes.js";
import bannerRoutes from "./routes/BannerRoutes.js";
import configuracaoRoutes from "./routes/ConfiguracaoRoutes.js";
import instagramRoutes from "./routes/InstagramRoutes.js";
import cupomRoutes from "./routes/CupomRoutes.js";
import corsOptions from "./config/corsOptions.js";

const app = express();
const publicPath = path.join(process.cwd(), "public", "images");
const fontsPath = path.join(process.cwd(), "public", "fonts");

//Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use("/images", express.static(publicPath));
app.use("/fonts", express.static(fontsPath));

//Rotas
app.use("/api/autenticacao", autenticacaoRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/eventos", eventoRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/configuracoes", configuracaoRoutes);
app.use("/api/instagram", instagramRoutes);
app.use("/api/cupons", cupomRoutes);

//Error Handler deve SEMPRE vir DEPOIS das rotas
app.use(gerenciadorErros);

export default app;
