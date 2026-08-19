#!/bin/bash

# Database Migration Runner Script for ChainBoard

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root
cd "$PROJECT_ROOT"

echo -e "${GREEN}ChainBoard Database Migration Runner${NC}"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create a .env file based on .env.example"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: DATABASE_URL not set in .env${NC}"
    exit 1
fi

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: psql is not installed${NC}"
    echo "Please install PostgreSQL client tools"
    exit 1
fi

echo -e "${YELLOW}Database URL: ${DATABASE_URL}${NC}"
echo ""

# Function to run migration
run_migration() {
    local migration_file=$1
    echo -e "${GREEN}Running migration: $migration_file${NC}"
    
    if psql "$DATABASE_URL" -f "$migration_file"; then
        echo -e "${GREEN}✓ Migration completed successfully${NC}"
    else
        echo -e "${RED}✗ Migration failed${NC}"
        exit 1
    fi
    echo ""
}

# Check if migrations directory exists
if [ ! -d "backend/migrations" ]; then
    echo -e "${RED}Error: backend/migrations directory not found${NC}"
    exit 1
fi

# Run all migration files in order
for migration_file in backend/migrations/*.sql; do
    if [ -f "$migration_file" ]; then
        run_migration "$migration_file"
    fi
done

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}All migrations completed successfully!${NC}"
