FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy all application files
COPY . .

# --- Production Stage ---
FROM node:20-alpine AS runner

# Install netcat for health checks
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy generated Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy prisma schema (needed for migrations)
COPY --from=builder /app/prisma ./prisma

# Copy root JS files
COPY --from=builder /app/*.js ./

# Copy application directories
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/services ./services
COPY --from=builder /app/utills ./utills

# Copy scripts if needed at runtime
COPY --from=builder /app/scripts ./scripts

# Copy start.sh
COPY --from=builder /app/start.sh ./start.sh

# Make start.sh executable and fix line endings
RUN chmod +x start.sh && \
    sed -i 's/\r$//' start.sh

# Create logs directory
RUN mkdir -p logs

EXPOSE 3001

CMD ["sh", "start.sh"]