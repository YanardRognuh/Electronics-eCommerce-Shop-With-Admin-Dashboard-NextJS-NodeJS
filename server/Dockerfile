# ./server/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Instal deps dulu (cache-friendly)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Baru copy kode
COPY . .

RUN npx prisma generate

EXPOSE 3001

# Tambahkan di akhir
COPY start.sh ./
RUN chmod +x start.sh
CMD ["./start.sh"]

