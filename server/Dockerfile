FROM node:20-alpine

# Install netcat for health checks
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Make start.sh executable and ensure LF line endings
RUN chmod +x start.sh && \
    # Convert CRLF to LF if needed
    sed -i 's/\r$//' start.sh

EXPOSE 3001

# Use start.sh as entrypoint
CMD ["sh", "start.sh"]