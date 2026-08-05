#!/bin/bash

# Database restore script for ChainBoard
# Usage: ./scripts/restore.sh <backup_file>

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="./backups"
BACKUP_FILE=$1
DATABASE_URL=${DATABASE_URL:-"postgresql://user:password@localhost:5432/chainboard"}

# Check if backup file is provided
if [ -z "$BACKUP_FILE" ]; then
    echo "Error: Please provide a backup file"
    echo "Usage: ./scripts/restore.sh <backup_file>"
    exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    # Try to find it in the backup directory
    if [ -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
        BACKUP_FILE="${BACKUP_DIR}/${BACKUP_FILE}"
    elif [ -f "${BACKUP_DIR}/${BACKUP_FILE}.sql.gz" ]; then
        BACKUP_FILE="${BACKUP_DIR}/${BACKUP_FILE}.sql.gz"
    else
        echo "Error: Backup file not found: $BACKUP_FILE"
        exit 1
    fi
fi

echo "Starting database restore..."
echo "Backup file: $BACKUP_FILE"

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "Decompressing backup..."
    gunzip -c "$BACKUP_FILE" | psql "$DATABASE_URL"
else
    psql "$DATABASE_URL" < "$BACKUP_FILE"
fi

echo "Restore completed successfully"
