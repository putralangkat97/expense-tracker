#!/bin/bash
set -e

echo "🔄 Setting up PostgreSQL..."

# Create database
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'expense_tracker'" | grep -q 1 || \
psql -U postgres -c "CREATE DATABASE expense_tracker;"

# Create user (jika pakai elysia_api user)
psql -U postgres -tc "SELECT 1 FROM pg_user WHERE usename = 'elysia_api'" | grep -q 1 || \
psql -U postgres -c "CREATE USER elysia_api WITH PASSWORD 'Hl+M8Th6145p9sl8';"

# Grant privileges
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE expense_tracker TO elysia_api;"

echo "✅ Database & user setup complete!"
