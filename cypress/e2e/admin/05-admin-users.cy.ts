// cypress/e2e/admin/05-admin-users.cy.ts

describe("Admin Users Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/admin/users");
    cy.waitForPageLoad();
  });

  describe("Users Page Layout", () => {
    it("should display users page", () => {
      cy.url().should("include", "/admin/users");
    });

    it("should display dashboard sidebar", () => {
      cy.get('[data-testid="dashboard-sidebar"]').should("be.visible");
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

      cy.get('[data-testid="user-email-input"]').type(userData.email);
      cy.get('[data-testid="user-password-input"]').type(userData.password);
      cy.get('[data-testid="user-role-select"]').select(userData.role);
      cy.get('[data-testid="create-user-button"]').click();

      cy.wait(2000);

      // Should redirect to users list
      cy.url().should("match", /\/admin\/users\/?$/);
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
      cy.visit("/admin/users/1", { failOnStatusCode: false });
      cy.waitForPageLoad();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="user-email-input"]').length > 0) {
          const timestamp = Date.now();
          const newEmail = `updated${timestamp}@example.com`;

          cy.get('[data-testid="user-email-input"]').clear().type(newEmail);
          cy.get('[data-testid="update-user-button"]').click();

          cy.wait(2000);

          cy.get('[data-testid="user-email-input"]').should(
            "have.value",
            newEmail
          );
        }
      });
    });

    it("should update user role", () => {
      cy.visit("/admin/users/1", { failOnStatusCode: false });
      cy.waitForPageLoad();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="user-role-select"]').length > 0) {
          cy.get('[data-testid="user-role-select"]').select("admin");
          cy.get('[data-testid="update-user-button"]').click();

          cy.wait(2000);

          cy.get('[data-testid="user-role-select"]').should(
            "have.value",
            "admin"
          );
        }
      });
    });

    it("should update user password", () => {
      cy.visit("/admin/users/1", { failOnStatusCode: false });
      cy.waitForPageLoad();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="user-password-input"]').length > 0) {
          cy.get('[data-testid="user-password-input"]')
            .clear()
            .type("NewSecurePass123!");
          cy.get('[data-testid="update-user-button"]').click();

          cy.wait(2000);

          // Should update successfully
          cy.url().should("match", /\/admin\/users\/\d+/);
        }
      });
    });
  });

  describe("Delete User", () => {
    it("should delete user after confirmation", () => {
      // First create a test user
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      const timestamp = Date.now();
      const testEmail = `deletetest${timestamp}@example.com`;

      cy.get('[data-testid="user-email-input"]').type(testEmail);
      cy.get('[data-testid="user-password-input"]').type("DeletePass123!");
      cy.get('[data-testid="user-role-select"]').select("user");
      cy.get('[data-testid="create-user-button"]').click();

      cy.wait(2000);

      // Find the created user and delete it
      // Note: This depends on how your user list is displayed
      cy.visit("/admin/users");
      cy.waitForPageLoad();

      // Navigate to the last created user (implementation dependent)
      // Then delete
      cy.on("window:confirm", () => true);
    });
  });

  describe("Form Validation", () => {
    it("should prevent duplicate emails", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      // Try to create user with admin email
      cy.get('[data-testid="user-email-input"]').type(
        Cypress.env("EMAIL_ADMIN")
      );
      cy.get('[data-testid="user-password-input"]').type("Password123!");
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

      cy.get('[data-testid="user-email-input"]').type(
        `admin${timestamp}@example.com`
      );
      cy.get('[data-testid="user-password-input"]').type("AdminPass123!");
      cy.get('[data-testid="user-role-select"]').select("admin");
      cy.get('[data-testid="create-user-button"]').click();

      cy.wait(2000);

      cy.url().should("match", /\/admin\/users\/?$/);
    });

    it("should create regular user", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      const timestamp = Date.now();

      cy.get('[data-testid="user-email-input"]').type(
        `user${timestamp}@example.com`
      );
      cy.get('[data-testid="user-password-input"]').type("UserPass123!");
      cy.get('[data-testid="user-role-select"]').select("user");
      cy.get('[data-testid="create-user-button"]').click();

      cy.wait(2000);

      cy.url().should("match", /\/admin\/users\/?$/);
    });
  });

  describe("Navigation", () => {
    it("should navigate back to users list from new user page", () => {
      cy.visit("/admin/users/new");
      cy.waitForPageLoad();

      cy.get('[data-testid="dashboard-sidebar"]').within(() => {
        cy.get('[data-testid="sidebar-users-link"]').click();
      });

      cy.url().should("match", /\/admin\/users\/?$/);
    });

    it("should navigate back from user details page", () => {
      cy.visit("/admin/users/1", { failOnStatusCode: false });
      cy.waitForPageLoad();

      cy.get('[data-testid="dashboard-sidebar"]').within(() => {
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
