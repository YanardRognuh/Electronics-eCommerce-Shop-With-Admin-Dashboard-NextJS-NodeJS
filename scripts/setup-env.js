// scripts/setup-env.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Starting environment setup...\n");

// Konfigurasi umum
const DB_URL_DOCKER =
  "mysql://root:rootpass@db:3306/singitronic_nextjs?sslmode=disabled";
const DB_URL_LOCAL =
  "mysql://root@localhost:3306/singitronic_nextjs?sslmode=disabled";
const NEXTAUTH_SECRET = "12D16C923BA17672F89B18C1DB22A";

// 1. .env (root) — untuk mode manual (XAMPP)
const rootEnv = `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
DATABASE_URL="${DB_URL_LOCAL}"
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
`;

// 2. server/.env — untuk mode manual
const serverEnv = `DATABASE_URL="${DB_URL_LOCAL}"
NODE_ENV=development
PORT=3001
`;

// 3. .env.docker — digunakan oleh Docker
const dockerEnv = `DATABASE_URL=${DB_URL_DOCKER}
API_BASE_URL=http://backend:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=production
`;

// 4. server/start.sh - Startup script untuk backend
const startSh = `#!/bin/sh
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

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy || true

# Seed database (optional)
if [ -f "utils/insertDemoData.js" ]; then
  echo "🌱 Seeding database..."
  node utils/insertDemoData.js || true
fi

# Start the application
echo "🚀 Starting backend server..."
exec node app.js
`;

// Buat folder jika belum ada
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
};

ensureDir("server");
ensureDir("scripts");

// Tulis file dengan LF line endings (bukan CRLF)
const writeFile = (filepath, content) => {
  // Normalize line endings to LF
  const normalized = content.replace(/\r\n/g, "\n");
  fs.writeFileSync(filepath, normalized, { encoding: "utf8" });
  console.log(`✅ Created: ${filepath}`);
};

writeFile(".env", rootEnv);
writeFile("server/.env", serverEnv);
writeFile(".env.docker", dockerEnv);
writeFile("server/start.sh", startSh);

// Make start.sh executable (Unix/Mac only)
if (process.platform !== "win32") {
  try {
    execSync("chmod +x server/start.sh");
    console.log("✅ Made start.sh executable");
  } catch (err) {
    console.log(
      "⚠️  Could not set executable permission (not critical for Docker)"
    );
  }
}

console.log("\n✅ Environment setup completed!");
console.log("\n📋 Files created:");
console.log("   - .env (for local development)");
console.log("   - server/.env (for backend)");
console.log("   - .env.docker (for Docker)");
console.log("   - server/start.sh (backend startup script)");
console.log("\n🐳 Next steps:");
console.log("   1. Review the .env files");
console.log("   2. Run: docker-compose build");
console.log("   3. Run: docker-compose up");
console.log("\n📝 For local development:");
console.log("   1. Start MySQL locally");
console.log("   2. Run: npm run dev");
console.log("   3. Run: cd server && npm run dev\n");
