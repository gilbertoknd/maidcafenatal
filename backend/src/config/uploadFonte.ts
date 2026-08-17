import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const fontsDir = path.join(process.cwd(), "public", "fonts");

// Garante que o diretório de fontes existe — SEM derrubar o servidor se falhar.
// Em produção o processo roda como `USER node` (não-root); se a pasta não puder
// ser criada (permissão), apenas registramos: o upload de fontes falha depois de
// forma controlada, mas a API inteira não pode cair no boot por causa disso.
// (O ideal é a pasta já existir via Dockerfile/volume — ver docker-compose.yml.)
try {
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
  }
} catch (err) {
  console.warn(
    `[uploadFonte] não foi possível garantir o diretório ${fontsDir}: ${(err as Error).message}`,
  );
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
