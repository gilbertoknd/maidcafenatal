import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5174",
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export default corsOptions;
