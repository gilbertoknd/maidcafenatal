import fs from "fs/promises";
import path from "path";

/**
 * Utilitário para gerenciar arquivos físicos (imagens de produtos/eventos)
 */
export const StorageProvider = {
  /**
   * Deleta um arquivo a partir de um caminho relativo (ex: /images/foto.webp)
   * ou absoluto (utilizado por Multer antes de salvar)
   */
  async deleteFile(filePath: string | null) {
    if (!filePath) return;

    let absolutePath: string;

    // Se o caminho começa com /, assume que é a URL relativa do banco (/images/...)
    if (filePath.startsWith("/")) {
      const fileName = filePath.split("/").pop();
      if (!fileName) return;
      absolutePath = path.resolve(process.cwd(), "public", "images", fileName);
    } else {
      // Caso contrário, assume que é um caminho absoluto (ex: req.file.path)
      absolutePath = filePath;
    }

    try {
      await fs.access(absolutePath);
      await fs.unlink(absolutePath);
      console.log(`[StorageProvider] Arquivo deletado: ${absolutePath}`);
    } catch (err) {
      // Arquivo não existe ou erro de permissão - silencia pois o objetivo era garantir a remoção
      // console.warn(`[StorageProvider] Falha ao deletar arquivo: ${absolutePath}`, err);
    }
  },
};
