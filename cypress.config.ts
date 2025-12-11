// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "ft1qnc",
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.{js,ts}",
    testIsolation: true,

    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 10000,
    responseTimeout: 30000,

    viewportWidth: 1024,
    viewportHeight: 768,

    video: false,
    screenshotOnRunFailure: true,

    setupNodeEvents(on, config) {
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
      });

      return config;
    },
  },

  env: {
    apiUrl: "http://localhost:3001",
    EMAIL_USER: "user@example.com",
    PASSWORD_USER: "password",
    EMAIL_ADMIN: "admin@example.com",
    PASSWORD_ADMIN: "password",
  },
});
