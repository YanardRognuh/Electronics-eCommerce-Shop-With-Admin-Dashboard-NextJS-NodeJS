#!/bin/sh
# server/start.sh

# Tunggu database siap (opsional tapi disarankan)
echo "⏳ Waiting for MySQL..."
while ! nc -z db 3306; do
  sleep 1
done
echo "✅ MySQL is ready!"

# Jalankan migrasi & seed
npx prisma migrate deploy
node utills/insertDemoData.js

# Jalankan app
exec node app.js