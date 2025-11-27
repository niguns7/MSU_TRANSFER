#!/bin/bash

##############################################################################
# Quick Fix & Deploy - Use this for immediate deployment
##############################################################################

set -e

echo "🔧 Quick Fix & Deploy Script"
echo "=============================="
echo ""

# Step 1: Commit and push
echo "📦 Committing changes..."
git add Dockerfile package.json yarn.lock
git commit -m "Fix: Update Dockerfile to use Prisma v6.8.0 from package.json" || echo "No changes to commit"
git push origin main

echo ""
echo "🚀 Deploying to server..."
echo ""

# Step 2: Deploy on server
ssh root@abroadinst << 'ENDSSH'
set -e

cd /opt/transfer-advising-form/MSU_TRANSFER

echo "→ Pulling changes..."
git stash || true
git pull origin main

echo "→ Stopping containers..."
docker compose down

echo "→ Removing old image..."
docker rmi transfer-form-web -f 2>/dev/null || true

echo "→ Building (no cache)..."
docker compose build --no-cache web

echo "→ Starting services..."
docker compose up -d

echo "→ Waiting 30 seconds..."
sleep 30

echo ""
echo "✅ Done! Checking logs..."
docker logs transfer-form-web --tail 50

ENDSSH

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Visit: https://midwesternstateuniversity.transfer-advising-form.abroadinst.com"
echo ""
