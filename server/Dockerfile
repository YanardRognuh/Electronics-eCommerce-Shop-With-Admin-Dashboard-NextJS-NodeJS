# server/Dockerfile - Multi-stage Build (RECOMMENDED)
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies untuk build
COPY package*.json ./
RUN npm ci

# Copy prisma schema dan generate
COPY prisma ./prisma
RUN npx prisma generate

# Copy semua files
COPY . .

# --- Production Stage ---
FROM node:20-alpine AS runner

# Install netcat untuk health check
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy generated Prisma Client dari builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy prisma schema
COPY --from=builder /app/prisma ./prisma

# Copy application files
COPY --from=builder /app/*.js ./
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/middlewares ./middlewares
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/utills ./utills
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/start.sh ./start.sh

# Set permissions
RUN chmod +x start.sh && sed -i 's/\r$//' start.sh

EXPOSE 3001

CMD ["sh", "start.sh"]