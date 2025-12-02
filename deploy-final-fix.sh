#!/bin/bash

##############################################################################
# FINAL FIX - Deploy Script
# This fixes the missing node_modules/.bin issue
##############################################################################

set -e

echo "🚀 Deploying Fixed Dockerfile to Server"
echo "========================================"
echo ""

# Deploy on server
ssh root@abroadinst << 'ENDSSH'
set -e

cd /opt/transfer-advising-form/MSU_TRANSFER

echo "📥 Pulling latest changes..."
git pull origin main

echo "🛑 Stopping containers..."
docker compose down

echo "🗑️  Removing old images..."
docker rmi transfer-form-web -f 2>/dev/null || true

echo "🧹 Clearing Docker cache..."
docker builder prune -a -f

echo "🔨 Building new image..."
DOCKER_BUILDKIT=0 docker compose build --no-cache web

echo "🚀 Starting services..."
docker compose up -d

echo "⏳ Waiting 30 seconds for startup..."
sleep 30

echo ""
echo "📊 Container Status:"
docker compose ps

echo ""
echo "📋 Checking logs..."
docker logs transfer-form-web --tail 30

echo ""
echo "✅ Deployment complete!"

ENDSSH

echo ""
echo "🧪 Testing deployment..."
sleep 5

if curl -f -s "https://midwesternstateuniversity.transfer-advising-form.abroadinst.com/api/healthz" > /dev/null; then
    echo "✅ Health check PASSED - Site is live!"
else
    echo "⚠️  Health check failed - checking logs..."
    ssh root@abroadinst "cd /opt/transfer-advising-form/MSU_TRANSFER && docker logs transfer-form-web --tail 50"
fi

echo ""
echo "🌐 Visit: https://midwesternstateuniversity.transfer-advising-form.abroadinst.com"
echo ""
