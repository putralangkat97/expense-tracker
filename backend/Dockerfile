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

RUN mkdir -p /app/data \
    && chmod 777 /app/data

USER 1000:1000
EXPOSE 3000
CMD ["/app/server"]
