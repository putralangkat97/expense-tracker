FROM oven/bun:1 AS builder

WORKDIR /app
COPY package.json bun.lock ./
# Fixed: use --production to skip dev deps in prod, omit for build stage
RUN bun install --frozen-lockfile

# Copy source + migrations + config
COPY src/ ./src/
COPY drizzle/ ./drizzle/
COPY drizzle.config.ts tsconfig.json ./

# Build production binary
RUN bun build --compile \
    --minify \
    --target bun \
    --outfile /dist/server \
    src/index.ts

# Production runtime (minimal)
FROM oven/bun:1-slim
WORKDIR /app

# Copy only compiled binary
COPY --from=builder /dist/server /app/server

# Create data dir
RUN mkdir -p /app/data && chown 1000:1000 /app/data

# Runtime deps only (no dev deps)
USER 1000
EXPOSE 3000
CMD ["/app/server"]
