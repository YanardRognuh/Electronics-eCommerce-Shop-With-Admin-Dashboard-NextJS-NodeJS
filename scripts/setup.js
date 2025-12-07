// scripts/setup-env.js
const fs = require("fs");
const path = require("path");

// Konfigurasi umum
const DB_URL_DOCKER =
  "mysql://root:rootpass@db:3306/singitronic_nextjs?sslmode=disabled";
const DB_URL_LOCAL =
  "mysql://root@localhost:3306/singitronic_nextjs?sslmode=disabled";
const NEXTAUTH_SECRET = "12D16C923BA17672F89B18C1DB22A";

// 1. .env (root) — untuk mode manual (XAMPP)
const rootEnv =
  `
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
DATABASE_URL="${DB_URL_LOCAL}"
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=http://localhost:3000
`.trim() + "\n";

// 2. server/.env — untuk mode manual
const serverEnv =
  `
DATABASE_URL="${DB_URL_LOCAL}"
NODE_ENV=development
`.trim() + "\n";

// 3. .env.docker — digunakan oleh Docker (dibaca di Dockerfile runner)
const dockerEnv =
  `
DATABASE_URL=${DB_URL_DOCKER}
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=production
`.trim() + "\n";

// Buat folder jika belum ada
if (!fs.existsSync("server")) fs.mkdirSync("server");
if (!fs.existsSync("scripts")) fs.mkdirSync("scripts");

// Tulis file
fs.writeFileSync(".env", rootEnv);
fs.writeFileSync("server/.env", serverEnv);
fs.writeFileSync(".env.docker", dockerEnv);

console.log("✅ File environment berhasil dibuat:");
console.log("   - .env (untuk development manual)");
console.log("   - server/.env");
console.log("   - .env.docker (untuk Docker)");
