// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "ft1qnc", // opsional, hanya jika pakai Cypress Cloud

  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.{js,ts}",
    experimentalRunAllSpecs: true,
    testIsolation: true,

    // Timeout yang realistis untuk lingkungan dev lokal
    defaultCommandTimeout: 5000, // 10 detik
    pageLoadTimeout: 60000, // 60 detik (Next.js dev bisa lambat saat cold start)
    requestTimeout: 5000,
    responseTimeout: 30000,

    // Viewport untuk desktop (default) — tambahkan test mobile terpisah jika perlu
    viewportWidth: 1280,
    viewportHeight: 720,

    // Rekam video hanya saat diperlukan (nonaktifkan di dev lokal untuk hemat waktu)
    video: false,

    // Ambil screenshot saat test gagal
    screenshotOnRunFailure: true,

    setupNodeEvents(on, config) {
      // Tambahkan event jika perlu (misal: log, custom task)
      // Contoh: on('task', { ... })
      return config;
    },
  },

  // Variabel lingkungan untuk akses backend & data test
  env: {
    apiUrl: "http://localhost:3001",
    EMAIL_USER: "user@example.com",
    PASSWORD_USER: "password",
    EMAIL_ADMIN: "admin@example.com",
    PASSWORD_ADMIN: "password",
  },

  // Opsional: konfigurasi komponen jika Anda ingin tambahkan Component Testing
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
