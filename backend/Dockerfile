FROM oven/bun:1 AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY src/ ./src/
COPY drizzle/ ./drizzle/
COPY drizzle.config.ts tsconfig.json ./

RUN bun build --compile \
    --minify \
    --target bun \
    --outfile /dist/server \
    src/index.ts

# Production runtime
FROM oven/bun:1-slim
WORKDIR /app

COPY --from=builder /dist/server /app/server

# Fix permissions: create dir owned by runtime user
RUN mkdir -p /app/data \
    && chown -R 1000:1000 /app/data \
    && chmod 755 /app/data

# Switch to non-root user
USER 1000:1000
EXPOSE 3000
CMD ["/app/server"]
