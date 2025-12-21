#!/bin/sh
# Run database migrations
echo "Running database migrations..."
bun run db:migrate

# Start the application
echo "Starting application..."
bun run src/index.ts
