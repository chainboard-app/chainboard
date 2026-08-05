# Database restore script for ChainBoard (Windows PowerShell)
# Usage: .\scripts\restore.ps1 <backup_file>

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
$BACKUP_FILE = $args[0]
$DATABASE_URL = if ($env:DATABASE_URL) { $env:DATABASE_URL } else { "postgresql://user:password@localhost:5432/chainboard" }

# Check if backup file is provided
if (-not $BACKUP_FILE) {
    Write-Error "Error: Please provide a backup file"
    Write-Host "Usage: .\scripts\restore.ps1 <backup_file>"
    exit 1
}

# Check if backup file exists
if (-not (Test-Path $BACKUP_FILE)) {
    # Try to find it in the backup directory
    $potentialPath = "${BACKUP_DIR}\${BACKUP_FILE}"
    if (Test-Path $potentialPath) {
        $BACKUP_FILE = $potentialPath
    } elseif (Test-Path "${potentialPath}.zip") {
        $BACKUP_FILE = "${potentialPath}.zip"
    } else {
        Write-Error "Error: Backup file not found: $BACKUP_FILE"
        exit 1
    }
}

Write-Host "Starting database restore..."
Write-Host "Backup file: $BACKUP_FILE"

# Decompress if needed
if ($BACKUP_FILE -like "*.zip") {
    Write-Host "Decompressing backup..."
    $tempDir = Join-Path $env:TEMP "chainboard_restore"
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $tempDir | Out-Null
    Expand-Archive -Path $BACKUP_FILE -DestinationPath $tempDir -Force
    $sqlFile = Get-ChildItem $tempDir -Filter "*.sql" | Select-Object -First 1
    & psql $DATABASE_URL -f $sqlFile.FullName
    Remove-Item $tempDir -Recurse -Force
} else {
    & psql $DATABASE_URL -f $BACKUP_FILE
}

Write-Host "Restore completed successfully"
