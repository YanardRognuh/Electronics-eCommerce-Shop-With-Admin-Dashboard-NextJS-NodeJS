// cypress/support/e2e.ts

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Handle uncaught exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // Only use this for known non-critical errors
  console.error("Uncaught exception:", err.message);

  // You can add specific error messages to ignore
  if (err.message.includes("ResizeObserver")) {
    return false;
  }

  // Allow other errors to fail the test
  return true;
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
