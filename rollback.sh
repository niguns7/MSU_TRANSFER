#!/bin/bash

##############################################################################
# Rollback Script - Restore from backup
# Usage: sudo ./rollback.sh [backup_file]
##############################################################################

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="/opt/transfer-advising-form"
BACKUP_DIR="/opt/backups/transfer-advising-form"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Rollback Script${NC}"
echo -e "${YELLOW}========================================${NC}"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}Error: This script must be run as root${NC}"
   exit 1
fi

cd "$PROJECT_DIR" || exit 1

# List available backups
echo ""
echo "Available backups:"
ls -lh "$BACKUP_DIR"/backup_*.tar.gz 2>/dev/null || {
    echo -e "${RED}No backups found in $BACKUP_DIR${NC}"
    exit 1
}

# Select backup
if [ -z "$1" ]; then
    echo ""
    echo "Usage: sudo ./rollback.sh [backup_file]"
    echo "Example: sudo ./rollback.sh $BACKUP_DIR/backup_20250111_120000.tar.gz"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}WARNING: This will restore from:${NC}"
echo "$BACKUP_FILE"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Rollback cancelled"
    exit 0
fi

# Stop containers
echo ""
echo "Stopping containers..."
docker compose down

# Backup current state before rollback
echo "Creating safety backup..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
tar -czf "$BACKUP_DIR/pre_rollback_$TIMESTAMP.tar.gz" \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    . 2>/dev/null

# Restore from backup
echo "Restoring from backup..."
tar -xzf "$BACKUP_FILE" -C "$PROJECT_DIR"

# Reinstall dependencies
echo "Reinstalling dependencies..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22
npm ci

# Rebuild
echo "Rebuilding application..."
npx prisma generate
npm run build

# Restart containers
echo "Restarting containers..."
docker compose up -d

# Restart nginx
echo "Restarting nginx..."
systemctl reload nginx

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}ROLLBACK COMPLETE${NC}"
echo -e "${GREEN}========================================${NC}"

exit 0
