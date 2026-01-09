import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.resolve(
    __dirname,
    "..",
    "..",
    "public",
    "images",
    "produtos"
  ),
  filename: (req, file, cb) => {
    //Nome único: data-atual + nome-original (ex: 123456-bolo.jpg)
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`;
    cb(null, uniqueName);
  },
});

export const uploadConfig = multer({ storage });
