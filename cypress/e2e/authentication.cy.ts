describe("Authentication", () => {
  beforeEach(() => {
    // Bersihkan session sebelum setiap test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe("Login Page", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("Harus menampilkan halaman login dengan benar", () => {
      // Verifikasi elemen halaman login ada
      cy.get('[data-testid="login-page-title"]').should("be.visible");
      cy.get('[data-testid="login-form"]').should("be.visible");
      cy.get('[data-testid="login-email-input"]').should("be.visible");
      cy.get('[data-testid="login-password-input"]').should("be.visible");
      cy.get('[data-testid="login-submit-button"]').should("be.visible");
    });

    it("Harus bisa login sebagai regular user dengan kredensial valid", () => {
      // Isi form login
      cy.get('[data-testid="login-email-input"]').type("user@example.com");
      cy.get('[data-testid="login-password-input"]').type("password");

      // Submit form
      cy.get('[data-testid="login-submit-button"]').click();

      // Verifikasi redirect dari halaman login
      cy.url().should("not.include", "/login");
    });

    it("Harus bisa login sebagai admin dengan kredensial valid", () => {
      cy.get('[data-testid="login-email-input"]').type("admin@example.com");
      cy.get('[data-testid="login-password-input"]').type("password");
      cy.get('[data-testid="login-submit-button"]').click();

      cy.url().should("not.include", "/login");

      // Verifikasi admin logged in (admin dashboard link harus muncul)
      cy.get('[data-testid="admin-dashboard-link"]').should("be.visible");
    });

    it("Harus menampilkan error jika email kosong", () => {
      // Hanya isi password
      cy.get('[data-testid="login-password-input"]').type("password");
      cy.get('[data-testid="login-submit-button"]').click();

      // Verifikasi masih di halaman login atau ada error
      cy.url().should("include", "/login");
    });

    it("Harus menampilkan error jika password kosong", () => {
      // Hanya isi email
      cy.get('[data-testid="login-email-input"]').type("user@example.com");
      cy.get('[data-testid="login-submit-button"]').click();

      // Verifikasi masih di halaman login
      cy.url().should("include", "/login");
    });

    it("Harus menampilkan error jika kredensial salah", () => {
      cy.get('[data-testid="login-email-input"]').type("wrong@example.com");
      cy.get('[data-testid="login-password-input"]').type("wrongpassword");
      cy.get('[data-testid="login-submit-button"]').click();

      // Verifikasi ada error message (jika error message component ada)
      cy.get('[data-testid="login-error-message"]').should("be.visible");
    });

    it('Harus bisa menggunakan "Remember me" checkbox', () => {
      cy.get('[data-testid="remember-me-checkbox"]').check();
      cy.get('[data-testid="remember-me-checkbox"]').should("be.checked");

      cy.get('[data-testid="login-email-input"]').type("user@example.com");
      cy.get('[data-testid="login-password-input"]').type("password");
      cy.get('[data-testid="login-submit-button"]').click();

      cy.url().should("not.include", "/login");
    });

    it('Harus bisa klik link "Forgot password"', () => {
      cy.get('[data-testid="forgot-password-link"]')
        .should("be.visible")
        .click();

      // Verifikasi redirect ke halaman forgot password (sesuaikan dengan route Anda)
      cy.url().should("include", "/forgot-password");
    });
  });

  describe("Register Page", () => {
    beforeEach(() => {
      cy.visit("/register");
    });

    it("Harus menampilkan halaman register dengan benar", () => {
      cy.get('[data-testid="register-page-title"]').should("be.visible");
      cy.get('[data-testid="register-form"]').should("be.visible");
      cy.get('[data-testid="register-name-input"]').should("be.visible");
      cy.get('[data-testid="register-email-input"]').should("be.visible");
      cy.get('[data-testid="register-password-input"]').should("be.visible");
      cy.get('[data-testid="register-submit-button"]').should("be.visible");
    });

    it("Harus bisa register dengan data valid", () => {
      const timestamp = Date.now();

      // Isi form registrasi
      cy.get('[data-testid="register-name-input"]').type("Test User");
      cy.get('[data-testid="register-lastname-input"]').type("Cypress");
      cy.get('[data-testid="register-email-input"]').type(
        `testuser${timestamp}@example.com`
      );
      cy.get('[data-testid="register-password-input"]').type("Password123!");
      cy.get('[data-testid="register-confirm-password-input"]').type(
        "Password123!"
      );

      // Check terms and conditions
      cy.get('[data-testid="register-terms-checkbox"]').check();

      // Submit form
      cy.get('[data-testid="register-submit-button"]').click();

      // Verifikasi redirect (biasanya ke login atau langsung home jika auto-login)
      cy.url().should("not.include", "/register");
    });

    it("Harus menampilkan error jika email sudah terdaftar", () => {
      // Gunakan email yang sudah ada
      cy.get('[data-testid="register-name-input"]').type("Test");
      cy.get('[data-testid="register-lastname-input"]').type("User");
      cy.get('[data-testid="register-email-input"]').type("user@example.com");
      cy.get('[data-testid="register-password-input"]').type("password");
      cy.get('[data-testid="register-confirm-password-input"]').type(
        "password"
      );
      cy.get('[data-testid="register-terms-checkbox"]').check();
      cy.get('[data-testid="register-submit-button"]').click();

      // Verifikasi error message
      cy.get('[data-testid="register-error-message"]').should("be.visible");
    });

    it("Harus menampilkan error jika password tidak match", () => {
      cy.get('[data-testid="register-name-input"]').type("Test");
      cy.get('[data-testid="register-lastname-input"]').type("User");
      cy.get('[data-testid="register-email-input"]').type("test@example.com");
      cy.get('[data-testid="register-password-input"]').type("Password123!");
      cy.get('[data-testid="register-confirm-password-input"]').type(
        "DifferentPassword"
      );
      cy.get('[data-testid="register-terms-checkbox"]').check();
      cy.get('[data-testid="register-submit-button"]').click();

      // Verifikasi masih di halaman register atau ada error
      cy.url().should("include", "/register");
    });

    it("Harus menampilkan error jika terms tidak di-check", () => {
      cy.get('[data-testid="register-name-input"]').type("Test");
      cy.get('[data-testid="register-lastname-input"]').type("User");
      cy.get('[data-testid="register-email-input"]').type("test@example.com");
      cy.get('[data-testid="register-password-input"]').type("Password123!");
      cy.get('[data-testid="register-confirm-password-input"]').type(
        "Password123!"
      );

      // Jangan check terms
      cy.get('[data-testid="register-submit-button"]').click();

      // Verifikasi masih di halaman register
      cy.url().should("include", "/register");
    });

    it("Harus validasi format email", () => {
      cy.get('[data-testid="register-name-input"]').type("Test");
      cy.get('[data-testid="register-lastname-input"]').type("User");
      cy.get('[data-testid="register-email-input"]').type("invalid-email");
      cy.get('[data-testid="register-password-input"]').type("Password123!");
      cy.get('[data-testid="register-confirm-password-input"]').type(
        "Password123!"
      );
      cy.get('[data-testid="register-terms-checkbox"]').check();
      cy.get('[data-testid="register-submit-button"]').click();

      // Verifikasi masih di halaman register
      cy.url().should("include", "/register");
    });
  });

  describe("Logout", () => {
    it("Harus bisa logout setelah login sebagai admin", () => {
      // Login sebagai admin
      cy.loginAsAdmin();
      cy.visit("/");

      // Verifikasi admin sudah login
      cy.visit("/admin"); // atau halaman admin lainnya
      cy.get('[data-testid="admin-user-profile-trigger"]').should("be.visible");

      // Klik user profile trigger
      cy.get('[data-testid="admin-user-profile-trigger"]').click();

      // Verifikasi dropdown menu muncul
      cy.get('[data-testid="admin-user-dropdown-menu"]').should("be.visible");

      // Klik logout
      cy.get('[data-testid="admin-logout-link"]').click();

      // Verifikasi sudah logout (admin elements tidak ada lagi)
      cy.get('[data-testid="admin-user-profile-trigger"]').should("not.exist");
    });
  });
});
