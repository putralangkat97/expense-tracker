FROM oven/bun:1

WORKDIR /app

# Copy deps first
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY src/ ./src/
COPY drizzle/ ./drizzle/
COPY drizzle.config.ts tsconfig.json ./

# Create data dir with proper perms BEFORE runtime
RUN mkdir -p /data && chmod 777 /data

# Run directly (not compiled)
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun run --eval "fetch('http://localhost:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1))" || exit 1

CMD ["bun", "run", "src/index.ts"]
