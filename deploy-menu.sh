#!/bin/bash

# Production Deployment Script
# This script helps with manual deployment tasks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_IMAGE="transfer-advising-form"
COMPOSE_FILE="docker-compose.yml"

# Helper functions
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}  ${1}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_success "Docker is installed"
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_success "Docker Compose is installed"
    
    if [ ! -f "$COMPOSE_FILE" ]; then
        print_error "docker-compose.yml not found"
        exit 1
    fi
    print_success "docker-compose.yml found"
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found - make sure environment variables are set"
    else
        print_success ".env file found"
    fi
}

# Build Docker image
build_image() {
    print_header "Building Docker Image"
    print_info "Building image: $DOCKER_IMAGE"
    
    docker-compose build --no-cache
    
    print_success "Docker image built successfully"
}

# Run database migrations
run_migrations() {
    print_header "Running Database Migrations"
    print_info "Applying Prisma migrations..."
    
    docker-compose exec -T app npx prisma migrate deploy
    
    print_success "Migrations completed"
}

# Start services
start_services() {
    print_header "Starting Services"
    print_info "Starting all services..."
    
    docker-compose up -d
    
    print_success "Services started"
    
    # Wait for services to be healthy
    print_info "Waiting for services to be healthy..."
    sleep 10
    
    docker-compose ps
}

# Stop services
stop_services() {
    print_header "Stopping Services"
    print_info "Stopping all services..."
    
    docker-compose down
    
    print_success "Services stopped"
}

# Restart services
restart_services() {
    print_header "Restarting Services"
    
    stop_services
    start_services
}

# View logs
view_logs() {
    print_header "Viewing Logs"
    print_info "Showing last 100 lines (Ctrl+C to exit)..."
    
    docker-compose logs -f --tail=100
}

# Check health
check_health() {
    print_header "Health Check"
    
    # Check if containers are running
    print_info "Checking container status..."
    docker-compose ps
    
    # Try health endpoint
    print_info "Checking health endpoint..."
    if curl -f http://localhost:3000/api/healthz &> /dev/null; then
        print_success "Application is healthy"
    else
        print_warning "Health check endpoint not responding"
    fi
    
    # Check database connection
    print_info "Checking database connection..."
    if docker-compose exec -T app npx prisma db pull &> /dev/null; then
        print_success "Database connection successful"
    else
        print_warning "Database connection failed"
    fi
}

# Backup database
backup_database() {
    print_header "Database Backup"
    
    BACKUP_DIR="./backups"
    mkdir -p "$BACKUP_DIR"
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"
    
    print_info "Creating backup: $BACKUP_FILE"
    
    docker-compose exec -T postgres pg_dump -U postgres transfer_advising > "$BACKUP_FILE"
    
    # Compress backup
    gzip "$BACKUP_FILE"
    
    print_success "Backup created: ${BACKUP_FILE}.gz"
    
    # Show backup size
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
    print_info "Backup size: $BACKUP_SIZE"
}

# Restore database
restore_database() {
    print_header "Database Restore"
    
    # List available backups
    print_info "Available backups:"
    ls -lh ./backups/*.sql.gz 2>/dev/null || print_error "No backups found"
    
    echo ""
    read -p "Enter backup filename (e.g., backup_20250114_120000.sql.gz): " BACKUP_FILE
    
    if [ ! -f "./backups/$BACKUP_FILE" ]; then
        print_error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
    
    print_warning "This will replace your current database!"
    read -p "Are you sure? (yes/no): " CONFIRM
    
    if [ "$CONFIRM" != "yes" ]; then
        print_info "Restore cancelled"
        exit 0
    fi
    
    print_info "Restoring from: $BACKUP_FILE"
    
    # Decompress and restore
    gunzip -c "./backups/$BACKUP_FILE" | docker-compose exec -T postgres psql -U postgres transfer_advising
    
    print_success "Database restored successfully"
}

# Clean up old images
cleanup() {
    print_header "Cleanup"
    
    print_info "Removing unused Docker images..."
    docker image prune -f
    
    print_info "Removing old backups (older than 30 days)..."
    find ./backups -name "backup_*.sql.gz" -mtime +30 -delete 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Show menu
show_menu() {
    echo -e "\n${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   Transfer Advising Deployment Menu   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}\n"
    
    echo "1. Build Docker image"
    echo "2. Start services"
    echo "3. Stop services"
    echo "4. Restart services"
    echo "5. View logs"
    echo "6. Run migrations"
    echo "7. Health check"
    echo "8. Backup database"
    echo "9. Restore database"
    echo "10. Cleanup"
    echo "11. Full deployment (build + migrate + start)"
    echo "0. Exit"
    echo ""
}

# Full deployment
full_deployment() {
    print_header "Full Deployment"
    
    check_prerequisites
    backup_database
    build_image
    stop_services
    start_services
    run_migrations
    check_health
    
    print_success "Deployment completed successfully!"
}

# Main script
main() {
    # If arguments provided, run specific command
    if [ $# -gt 0 ]; then
        case "$1" in
            build)
                check_prerequisites
                build_image
                ;;
            start)
                start_services
                ;;
            stop)
                stop_services
                ;;
            restart)
                restart_services
                ;;
            logs)
                view_logs
                ;;
            migrate)
                run_migrations
                ;;
            health)
                check_health
                ;;
            backup)
                backup_database
                ;;
            restore)
                restore_database
                ;;
            cleanup)
                cleanup
                ;;
            deploy)
                full_deployment
                ;;
            *)
                echo "Unknown command: $1"
                echo "Available commands: build, start, stop, restart, logs, migrate, health, backup, restore, cleanup, deploy"
                exit 1
                ;;
        esac
        exit 0
    fi
    
    # Interactive menu
    while true; do
        show_menu
        read -p "Select an option: " choice
        
        case $choice in
            1)
                check_prerequisites
                build_image
                ;;
            2)
                start_services
                ;;
            3)
                stop_services
                ;;
            4)
                restart_services
                ;;
            5)
                view_logs
                ;;
            6)
                run_migrations
                ;;
            7)
                check_health
                ;;
            8)
                backup_database
                ;;
            9)
                restore_database
                ;;
            10)
                cleanup
                ;;
            11)
                full_deployment
                ;;
            0)
                print_info "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid option"
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main "$@"
