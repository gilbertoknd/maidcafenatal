Start-Transcript -Path 'C:\Users\pdvme\Documents\GitHub\maidcafenatal\backup_log.txt'
Start-Transcript -Path 'C:\Users\pdvme\Documents\GitHub\maidcafenatal\backup_log.txt'
Start-Transcript -Path 'C:\Users\pdvme\Documents\GitHub\maidcafenatal\backup_log.txt'
param (
    [switch]$Force
)

# ==============================================================================
# SCRIPT DE BACKUP: Mew Mew CafÃ© (Maid CafÃ© Natal)
# DescriÃ§Ã£o: Realiza o backup do banco de dados, uploads de mÃ­dia e fontes.
# Destino: Cloudflare R2 via rclone.
# ==============================================================================

$ErrorActionPreference = "Stop"

# 1. ConfiguraÃ§Ãµes de Caminhos
# Define o diretÃ³rio do projeto relativo Ã  localizaÃ§Ã£o do script (assume que o script estÃ¡ numa subpasta ou raiz)
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
Write-Host "DiretÃ³rio do Projeto: $ProjetoDir"

# 2. Carregar VariÃ¡veis de Ambiente (.env raiz)
$EnvPath = Join-Path -Path $ProjetoDir -ChildPath ".env"
if (Test-Path -Path $EnvPath) {
    # Extrai variÃ¡veis ignorando comentÃ¡rios e linhas vazias
    Get-Content -Path $EnvPath | Where-Object { $_ -match "^[^#]" -and $_.Trim() -ne "" } | ForEach-Object {
        $name, $value = $_.Split('=', 2)
        [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim())
    }
    Write-Host "[OK] VariÃ¡veis de ambiente carregadas."
} else {
    Write-Host "[ERRO] Arquivo .env nÃ£o encontrado em $ProjetoDir" -ForegroundColor Red
    exit 1
}

# 3. Verificar se o container do PostgreSQL estÃ¡ rodando
$ContainerStatus = docker ps --format '{{.Names}}' | Select-String '^maid_postgres$'
if (-not $ContainerStatus) {
    Write-Host "[ERRO] Container maid_postgres nÃ£o estÃ¡ rodando." -ForegroundColor Red
    exit 1
}

# 4. Preparar Pasta TemporÃ¡ria
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
    
    # O cmd.exe Ã© usado para garantir que o redirecionamento (>) preserve a codificaÃ§Ã£o correta do SQL
    cmd.exe /c "docker exec maid_postgres pg_dump -U $DbUser $DbName > `"$PastaTemp\database.sql`""
    
    if ($LASTEXITCODE -ne 0) { throw "Falha no pg_dump" }
    Write-Host "[OK] Dump do banco de dados concluÃ­do."
} catch {
    Write-Host "[ERRO] Falha ao extrair banco de dados." -ForegroundColor Red
    Remove-Item -Path $PastaTemp -Recurse -Force
    exit 1
}

# 6. Backup de Arquivos de MÃ­dia e Fontes (Uploads)
Write-Host "Copiando arquivos de mÃ­dia e fontes..."
$PastaUploads = Join-Path -Path $PastaTemp -ChildPath "uploads"
New-Item -ItemType Directory -Path $PastaUploads | Out-Null

$ImagensPath = Join-Path -Path $ProjetoDir -ChildPath "backend\public\images"
if (Test-Path -Path $ImagensPath) {
    Copy-Item -Path $ImagensPath -Destination $PastaUploads -Recurse
    Write-Host "[OK] Imagens copiadas."
} else {
    Write-Host "[AVISO] Pasta de imagens nÃ£o encontrada, pulando." -ForegroundColor Yellow
}

$FontesPath = Join-Path -Path $ProjetoDir -ChildPath "backend\public\fonts"
if (Test-Path -Path $FontesPath) {
    Copy-Item -Path $FontesPath -Destination $PastaUploads -Recurse
    Write-Host "[OK] Fontes copiadas."
} else {
    Write-Host "[AVISO] Pasta de fontes nÃ£o encontrada, pulando." -ForegroundColor Yellow
}

# 7. Copiar Arquivos .env para referÃªncia
Copy-Item -Path $EnvPath -Destination "$PastaTemp\env_root.txt"

$EnvBackendPath = Join-Path -Path $ProjetoDir -ChildPath "backend\.env"
if (Test-Path -Path $EnvBackendPath) {
    Copy-Item -Path $EnvBackendPath -Destination "$PastaTemp\env_backend.txt"
}

$EnvFrontendPath = Join-Path -Path $ProjetoDir -ChildPath "frontend\.env"
if (Test-Path -Path $EnvFrontendPath) {
    Copy-Item -Path $EnvFrontendPath -Destination "$PastaTemp\env_frontend.txt"
}

# 8. CompactaÃ§Ã£o
Write-Host "Compactando arquivos..."
try {
    Compress-Archive -Path "$PastaTemp\*" -DestinationPath $ArquivoZipCaminho -Force
    Write-Host "[OK] Arquivo compactado: $ArquivoZipCaminho"
} catch {
    Write-Host "[ERRO] Falha na compactaÃ§Ã£o." -ForegroundColor Red
    Remove-Item -Path $PastaTemp -Recurse -Force
    exit 1
}

# 9. Envio para Cloudflare R2 via rclone
Write-Host "Enviando para Cloudflare R2..."
try {
    # Evita que o powershell pare a execuÃ§Ã£o se o rclone jogar avisos no stderr
    $env:RCLONE_RETRIES = "3"
    & rclone copy $ArquivoZipCaminho "$BucketDestino/"
    
    if ($LASTEXITCODE -ne 0) { throw "Falha no Rclone" }
    Write-Host "[OK] Backup enviado com sucesso para o R2!"
} catch {
    Write-Host "[ERRO] Falha ao enviar para o Cloudflare R2." -ForegroundColor Red
    exit 1
}

# 10. Limpeza Final
Write-Host "Limpando arquivos temporÃ¡rios..."
Remove-Item -Path $PastaTemp -Recurse -Force
Remove-Item -Path $ArquivoZipCaminho -Force
Write-Host "Backup finalizado com sucesso!"
Write-Host "----------------------------------------------------------"


