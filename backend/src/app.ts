import express from "express";
import cors from "cors";
import productRoutes from "./routes/ProductRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
import authRoutes from "./routes/AuthRoutes.js";
import corsOptions from "./config/corsOptions.js";

const app = express();
const publicPath = path.join(process.cwd(), "public", "images");

//Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use("/images", express.static(publicPath));
app.use(errorHandler);

//Rotas
app.use("/api/auth", authRoutes);
app.use("/api/produtos", productRoutes);

export default app;
