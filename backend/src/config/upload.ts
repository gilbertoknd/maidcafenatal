import multer from "multer";
import path from "path";
import crypto from "crypto";
import { AppError } from "../errors/AppError.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public", "images"));
  },
  filename: (req, file, cb) => {
    const fileHash = crypto.randomBytes(16).toString("hex");
    const fileName = `${fileHash}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, fileName);
  },
});

export const uploadConfig = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB (Aumentado conforme solicitação do usuário)
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp|mp4|webm|mov/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error("Apenas imagens e vídeos são permitidos! (JPEG, PNG, GIF, WEBP, MP4, WEBM)"));
  },
});
