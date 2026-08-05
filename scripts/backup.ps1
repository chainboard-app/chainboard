# Database backup script for ChainBoard (Windows PowerShell)
# Usage: .\scripts\backup.ps1 [backup_name]

$ErrorActionPreference = "Stop"

# Load environment variables
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#].+?)=(.+)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

# Configuration
$BACKUP_DIR = ".\backups"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_NAME = if ($args[0]) { $args[0] } else { "chainboard_backup_${TIMESTAMP}" }
$DATABASE_URL = if ($env:DATABASE_URL) { $env:DATABASE_URL } else { "postgresql://user:password@localhost:5432/chainboard" }

# Create backup directory if it doesn't exist
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

Write-Host "Starting database backup..."
Write-Host "Backup name: $BACKUP_NAME"

# Perform backup using pg_dump
& pg_dump $DATABASE_URL | Out-File "${BACKUP_DIR}\${BACKUP_NAME}.sql" -Encoding UTF8

# Compress the backup
Compress-Archive -Path "${BACKUP_DIR}\${BACKUP_NAME}.sql" -DestinationPath "${BACKUP_DIR}\${BACKUP_NAME}.zip" -Force
Remove-Item "${BACKUP_DIR}\${BACKUP_NAME}.sql"

Write-Host "Backup completed: ${BACKUP_DIR}\${BACKUP_NAME}.zip"

# Keep only the last 7 days of backups
Get-ChildItem $BACKUP_DIR -Filter "chainboard_backup_*.zip" | Where-Object {
    $_.LastWriteTime -lt (Get-Date).AddDays(-7)
} | Remove-Item

Write-Host "Old backups cleaned up (keeping last 7 days)"
