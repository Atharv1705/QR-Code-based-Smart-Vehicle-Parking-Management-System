#!/bin/bash

# Smart Parking Management System Deployment Script
# This script handles the deployment of the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="smart-parking"
BACKUP_DIR="./backups"
LOG_FILE="./deploy.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    success "Prerequisites check passed"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    
    mkdir -p $BACKUP_DIR
    mkdir -p ./data
    mkdir -p ./logs
    mkdir -p ./monitoring
    
    success "Directories created"
}

# Backup existing data
backup_data() {
    if [ -f "./data/parking_system.db" ]; then
        log "Backing up existing database..."
        cp ./data/parking_system.db $BACKUP_DIR/parking_system_$(date +%Y%m%d_%H%M%S).db
        success "Database backed up"
    else
        log "No existing database found, skipping backup"
    fi
}

# Build and deploy
deploy() {
    log "Starting deployment..."
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose down || true
    
    # Build and start new containers
    log "Building and starting containers..."
    docker-compose up --build -d
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        success "Services are running"
    else
        error "Some services failed to start"
    fi
}

# Health check
health_check() {
    log "Performing health checks..."
    
    # Check backend
    if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
        success "Backend is healthy"
    else
        warning "Backend health check failed"
    fi
    
    # Check frontend
    if curl -f http://localhost:80/health > /dev/null 2>&1; then
        success "Frontend is healthy"
    else
        warning "Frontend health check failed"
    fi
}

# Cleanup old images
cleanup() {
    log "Cleaning up old Docker images..."
    docker image prune -f
    success "Cleanup completed"
}

# Main deployment process
main() {
    log "Starting Smart Parking Management System deployment"
    
    check_prerequisites
    create_directories
    backup_data
    deploy
    health_check
    cleanup
    
    success "Deployment completed successfully!"
    log "Application is available at:"
    log "  Frontend: http://localhost:80"
    log "  Backend API: http://localhost:8080/api"
    log "  Health Check: http://localhost:8080/actuator/health"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "stop")
        log "Stopping services..."
        docker-compose down
        success "Services stopped"
        ;;
    "restart")
        log "Restarting services..."
        docker-compose restart
        success "Services restarted"
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "status")
        docker-compose ps
        ;;
    "backup")
        backup_data
        ;;
    *)
        echo "Usage: $0 {deploy|stop|restart|logs|status|backup}"
        exit 1
        ;;
esac