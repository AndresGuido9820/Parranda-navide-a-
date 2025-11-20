#!/bin/bash
set -e

echo "Starting Parranda Navideña API..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! pg_isready -h db -p 5432 -U parranda_user -d parranda; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

# Run Alembic migrations
echo "Running database migrations..."
alembic upgrade head

# Start the application
echo "Starting FastAPI application..."
exec uvicorn app.interface.main_app:app --host 0.0.0.0 --port 8000 --reload
