# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --production

# Copy source code
COPY . .

# Expose the port
EXPOSE 3001

# Ensure data directory exists
RUN mkdir -p /app/data

# Entrypoint to run migrations and then start the server
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
