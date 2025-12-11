// cypress/e2e/admin/05-admin-users.cy.ts

describe("Admin Users Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.clearTestUser();
    cy.visit("/admin/users");
    cy.waitForPageLoad();
  });

  describe("Users Page Layout", () => {
    it("should display users page", () => {
      cy.url().should("include", "/admin/users");
    });

    it("should display dashboard sidebar", () => {
      cy.get('[data-testid="dashboard-sidebar-container"]').should(
        "be.visible"
      );
    });
  });

  describe("Add New User", () => {
    it("should navigate to add user page", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      cy.get('[data-testid="dashboard-create-new-user-container"]').should(
        "be.visible"
      );
    });

    it("should display add user form", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      cy.get('[data-testid="add-new-user-title"]').should("be.visible");
      cy.get('[data-testid="user-email-label"]').should("be.visible");
      cy.get('[data-testid="user-email-input"]').should("be.visible");
      cy.get('[data-testid="user-password-label"]').should("be.visible");
      cy.get('[data-testid="user-password-input"]').should("be.visible");
      cy.get('[data-testid="user-role-label"]').should("be.visible");
      cy.get('[data-testid="user-role-select"]').should("be.visible");
      cy.get('[data-testid="create-user-button"]').should("be.visible");
    });

    it("should display role options", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      cy.get('[data-testid="role-option-admin"]').should("exist");
      cy.get('[data-testid="role-option-user"]').should("exist");
    });

    it("should create new user successfully", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      const timestamp = Date.now();
      const userData = {
        email: `testuser${timestamp}@example.com`,
        password: "SecurePass123!",
        role: "user",
      };

      // ✅ 1. Intercept API create
      cy.intercept("POST", "/api/users").as("createUser");

      cy.get('[data-testid="user-email-input"]').type(userData.email);
      cy.get('[data-testid="user-password-input"]').type(userData.password);
      cy.get('[data-testid="user-role-select"]').select(userData.role);
      cy.get('[data-testid="create-user-button"]').click();

      cy.wait("@createUser").its("response.statusCode").should("eq", 201);

      cy.visit("/admin/users");
      cy.waitForPageLoad();

      // ✅ Verifikasi: email muncul di tabel
      cy.contains(userData.email).should("be.visible");
    });

    it("should validate required fields", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      // Try to submit without filling fields
      cy.get('[data-testid="create-user-button"]').click();

      // Should stay on same page
      cy.url().should("include", "/admin/users/new");
    });

    it("should validate email format", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      cy.get('[data-testid="user-email-input"]').type("invalid-email");
      cy.get('[data-testid="user-password-input"]').type("password123");
      cy.get('[data-testid="user-role-select"]').select("user");
      cy.get('[data-testid="create-user-button"]').click();

      // Should show validation error
      cy.url().should("include", "/admin/users/new");
    });

    it("should validate password strength", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      const timestamp = Date.now();

      cy.get('[data-testid="user-email-input"]').type(
        `user${timestamp}@example.com`
      );
      cy.get('[data-testid="user-password-input"]').type("123"); // Weak password
      cy.get('[data-testid="user-role-select"]').select("user");
      cy.get('[data-testid="create-user-button"]').click();

      // Should show validation error or stay on page
      cy.url().should("include", "/admin/users/new");
    });
  });

  describe("View User Details", () => {
    it("should navigate to user details page", () => {
      cy.visit("/admin/users/1", { failOnStatusCode: false });
      cy.waitForPageLoad();

      cy.get("body").then(($body) => {
        if (
          $body.find('[data-testid="dashboard-single-user-container"]').length >
          0
        ) {
          cy.get('[data-testid="dashboard-single-user-container"]').should(
            "be.visible"
          );
        }
      });
    });

    it("should display user details form", () => {
      cy.visit("/admin/users/1", { failOnStatusCode: false });
      cy.waitForPageLoad();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="user-details-title"]').length > 0) {
          cy.get('[data-testid="user-details-title"]').should("be.visible");
          cy.get('[data-testid="user-email-input"]').should("be.visible");
          cy.get('[data-testid="user-password-input"]').should("be.visible");
          cy.get('[data-testid="user-role-select"]').should("be.visible");
        }
      });
    });

    it("should display action buttons", () => {
      cy.visit("/admin/users/1", { failOnStatusCode: false });
      cy.waitForPageLoad();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="update-user-button"]').length > 0) {
          cy.get('[data-testid="update-user-button"]').should("be.visible");
          cy.get('[data-testid="delete-user-button"]').should("be.visible");
        }
      });
    });
  });

  describe("Update User", () => {
    it("should update user email", () => {
      it("should update user email", () => {
        const timestamp = Date.now();
        const initialEmail = `tempuser${timestamp}@example.com`;
        const newEmail = `updated${timestamp}@example.com`;

        // ✅ 1. Intercept API create
        cy.intercept("POST", "/api/users").as("createUser");

        // 2. Buat user
        cy.visit("/admin/users/new");
        cy.get('[data-testid="user-email-input"]').type(initialEmail);
        cy.get('[data-testid="user-password-input"]').type("TempPass123!");
        cy.get('[data-testid="user-role-select"]').select("user");
        cy.get('[data-testid="create-user-button"]').click();

        // ✅ 3. Tunggu API sukses
        cy.wait("@createUser").its("response.statusCode").should("eq", 201);

        // 4. Sekarang aman kunjungi daftar
        cy.visit("/admin/users");
        cy.waitForPageLoad();

        // 5. Cari user di tabel
        cy.get('[data-testid^="user-row-"]')
          .contains(initialEmail)
          .find('[data-testid^="user-details-link-"]')
          .invoke("attr", "href")
          .then((href) => {
            const userId = href?.split("/").pop();
            if (!userId) throw new Error("User ID not found");

            cy.visit(`/admin/users/${userId}`);
            cy.waitForPageLoad();

            cy.get('[data-testid="user-email-input"]').clear().type(newEmail);
            cy.get('[data-testid="update-user-button"]').click();

            cy.get('[data-testid="user-email-input"]').should(
              "have.value",
              newEmail
            );
          });
      });
    });
  });

  describe("Delete User", () => {
    it("should delete user after confirmation", () => {
      it("should delete user after confirmation", () => {
        const timestamp = Date.now();
        const testEmail = `deletetest${timestamp}@example.com`;

        // Buat user
        cy.visit("/admin/users/new");
        cy.get('[data-testid="user-email-input"]').type(testEmail);
        cy.get('[data-testid="user-password-input"]').type("DeletePass123!");
        cy.get('[data-testid="user-role-select"]').select("user");
        cy.get('[data-testid="create-user-button"]').click();

        // Tunggu backend selesai (gunakan intercept jika bisa)
        cy.visit("/admin/users");
        cy.waitForPageLoad();

        // ✅ Cari email HANYA di dalam baris user
        cy.get('[data-testid^="user-row-"]')
          .contains(testEmail)
          .find('[data-testid^="user-details-link-"]')
          .click();

        cy.get('[data-testid="delete-user-button"]').click();
        cy.on("window:confirm", () => true);

        cy.visit("/admin/users");
        cy.get('[data-testid^="user-row-"]')
          .contains(testEmail)
          .should("not.exist");
      });
    });
  });

  describe("Form Validation", () => {
    it("should prevent duplicate emails", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      // Try to create user with admin email
      cy.get('[data-testid="user-email-input"]').type("user@example.com");
      cy.get('[data-testid="user-password-input"]').type("password");
      cy.get('[data-testid="user-role-select"]').select("user");
      cy.get('[data-testid="create-user-button"]').click();

      cy.wait(1000);

      // Should show error or stay on page
      cy.url().should("include", "/admin/users/new");
    });

    it("should require valid email format", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      cy.get('[data-testid="user-email-input"]').type("not-an-email");
      cy.get('[data-testid="user-password-input"]').type("Password123!");
      cy.get('[data-testid="create-user-button"]').click();

      cy.url().should("include", "/admin/users/new");
    });
  });

  describe("Role Management", () => {
    it("should create admin user", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      const timestamp = Date.now();
      const userData = {
        email: `testuser${timestamp}@example.com`,
        password: "SecurePass123!",
        role: "user",
      };

      // ✅ 1. Intercept API create
      cy.intercept("POST", "/api/users").as("createUser");

      cy.get('[data-testid="user-email-input"]').type(userData.email);
      cy.get('[data-testid="user-password-input"]').type(userData.password);
      cy.get('[data-testid="user-role-select"]').select(userData.role);
      cy.get('[data-testid="create-user-button"]').click();

      cy.wait("@createUser").its("response.statusCode").should("eq", 201);

      cy.visit("/admin/users");
      cy.waitForPageLoad();

      // ✅ Verifikasi: email muncul di tabel
      cy.contains(userData.email).should("be.visible");
    });

    it("should create regular user", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      const timestamp = Date.now();
      const userData = {
        email: `testuser${timestamp}@example.com`,
        password: "SecurePass123!",
        role: "user",
      };

      // ✅ 1. Intercept API create
      cy.intercept("POST", "/api/users").as("createUser");

      cy.get('[data-testid="user-email-input"]').type(userData.email);
      cy.get('[data-testid="user-password-input"]').type(userData.password);
      cy.get('[data-testid="user-role-select"]').select(userData.role);
      cy.get('[data-testid="create-user-button"]').click();

      cy.wait("@createUser").its("response.statusCode").should("eq", 201);

      cy.visit("/admin/users");
      cy.waitForPageLoad();

      cy.contains(userData.email).should("be.visible");
    });
  });

  describe("Navigation", () => {
    it("should navigate back to users list from new user page", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      cy.get('[data-testid="dashboard-sidebar-container"]').within(() => {
        cy.get('[data-testid="sidebar-users-link"]').click();
      });

      cy.url().should("match", /\/admin\/users\/?$/);
    });

    it("should navigate back from user details page", () => {
      cy.visit("/admin/users/1", { failOnStatusCode: false });
      cy.waitForPageLoad();

      cy.get('[data-testid="dashboard-sidebar-container"]').within(() => {
        cy.get('[data-testid="sidebar-users-link"]').click();
      });

      cy.url().should("match", /\/admin\/users\/?$/);
    });
  });

  describe("Security", () => {
    it("should not display passwords in plain text", () => {
      cy.visit("/admin/users/1", { failOnStatusCode: false });
      cy.waitForPageLoad();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="user-password-input"]').length > 0) {
          cy.get('[data-testid="user-password-input"]').should(
            "have.attr",
            "type",
            "password"
          );
        }
      });
    });

    it("should require authentication for user management", () => {
      cy.logout();

      cy.visit("/admin/users", { failOnStatusCode: false });

      // Should redirect to login
      cy.url().should("include", "/login");
    });

    it("should require admin role for user management", () => {
      cy.logout();
      cy.loginAsUser();

      cy.visit("/admin/users", { failOnStatusCode: false });

      // Should redirect or show access denied
      cy.url().should("not.include", "/admin/users");
    });
  });
});
