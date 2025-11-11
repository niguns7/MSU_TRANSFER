#!/bin/bash

##############################################################################
# Deployment Script for Transfer Advising Form
# This script handles complete deployment: git pull -> build -> nginx restart
##############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/opt/transfer-advising-form"
BRANCH="main"
BACKUP_DIR="/opt/backups/transfer-advising-form"
LOG_FILE="/var/log/transfer-advising-form-deploy.log"

##############################################################################
# Helper Functions
##############################################################################

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"
}

##############################################################################
# Pre-deployment Checks
##############################################################################

log "Starting deployment process..."

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root or with sudo"
   exit 1
fi

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    error "Project directory $PROJECT_DIR does not exist"
    exit 1
fi

# Navigate to project directory
cd "$PROJECT_DIR" || exit 1
log "Changed to project directory: $PROJECT_DIR"

##############################################################################
# Backup Current State
##############################################################################

log "Creating backup..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create timestamped backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"

# Backup current state (excluding node_modules and .next)
tar -czf "$BACKUP_FILE" \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    . 2>/dev/null || warn "Backup creation had warnings"

log "Backup created: $BACKUP_FILE"

# Keep only last 5 backups
cd "$BACKUP_DIR" && ls -t backup_*.tar.gz | tail -n +6 | xargs -r rm
log "Cleaned up old backups"

cd "$PROJECT_DIR" || exit 1

##############################################################################
# Git Pull
##############################################################################

log "Pulling latest changes from Git..."

# Stash any local changes
git stash save "Auto-stash before deployment $TIMESTAMP" || true

# Fetch latest changes
git fetch origin

# Get current commit
OLD_COMMIT=$(git rev-parse HEAD)
log "Current commit: $OLD_COMMIT"

# Pull latest changes
git pull origin "$BRANCH"

# Get new commit
NEW_COMMIT=$(git rev-parse HEAD)
log "New commit: $NEW_COMMIT"

if [ "$OLD_COMMIT" == "$NEW_COMMIT" ]; then
    info "No new changes detected. Continuing anyway..."
else
    log "Changes detected. Deploying new version..."
fi

##############################################################################
# Install Dependencies
##############################################################################

log "Installing/updating dependencies..."

# Use nvm to ensure correct Node version
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node 22
nvm use 22 || {
    warn "Node 22 not found, installing..."
    nvm install 22
    nvm use 22
}

log "Using Node $(node --version) and npm $(npm --version)"

# Install dependencies with npm
npm ci --production=false || {
    error "npm install failed"
    exit 1
}

log "Dependencies installed successfully"

##############################################################################
# Database Migrations
##############################################################################

log "Running database migrations..."

# Generate Prisma Client
npx prisma generate || {
    error "Prisma generate failed"
    exit 1
}

# Run migrations
npx prisma migrate deploy || {
    error "Database migration failed"
    exit 1
}

log "Database migrations completed"

##############################################################################
# Build Application
##############################################################################

log "Building Next.js application..."

# Clean previous build
rm -rf .next

# Build the application
npm run build || {
    error "Build failed"
    exit 1
}

log "Build completed successfully"

##############################################################################
# Docker Operations
##############################################################################

log "Restarting Docker containers..."

# Stop containers
docker compose down || warn "Failed to stop containers"

# Remove old images (optional - uncomment if needed)
# docker compose build --no-cache

# Rebuild and start containers
docker compose build || {
    error "Docker build failed"
    exit 1
}

docker compose up -d || {
    error "Failed to start containers"
    exit 1
}

log "Docker containers restarted"

# Wait for containers to be healthy
sleep 10

# Check container status
docker compose ps

##############################################################################
# Nginx Restart
##############################################################################

log "Restarting Nginx..."

# Test nginx configuration
nginx -t || {
    error "Nginx configuration test failed"
    exit 1
}

# Reload nginx
systemctl reload nginx || systemctl restart nginx || {
    error "Nginx restart failed"
    exit 1
}

log "Nginx restarted successfully"

##############################################################################
# Health Checks
##############################################################################

log "Performing health checks..."

# Wait a bit for services to start
sleep 5

# Check if web container is running
if docker compose ps | grep -q "web.*Up"; then
    log "✓ Web container is running"
else
    error "✗ Web container is not running"
    docker compose logs web | tail -n 50
    exit 1
fi

# Check if database is accessible
if docker compose exec -T db pg_isready -U transferuser > /dev/null 2>&1; then
    log "✓ Database is accessible"
else
    warn "✗ Database health check failed"
fi

# Check HTTP endpoint
if curl -f -s http://localhost:3000/api/healthz > /dev/null 2>&1; then
    log "✓ Application is responding"
else
    warn "✗ Application health check failed"
fi

##############################################################################
# Post-Deployment Tasks
##############################################################################

log "Running post-deployment tasks..."

# Clear old logs (keep last 7 days)
find /var/log -name "transfer-advising-form*.log" -mtime +7 -delete 2>/dev/null || true

# Set proper permissions
chown -R www-data:www-data "$PROJECT_DIR/.next" 2>/dev/null || true

log "Post-deployment tasks completed"

##############################################################################
# Deployment Summary
##############################################################################

echo ""
echo "=============================================="
log "DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "=============================================="
echo ""
info "Deployment Details:"
info "  - Previous commit: $OLD_COMMIT"
info "  - Current commit:  $NEW_COMMIT"
info "  - Backup location: $BACKUP_FILE"
info "  - Deployment time: $(date)"
echo ""
info "Container Status:"
docker compose ps
echo ""
info "Application URLs:"
info "  - App: http://$(hostname -I | awk '{print $1}'):3000"
info "  - Admin: http://$(hostname -I | awk '{print $1}'):3000/admin"
echo ""
log "Check logs with: docker compose logs -f web"
echo "=============================================="

exit 0
