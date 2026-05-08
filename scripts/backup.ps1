param (
    [switch]$Force
)

# ==============================================================================
# SCRIPT DE BACKUP: Mew Mew Café (Maid Café Natal)
# Descrição: Realiza o backup do banco de dados, uploads de mídia e fontes.
# Destino: Cloudflare R2 via rclone.
# ==============================================================================

$ErrorActionPreference = "Stop"

# 1. Configurações de Caminhos
# Define o diretório do projeto relativo à localização do script (assume que o script está numa subpasta ou raiz)
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
if ($ScriptPath -eq "") { $ScriptPath = $PWD.Path }
$ProjetoDir = Split-Path -Parent $ScriptPath # Volta uma pasta, equivalente ao ".." do bash
# Se o script for salvo direto na raiz do projeto (C:\Users\pdvme\Documents\GitHub\maidcafenatal), 
# comente a linha acima e use: $ProjetoDir = $ScriptPath

$PastaTemp = "$env:TEMP\mewmew_backup"
$Data = Get-Date -Format "yyyy-MM-dd_HH-mm"
$ArquivoZip = "backup_mewmew_$Data.zip"
$ArquivoZipCaminho = "$env:TEMP\$ArquivoZip"
$BucketDestino = "cloudflare_r2:mewmew-backups"

Write-Host "----------------------------------------------------------"
Write-Host "Iniciando Backup: $Data"
Write-Host "Diretório do Projeto: $ProjetoDir"

# 2. Carregar Variáveis de Ambiente (.env raiz)
$EnvPath = Join-Path -Path $ProjetoDir -ChildPath ".env"
if (Test-Path -Path $EnvPath) {
    # Extrai variáveis ignorando comentários e linhas vazias
    Get-Content -Path $EnvPath | Where-Object { $_ -match "^[^#]" -and $_.Trim() -ne "" } | ForEach-Object {
        $name, $value = $_.Split('=', 2)
        [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim())
    }
    Write-Host "[OK] Variáveis de ambiente carregadas."
} else {
    Write-Host "[ERRO] Arquivo .env não encontrado em $ProjetoDir" -ForegroundColor Red
    exit 1
}

# 3. Verificar se o container do PostgreSQL está rodando
$ContainerStatus = docker ps --format '{{.Names}}' | Select-String '^maid_postgres$'
if (-not $ContainerStatus) {
    Write-Host "[ERRO] Container maid_postgres não está rodando." -ForegroundColor Red
    exit 1
}

# 4. Preparar Pasta Temporária
if (Test-Path -Path $PastaTemp) {
    Remove-Item -Path "$PastaTemp\*" -Recurse -Force
} else {
    New-Item -ItemType Directory -Path $PastaTemp | Out-Null
}

# 5. Dump do Banco de Dados (Postgres)
Write-Host "Extraindo banco de dados..."
try {
    $DbUser = [Environment]::GetEnvironmentVariable("DB_USER")
    $DbName = [Environment]::GetEnvironmentVariable("DB_NAME")
    
    # O cmd.exe é usado para garantir que o redirecionamento (>) preserve a codificação correta do SQL
    cmd.exe /c "docker exec maid_postgres pg_dump -U $DbUser $DbName > `"$PastaTemp\database.sql`""
    
    if ($LASTEXITCODE -ne 0) { throw "Falha no pg_dump" }
    Write-Host "[OK] Dump do banco de dados concluído."
} catch {
    Write-Host "[ERRO] Falha ao extrair banco de dados." -ForegroundColor Red
    Remove-Item -Path $PastaTemp -Recurse -Force
    exit 1
}

# 6. Backup de Arquivos de Mídia e Fontes (Uploads)
Write-Host "Copiando arquivos de mídia e fontes..."
$PastaUploads = Join-Path -Path $PastaTemp -ChildPath "uploads"
New-Item -ItemType Directory -Path $PastaUploads | Out-Null

$ImagensPath = Join-Path -Path $ProjetoDir -ChildPath "backend\public\images"
if (Test-Path -Path $ImagensPath) {
    Copy-Item -Path $ImagensPath -Destination $PastaUploads -Recurse
    Write-Host "[OK] Imagens copiadas."
} else {
    Write-Host "[AVISO] Pasta de imagens não encontrada, pulando." -ForegroundColor Yellow
}

$FontesPath = Join-Path -Path $ProjetoDir -ChildPath "backend\public\fonts"
if (Test-Path -Path $FontesPath) {
    Copy-Item -Path $FontesPath -Destination $PastaUploads -Recurse
    Write-Host "[OK] Fontes copiadas."
} else {
    Write-Host "[AVISO] Pasta de fontes não encontrada, pulando." -ForegroundColor Yellow
}

# 7. Copiar Arquivos .env para referência
Copy-Item -Path $EnvPath -Destination "$PastaTemp\env_root.txt"

$EnvBackendPath = Join-Path -Path $ProjetoDir -ChildPath "backend\.env"
if (Test-Path -Path $EnvBackendPath) {
    Copy-Item -Path $EnvBackendPath -Destination "$PastaTemp\env_backend.txt"
}

$EnvFrontendPath = Join-Path -Path $ProjetoDir -ChildPath "frontend\.env"
if (Test-Path -Path $EnvFrontendPath) {
    Copy-Item -Path $EnvFrontendPath -Destination "$PastaTemp\env_frontend.txt"
}

# 8. Compactação
Write-Host "Compactando arquivos..."
try {
    Compress-Archive -Path "$PastaTemp\*" -DestinationPath $ArquivoZipCaminho -Force
    Write-Host "[OK] Arquivo compactado: $ArquivoZipCaminho"
} catch {
    Write-Host "[ERRO] Falha na compactação." -ForegroundColor Red
    Remove-Item -Path $PastaTemp -Recurse -Force
    exit 1
}

# 9. Envio para Cloudflare R2 via rclone
Write-Host "Enviando para Cloudflare R2..."
try {
    # Evita que o powershell pare a execução se o rclone jogar avisos no stderr
    $env:RCLONE_RETRIES = "3"
    & rclone copy $ArquivoZipCaminho "$BucketDestino/"
    
    if ($LASTEXITCODE -ne 0) { throw "Falha no Rclone" }
    Write-Host "[OK] Backup enviado com sucesso para o R2!"
} catch {
    Write-Host "[ERRO] Falha ao enviar para o Cloudflare R2." -ForegroundColor Red
    exit 1
}

# 10. Limpeza Final
Write-Host "Limpando arquivos temporários..."
Remove-Item -Path $PastaTemp -Recurse -Force
Remove-Item -Path $ArquivoZipCaminho -Force
Write-Host "Backup finalizado com sucesso!"
Write-Host "----------------------------------------------------------"