FROM oven/bun:1 AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production=false

# Copy source + migrations
COPY src/ ./src/
COPY drizzle/ ./drizzle/
COPY drizzle.config.ts tsconfig.json ./

# Build production binary
RUN bun build --compile \
  --minify \
  --target bun \
  --outfile /dist/server \
  src/index.ts

# Production runtime
FROM oven/bun:1-slim
WORKDIR /app

# Copy compiled binary
COPY --from=builder /dist/server /app/server

# Create data dir
RUN mkdir -p /app/data && chown bun:bun /app/data

# Runtime deps only
USER bun
EXPOSE 3000
CMD ["/app/server"]
