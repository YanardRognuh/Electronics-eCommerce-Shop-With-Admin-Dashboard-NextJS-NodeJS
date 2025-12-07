FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install ALL dependencies (including devDependencies)
RUN npm ci
COPY . .
# This runs: prisma generate && next build --no-lint
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy environment file
COPY .env.docker .env

# IMPORTANT: Copy ALL node_modules from BUILDER (not deps)
# This includes the generated Prisma Client
COPY --from=builder /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy prisma schema
COPY --from=builder /app/prisma ./prisma

# Copy package files
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "start"]