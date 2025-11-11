#!/bin/bash

##############################################################################
# Quick Deploy Script - Uses existing .env configuration
# Usage: sudo ./quick-deploy.sh
##############################################################################

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Starting Quick Deployment${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}Error: This script must be run as root${NC}"
   echo "Usage: sudo ./quick-deploy.sh"
   exit 1
fi

# Default project directory (change if needed)
PROJECT_DIR="/opt/transfer-advising-form/MSU_TRANSFER"

# Check if custom directory is provided
if [ ! -z "$1" ]; then
    PROJECT_DIR="$1"
fi

# Navigate to project
cd "$PROJECT_DIR" || {
    echo -e "${RED}Error: Project directory $PROJECT_DIR not found${NC}"
    exit 1
}

echo -e "${GREEN}✓${NC} Project directory: $PROJECT_DIR"

##############################################################################
# 1. Git Pull
##############################################################################

echo ""
echo -e "${YELLOW}[1/7] Pulling latest code...${NC}"
git pull origin main || {
    echo -e "${RED}✗ Git pull failed${NC}"
    exit 1
}
echo -e "${GREEN}✓${NC} Code updated"

##############################################################################
# 2. Load Node 22
##############################################################################

echo ""
echo -e "${YELLOW}[2/7] Loading Node.js 22...${NC}"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22 || {
    echo -e "${YELLOW}Installing Node 22...${NC}"
    nvm install 22
    nvm use 22
}
echo -e "${GREEN}✓${NC} Node $(node --version)"

##############################################################################
# 3. Install Dependencies
##############################################################################

echo ""
echo -e "${YELLOW}[3/7] Installing dependencies...${NC}"
npm ci || {
    echo -e "${RED}✗ npm install failed${NC}"
    exit 1
}
echo -e "${GREEN}✓${NC} Dependencies installed"

##############################################################################
# 4. Database Setup
##############################################################################

echo ""
echo -e "${YELLOW}[4/7] Setting up database...${NC}"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy || {
    echo -e "${RED}✗ Migrations failed${NC}"
    exit 1
}
echo -e "${GREEN}✓${NC} Database ready"

##############################################################################
# 5. Build Application
##############################################################################

echo ""
echo -e "${YELLOW}[5/7] Building application...${NC}"
rm -rf .next
npm run build || {
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
}
echo -e "${GREEN}✓${NC} Build complete"

##############################################################################
# 6. Restart Docker
##############################################################################

echo ""
echo -e "${YELLOW}[6/7] Restarting Docker containers...${NC}"
docker compose down
docker compose build
docker compose up -d || {
    echo -e "${RED}✗ Docker restart failed${NC}"
    exit 1
}
echo -e "${GREEN}✓${NC} Containers running"

# Wait for containers
sleep 5

##############################################################################
# 7. Restart Nginx
##############################################################################

echo ""
echo -e "${YELLOW}[7/7] Restarting Nginx...${NC}"
nginx -t && systemctl reload nginx || {
    echo -e "${RED}✗ Nginx restart failed${NC}"
    exit 1
}
echo -e "${GREEN}✓${NC} Nginx restarted"

##############################################################################
# Summary
##############################################################################

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}DEPLOYMENT SUCCESSFUL!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Container Status:"
docker compose ps
echo ""
echo "View logs: docker compose logs -f web"
echo ""

exit 0
