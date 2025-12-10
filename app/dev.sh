#!/bin/bash

# Parranda Navideña - Development Script

echo "🚀 Starting Parranda Navideña Development Environment"

# Function to show help
show_help() {
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Start all services (database, pgAdmin, app)"
    echo "  stop      - Stop all services"
    echo "  restart   - Restart all services"
    echo "  build     - Build the application image"
    echo "  logs      - Show application logs"
    echo "  db-logs   - Show database logs"
    echo "  shell     - Open shell in app container"
    echo "  migrate   - Run database migrations"
    echo "  seed      - Seed database with test data"
    echo "  clean     - Clean up containers and volumes"
    echo "  status    - Show status of all services"
    echo "  diagnose  - Diagnose common issues"
    echo "  help      - Show this help message"
}

# Function to start services
start_services() {
    echo "📦 Starting services..."
    
    # First, build the image to catch any build errors
    echo "🔨 Building application image..."
    if ! docker compose -f docker-compose.yml build app; then
        echo "❌ Failed to build with docker compose!"
        echo "🔄 Trying with buildx..."
        if ! docker buildx build --tag parranda-app:latest .; then
            echo "❌ Failed to build application image!"
            echo "💡 Try running: ./dev.sh clean && ./dev.sh build"
            exit 1
        fi
    fi
    
    # Start all services
    if ! docker compose -f docker-compose.yml up -d; then
        echo "❌ Failed to start services!"
        echo "💡 Try running: ./dev.sh clean && ./dev.sh start"
        exit 1
    fi
    
    # Wait a moment for services to start
    echo "⏳ Waiting for services to start..."
    sleep 5
    
    # Check if services are running
    if ! docker compose -f docker-compose.yml ps | grep -q "Up"; then
        echo "❌ Some services failed to start!"
        echo "📋 Checking logs..."
        docker compose -f docker-compose.yml logs
        exit 1
    fi
    
    echo "✅ Services started successfully!"
    echo ""
    echo "🌐 Application: http://localhost:8000"
    echo "📊 API Docs: http://localhost:8000/docs"
    echo "🗄️  pgAdmin: http://localhost:5050"
    echo "   Email: admin@parranda.com"
    echo "   Password: admin123"
    echo "   Database: parranda"
    echo "   Host: db"
    echo "   Port: 5432"
    echo "   Username: parranda_user"
    echo "   Password: parranda_pass"
    echo ""
    echo "📋 To view logs: ./dev.sh logs"
    echo "🛑 To stop: ./dev.sh stop"
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping services..."
    docker compose -f docker-compose.yml down
    echo "✅ Services stopped!"
}

# Function to restart services
restart_services() {
    echo "🔄 Restarting services..."
    docker compose -f docker-compose.yml restart
    echo "✅ Services restarted!"
}

# Function to build image
build_image() {
    echo "🔨 Building application image..."
    
    # Clean up any existing containers
    echo "🧹 Cleaning up existing containers..."
    docker compose -f docker-compose.yml down
    
    # Build with no cache to ensure fresh build
    if ! docker compose -f docker-compose.yml build --no-cache app; then
        echo "❌ Failed to build with docker compose!"
        echo "🔄 Trying with buildx..."
        if ! docker buildx build --tag parranda-app:latest .; then
            echo "❌ Failed to build application image!"
            echo "💡 Try running: ./dev.sh clean && ./dev.sh build"
            exit 1
        fi
    fi
    
    echo "✅ Image built successfully!"
}

# Function to show logs
show_logs() {
    echo "📋 Showing application logs..."
    docker compose -f docker-compose.yml logs -f app
}

# Function to show database logs
show_db_logs() {
    echo "📋 Showing database logs..."
    docker compose -f docker-compose.yml logs -f db
}

# Function to open shell
open_shell() {
    echo "🐚 Opening shell in app container..."
    docker compose -f docker-compose.yml exec app bash
}

# Function to run migrations
run_migrations() {
    echo "🗄️ Running database migrations..."
    docker compose -f docker-compose.yml exec app alembic upgrade head
    echo "✅ Migrations completed!"
}

# Function to seed database
seed_database() {
    echo "🌱 Seeding database with test data..."
    docker compose -f docker-compose.yml exec app python -m scripts.seed_all
    echo "✅ Database seeded!"
}

# Function to clean up
clean_up() {
    echo "🧹 Cleaning up containers and volumes..."
    docker compose -f docker-compose.yml down -v
    docker system prune -f
    echo "✅ Cleanup completed!"
}

# Function to show status
show_status() {
    echo "📊 Service Status:"
    echo "=================="
    docker compose -f docker-compose.yml ps
    echo ""
    echo "🐳 Docker Images:"
    echo "================="
    docker images | grep -E "(parranda|postgres|pgadmin)"
}

# Function to diagnose issues
diagnose() {
    echo "🔍 Diagnosing common issues..."
    echo "=============================="
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        echo "❌ Docker is not running!"
        echo "💡 Start Docker service: sudo systemctl start docker"
        return 1
    fi
    
    # Check if docker compose is available
    if ! docker compose version >/dev/null 2>&1; then
        echo "❌ docker compose plugin is not installed!"
        echo "💡 Install: sudo apt install docker-compose-plugin"
        return 1
    fi
    
    # Check if files exist
    if [ ! -f "docker-compose.yml" ]; then
        echo "❌ docker-compose.yml not found!"
        return 1
    fi
    
    if [ ! -f "Dockerfile" ]; then
        echo "❌ Dockerfile not found!"
        return 1
    fi
    
    if [ ! -f "requirements.txt" ]; then
        echo "❌ requirements.txt not found!"
        return 1
    fi
    
    # Check port availability
    if netstat -tuln | grep -q ":8000 "; then
        echo "⚠️  Port 8000 is already in use!"
        echo "💡 Stop other services using port 8000"
    fi
    
    if netstat -tuln | grep -q ":5433 "; then
        echo "⚠️  Port 5433 is already in use!"
        echo "💡 Stop other PostgreSQL services using port 5433"
    fi
    
    echo "✅ Basic checks passed!"
    echo ""
    echo "📋 Current service status:"
    docker compose -f docker-compose.yml ps
}

# Main script logic
case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    build)
        build_image
        ;;
    logs)
        show_logs
        ;;
    db-logs)
        show_db_logs
        ;;
    shell)
        open_shell
        ;;
    migrate)
        run_migrations
        ;;
    seed)
        seed_database
        ;;
    clean)
        clean_up
        ;;
    status)
        show_status
        ;;
    diagnose)
        diagnose
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
