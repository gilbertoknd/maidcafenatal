import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const fontsDir = path.join(process.cwd(), "public", "fonts");

// Garante que o diretório de fontes existe
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, fontsDir);
  },
  filename: (_req, file, cb) => {
    const fileHash = crypto.randomBytes(8).toString("hex");
    const safeName = file.originalname.replace(/\s+/g, "_").toLowerCase();
    const fileName = `${fileHash}-${safeName}`;
    cb(null, fileName);
  },
});

export const uploadFonteConfig = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (_req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname === ".woff2") {
      return cb(null, true);
    }
    cb(
      new Error("Apenas arquivos .woff2 são permitidos para upload de fontes!"),
    );
  },
});
