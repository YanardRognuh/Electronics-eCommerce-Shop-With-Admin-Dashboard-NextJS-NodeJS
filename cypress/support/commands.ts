// Custom Commands untuk Singitronic E-commerce

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login sebagai user
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Login sebagai admin
       * @example cy.loginAsAdmin()
       */
      loginAsAdmin(): Chainable<void>;

      /**
       * Logout dari aplikasi
       * @example cy.logout()
       */
      logout(): Chainable<void>;
    }
  }
}

// Command untuk login user
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit("/login");

    // Isi form login menggunakan data-testid yang sudah ada
    cy.get('[data-testid="login-email-input"]').type(email);
    cy.get('[data-testid="login-password-input"]').type(password);
    cy.get('[data-testid="login-submit-button"]').click();

    // Tunggu sampai redirect selesai
    cy.url().should("not.include", "/login");
  });
});

// Command untuk login sebagai admin
Cypress.Commands.add("loginAsAdmin", () => {
  cy.login("admin@example.com", "password");
});

// Command untuk logout
Cypress.Commands.add("logout", () => {
  // Klik user profile trigger di admin header
  cy.get('[data-testid="admin-user-profile-trigger"]').click();

  // Klik logout link
  cy.get('[data-testid="admin-logout-link"]').click();

  // Verifikasi sudah logout (redirect ke login atau home)
  cy.url().should("match", /\/(login)?$/);
});

export {};
