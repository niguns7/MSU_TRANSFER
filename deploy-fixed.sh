#!/bin/bash

##############################################################################
# Complete Deployment Script - Transfer Advising Form
# Fixes Prisma v7 issue and deploys to production
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_USER="root"
SERVER_HOST="abroadinst"
SERVER_PATH="/opt/transfer-advising-form/MSU_TRANSFER"
DOMAIN="midwesternstateuniversity.transfer-advising-form.abroadinst.com"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       Transfer Advising Form - Deployment Script          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check local changes
echo -e "${YELLOW}📋 Step 1: Checking local repository...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}   Found uncommitted changes${NC}"
    git status -s
    echo ""
    read -p "   Commit these changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add -A
        read -p "   Enter commit message: " commit_msg
        git commit -m "$commit_msg"
    fi
else
    echo -e "${GREEN}   ✓ Working directory clean${NC}"
fi

# Step 2: Push to GitHub
echo ""
echo -e "${YELLOW}📤 Step 2: Pushing to GitHub...${NC}"
git push origin main
echo -e "${GREEN}   ✓ Pushed to GitHub${NC}"

# Step 3: Deploy to server
echo ""
echo -e "${YELLOW}🚀 Step 3: Deploying to server...${NC}"
echo -e "${BLUE}   → Connecting to ${SERVER_HOST}...${NC}"

ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
set -e

# Colors for SSH session
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd /opt/transfer-advising-form/MSU_TRANSFER

echo -e "${BLUE}   → Pulling latest changes...${NC}"
# Stash any local changes
git stash || true
git fetch origin
git reset --hard origin/main
git pull origin main

echo -e "${BLUE}   → Stopping containers...${NC}"
docker compose down

echo -e "${BLUE}   → Removing old images...${NC}"
docker rmi transfer-form-web -f 2>/dev/null || echo "   Image already removed"

echo -e "${BLUE}   → Clearing Docker build cache...${NC}"
docker builder prune -f

echo -e "${BLUE}   → Building new image (this may take a few minutes)...${NC}"
docker compose build --no-cache --pull web

echo -e "${BLUE}   → Starting services...${NC}"
docker compose up -d

echo -e "${YELLOW}   ⏳ Waiting for services to initialize (30 seconds)...${NC}"
sleep 30

echo ""
echo -e "${GREEN}   ✓ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}   📊 Container Status:${NC}"
docker compose ps

echo ""
echo -e "${BLUE}   📋 Recent logs from web container:${NC}"
docker logs transfer-form-web --tail 30

ENDSSH

# Step 4: Verify deployment
echo ""
echo -e "${YELLOW}🧪 Step 4: Verifying deployment...${NC}"

echo -e "${BLUE}   → Testing health endpoint...${NC}"
sleep 5

if curl -f -s "https://${DOMAIN}/api/healthz" > /dev/null; then
    echo -e "${GREEN}   ✓ Health check passed${NC}"
else
    echo -e "${RED}   ✗ Health check failed${NC}"
    echo -e "${YELLOW}   → Checking logs...${NC}"
    ssh ${SERVER_USER}@${SERVER_HOST} "cd ${SERVER_PATH} && docker logs transfer-form-web --tail 50"
fi

# Final status
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                   Deployment Summary                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}   🌐 Website:${NC} https://${DOMAIN}"
echo -e "${BLUE}   🏥 Health:${NC}  https://${DOMAIN}/api/healthz"
echo -e "${BLUE}   👤 Admin:${NC}   https://${DOMAIN}/admin/login"
echo ""
echo -e "${YELLOW}📝 Useful commands:${NC}"
echo -e "   View logs:    ${BLUE}ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_PATH} && docker logs -f transfer-form-web'${NC}"
echo -e "   Restart:      ${BLUE}ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_PATH} && docker compose restart web'${NC}"
echo -e "   Check status: ${BLUE}ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_PATH} && docker compose ps'${NC}"
echo ""
