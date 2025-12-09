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

// Before each test, clear cookies and local storage
beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
