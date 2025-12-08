import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "ft1qnc",
  e2e: {
    // URL dasar aplikasi Anda
    baseUrl: "http://localhost:3000",

    // Timeout settings
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,

    // Viewport default
    viewportWidth: 1280,
    viewportHeight: 720,

    // Setup untuk test
    setupNodeEvents(on, config) {
      // implementasi event listeners di sini
    },

    // Untuk screenshot otomatis saat test gagal
    screenshotOnRunFailure: true,

    // Pattern file test
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },

  // Environment variables
  env: {
    apiUrl: "http://localhost:3001", // URL backend Anda
  },
});
