// cypress/support/e2e.ts

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Handle uncaught exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
  // Ignore CORS dan fetch errors
  if (
    err.message.includes("Failed to fetch") ||
    err.message.includes("CORS") ||
    err.message.includes("NetworkError") ||
    err.message.includes("Load failed")
  ) {
    console.log("⚠️ Ignored network error:", err.message);
    return false; // Prevent Cypress from failing
  }

  // Let other errors fail the test
  return true;
});

declare global {
  namespace Cypress {
    interface Chainable {
      waitForBackend(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("waitForBackend", () => {
  cy.request({
    url: `${Cypress.env("apiUrl")}/health`,
    failOnStatusCode: false,
    timeout: 10000,
    retryOnStatusCodeFailure: true,
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});

// Hanya clear session untuk test authentication
// Test lain akan tetap maintain session
beforeEach(() => {
  // Ambil nama file test yang sedang berjalan
  const testFile = Cypress.spec.name;

  // Hanya clear jika test authentication
  if (testFile.includes("authentication")) {
    cy.clearCookies();
    cy.clearLocalStorage();
  }
});
