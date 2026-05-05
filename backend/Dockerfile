# Stage 1: Install dependencies
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# Stage 2: Production image
FROM node:18-alpine
WORKDIR /app

# Copy dependencies dari stage 1
COPY --from=builder /app/node_modules ./node_modules

# Copy source code
COPY . .

# Jalankan sebagai non-root user (keamanan)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

# Health check untuk ECS
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O - http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]
