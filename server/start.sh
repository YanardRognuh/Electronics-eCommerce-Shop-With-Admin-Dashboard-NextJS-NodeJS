#!/bin/sh
# server/start.sh

set -e  # Exit on error

echo "⏳ Waiting for MySQL to be ready..."

# Wait for MySQL to be available
max_retries=30
retry_count=0

while ! nc -z db 3306; do
  retry_count=$((retry_count + 1))
  if [ $retry_count -gt $max_retries ]; then
    echo "❌ MySQL failed to start after $max_retries attempts"
    exit 1
  fi
  echo "Attempt $retry_count/$max_retries - MySQL not ready yet..."
  sleep 2
done

echo "✅ MySQL is ready!"

# Generate Prisma Client (ensure it's available)
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy || echo "⚠️  No migrations to apply"

# Seed database (optional)
if [ -f "utils/insertDemoData.js" ]; then
  echo "🌱 Seeding database..."
  node utils/insertDemoData.js || echo "⚠️  Seeding skipped"
elif [ -f "utills/insertDemoData.js" ]; then
  echo "🌱 Seeding database..."
  node utills/insertDemoData.js || echo "⚠️  Seeding skipped"
fi

# Start the application
echo "🚀 Starting backend server..."
exec node app.js
