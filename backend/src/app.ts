import express from "express";
import cors from "cors";
import productRoutes from "./routes/ProductRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import path from "path";

const app = express();
const publicPath = path.join(process.cwd(), "public", "images");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET, PUT, PATCH, POST, DELETE"],
    allowedHeaders: ["Content-Type, Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/images", express.static(publicPath));

app.use("/api/produtos", productRoutes);

app.get("/", (req, res) => {
  res.json({
    mensagem: "Backend do Maid Café Mew Mew!",
    status: "Positivo e operante",
  });
});

app.use(errorHandler);

export default app;
