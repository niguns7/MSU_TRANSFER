#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest code
echo "📥 Pulling latest code..."
git pull

# Build application
echo "🔨 Building application..."
npm run build

# Build and start containers
echo "🐳 Building Docker containers..."
docker compose build

echo "🐳 Starting containers..."
docker compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "📊 Running database migrations..."
docker compose exec web npx prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
docker compose exec web npx prisma generate

# Restart web container
echo "🔄 Restarting web service..."
docker compose restart web

# Check if everything is running
echo "✅ Checking service status..."
docker compose ps

echo "🎉 Deployment complete!"
echo "📍 Application URL: https://midwesternstateuniversity.transfer-advising-form.abroadinst.com"