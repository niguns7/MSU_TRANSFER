#!/bin/bash

# Deploy Prisma OpenSSL Fix
# This script deploys the Prisma OpenSSL compatibility fix

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║   🚀 Deploying Prisma OpenSSL Compatibility Fix       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Error: docker-compose.yml not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Pull latest changes
echo -e "${BLUE}📥 Pulling latest changes from Git...${NC}"
git pull origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git pull failed${NC}"
    exit 1
fi
echo ""

# Stop containers
echo -e "${YELLOW}⏹️  Stopping containers...${NC}"
docker compose down
echo ""

# Remove old image to force rebuild
echo -e "${YELLOW}🗑️  Removing old Docker image...${NC}"
docker rmi transfer-advising-form-web 2>/dev/null || echo "No old image to remove"
echo ""

# Rebuild with no cache
echo -e "${BLUE}🔨 Building new Docker image (this may take a few minutes)...${NC}"
docker compose build --no-cache web
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi
echo ""

# Start services
echo -e "${GREEN}▶️  Starting services...${NC}"
docker compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start services${NC}"
    exit 1
fi
echo ""

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 15
echo ""

# Check container status
echo -e "${BLUE}📊 Container Status:${NC}"
docker compose ps
echo ""

# Check logs for errors
echo -e "${BLUE}📋 Recent logs:${NC}"
docker compose logs --tail=30 web
echo ""

# Final status
echo "╔════════════════════════════════════════════════════════╗"
echo "║   ✅ Deployment Complete!                              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Check logs: ${BLUE}docker compose logs -f web${NC}"
echo "2. Test submission: Visit your website and submit a form"
echo "3. Monitor: ${BLUE}docker compose ps${NC}"
echo ""
echo -e "${YELLOW}If you see any Prisma/OpenSSL errors, check:${NC}"
echo "- PRISMA_OPENSSL_FIX.md for troubleshooting"
echo "- Logs: docker compose logs web | grep -i 'prisma\|openssl'"
echo ""
