import express from "express";
import cors from "cors";
import produtoRoutes from "./routes/ProdutoRoutes.js";
import pedidoRoutes from "./routes/PedidoRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
import authRoutes from "./routes/AuthRoutes.js";
import eventoRoutes from "./routes/EventoRoutes.js";
import corsOptions from "./config/corsOptions.js";

const app = express();
const publicPath = path.join(process.cwd(), "public", "images");

//Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use("/images", express.static(publicPath));

//Rotas
app.use("/api/auth", authRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/eventos", eventoRoutes);

// Error Handler deve SEMPRE vir DEPOIS das rotas
app.use(errorHandler);

export default app;
