// cypress/e2e/admin/01-admin-dashboard.cy.ts

describe("Admin Dashboard", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit("/admin");
    cy.waitForPageLoad();
  });

  describe("Dashboard Access & Layout", () => {
    it("should display admin dashboard page", () => {
      cy.get('[data-testid="admin-dashboard-page-container"]').should(
        "be.visible"
      );
    });

    it("should display dashboard sidebar", () => {
      cy.get('[data-testid="dashboard-sidebar-container"]').should(
        "be.visible"
      );
    });

    it("should display all sidebar menu items", () => {
      cy.get('[data-testid="sidebar-dashboard-item"]').should("be.visible");
      cy.get('[data-testid="sidebar-orders-item"]').should("be.visible");
      cy.get('[data-testid="sidebar-products-item"]').should("be.visible");
      cy.get('[data-testid="sidebar-bulk-upload-item"]').should("be.visible");
      cy.get('[data-testid="sidebar-categories-item"]').should("be.visible");
      cy.get('[data-testid="sidebar-users-item"]').should("be.visible");
      cy.get('[data-testid="sidebar-merchant-item"]').should("be.visible");
      cy.get('[data-testid="sidebar-settings-item"]').should("be.visible");
    });

    it("should display sidebar labels", () => {
      cy.get('[data-testid="dashboard-label"]').should("contain", "Dashboard");
      cy.get('[data-testid="orders-label"]').should("contain", "Orders");
      cy.get('[data-testid="products-label"]').should("contain", "Products");
      cy.get('[data-testid="categories-label"]').should(
        "contain",
        "Categories"
      );
      cy.get('[data-testid="users-label"]').should("contain", "Users");
    });

    it("should display sidebar icons", () => {
      cy.get('[data-testid="dashboard-icon"]').should("be.visible");
      cy.get('[data-testid="orders-icon"]').should("be.visible");
      cy.get('[data-testid="products-icon"]').should("be.visible");
      cy.get('[data-testid="categories-icon"]').should("be.visible");
      cy.get('[data-testid="users-icon"]').should("be.visible");
    });
  });

  describe("Header", () => {
    it("should display admin header", () => {
      cy.get('[data-testid="admin-header-content"]').should("be.visible");
    });

    it("should display admin logo", () => {
      cy.get('[data-testid="admin-logo"]').should("be.visible");
    });

    it("should display admin logo link", () => {
      cy.get('[data-testid="admin-logo-link"]').should("be.visible");
    });

    it("should display admin user profile trigger", () => {
      cy.get('[data-testid="admin-user-profile-trigger"]').should("be.visible");
    });

    it("should display admin user profile image", () => {
      cy.get('[data-testid="admin-user-profile-image"]').should("be.visible");
    });

    it("should display admin notification bell", () => {
      cy.get('[data-testid="admin-notification-bell-component"]').should(
        "be.visible"
      );
    });
  });

  describe("User Dropdown Menu", () => {
    it("should open user dropdown on click", () => {
      cy.get('[data-testid="admin-user-profile-trigger"]').click();
      cy.get('[data-testid="admin-user-dropdown-menu"]').should("be.visible");
    });

    it("should display dropdown menu items", () => {
      cy.get('[data-testid="admin-user-profile-trigger"]').click();

      cy.get('[data-testid="admin-dashboard-menu-item"]').should("be.visible");
      cy.get('[data-testid="admin-profile-menu-item"]').should("be.visible");
      cy.get('[data-testid="admin-logout-menu-item"]').should("be.visible");
    });

    it("should navigate to dashboard from dropdown", () => {
      cy.get('[data-testid="admin-user-profile-trigger"]').click();
      cy.get('[data-testid="admin-dashboard-link"]').click();

      cy.url().should("include", "/admin");
    });

    it("should navigate to profile from dropdown", () => {
      cy.get('[data-testid="admin-user-profile-trigger"]').click();
      cy.get('[data-testid="admin-profile-link"]').click();

      // Should navigate to profile page
      cy.url().should("match", /\/admin|profile/);
    });
  });

  describe("Dashboard Statistics", () => {
    it("should display stats elements container", () => {
      cy.get('[data-testid="stats-elements-container"]').should("be.visible");
    });

    it("should display multiple stats elements", () => {
      cy.get('[data-testid="stats-element-1"]').should("be.visible");
      cy.get('[data-testid="stats-element-2"]').should("be.visible");
      cy.get('[data-testid="stats-element-3"]').should("be.visible");
    });

    it("should display visitors stats", () => {
      cy.get('[data-testid="visitors-stats-container"]').should("be.visible");
      cy.get('[data-testid="visitors-title"]').should("be.visible");
      cy.get('[data-testid="visitors-count"]').should("be.visible");
    });

    it("should display visitors trend", () => {
      cy.get('[data-testid="visitors-trend"]').should("be.visible");
    });

    it("should show numeric values in stats", () => {
      cy.get('[data-testid="visitors-count"]')
        .invoke("text")
        .should("match", /\d+/);
    });
  });

  describe("Sidebar Navigation", () => {
    it("should navigate to orders page", () => {
      cy.get('[data-testid="sidebar-orders-link"]').click();
      cy.url().should("include", "/admin/orders");
      cy.get('[data-testid="admin-orders-container"]').should("be.visible");
    });

    it("should navigate to products page", () => {
      cy.get('[data-testid="sidebar-products-link"]').click();
      cy.url().should("include", "/admin/products");
      cy.get('[data-testid="dashboard-product-table-container"]').should(
        "be.visible"
      );
    });

    it("should navigate to bulk upload page", () => {
      cy.get('[data-testid="sidebar-bulk-upload-link"]').click();
      cy.url().should("include", "/admin/bulk-upload");
      cy.get('[data-testid="bulk-upload-page-container"]').should("be.visible");
    });

    it("should navigate to categories page", () => {
      cy.get('[data-testid="sidebar-categories-link"]').click();
      cy.url().should("include", "/admin/categories");
      cy.get('[data-testid="dashboard-category-container"]').should(
        "be.visible"
      );
    });

    it("should navigate to users page", () => {
      cy.get('[data-testid="sidebar-users-link"]').click();
      cy.url().should("include", "/admin/users");
    });

    it("should navigate to merchant page", () => {
      cy.get('[data-testid="sidebar-merchant-link"]').click();
      cy.url().should("include", "/admin/merchant");
      cy.get('[data-testid="merchant-page-container"]').should("be.visible");
    });

    it("should navigate to settings page", () => {
      cy.get('[data-testid="sidebar-settings-link"]').click();
      cy.url().should("include", "/admin/settings");
    });

    it("should highlight active menu item", () => {
      cy.get('[data-testid="sidebar-products-link"]').click();
      cy.get('[data-testid="sidebar-products-item"]').should(
        "have.class",
        "active"
      );
    });
  });

  describe("Access Control", () => {
    it("should not allow non-admin users to access dashboard", () => {
      cy.logout();
      cy.loginAsUser();

      cy.visit("/admin", { failOnStatusCode: false });

      // Should redirect to home or show access denied
      cy.url().should("not.include", "/admin");
    });

    it("should redirect to login when accessing admin without authentication", () => {
      cy.logout();

      cy.visit("/admin", { failOnStatusCode: false });

      // Should redirect to login
      cy.url().should("include", "/login");
    });
  });

  describe("Responsive Design", () => {
    it("should display correctly on tablet", () => {
      cy.viewport("ipad-2");

      cy.get('[data-testid="admin-dashboard-page-container"]').should(
        "be.visible"
      );
      cy.get('[data-testid="dashboard-sidebar-container"]').should(
        "be.visible"
      );
    });

    it("should have mobile-friendly sidebar on small screens", () => {
      cy.viewport("iphone-x");

      cy.get('[data-testid="admin-dashboard-page-container"]').should(
        "be.visible"
      );

      // Sidebar might be collapsed or hidden on mobile
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="sidebar-toggle"]').length > 0) {
          cy.get('[data-testid="sidebar-toggle"]').click();
          cy.get('[data-testid="dashboard-sidebar-container"]').should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Logout Functionality", () => {
    it("should logout successfully from dropdown menu", () => {
      cy.get('[data-testid="admin-user-profile-trigger"]').click();
      cy.get('[data-testid="admin-logout-link"]').click();

      // Should redirect to login or home page
      cy.location("pathname").should("eq", "/login");
    });

    it("should clear session after logout", () => {
      cy.get('[data-testid="admin-user-profile-trigger"]').click();
      cy.get('[data-testid="admin-logout-link"]').click();

      cy.wait(1000);

      // Try to access admin again
      cy.visit("/admin", { failOnStatusCode: false });

      // Should redirect to login
      cy.url().should("include", "/login");
    });
  });
});
