#!/bin/bash

# Transfer Advising Form - Quick Start Script
# This script sets up the development environment

set -e

echo "🚀 Transfer Advising Form - Quick Start"
echo "========================================"
echo ""

# Check if .env existssudo certbot certificates

if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please update .env with your actual database credentials and secrets"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

# Check if DATABASE_URL is set
if grep -q "DATABASE_URL=postgresql://app:change_me@localhost:5432" .env; then
    echo "⚠️  WARNING: Default DATABASE_URL detected!"
    echo "   Please update DATABASE_URL in .env before running migrations"
    echo ""
    echo "   Options:"
    echo "   1. Use Docker: docker compose up -d db"
    echo "   2. Use local PostgreSQL"
    echo ""
    read -p "Do you want to start PostgreSQL with Docker? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v docker &> /dev/null; then
            echo "🐳 Starting PostgreSQL with Docker..."
            docker compose up -d db
            echo "✅ PostgreSQL started"
            echo "⏳ Waiting 10 seconds for database to be ready..."
            sleep 10
            
            # Run migrations
            echo "🔄 Running database migrations..."
            npx prisma migrate deploy
            echo "✅ Migrations completed"
            echo ""
            
            # Seed database
            echo "🌱 Seeding database with admin user..."
            npm run prisma:seed
            echo "✅ Database seeded"
            echo ""
        else
            echo "❌ Docker not found. Please install Docker or setup PostgreSQL manually."
            exit 1
        fi
    else
        echo "⏭️  Skipping database setup"
        echo "   Run manually: npx prisma migrate deploy && npm run prisma:seed"
        echo ""
    fi
else
    echo "🔄 Running database migrations..."
    npx prisma migrate deploy || echo "⚠️  Migration failed. Make sure database is accessible."
    echo ""
    
    echo "🌱 Seeding database..."
    npm run prisma:seed || echo "⚠️  Seeding failed. Make sure database is accessible."
    echo ""
fi

echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Review and update .env file with your credentials"
echo "   2. Start development server: npm run dev"
echo "   3. Open http://localhost:3000"
echo ""
echo "🔑 Default Admin Credentials (from .env):"
echo "   Email: admin@example.com"
echo "   Password: ChangeMe123!"
echo "   Login at: http://localhost:3000/admin/login"
echo ""
echo "📖 Documentation:"
echo "   - README.md - General documentation"
echo "   - DEPLOYMENT.md - Production deployment guide"
echo ""
echo "Happy coding! 🎉"
