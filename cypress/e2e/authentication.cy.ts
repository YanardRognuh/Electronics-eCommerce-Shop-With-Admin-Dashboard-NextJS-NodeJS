// cypress/e2e/user/01-authentication.cy.ts

describe("User Authentication", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe("Registration", () => {
    it("should display registration page correctly", () => {
      cy.visit("/register");
      cy.waitForPageLoad();

      // Verify page elements
      cy.get('[data-testid="register-page-title"]').should("be.visible");
      cy.get('[data-testid="register-form"]').should("be.visible");
      cy.get('[data-testid="register-name-input"]').should("be.visible");
      cy.get('[data-testid="register-lastname-input"]').should("be.visible");
      cy.get('[data-testid="register-email-input"]').should("be.visible");
      cy.get('[data-testid="register-password-input"]').should("be.visible");
      cy.get('[data-testid="register-confirm-password-input"]').should(
        "be.visible"
      );
      cy.get('[data-testid="register-terms-checkbox"]').should("be.visible");
      cy.get('[data-testid="register-submit-button"]').should("be.visible");
    });

    it("should successfully register a new user", () => {
      const timestamp = Date.now();
      const testUser = {
        name: "Test",
        lastname: "User",
        email: `testuser${timestamp}@example.com`,
        password: "SecurePass123!",
      };

      cy.registerUser(
        testUser.name,
        testUser.lastname,
        testUser.email,
        testUser.password
      );

      // Should redirect to login or home page after successful registration
      cy.url().should("not.include", "/register");
    });

    it("should show error for mismatched passwords", () => {
      cy.visit("/register");
      cy.waitForPageLoad();

      cy.get('[data-testid="register-name-input"]').type("Test");
      cy.get('[data-testid="register-lastname-input"]').type("User");
      cy.get('[data-testid="register-email-input"]').type("test@example.com");
      cy.get('[data-testid="register-password-input"]').type("password123");
      cy.get('[data-testid="register-confirm-password-input"]').type(
        "different456"
      );
      cy.get('[data-testid="register-terms-checkbox"]').check();

      cy.get('[data-testid="register-submit-button"]').click();

      // Should show error message
      cy.get('[data-testid="register-error-message"]').should("be.visible");
    });

    it("should require terms and conditions acceptance", () => {
      cy.visit("/register");
      cy.waitForPageLoad();

      cy.get('[data-testid="register-name-input"]').type("Test");
      cy.get('[data-testid="register-lastname-input"]').type("User");
      cy.get('[data-testid="register-email-input"]').type("test@example.com");
      cy.get('[data-testid="register-password-input"]').type("password123");
      cy.get('[data-testid="register-confirm-password-input"]').type(
        "password123"
      );

      // Don't check terms checkbox
      cy.get('[data-testid="register-submit-button"]').click();

      // Should not redirect (stay on register page)
      cy.url().should("include", "/register");
    });

    it("should validate email format", () => {
      cy.visit("/register");
      cy.waitForPageLoad();

      cy.get('[data-testid="register-name-input"]').type("Test");
      cy.get('[data-testid="register-lastname-input"]').type("User");
      cy.get('[data-testid="register-email-input"]').type("invalid-email");
      cy.get('[data-testid="register-password-input"]').type("password123");
      cy.get('[data-testid="register-confirm-password-input"]').type(
        "password123"
      );
      cy.get('[data-testid="register-terms-checkbox"]').check();

      cy.get('[data-testid="register-submit-button"]').click();

      // Should show validation error or stay on page
      cy.url().should("include", "/register");
    });
  });

  describe("Login", () => {
    it("should display login page correctly", () => {
      cy.visit("/login");
      cy.waitForPageLoad();

      // Verify page elements
      cy.get('[data-testid="login-page-title"]').should("be.visible");
      cy.get('[data-testid="login-form"]').should("be.visible");
      cy.get('[data-testid="login-email-input"]').should("be.visible");
      cy.get('[data-testid="login-password-input"]').should("be.visible");
      cy.get('[data-testid="remember-me-checkbox"]').should("be.visible");
      cy.get('[data-testid="forgot-password-link"]').should("be.visible");
      cy.get('[data-testid="login-submit-button"]').should("be.visible");
      cy.get('[data-testid="google-login-button"]').should("be.visible");
      cy.get('[data-testid="github-login-button"]').should("be.visible");
    });

    it("should successfully login with valid credentials", () => {
      cy.loginAsUser();
      cy.visit("/");
      cy.waitForPageLoad();

      // Should be on home page (logged in)
      cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    });

    it("should show error for invalid credentials", () => {
      cy.visit("/login");
      cy.waitForPageLoad();

      cy.get('[data-testid="login-email-input"]').type("wrong@example.com");
      cy.get('[data-testid="login-password-input"]').type("wrongpassword");
      cy.get('[data-testid="login-submit-button"]').click();

      // Should show error message
      cy.get('[data-testid="login-error-message"]').should("be.visible");
      cy.url().should("include", "/login");
    });

    it("should validate required fields", () => {
      cy.visit("/login");
      cy.waitForPageLoad();

      // Try to submit without filling fields
      cy.get('[data-testid="login-submit-button"]').click();

      // Should stay on login page
      cy.url().should("include", "/login");
    });

    it("should remember user when checkbox is checked", () => {
      cy.visit("/login");
      cy.waitForPageLoad();

      cy.get('[data-testid="login-email-input"]').type(
        Cypress.env("EMAIL_USER")
      );
      cy.get('[data-testid="login-password-input"]').type(
        Cypress.env("PASSWORD_USER")
      );
      cy.get('[data-testid="remember-me-checkbox"]').check();

      // Verify checkbox is checked before submitting
      cy.get('[data-testid="remember-me-checkbox"]').should("be.checked");

      cy.get('[data-testid="login-submit-button"]').click();

      cy.url().should("not.include", "/login");
    });

    it("should navigate to forgot password page", () => {
      cy.visit("/login");
      cy.waitForPageLoad();

      cy.get('[data-testid="forgot-password-link"]').click();

      // Should navigate to forgot password or show modal
      cy.url().should("not.include", "/login");
    });
  });

  describe("Session Management", () => {
    it("should maintain session after page refresh", () => {
      cy.loginAsUser();
      cy.visit("/");
      cy.waitForPageLoad();

      // Refresh the page
      cy.reload();
      cy.waitForPageLoad();

      // User should still be logged in
      cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    });

    it("should redirect to login when accessing protected routes without authentication", () => {
      cy.visit("/checkout", { failOnStatusCode: false });
      cy.waitForPageLoad();

      // Should redirect to login
      cy.url().should("include", "/login");
    });
  });
});
