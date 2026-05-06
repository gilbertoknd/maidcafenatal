#!/bin/bash

# ==============================================================================
# SCRIPT DE BACKUP: Mew Mew Café (Maid Café Natal)
# Descrição: Realiza o backup do banco de dados, uploads de mídia e fontes.
# Destino: Cloudflare R2 via rclone.
# ==============================================================================

# 1. Configurações de Caminhos
# Define o diretório do projeto relativo à localização do script
PROJETO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PASTA_TEMP="/tmp/mewmew_backup"
DATA=$(date +"%Y-%m-%d_%H-%M")
ARQUIVO_ZIP="backup_mewmew_$DATA.tar.gz"
BUCKET_DESTINO="cloudflare_r2:mewmew-db-backups"

echo "----------------------------------------------------------"
echo "Iniciando Backup: $DATA"
echo "Diretório do Projeto: $PROJETO_DIR"

# 2. Carregar Variáveis de Ambiente (.env raiz)
if [ -f "$PROJETO_DIR/.env" ]; then
    # Extrai variáveis ignorando comentários e linhas vazias
    export $(grep -v '^#' "$PROJETO_DIR/.env" | grep -v '^$' | xargs)
    echo "[OK] Variáveis de ambiente carregadas."
else
    echo "[ERRO] Arquivo .env não encontrado em $PROJETO_DIR"
    exit 1
fi

# 3. Preparar Pasta Temporária
mkdir -p $PASTA_TEMP
rm -rf $PASTA_TEMP/* # Limpa se houver resquícios

# 4. Dump do Banco de Dados (Postgres)
echo "Extraindo banco de dados..."
docker exec maid_postgres pg_dump -U $DB_USER $DB_NAME > $PASTA_TEMP/database.sql
if [ $? -eq 0 ]; then
    echo "[OK] Dump do banco de dados concluído."
else
    echo "[ERRO] Falha ao extrair banco de dados."
    rm -rf $PASTA_TEMP
    exit 1
fi

# 5. Backup de Arquivos de Mídia e Fontes (Uploads)
echo "Copiando arquivos de mídia e fontes..."
mkdir -p $PASTA_TEMP/uploads
cp -r "$PROJETO_DIR/backend/public/images" "$PASTA_TEMP/uploads/"
cp -r "$PROJETO_DIR/backend/public/fonts" "$PASTA_TEMP/uploads/"
echo "[OK] Arquivos de mídia copiados."

# 6. Copiar Arquivos .env para referência
cp "$PROJETO_DIR/.env" "$PASTA_TEMP/env_root.txt"
cp "$PROJETO_DIR/backend/.env" "$PASTA_TEMP/env_backend.txt"
cp "$PROJETO_DIR/frontend/.env" "$PASTA_TEMP/env_frontend.txt"

# 7. Compactação
echo "Compactando arquivos..."
tar -czf /tmp/$ARQUIVO_ZIP -C $PASTA_TEMP .
if [ $? -eq 0 ]; then
    echo "[OK] Arquivo compactado: /tmp/$ARQUIVO_ZIP"
else
    echo "[ERRO] Falha na compactação."
    rm -rf $PASTA_TEMP
    exit 1
fi

# 8. Envio para Cloudflare R2 via rclone
echo "Enviando para Cloudflare R2..."
rclone copy "/tmp/$ARQUIVO_ZIP" "$BUCKET_DESTINO/"
if [ $? -eq 0 ]; then
    echo "[OK] Backup enviado com sucesso para o R2!"
else
    echo "[ERRO] Falha ao enviar para o Cloudflare R2."
    # Não deletamos o zip em caso de erro para permitir tentativa manual
    exit 1
fi

# 9. Limpeza Final
echo "Limpando arquivos temporários..."
rm -rf $PASTA_TEMP
rm "/tmp/$ARQUIVO_ZIP"
echo "Backup finalizado com sucesso!"
echo "----------------------------------------------------------"