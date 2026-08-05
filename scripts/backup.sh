#!/bin/bash

# Database backup script for ChainBoard
# Usage: ./scripts/backup.sh [backup_name]

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME=${1:-"chainboard_backup_${TIMESTAMP}"}
DATABASE_URL=${DATABASE_URL:-"postgresql://user:password@localhost:5432/chainboard"}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting database backup..."
echo "Backup name: $BACKUP_NAME"

# Perform backup using pg_dump
pg_dump "$DATABASE_URL" > "${BACKUP_DIR}/${BACKUP_NAME}.sql"

# Compress the backup
gzip "${BACKUP_DIR}/${BACKUP_NAME}.sql"

echo "Backup completed: ${BACKUP_DIR}/${BACKUP_NAME}.sql.gz"

# Keep only the last 7 days of backups
find "$BACKUP_DIR" -name "chainboard_backup_*.sql.gz" -mtime +7 -delete

echo "Old backups cleaned up (keeping last 7 days)"
